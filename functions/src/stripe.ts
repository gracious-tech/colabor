
import {onCall} from 'firebase-functions/v2/https'
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {Stripe} from 'stripe'

import {gen_stripe_url_schema} from './shared/requests.js'


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
    const data = gen_stripe_url_schema.parse(request.data)

    // Get the Stripe private key for the fundraiser
    const private_data = await fire_db.doc(`fundraisers/${data.fundraiser}/private/0`).get()
    const stripe_key = private_data.data()?.['stripe_key'] as string|undefined
    if (!stripe_key){
        return notify_fundraiser(data.fundraiser, 'missing_key')
    }
    const stripe_instance = new Stripe(stripe_key)

    // Get the name of the fundraiser
    const fund_data = await fire_db.doc(`fundraisers/${data.fundraiser}`).get()
    const fund_name = (fund_data.data()?.['title'] as string|undefined) || "fundraiser"

    // Determine what to call the payment
    // NOTE Important to include fundraiser name in case Stripe used for multiple fundraisers
    let product_name = `Donate to ${fund_name}`
    if (data.recurring !== 'single'){
        // WARN Stripe will actually call this "Subscribe to {product_name}"
        product_name = `donate to ${fund_name}`
    }

    // Helper for creating a session with optional inclusion of email address
    const create_session = (with_email:boolean) => {
        return stripe_instance.checkout.sessions.create({
            metadata: {colabor_ref: data.ref_code},
            mode: data.recurring === 'single' ? 'payment' : 'subscription',
            success_url: `${domain_origin}/${data.fundraiser}#stripe={CHECKOUT_SESSION_ID}`,
            ...with_email ? {customer_email: data.email} : {},
            submit_type: data.recurring === 'single' ? 'donate' : 'subscribe',
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: data.currency,
                    unit_amount: data.cents,
                    product_data: {
                        name: product_name,
                    },
                    ...data.recurring === 'single' ? {} : {recurring:{interval: 'month'}},
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
            return notify_fundraiser(data.fundraiser, 'invalid_key')
        } else if (error instanceof Stripe.errors.StripePermissionError){
            // Stripe key is valid but lacks permission to write checkout sessions
            return notify_fundraiser(data.fundraiser, 'no_permission')
        } else {
            // Anything else is developer responsibility to fix
            throw error
        }
    }

    // Respond with url
    return {stripe_url: session.url}
})
