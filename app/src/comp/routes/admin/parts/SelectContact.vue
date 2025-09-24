
<template lang='pug'>

div(v-if='new_contact')
    v-text-field(v-model='name' label="New supporter")
    v-text-field(v-model='email' label="Email")
    v-btn(@click='new_contact = false') Find existing contact
div(v-else)
    v-autocomplete(v-model='existing_id' :items='contacts_list')
    v-btn(@click='new_contact = true') Add new contact

</template>


<script lang='ts' setup>

import {computed, inject, ref, watch} from 'vue'

import type {Ref} from 'vue'
import type {ContactWithId} from '@/shared/schemas'


export type id_or_details = string|{name:string, email:string}

const contacts = inject('contacts') as Ref<ContactWithId[]>

const model = defineModel<id_or_details>({required: true})


const name = ref('')
const email = ref('')
const existing_id = ref<string>('')


const contacts_list = computed(() => {
    return contacts.value.map(c => ({value: c.id, title: c.name}))
})


// Only apply props on initial load so don't wipe out user input
if (typeof model.value === 'string'){
    if (contacts.value.find(c => c.id === (model.value as string))){
        existing_id.value = model.value
    }
} else {
    // Try match an existing contact based on email if given
    if (model.value.email){
        const email_match = contacts.value.find(c => c.email === model.value.email)
        if (email_match){
            existing_id.value = email_match.id
        }
    }
    name.value = model.value.name
    email.value = model.value.email
}


// Default to showing input fields if no existing matched
const new_contact = ref(!existing_id.value)


// Emit values when they change
watch([new_contact, name, email, existing_id], () => {
    const trimmed_name = name.value.trim()
    const trimmed_email = email.value.trim()
    if (new_contact.value){
        if (!trimmed_name && !trimmed_email){
            model.value = ''
        } else {
            model.value = {name: trimmed_name, email: trimmed_email}
        }
    } else {
        model.value = existing_id.value  // Should be empty string if no selection
    }
})

</script>
