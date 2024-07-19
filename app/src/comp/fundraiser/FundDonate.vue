
<template lang='pug'>


div.donate
    h3 Support
    div.quote {{ subheading }}
    h4 100% of donations go to the fundraiser's accounts
    div.options
        div
            v-btn(size='large' color='')
                app-icon(name='account_balance')
                | Bank Transfer
            div.fees No fees for domestic transfers
        div
            v-btn(size='large' color='')
                app-icon(name='credit_card')
                | Card
            div.fees Some third-party fees
        div
            v-btn(size='large' color='')
                app-icon(name='currency_bitcoin')
                | Bitcoin


div.progress
    v-progress-linear(:model-value='40' :height='40' :max='100' color='#8db' striped)
        div.amount
            span.current 4 days / week
            span.total 10 days / week


</template>


<script lang='ts' setup>

import {computed, inject} from 'vue'


const props = defineProps<{activity:string|null}>()
const fund = inject('fund')

const subheading = computed(() => {
    if (props.activity){
        return fund.activities.filter(a => a.id === props.activity)[0].title
    }
    return "“So that we may be fellow workers for the truth.” (3 John 1:8)"
})

</script>


<style lang='sass' scoped>

.donate
    width: 100%
    padding: 24px
    color: rgb(var(--v-theme-on-secondary))
    background-color: rgb(var(--v-theme-secondary))
    text-align: center

    .quote
        font-size: 16px
        font-style: italic
        margin-bottom: 48px

    .options
        display: flex
        @media (max-width: 860px)
            flex-direction: column

        > *
            display: flex
            flex-direction: column
            flex-basis: 0
            flex-grow: 1
            margin: 12px

            .v-btn

                .icon
                    margin-right: 6px

            .fees
                margin-top: 6px
                color: #0009
                font-size: 14px

    h3
        font-size: 40px
        font-weight: 600

.progress
    .amount
        display: flex
        width: 100%
        padding: 0 var(--gutter)
        font-weight: bold
        opacity: 0.8
        .current
            flex-grow: 1

</style>
