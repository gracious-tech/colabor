
<template lang="pug">

v-dialog(v-model="show" max-width="400")
    v-card
        v-card-title Add Fundraiser
        v-card-text
            v-text-field(v-model="fund_id" label="Fundraiser ID" required)
            v-text-field(v-model="fund_title" label="Fundraiser title" required)
            v-text-field(v-model="fund_steward_name" label="Your name" required)
            v-radio-group(v-model="fund_type" label="Type" row)
                v-radio(label="Public" value="public")
                v-radio(label="Private" value="private")
        v-card-actions
            v-spacer
            v-btn(text @click="show = false") Cancel
            v-btn(@click='submit' :disabled="loading")
                v-progress-circular(v-if="loading" indeterminate size="20" color="white")
                span(v-else) Create

</template>


<script setup lang="ts">

import {ref} from 'vue'

import {use_waiter} from '@/services/composables'
import {create_fundraiser} from '@/services/backend'


const show = defineModel<boolean>({required: true})

const {loading, error, run} = use_waiter()

const fund_id = ref('')
const fund_title = ref('')
const fund_type = ref('public')
const fund_steward_name = ref('')

async function submit(){
    await run(() => create_fundraiser(fund_id.value, fund_title.value, fund_steward_name.value))
    show.value = false
}

</script>
