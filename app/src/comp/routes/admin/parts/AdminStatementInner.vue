
<template lang="pug">

h2 {{ statement.title }}
h3(class='mb-6') {{ formatted_start }} - {{ formatted_end }}

AppHtml(:html='statement.message' @changed='update_message')

v-list(class='mt-12')
    StatementItem(v-for="item of statement_items" :key="item.id" :item="item"
        :statement='statement.id')

v-btn(class='my-4' @click='create_item') Add Item

</template>


<script setup lang="ts">

import {computed, inject, type Ref} from 'vue'

import AppHtml from '@/comp/global/AppHtml.vue'
import StatementItem from './AdminStatementItem.vue'
import {format_date_string} from '@/services/utils'
import {update_statement, use_statement_items, create_statement_item} from '@/services/backend'

import type {StatementWithId} from '@/shared/schemas'


const fundraiser = inject('fundraiser') as Ref<string>
const props = defineProps<{statement:StatementWithId}>()
const statement_items = use_statement_items(fundraiser.value, props.statement.id)

const formatted_start = computed(() => format_date_string(props.statement.start))
const formatted_end = computed(() => format_date_string(props.statement.end))


async function update_message(value:string){
    update_statement(fundraiser.value, props.statement.id, {message: value})
}

async function create_item() {
    await create_statement_item(fundraiser.value, props.statement.id, {
        contact: '',
        cents: 0,
        currency: 'aud',  // TODO Default to fundraiser's currency
        ref_codes: [],
        record_sent: false,
    })
}

</script>


<style lang='sass' scoped>

</style>
