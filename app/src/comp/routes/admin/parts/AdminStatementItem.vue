<template lang="pug">

v-list-item(v-if='!editing' @click='editing = true')
    v-list-item-title {{ contact_name }} &lt;{{ contact_email }}&gt;
    v-list-item-subtitle {{ amount_display }}
v-card(v-else class='pa-4' color='#0003')
    SelectContact(v-model='editable_contact')
    div(class='d-flex align-center')
        AppAmount(:cents='editable_cents' :currency='editable_currency'
            @update:cents='on_cents_change' @update:currency='on_currency_change')
        v-spacer
        v-btn(@click='editing = false' variant='text' class='mr-4') Cancel
        v-btn(@click='save') Save

</template>


<script setup lang="ts">

import {inject, computed, ref, type Ref} from 'vue'

import SelectContact, {type id_or_details} from './SelectContact.vue'
import AppAmount from '@/comp/global/AppAmount.vue'
import {update_statement_item, create_contact} from '@/services/backend'
import {cents_to_display} from '@/shared/currency'

import type {StatementItemWithId, ContactWithId} from '@/shared/schemas'


const fundraiser = inject('fundraiser') as Ref<string>
const contacts = inject('contacts') as Ref<ContactWithId[]>
const props = defineProps<{item:StatementItemWithId, statement:string}>()

const editing = ref(false)
const editable_contact = ref<id_or_details>(props.item.contact)
const editable_cents = ref(props.item.cents)
const editable_currency = ref(props.item.currency)

const contact_info = computed(() => contacts.value.find(c => c.id === props.item.contact))
const contact_name = computed(() => contact_info.value?.name || '[Anonymous]')
const contact_email = computed(() => contact_info.value?.email || 'n/a')
const amount_display = computed(() => cents_to_display(props.item.cents, props.item.currency))


async function on_cents_change(new_cents:number){
    editable_cents.value = new_cents
}


async function on_currency_change(new_currency:string){
    editable_currency.value = new_currency
}


async function save() {
    let contact_id = ''
    if (typeof editable_contact.value === 'string') {
        contact_id = editable_contact.value
    } else {
        contact_id = await create_contact(fundraiser.value, {
            ...editable_contact.value,
            name_hello: '',
        })
    }
    await update_statement_item(fundraiser.value, props.statement, props.item.id, {
        contact: contact_id,
        cents: editable_cents.value,
        currency: editable_currency.value,
    })
    editing.value = false
}

</script>


<style lang='sass' scoped>

</style>
