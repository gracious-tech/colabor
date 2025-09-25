
<template lang="pug">

v-dialog(v-model="show" max-width="400")
    v-card
        v-card-title Add Record of Payment
        v-card-text
            v-date-input(v-model='date' label="Date")
            AppAmount(:cents='cents' :currency='currency' @update:cents='cents = $event'
                @update:currency='currency = $event')
            SelectContact(v-model='contact')
            v-text-field(v-model='means' label="Payment method")
            v-text-field(v-model='ref_code' label="Reference code")
            div {{ error }}
        v-card-actions
            v-spacer
            v-btn(text @click="show = false") Cancel
            v-btn(@click='submit' :disabled="loading")
                v-progress-circular(v-if="loading" indeterminate size="20" color="white")
                span(v-else) Create

</template>


<script setup lang="ts">

import {inject, ref, type Ref} from 'vue'
import {VDateInput} from 'vuetify/labs/VDateInput'

import AppAmount from '@/comp/global/AppAmount.vue'
import {use_waiter} from '@/services/composables'
import {update_pledge, create_contact, create_payment} from '@/services/backend'
import SelectContact, {type id_or_details} from './SelectContact.vue'

import type {ContactWithId, PledgeWithId} from '@/shared/schemas'


const show = defineModel<boolean>({required: true})
const props = defineProps<{pledge:PledgeWithId}>()


const {loading, error, run} = use_waiter()

const fundraiser = inject('fundraiser') as Ref<string>
const contacts = inject('contacts') as Ref<ContactWithId[]>


const contact = ref<id_or_details>({name: props.pledge.name, email: props.pledge.email})
const cents = ref(props.pledge.cents ?? 0)
const currency = ref(props.pledge.currency)
const date = ref<string|null>(null)
const means = ref(props.pledge.means)
const ref_code = ref(props.pledge.ref_code)


async function submit(){

    if (!date.value){
        error.value = "Date is missing"
        return
    }

    if (typeof contact.value === 'string' && !contacts.value.find(c => c.id === contact.value)){
        error.value = "Contact does not exist"
        return
    }

    if (cents.value <= 0){
        error.value = "Amount is invalid"
        return
    }

    // Create contact if needed
    let contact_id:string
    if (typeof contact.value === 'string'){
        contact_id = contact.value
    } else {
        contact_id = await create_contact(fundraiser.value, {...contact.value, name_hello: ''})
    }

    run(() => create_payment(fundraiser.value, {
        contact: contact_id,
        cents: cents.value,
        currency: currency.value.toLowerCase(),
        date: date.value!,
        means: means.value,
        ref_code: ref_code.value,
        receipt_sent: false,
    }).then(() => {
        // If pledge doesn't recur, then assume it has been fulfilled
        if (props.pledge.status === 'pending' && props.pledge.recurring === 'single'){
            update_pledge(fundraiser.value, props.pledge.id, {status: 'finished'})
        }
    }))

    // Hide dialog
    show.value = false
}

</script>
