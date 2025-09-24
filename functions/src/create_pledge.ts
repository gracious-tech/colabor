import {initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {defineSecret} from 'firebase-functions/params'
import {onCall, HttpsError} from 'firebase-functions/v2/https'
import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses'
import {z} from 'zod'

import {render_email_pledge} from './email.js'
import {fundraiser_schema, pledge_schema} from './shared/schemas.js'
import {cents_to_display} from './shared/currency.js'

const AWS_ACCESS_KEY_ID = defineSecret('AWS_ACCESS_KEY_ID')
const AWS_SECRET_ACCESS_KEY = defineSecret('AWS_SECRET_ACCESS_KEY')


initializeApp()
const firestore = getFirestore()


export const create_pledge = onCall({
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

    // Validate input
    const {fundraiser, pledge} = z.object({
        fundraiser: z.string(),
        pledge: pledge_schema,
    }).parse(request.data)

    // Override fields that submitter shouldn't be able to manipulate
    pledge.timestamp = new Date().getTime()
    pledge.contact = ''
    pledge.ip = request.rawRequest.ip ?? 'unavailable'

    // Get info from fundraiser
    const fundraiser_doc = await firestore.collection('fundraisers').doc(fundraiser).get()
    if (!fundraiser_doc.exists){
        throw new HttpsError('not-found', "Fundraiser not found")
    }
    const fund_data = fundraiser_schema.parse(fundraiser_doc.data())

    // Create pledge
    // WARN First confirm fundraiser exists and is active
    await firestore.collection('fundraisers').doc(fundraiser).collection('pledges').add(pledge)

    // Generate HTML
    const amount_str = pledge.cents ? cents_to_display(pledge.cents, pledge.currency) : "TBC"
    const hue = 340
    const contact_name = pledge.name || pledge.email || "[Anonymous]"
    const html = render_email_pledge(fundraiser, fund_data.title, hue,
        amount_str, pledge.means, pledge.ref_code, contact_name, pledge.recurring)

    // Send the email
    await ses.send(new SendEmailCommand({
        Source: `Colabor <notifications@colabor.ing>`,
        ReplyToAddresses: ['support@gracious.tech'],
        Destination: {
            ToAddresses: [process.env['FUNCTIONS_EMULATOR'] ? 'support@gracious.tech'
                : fund_data.contact.email],
        },
        Message: {
            Subject: {Data: `New donation pledge for ${fund_data.title}`},
            Body: {
                Html: {
                    Data: html,
                },
            },
        },

    }))

    return {success: true}
})
