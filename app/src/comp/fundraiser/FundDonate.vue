
<template lang='pug'>


div.donate
    h3 Support
    div.quote
        | {{ subheading }}
        AppIcon(v-if='activity' name='help' class='ml-2' v-tooltip='"Donations will not specifically go toward an activity you choose but the fundraiser will be informed that you appreciate it"')
    VBtn(@click='$emit("show")' size='large' color='' variant='elevated' class='mt-10 mb-4') Donate


div.progress
    v-progress-linear(:model-value='fund.steward.progress_current'
            :max='fund.steward.progress_total' color='#8db' bg-color='black' bg-opacity='0.15' :height='40' striped)
        div.amount
            span.current {{ current }}
            span.total {{ total }} (goal)


</template>


<script lang='ts' setup>

import {computed, inject} from 'vue'

import {currency_str} from '@/services/utils'

import type {Fundraiser} from '@/types'


const props = defineProps<{activity:string|null}>()
defineEmits(['show'])
const fund = inject('fund') as Fundraiser

const subheading = computed(() => {
    if (props.activity){
        return "In appreciation of: " + fund.activities.filter(a => a.id === props.activity)[0]!.title
    }
    return "“So that we may be fellow workers for the truth.” (3 John 1:8)"
})

const current = computed(() => {
    if (fund.steward.progress_type === '%'){
        return `${fund.steward.progress_current}%`
    } else if (fund.steward.progress_type === 'money'){
        return currency_str(fund.steward.progress_current, fund.steward.goal_currency)
    } else if (fund.steward.progress_type === 'days'){
        return `${fund.steward.progress_current} days/week`
    }
    throw new Error("Impossible progress_type")
})

const total = computed(() => {
    if (fund.steward.progress_type === '%'){
        return ''
    } else if (fund.steward.progress_type === 'money'){
        return currency_str(fund.steward.progress_total, fund.steward.goal_currency)
    } else if (fund.steward.progress_type === 'days'){
        return `${fund.steward.progress_total} days/week`
    }
    throw new Error("Impossible progress_type")
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
        display: flex
        font-size: 16px
        font-style: italic
        justify-content: center

    h3
        font-size: 40px
        font-weight: 600

.progress
    background-color: rgb(var(--v-theme-secondary))
    .amount
        display: flex
        width: 100%
        padding: 0 var(--gutter)
        font-weight: bold
        opacity: 0.8
        .current
            flex-grow: 1

</style>
