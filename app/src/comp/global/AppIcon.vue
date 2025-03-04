
<template lang='pug'>

component.icon(:is='icons[name]')

</template>


<script lang='ts' setup>


import drag_indicator from '@material-symbols/svg-400/outlined/drag_indicator.svg?component'
import close from '@material-symbols/svg-400/outlined/close.svg?component'
import arrow_back from '@material-symbols/svg-400/outlined/arrow_back.svg?component'
import copyright from '@material-symbols/svg-400/outlined/copyright.svg?component'
import auto_stories from '@material-symbols/svg-400/outlined/auto_stories.svg?component'
import subject from '@material-symbols/svg-400/outlined/subject.svg?component'
import download from '@material-symbols/svg-400/outlined/download.svg?component'
import error from '@material-symbols/svg-400/outlined/error.svg?component'
import help from '@material-symbols/svg-400/outlined/help.svg?component'
import currency_bitcoin from '@material-symbols/svg-400/outlined/currency_bitcoin.svg?component'
import credit_card from '@material-symbols/svg-400/outlined/credit_card.svg?component'
import account_balance from '@material-symbols/svg-400/outlined/account_balance.svg?component'
import check from '@material-symbols/svg-400/outlined/check.svg?component'
import expand_circle_up from '@material-symbols/svg-400/outlined/expand_circle_up.svg?component'
import paid from '@material-symbols/svg-400/outlined/paid.svg?component'
import step_out from '@material-symbols/svg-400/outlined/step_out.svg?component'
import stacks from '@material-symbols/svg-400/outlined/stacks.svg?component'
import emoji_people from '@material-symbols/svg-400/outlined/emoji_people.svg?component'
import equalizer from '@material-symbols/svg-400/outlined/equalizer.svg?component'
import world from '@material-symbols/svg-400/outlined/public.svg?component'
import more_vert from '@material-symbols/svg-400/outlined/more_vert.svg?component'

import planner_banner from '@/assets/planner_banner.svg?component'

import type {FunctionalComponent} from 'vue'


defineProps({
    name: {required: true, type: String},
})


const icons = {
    drag_indicator, close, arrow_back, planner_banner, copyright, auto_stories, check,
    subject, download, error, help, currency_bitcoin, credit_card, account_balance,
    expand_circle_up, step_out, paid, stacks, emoji_people, equalizer, world, more_vert,
} as Record<string, FunctionalComponent>


</script>


<style lang='sass' scoped>

.icon
    height: 24px
    width: 24px
    fill: currentColor

</style>
