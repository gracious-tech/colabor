
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



</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'

import FundStewardPolicy from './FundStewardPolicy.vue'


const fund = inject('fund')

const towards_title = computed(() => {
    if (fund.steward.towards === 'livelihood'){
        return "Livelihood"
    }
})

const towards_explain = computed(() => {
    if (fund.steward.towards === 'livelihood'){
        return "Funds go directly to their personal bank account. This allows them to spend less time with admin and more time in their ministry."
    }
})

const income_cap = computed(() => {
    return fund.steward.income_cap.toLocaleString(undefined, {
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        currency: fund.currency,
        minimumFractionDigits: 0,
    }) + ' ' + fund.currency.toUpperCase()
})

const assets_cap = computed(() => {
    return fund.steward.assets_cap.toLocaleString(undefined, {
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
