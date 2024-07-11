
<template lang='pug'>

div.fund
    img.header(src='/causes/example/header.jpg')
    div.profile
        img(src='/causes/example/profile.jpg')
    div.text
        h1 {{ fund.name }}
        h2 {{ fund.subheading }}
        div(v-html='fund.intro')

    div.activities
        VTooltip(v-for='activity of fund.activities' :key='activity.id'
                text="Give towards this work" location='bottom right')
            template(#activator='{props}')
                FundActivity(v-bind='props'
                    :activity='activity' :class='{selected: selected_activity === activity.id}'
                    @click='support_activity(activity.id)')

    FundPray
    FundDonate(:activity='selected_activity')

div.extra
    h3 Milestones

    FundMilestones

    h3 Stewarding

    FundSteward


</template>


<script lang='ts' setup>

import {inject, ref} from 'vue'

import FundSteward from './FundSteward.vue'
import FundActivity from './FundActivity.vue'
import FundDonate from './FundDonate.vue'
import FundMilestones from './FundMilestones.vue'
import FundPray from './FundPray.vue'


const fund = inject('fund')
const selected_activity = ref<string|null>(null)

const support_activity = (id:string) => {
    selected_activity.value = selected_activity.value === id ? null : id
}

</script>


<style lang='sass' scoped>

.fund
    align-items: center
    overflow: hidden
    background-color: white
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

.activities
    margin: var(--gutter)

    .activity
        cursor: pointer
        border: 2px solid transparent

        &.selected
            border-color: rgb(var(--v-theme-secondary))

</style>
