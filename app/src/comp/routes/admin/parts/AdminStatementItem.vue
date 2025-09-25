
<template lang="pug">

v-list-item
    v-list-item-title {{ contact_name }} &lt;{{ contact_email }}&gt;
    v-list-item-subtitle {{ amount_display }}

</template>


<script setup lang="ts">

import {inject, computed, type Ref} from 'vue'

import {cents_to_display} from '@/shared/currency'

import type {StatementItemWithId, ContactWithId} from '@/shared/schemas'


const contacts = inject('contacts') as Ref<ContactWithId[]>
const props = defineProps<{item:StatementItemWithId}>()

const contact_info = computed(() => contacts.value.find(c => c.id === props.item.contact))
const contact_name = computed(() => contact_info.value?.name || "[Anonymous]")
const contact_email = computed(() => contact_info.value?.email || 'n/a')
const amount_display = computed(() => cents_to_display(props.item.cents, props.item.currency))

</script>


<style lang='sass' scoped>

</style>
