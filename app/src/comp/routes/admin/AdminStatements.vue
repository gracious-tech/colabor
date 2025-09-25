<template lang='pug'>

h3 Statements
v-list(class='mt-4 mb-6')
    AdminStatementsItem(v-for='statement of statements' :key='statement.id' :statement='statement')

v-btn(@click='show_dialog = true') New Statement
CreateStatementDialog(v-model='show_dialog')

</template>


<script setup lang='ts'>

import {inject, ref, type Ref} from 'vue'

import AdminStatementsItem from './parts/AdminStatementsItem.vue'
import CreateStatementDialog from './parts/DialogCreateStatement.vue'
import {use_statements} from '@/services/backend'

const fundraiser = inject('fundraiser') as Ref<string>
const statements = use_statements(fundraiser.value)
const show_dialog = ref(false)


</script>


<style lang='sass' scoped>

</style>
