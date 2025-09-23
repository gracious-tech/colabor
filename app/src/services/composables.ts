

import {ref} from 'vue'


// Composable for tracking progress/error state for an async task
export function use_waiter(){
    const loading = ref(false)
    const error = ref<unknown>(null)

    async function run(fn:()=>unknown){
        loading.value = true
        error.value = null
        try {
            return await fn()
        } catch (err){
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    return {loading, error, run}
}
