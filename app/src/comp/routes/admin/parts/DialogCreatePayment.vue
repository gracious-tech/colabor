
<template lang="pug">

v-dialog(v-model="show" max-width="400")
    v-card
        v-card-title Add Record of Payment
        v-card-text
            v-date-input(v-model='date' display-format='fullDate' label="Date")
            div(class='d-flex my-4')
                v-text-field(v-model='amount' label="Amount")
                v-text-field(v-model='currency' max-width='100' label="Currency" class='ml-2')
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

import {use_waiter} from '@/services/composables'
import {create_contact, create_payment} from '@/services/backend'
import {cents_to_display, display_to_cents} from '@/shared/currency'
import SelectContact, {type id_or_details} from './SelectContact.vue'

import type {ContactWithId, PledgeWithId} from '@/shared/schemas'


const show = defineModel<boolean>({required: true})
const props = defineProps<{pledge:PledgeWithId}>()


const {loading, error, run} = use_waiter()

const fundraiser = inject('fundraiser') as Ref<string>
const contacts = inject('contacts') as Ref<ContactWithId[]>


const contact = ref<id_or_details>({name: props.pledge.name, email: props.pledge.email})
const amount = ref(props.pledge.cents ?
    cents_to_display(props.pledge.cents, props.pledge.currency, true) : '')
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

    const cents = display_to_cents(amount.value, currency.value)
    if (cents <= 0){
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
        cents,
        currency: currency.value.toLowerCase(),
        date: date.value!,
        means: means.value,
        ref_code: ref_code.value,
        receipt_sent: false,
    }))

    // Hide dialog
    show.value = false
}

</script>
