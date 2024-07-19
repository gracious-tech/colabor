
<template lang='pug'>

div.steward

    div.unique
        FundStewardPolicy(title="Donations go towards" :value='towards_title'
            :explain="towards_explain")
        FundStewardPolicy(title="Household Income Cap"
            :value='`< ${income_cap} / year`' explain="This is the maximum amount they say they will earn before redirecting donations to other ministries more in need than theirs.")
        FundStewardPolicy(title="Household Assets Cap" :value='`< ${assets_cap}`' explain="This is the maximum amount of assets they say they will store before redirecting donations to other ministries more in need than theirs.")

    div.common
        FundStewardPolicy(title="Non-commercial ministry" explain="Recipients of this ministry receive it free of charge. Resources created are free of copyright and there is always a means of free access to them. Physical distribution costs may be charged but there is always a free alternative, such as digital access.")
        FundStewardPolicy(title="Non-profit ministry" explain="They agree to redirect donations to other ministries if they exceed the income/assets caps they have stated. They also agree to carefully keep track of donations received for this purpose.")
        FundStewardPolicy(title="Beliefs faithful to Scripture" explain="Those fundraising affirm the divinity of Jesus, agree to the creeds, and the authority of Scripture.")

div.trust(class='text-center')
    p Donations go directly to fundraisers. You should only donate if you trust the organisers of this fundraiser.
    VBtn() Learn more

</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'

import FundStewardPolicy from './FundStewardPolicy.vue'
import type {Fundraiser} from '@/types'


const fund = inject('fund') as Fundraiser

const towards_title = computed(() => {
    return {
        income: "Livelihood",
        cause: "Cause",
        mixed: "Livelihood & Cause",
    }[fund.steward.towards]
})

const towards_explain = computed(() => {
    const personal = fund.steward.organiser_type === 'individual' ? 'personal' : ''
    return {
        income: `Funds go directly towards the organiser's own ${personal} income rather than to a specific cause.`,
        cause: `Funds go solely towards the stated cause and no one draws any personal benefit from it.`,
        mixed: `Funds go both towards the cause and also towards the organiser's own ${personal} income`,
    }[fund.steward.towards]
})

const income_cap = computed(() => {
    return fund.steward.max_personal_income.toLocaleString(undefined, {
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        currency: fund.currency,
        minimumFractionDigits: 0,
    }) + ' ' + fund.currency.toUpperCase()
})

const assets_cap = computed(() => {
    return fund.steward.max_personal_assets.toLocaleString(undefined, {
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        currency: fund.currency,
        minimumFractionDigits: 0,
    }) + ' ' + fund.currency.toUpperCase()
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

    > *
        flex-basis: 0
        flex-grow: 1
        margin-bottom: 24px

        &:first-child
            max-width: 450px

        &:last-child
            max-width: 300px


</style>
