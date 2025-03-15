
<template lang='pug'>

div.milestones
    div.milestone(v-for='milestone of milestones' :key='milestone.id'
            :class='{upcoming: !milestone.date, clickable: milestone.url}' @click='open(milestone.url)')
        div.date
            AppIcon(name='step_out')
            span {{ milestone.upcoming ? "Upcoming" : milestone.date }}
        div.box
            img(:src='`${fund.url}/milestone-${milestone.id}.jpg`')
            div.text {{ milestone.title }}



</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'

import type {Fundraiser} from '@/types'


const fund = inject('fund') as Fundraiser

const milestones = computed(() => {
    let upcoming = true
    return fund.content.milestones.map(ms => {
        if (ms.date){
            upcoming = false  // Can't be upcoming once first item with date reached
        }
        return {...ms, upcoming}
    })
})

const open = (url:string) => {
    if (url){
        self.open(url, '_blank')
    }
}

</script>


<style lang='sass' scoped>

.milestone
    display: flex
    justify-content: flex-end
    align-items: center
    @media (max-width: 860px)
        margin: 24px 0

    &:nth-child(odd)
        flex-direction: row-reverse

    &.clickable .box
        cursor: pointer
        &:hover
            filter: brightness(1.1)

    &.upcoming
        .date
            font-style: italic
            font-weight: normal
        .box
            border: 2px dashed #fff4
            color: #fff9
            background-color: transparent

    .date
        display: flex
        flex-direction: column
        align-items: center
        text-align: center
        color: white
        margin: 0 24px
        font-weight: bold

        .icon
            opacity: 0.2
            margin-bottom: 12px

    .box
        background-color: #333
        color: #fffd
        display: flex
        width: 100%
        max-width: 300px
        border-radius: 8px
        overflow: hidden
        height: 80px

        img
            height: 100%
            object-fit: cover
            aspect-ratio: 1 / 1

        .text
            padding: 12px
            align-self: center
            font-size: 14px


</style>
