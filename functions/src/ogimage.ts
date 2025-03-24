
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

import {onRequest} from 'firebase-functions/v2/https'


// Keep index in memory for life of function
const index_path = join(dirname(fileURLToPath(import.meta.url)), 'index.html')
const index_html = readFileSync(index_path, {encoding: 'utf8'})


export const replace_ogimage = onRequest((request, response) => {

    // Identify fund id and fund's header image url
    const fund_id = request.url.split('/').at(-1)!
    const img_url = `/dev/${fund_id}/header.jpg`

    // Replace default og:image with fund's header image
    let resp_html = index_html.replace('/social.jpg', img_url)

    // Identify existing title/desc so can more easily replace
    const old_title = /<title>(.*?)</.exec(resp_html)?.[1]
    const old_desc = /name=['"]description['"] content="(.*?)"/.exec(resp_html)?.[1]

    // Replace meta with generic text that includes fund id
    // This is good enough for a link preview and still doesn't require a slower db request
    if (old_title){
        const fund_name = fund_id.replace(/^\./, '')  // Remove private leading period if present
        resp_html = resp_html.replaceAll(old_title, `Support ${fund_name}`)
    }
    if (old_desc){
        resp_html = resp_html.replaceAll(old_desc, "Learn more")
    }

    // If id starts with '.' it is a private fundraiser and shouldn't be indexed
    // NOTE This shouldn't affect og:image previews, hopefully
    if (fund_id.startsWith('.')){
        response.setHeader('X-Robots-Tag', 'noindex, nofollow')
    }

    // Send response
    response.status(200).send(resp_html)
})
