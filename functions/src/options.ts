// WARN This must be in separate file so it's executed before functions get imported

import {setGlobalOptions} from 'firebase-functions/v2'


setGlobalOptions({
    region: 'us-west1',
    memory: '256MiB',  // 128 resulted in errors
})
