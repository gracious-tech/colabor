
import {onCall} from 'firebase-functions/v2/https'
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {Stripe} from 'stripe'


// Stripe takes amounts in cents/lowest-denomination, so need to know decimal places
// See https://docs.stripe.com/currencies#zero-decimal
// NOTE Stripe lists UGX as zero-decimal but then says it's still 2dec for compatibility
const zero_decimal = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf',
    'vnd', 'vuv', 'xaf', 'xof', 'xpf']
// See https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae
const three_decimal = ['bhd', 'jod', 'kwd', 'omr', 'tnd']


// Init firebase
const fire_app = initializeApp()
const fire_db = getFirestore(fire_app)


// Helper for warning fundraiser of a settings issue and returning null to app
async function notify_fundraiser(fundraiser:string,
        stripe_error:'missing_key'|'invalid_key'|'no_permission'){
    // TODO Get email addresses of all admins of fundraiser from DB
    // TODO Send email

    // Return null for url so error not thrown as no need to notify developers
    return {stripe_url: null}
}


// Main function
export const gen_stripe_url = onCall(async (request):Promise<{stripe_url:string|null}> => {

    // Determine origin and ensure either localhost or production site
    const domain_origin = request.rawRequest.headers.origin!
    if (domain_origin !== 'https://colabor.ing'
            && domain_origin.split('//')[1]?.split(':')[0] !== 'localhost'){
        throw new Error(`Invalid origin: ${domain_origin}`)
    }

    // Extract data
    // SECURITY Only accept data relating to how much to give, not anything on the fundraiser itself
    // E.g. Don't accept name of fundraiser as could become "Subscribe to [malicious text]"
    const data = request.data as Record<string, unknown>
    const fundraiser = String(data['fundraiser'])
    const ref_code = String(data['ref_code'])
    const email = String(data['email'])
    const recurring = data['recurring'] === 'month' ? 'month' : 'single'
    const currency = String(data['currency']).toLowerCase()
    let amount = Math.max(1, parseInt(String(data['amount']), 10))  // In dollars/equiv

    // Convert amount to cents/equiv (which Stripe requires)
    if (three_decimal.includes(currency)){
        amount *= 1000
    } else if (!zero_decimal.includes(currency)){
        amount *= 100  // Default to 2 decimal unless know otherwise
    }

    // Get the Stripe private key for the fundraiser
    const private_data = await fire_db.doc(`fundraisers/${fundraiser}/private/0`).get()
    const stripe_key = private_data.data()?.['stripe_key'] as string|undefined
    if (!stripe_key){
        return notify_fundraiser(fundraiser, 'missing_key')
    }
    const stripe_instance = new Stripe(stripe_key)

    // Get the name of the fundraiser
    const fund_data = await fire_db.doc(`fundraisers/${fundraiser}`).get()
    const fund_name = (fund_data.data()?.['name'] as string|undefined) || "fundraiser"

    // Determine what to call the payment
    // NOTE Important to include fundraiser name in case Stripe used for multiple fundraisers
    let product_name = `Donate to ${fund_name}`
    if (recurring !== 'single'){
        // WARN Stripe will actually call this "Subscribe to {product_name}"
        product_name = `donate to ${fund_name}`
    }

    // Helper for creating a session with optional inclusion of email address
    const create_session = (with_email:boolean) => {
        return stripe_instance.checkout.sessions.create({
            metadata: {colabor_ref: ref_code},
            mode: recurring === 'single' ? 'payment' : 'subscription',
            success_url: `${domain_origin}/${fundraiser}#stripe={CHECKOUT_SESSION_ID}`,
            ...with_email ? {customer_email: email} : {},
            submit_type: recurring === 'single' ? 'donate' : 'subscribe',  // Can't change subscr.
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: currency,
                    unit_amount: amount,
                    product_data: {
                        name: product_name,
                    },
                    ...recurring === 'single' ? {} : {recurring:{interval: 'month'}},
                },
            }],
        })
    }

    // Attempt to create session with email included
    // NOTE Email is non-essential and easy to get wrong, so don't let it prevent access to checkout
    let session:Stripe.Checkout.Session
    try {
        session = await create_session(true)
    } catch (error){
        if (error instanceof Stripe.errors.StripeError && error.code === 'email_invalid'){
            // Try again with email excluded
            // NOTE If error happens again it's developer's responsibility as auth already passed
            session = await create_session(false)
        } else if (error instanceof Stripe.errors.StripeAuthenticationError){
            // Key given is invalid
            return notify_fundraiser(fundraiser, 'invalid_key')
        } else if (error instanceof Stripe.errors.StripePermissionError){
            // Stripe key is valid but lacks permission to write checkout sessions
            return notify_fundraiser(fundraiser, 'no_permission')
        } else {
            // Anything else is developer responsibility to fix
            throw error
        }
    }

    // Respond with url
    return {stripe_url: session.url}
})
