
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
        VTooltip(v-for='activity of fund.activities' :key='activity.id' location='bottom right'
                :text='selected_activity === activity.id ? "✕" : "Give in appreciation of this"')
            template(#activator='{props}')
                FundActivity(v-bind='props'
                    :activity='activity' :class='{selected: selected_activity === activity.id}'
                    @click='support_activity(activity.id)')

    FundPray
    FundDonate(:activity='selected_activity' @show='donate'
        @noactivity='selected_activity = null')

div.extra

    template(v-if='fund.resources.length')
        h3 Resources Produced
        div.resources
            FundResource(v-for='resource of fund.resources' :key='resource.id' :resource='resource')

    template(v-if='fund.quotes.length')
        h3 Feedback received
        div.quotes
            FundQuote(v-for='quote of fund.quotes' :key='quote.id' :quote='quote')

    template(v-if='fund.milestones.length')
        h3 Milestones
        FundMilestones

    h3 Stewarding
    FundSteward

VBtn.donate(@click='donate' :size='donate_btn_size' color='secondary') Donate

DialogDonate(v-model='show_donation_dialog' :activity='selected_activity')
DialogStripeConfirm

</template>


<script lang='ts' setup>

import {provide, ref, computed} from 'vue'
import {useDisplay} from 'vuetify'

import FundSteward from './FundSteward.vue'
import FundActivity from './FundActivity.vue'
import FundDonate from './FundDonate.vue'
import FundMilestones from './FundMilestones.vue'
import FundPray from './FundPray.vue'
import FundResource from './FundResource.vue'
import FundQuote from './FundQuote.vue'
import DialogDonate from '../dialogs/DialogDonate.vue'
import DialogStripeConfirm from '../dialogs/DialogStripeConfirm.vue'

import type {Fundraiser} from '@/types'

const display = useDisplay()
const props = defineProps<{fund:Fundraiser}>()
provide<Fundraiser>('fund', props.fund)


const selected_activity = ref<string|null>(null)
const show_donation_dialog = ref(false)

const support_activity = (id:string) => {
    selected_activity.value = selected_activity.value === id ? null : id
}

const donate_btn_size = computed(() => {
    return display.mdAndUp.value ? "large" : "small"
})

const donate = () => {
    if (props.fund.payment.third_party){
        self.open(props.fund.payment.third_party, '_blank')
    } else {
        show_donation_dialog.value = true
    }
}

</script>


<style lang='sass' scoped>

.fund
    align-items: center
    overflow: hidden
    background-color: white
    color: #000c
    margin-bottom: 120px
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
    margin-top: 80px
    margin-bottom: 24px
    font-size: 26px

.resources
    display: grid
    gap: 24px
    grid-template-columns: 1fr 1fr 1fr
    @media (max-width: 860px)
        gap: 12px
        grid-template-columns: 1fr 1fr

.quotes
    display: grid
    gap: 36px
    grid-template-columns: 1fr 1fr
    @media (max-width: 800px)
        grid-template-columns: 1fr

.activities
    margin: var(--gutter)

.donate
    position: fixed
    bottom: 20px
    right: 20px
    @media (min-width: 1100px)
        bottom: auto
        right: auto
        top: 48px
        left: calc(100vw / 2 + 400px + 48px)

</style>
