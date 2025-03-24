
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
    const resp_html = index_html.replace('/social.jpg', img_url)

    // Send response
    response.status(200).send(resp_html)
})
