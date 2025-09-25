
<template lang='pug'>

AdminStatementInner(v-if='statement' :statement='statement')
v-alert(v-else type='error' color='error') ...

</template>


<script setup lang='ts'>

import {inject, type Ref} from 'vue'
import {useRoute} from 'vue-router'
import AdminStatementInner from './parts/AdminStatementInner.vue'
import {use_statement} from '@/services/backend'

const fundraiser = inject('fundraiser') as Ref<string>
const route = useRoute()
const statement_id = route.params['statement'] as string
const statement = use_statement(fundraiser.value, statement_id)

</script>


<style lang='sass' scoped>

</style>
