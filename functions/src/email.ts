
import chroma from 'chroma-js'
import {escape as html_escape} from 'lodash-es'  // Avoid deprecated global `escape()`

import {donation_icon_url} from './assets/images.js'


export function gen_invite_styles(hue:number){
    // Generate styles for the different elements in a HTML email

    // Get RGB hex values for hue (since Outlook can't understand anything else)
    // NOTE Sometimes still use rgba/hsla etc if can't do via hex and not super important
    const bg_color = chroma.hsl(hue, 0.4, 0.4).hex()

    // WARN Don't use 'em' as SpamAssassin thinks it's hiding words when less than 0 (e.g. 0.8em)
    // See https://github.com/apache/spamassassin/blob/d092a416336117b34ca49ef57be31b8c0b5b0422/rulesrc/sandbox/jhardin/20_misc_testing.cf#L2569
    return {
        wrapper: `padding-top: 36px; padding-bottom: 150px; background-color: ${bg_color}; font-family: sans-serif;`,
        container: `border-radius: 12px; max-width: 600px; margin: 0 auto;`,
        name: `color: white; font-size: 20px; text-decoration: none; font-weight: bold;`,
        contents: `padding: 24px; margin-top: 24px; background-color: white; border-radius: 12px;`,
    }
}


export function render_email(fund_id:string, fund_name:string, hue:number, contents:string,
        message:string):string{
    // Render a HTML email template with the provided contents
    // NOTE Images must be wrapped in <a> to prevent gmail showing download buttons for them
    // NOTE Styles are inline so preserved when replying/forwarding
    // NOTE Some styles must be directly on elements to not be overriden (e.g. color on <a>)
    // NOTE Outlook desktop is the worst client and some things (bg etc) don't work on it
    // WARN Must always test on Outlook desktop/iMail/Gmail/Thunderbird/etc whenever changed

    // Generate styles
    const styles = gen_invite_styles(hue)

    const url = `https://colabor.ing/${fund_id}`
    const fund_img = `https://colabor.ing/dev/${fund_id}/profile.jpg`

    // NOTE meta color-scheme ensures Apple etc apply user's scheme rather than default to light
    return `
        <html>
        <head>
            <meta name='color-scheme' content='light dark'>
        </head>
        <body style='margin: 0; padding: 0;'>
        <div style='${styles.wrapper}'>
            <div style='${styles.container}'>
                <table>
                    <tr>
                        <td valign='middle'>
                            <a href='${html_escape(url)}'>
                                <img src='${html_escape(fund_img)}' width='48' height='48' style='border-radius: 50%; background-color: white; margin-right: 12px; border: 1px solid #999;'>
                            </a>
                        </td>
                        <td valign='middle'>
                            <a href='${html_escape(url)}' style='${styles.name}'>
                                ${html_escape(fund_name)}
                            </a>
                        </td>
                    </tr>
                </table>
                <div style='${styles.contents}'>
                    ${contents}
                </div>
                <div style='margin-top: 48px; color: white; font-size: 26px; font-family: serif'>
                    ${message}
                </div>
            </div>
            <p>&nbsp;</p>
            <p style='text-align: center; color: #eee;'>
                <small>Powered by <a href='https://colabor.ing' style='color: #eee;'>Colabor</a></small>
            </p>
        </div>
        </body>
        </html>
    `
}


export function render_email_receipt(fund_id:string, fund_name:string, hue:number, date:string,
        amount:string, method:string, reference:string, message:string){

    const url = `https://colabor.ing/${fund_id}`

    const contents = `
        <h1 style='text-align: center; font-weight: normal; margin-bottom: 48px'>Receipt</h1>
        <table>
            <tr>
                <td valign='middle' style='padding-right: 24px'>
                    <img src='${donation_icon_url}'>
                </td>
                <td valign='middle'>
                    <div style='font-size: 30px; font-weight: bold; margin-bottom: 12px'>${html_escape(amount)}</div>
                    <div style='font-weight: bold'>Donation to ${html_escape(fund_name)}</div>
                </td>
            </tr>
        </table>
        <div style='background-color: #cec; color: black; padding: 24px; margin: 24px 0; font-size: 20px; text-align: center;'>
            <strong>Received</strong> ${html_escape(date)}
        </div>
        <p><strong>Not tax deductible</strong></p>
        <p><strong>Payment method:</strong> ${html_escape(method)}</p>
        <p><strong>Reference code:</strong> ${html_escape(reference)}</p>
        <p>&nbsp;</p>
        <p style='text-align: right;'><strong><a href='${url}'>Fundraiser Information</a></strong></p>
    `

    return render_email(fund_id, fund_name, hue, contents, message)
}


export function render_email_pledge(fund_id:string, fund_name:string, hue:number,
        amount:string, method:string, reference:string, contact_name:string, recurring:string){

    const url = `https://colabor.ing/${fund_id}`

    const contents = `
        <h1 style='text-align: center; font-weight: normal; margin-bottom: 48px'>New Pledge</h1>
        <table>
            <tr>
                <td valign='middle' style='padding-right: 24px'>
                    <img src='${donation_icon_url}'>
                </td>
                <td valign='middle'>
                    <div style='font-size: 30px; font-weight: bold; margin-bottom: 12px'>${html_escape(contact_name)}</div>
                    <div style='font-weight: bold'>${html_escape(reference)}</div>
                </td>
            </tr>
        </table>
        <div style='background-color: #cec; color: black; padding: 24px; margin: 24px 0; font-size: 20px; text-align: center;'>
            <strong>${html_escape(amount)} / ${recurring}</strong>
        </div>
        <p><strong>Payment method:</strong> ${html_escape(method)}</p>
        <p>&nbsp;</p>
        <p style='text-align: right;'><strong><a href='${url}'>Fundraiser Information</a></strong></p>
    `

    return render_email(fund_id, fund_name, hue, contents, "")
}
