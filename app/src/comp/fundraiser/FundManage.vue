
<template lang='pug'>

p
    | If you have already setup recurring donations, you can cancel them yourself at any time:
    |
    span(v-for='manage of fund.payment.manage_recurring')
        a(:href='manage.url' target='_blank') Cancel {{ manage.label }}
        | .
p To change the amount, simply organize a new recurring donation after cancelling the previous one.

</template>


<script lang='ts' setup>

import {inject} from 'vue'

import type {Fundraiser} from '@/types'


const fund = inject('fund') as Fundraiser

</script>


<style lang='sass' scoped>

</style>
