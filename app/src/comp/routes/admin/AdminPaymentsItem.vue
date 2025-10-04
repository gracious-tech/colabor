<template lang="pug">

v-list-item
    v-list-item-title {{ date }} | {{ amount }} | {{ contact_display }}
    v-list-item-subtitle {{ payment.means }}
    template(#append)
        v-btn(icon variant='text' @click='send_receipt_action' :color='payment.receipt_sent ? "green" : ""')
            app-icon(:name='payment.receipt_sent ? "mark_email_read" : "send"')
        v-menu(location="bottom end")
            template(#activator="{props}")
                v-btn(icon v-bind="props" variant='text')
                    app-icon(name='more_vert')
            v-list
                v-list-item(@click='toggle_receipt_sent')
                    v-list-item-title Toggle receipt sent status
                v-list-item(@click='delete_payment_action')
                    v-list-item-title Delete payment record

</template>


<script setup lang="ts">

import {computed, inject, type Ref} from 'vue'

import {delete_payment, send_receipt, update_payment} from '@/services/backend'
import {format_date_string} from '@/services/utils'
import {cents_to_display} from '@/shared/currency'
import {use_waiter} from '@/services/composables'

import type {PaymentWithId, ContactWithId} from '@/shared/schemas'


const fundraiser = inject('fundraiser') as Ref<string>
const contacts = inject('contacts') as Ref<ContactWithId[]>

const props = defineProps<{payment:PaymentWithId}>()

const send_state = use_waiter()


const contact = computed(() => {
    return contacts.value.find(c => c.id === props.payment.contact)
})

const contact_display = computed(() => {
    if (!contact.value){
        return "[unknown]"
    }
    return `${contact.value.name} <${contact.value.email}>`
})

const amount = computed(() => {
    return cents_to_display(props.payment.cents, props.payment.currency)
})

const date = computed(() => {
    return format_date_string(props.payment.date)
})

function send_receipt_action(){
    if (!props.payment.receipt_sent && contact.value?.email && !send_state.loading.value){
        send_state.run(() => {
            send_receipt({fundraiser: fundraiser.value, payment: props.payment.id})
        })
    }
}

function delete_payment_action(){
    delete_payment(fundraiser.value, props.payment.id)
}

function toggle_receipt_sent(){
    update_payment(fundraiser.value, props.payment.id, {receipt_sent: !props.payment.receipt_sent})
}


</script>


<style lang='sass' scoped>


</style>
