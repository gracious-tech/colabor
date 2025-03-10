
<template lang='pug'>

div.fund
    img.header(:src='`${fund.url}/header.jpg`')
    div.profile(v-if='fund.style.show_profile')
        img(:src='`${fund.url}/profile.jpg`')
    div.text
        h1 {{ fund.name }}
        h2 {{ fund.subheading }}
        div(v-html='fund.intro')

    div.activities
        VTooltip(v-for='activity of fund.activities' :key='activity.id'
                text="Give in appreciation of this" location='bottom right')
            template(#activator='{props}')
                FundActivity(v-bind='props'
                    :activity='activity' :class='{selected: selected_activity === activity.id}'
                    @click='support_activity(activity.id)')

    FundPray
    FundDonate(:activity='selected_activity' @show='show_donation_dialog = true')

div.extra

    h3 Resources Produced

    template(v-if='fund.quotes.length')
        h3 Feedback received
        div.quotes
            FundQuote(v-for='quote of fund.quotes' :quote='quote')

    template(v-if='fund.milestones.length')
        h3 Milestones
        FundMilestones

    h3 Stewarding
    FundSteward

DialogDonate(v-model='show_donation_dialog')

VBtn.donate(@click='show_donation_dialog = true' size='large' color='secondary') Donate

</template>


<script lang='ts' setup>

import {provide, ref} from 'vue'

import FundSteward from './FundSteward.vue'
import FundActivity from './FundActivity.vue'
import FundDonate from './FundDonate.vue'
import FundMilestones from './FundMilestones.vue'
import FundPray from './FundPray.vue'
import FundQuote from './FundQuote.vue'
import DialogDonate from '../dialogs/DialogDonate.vue'

import type {Fundraiser} from '@/types'

const props = defineProps<{fund:Fundraiser}>()
provide<Fundraiser>('fund', props.fund)
const selected_activity = ref<string|null>(null)
const show_donation_dialog = ref(false)

const support_activity = (id:string) => {
    selected_activity.value = selected_activity.value === id ? null : id
}

</script>


<style lang='sass' scoped>

.fund
    align-items: center
    overflow: hidden
    background-color: white
    color: #000c
    margin-bottom: 48px
    border-radius: 18px
    @media (max-width: 860px)
        border-radius: 0

.extra
    @media (max-width: 860px)
        margin: 0 24px

.header
    width: 100%
    height: 30vh
    max-height: 300px
    object-fit: cover
    clip-path: polygon(0 0, 100% 0, 100% 80%, 75% 90%, 25% 90%, 0 100%)

.profile
    margin-top: -100px
    text-align: center

    img
        width: 200px
        height: 200px
        border-radius: 50%
        object-fit: cover
        border: 4px solid white

.text
    margin: 0 var(--gutter)

    h1
        text-align: center

    h2
        text-align: center
        margin-bottom: 36px
        font-weight: 300

h3
    color: white
    margin: 48px 0
    font-size: 26px

.quotes
    display: grid
    grid-gap: 36px
    grid-template-columns: 1fr 1fr
    @media (max-width: 800px)
        grid-template-columns: 100%

.activities
    margin: var(--gutter)

.donate
    position: fixed
    bottom: 20px
    right: 20px
    @media (min-width: 1100px)
        top: 48px
        right: 48px

</style>
