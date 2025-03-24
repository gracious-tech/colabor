
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

import {onRequest} from 'firebase-functions/v2/https'


// Keep index in memory for life of function
const index_path = join(dirname(fileURLToPath(import.meta.url)), 'index.html')
const index_html = readFileSync(index_path, {encoding: 'utf8'})


export const replace_ogimage = onRequest((request, response) => {

    // Identify fund id and fund's header image url
    const fund_id = request.url.split('/').at(-1)
    const img_url = `/dev/${fund_id}/header.jpg`

    // Replace default og:image with fund's header image
    let resp_html = index_html.replace('/social.jpg', img_url)

    // Identify existing title/desc so can more easily replace
    const old_title = /<title>(.*?)</.exec(resp_html)?.[1]
    const old_desc = /name=['"]description['"] content="(.*?)"/.exec(resp_html)?.[1]

    // Replace meta with generic text that includes fund id
    // This is good enough for a link preview and still doesn't require a slower db request
    if (old_title){
        resp_html = resp_html.replaceAll(old_title, `Support ${fund_id}`)
    }
    if (old_desc){
        resp_html = resp_html.replaceAll(old_desc, "Learn more")
    }

    // Send response
    response.status(200).send(resp_html)
})
