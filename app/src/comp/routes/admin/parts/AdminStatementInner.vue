
<template lang="pug">

h2 {{ statement.title }}
h3(class='mb-6') {{ formatted_start }} - {{ formatted_end }}

AppHtml(:html='statement.message' @changed='update_message')

v-list(class='mt-12')
    StatementItem(v-for="item of statement_items" :key="item.id" :item="item")

</template>


<script setup lang="ts">

import {computed, inject, type Ref} from 'vue'

import AppHtml from '@/comp/global/AppHtml.vue'
import StatementItem from './AdminStatementItem.vue'
import {format_date_string} from '@/services/utils'
import {update_statement, use_statement_items} from '@/services/backend'

import type {StatementWithId} from '@/shared/schemas'


const fundraiser = inject('fundraiser') as Ref<string>
const props = defineProps<{statement:StatementWithId}>()
const statement_items = use_statement_items(fundraiser.value, props.statement.id)

const formatted_start = computed(() => format_date_string(props.statement.start))
const formatted_end = computed(() => format_date_string(props.statement.end))


async function update_message(value:string){
    update_statement(fundraiser.value, props.statement.id, {message: value})
}

</script>


<style lang='sass' scoped>

</style>
