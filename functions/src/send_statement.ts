
import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {defineSecret} from 'firebase-functions/params'
import {onCall, HttpsError} from 'firebase-functions/v2/https'
import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses'
import zod from 'zod'

import {render_email_statement} from './email.js'
import {format_date_string} from './utils.js'
import {statement_schema, contact_schema, fundraiser_schema, statement_item_schema}
    from './shared/schemas.js'
import {cents_to_display} from './shared/currency.js'

const AWS_ACCESS_KEY_ID = defineSecret('AWS_ACCESS_KEY_ID')
const AWS_SECRET_ACCESS_KEY = defineSecret('AWS_SECRET_ACCESS_KEY')


initializeApp()
const firestore = getFirestore()


export const send_statement = onCall({
    secrets: [AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY],
}, async (request, response) => {

    // Configure SES
    const ses = new SESClient({
        region: 'us-west-2',
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID.value(),
            secretAccessKey: AWS_SECRET_ACCESS_KEY.value(),
        },
    })

    // Confirm user authenticated
    if (!request.auth){
        throw new HttpsError('unauthenticated', "User must be signed in")
    }

    // Validate payment_id and fundraiser
    const schema = zod.object({
        fundraiser: zod.string(),
        statement: zod.string(),
        item: zod.string(),
    })
    const {statement, fundraiser, item} = schema.parse(request.data)

    // Check user is an owner of the fundraiser
    const fundraiser_doc = await firestore.collection('fundraisers').doc(fundraiser).get()
    if (!fundraiser_doc.exists){
        throw new HttpsError('not-found', "Fundraiser not found")
    }
    const fund_data = fundraiser_schema.parse(fundraiser_doc.data())
    if (!fund_data.owners.includes(request.auth.uid)){
        throw new HttpsError('permission-denied', "User does not own the fundraiser")
    }

    // Get the statement record
    const statement_doc = await firestore.collection('fundraisers').doc(fundraiser)
        .collection('statements').doc(statement).get()
    if (!statement_doc.exists){
        throw new HttpsError('not-found', "Statement record not found")
    }
    const statement_data = statement_schema.parse(statement_doc.data())

    // Get the statement item with the contact that will send to
    const item_doc = await firestore.collection('fundraisers').doc(fundraiser)
        .collection('statements').doc(statement).collection('items').doc(item).get()
    if (!item_doc.exists){
        throw new HttpsError('not-found', "Statement item not found")
    }
    const item_data = statement_item_schema.parse(item_doc.data())

    // Lookup contact/email
    const contact_doc = await firestore.collection('fundraisers').doc(fundraiser)
        .collection('contacts').doc(item_data.contact).get()
    if (!contact_doc.exists){
        throw new HttpsError('not-found', "Contact not found")
    }
    const contact_data = contact_schema.parse(contact_doc.data())

    // Generate HTML
    const subtitle = format_date_string(statement_data.start) + ' - '
        + format_date_string(statement_data.end)
    const amount_str = cents_to_display(item_data.cents, item_data.currency)
    const html = render_email_statement(fundraiser, fund_data.title, 340, statement_data.title,
        subtitle, amount_str, statement_data.message)

    // Send the email
    const safe_name = fund_data.steward.organiser_name.replace(/[<>@"'\n]/g, '').trim()
    await ses.send(new SendEmailCommand({
        // WARN If SES says address not verified, ensure firebase is auth'd and AWS key is in use
        Source: `"${safe_name}" <notifications@colabor.ing>`,
        ReplyToAddresses: [fund_data.contact.email],
        Destination: {
            ToAddresses: [
                process.env['FUNCTIONS_EMULATOR'] ? 'support@gracious.tech' : contact_data.email,
            ],
            // Also send copy to fundraiser's contact address
            BccAddresses: [fund_data.contact.email],
        },
        Message: {
            Subject: {Data: statement_data.title},
            Body: {
                Html: {
                    Data: html,
                },
            },
        },

    }))

    // Update payment record
    await item_doc.ref.update({record_sent: true})

    return {success: true}
})
