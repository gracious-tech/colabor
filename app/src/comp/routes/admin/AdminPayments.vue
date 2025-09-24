
<template lang="pug">

v-list
    AdminPaymentsItem(v-for="payment in payments" :key="payment.id" :payment='payment')

</template>


<script setup lang="ts">

import {inject, type Ref} from 'vue'

import {use_payments} from '@/services/backend'
import AdminPaymentsItem from './AdminPaymentsItem.vue'


const fundraiser = inject('fundraiser') as Ref<string>
const payments = use_payments(fundraiser.value)


</script>


<style lang='sass' scoped>


</style>
