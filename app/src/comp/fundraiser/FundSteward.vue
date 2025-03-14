
<template lang='pug'>

div.steward

    div.unique
        FundStewardPolicy(title="Donations received by" :value='fund.steward.organiser_name'
            :explain='explain_received')
        FundStewardPolicy(title="Donations go towards" :value='value_towards'
            :explain="explain_towards")
        FundStewardPolicy(title="Fundraising goal" :value='value_goal'
            :explain='explain_goal')

    div.common
        FundStewardPolicy(title="Non-commercial ministry" explain="This ministry serves people free of charge. Resources created are free of copyright and there is always a means of free access to them. Physical distribution costs may be charged but there is always a free alternative, such as digital access.")
        FundStewardPolicy(title="Non-profit ministry" explain="They agree to redirect donations to other ministries if they exceed the income/assets caps they have stated. They also agree to carefully keep track of donations received for this purpose.")
        FundStewardPolicy(title="Beliefs faithful to Scripture" explain="Those fundraising affirm the Apostles' Creed, the Trinity, and the authority of Scripture.")

div(class='text-center')
    div(class='explain') {{ fund.steward.goal_explain }}
    div(class='explain') {{ get_tax_notice(fund.payment.tax_deductible) }}
    p(class='mt-12') {{ disclaimer }}
    VBtn(variant='outlined' color='' href='/official' target='_blank') Learn more

</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'

import FundStewardPolicy from './FundStewardPolicy.vue'
import {disclaimer, get_tax_notice} from '@/services/utils'

import type {Fundraiser} from '@/types'


const fund = inject('fund') as Fundraiser

const value_towards = computed(() => {
    return {
        income: "Livelihood",
        cause: "Cause",
        mixed: "Livelihood & Cause",
    }[fund.steward.towards]
})

const explain_received = computed(() => {
    return "This is who stewards the donations and ensures they go towards the stated cause."
})

const explain_towards = computed(() => {
    const personal = fund.steward.organiser_type === 'individual' ? 'personal' : ''
    return {
        income: `Funds go directly towards the organiser's own ${personal} income rather than to a specific cause.`,
        cause: `Funds go solely towards the stated cause and no one draws any personal benefit from it.`,
        mixed: `Funds go both towards the cause and also towards the organiser's own ${personal} income`,
    }[fund.steward.towards]
})

const explain_goal = computed(() => {
    return `When this goal is reached the fundraiser will either cease seeking new donors
        or will clarify the next goal's amount and purpose.`
})

const value_goal = computed(() => {
    let str = fund.steward.goal.toLocaleString(undefined, {
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        currency: fund.steward.goal_currency,
        minimumFractionDigits: 0,
    })
    str += ' ' + fund.steward.goal_currency.toUpperCase()
    if (fund.steward.plus_super){
        str += ' + super'
    }
    if (fund.steward.goal_period){
        str += ' / ' + fund.steward.goal_period
    }
    return str
})

</script>


<style lang='sass' scoped>


.steward
    display: flex
    justify-content: space-between
    width: 100%
    color: white

    @media (max-width: 860px)
        flex-direction: column
        > *:last-child
            max-width: 450px !important  // Make things align better on narrow screens

    > *
        flex-basis: 0
        flex-grow: 1

        &:first-child
            max-width: 450px

        &:last-child
            max-width: 300px

.explain
    opacity: 0.7
    font-weight: 300
    font-size: 0.9em
    margin-top: 12px


</style>
