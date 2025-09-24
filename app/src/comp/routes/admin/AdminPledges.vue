
<template lang="pug">

h2 Active

v-list
    AdminPledgesItem(v-for="pledge in active_pledges" :key="pledge.id" :pledge='pledge'
        @payment='show_payment_dialog(pledge)')

h2 Inactive

v-list
    AdminPledgesItem(v-for="pledge in inactive_pledges" :key="pledge.id" :pledge='pledge'
        @payment='show_payment_dialog(pledge)')


DialogCreatePayment(v-if='payment_dialog_pledge' v-model='payment_dialog_show'
    :key='payment_dialog_pledge?.id' :pledge='payment_dialog_pledge')

</template>


<script setup lang="ts">

import {computed, inject, ref, type Ref} from 'vue'

import DialogCreatePayment from './parts/DialogCreatePayment.vue'
import AdminPledgesItem from './AdminPledgesItem.vue'
import {use_pledges} from '@/services/backend'

import type {PledgeWithId} from '@/shared/schemas'


const fundraiser = inject('fundraiser') as Ref<string>
const pledges = use_pledges(fundraiser.value)

const payment_dialog_show = ref(false)
const payment_dialog_pledge = ref<PledgeWithId>()


const active_pledges = computed(() => {
    return pledges.value.filter(p => p.status === 'pending')
})


const inactive_pledges = computed(() => {
    return pledges.value.filter(p => p.status !== 'pending')
})


function show_payment_dialog(pledge: PledgeWithId) {
    payment_dialog_pledge.value = pledge
    payment_dialog_show.value = true
}

</script>


<style lang='sass' scoped>


</style>
