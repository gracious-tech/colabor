
<template lang='pug'>

div.milestones
    div.milestone(v-for='milestone of milestones' :key='milestone.id'
            :class='{upcoming: !milestone.date}')
        div.date
            AppIcon(name='step_out')
            span {{ milestone.date ? month_only(milestone.date) : "Upcoming" }}
        div.box
            img(:src='`${fund.url}/milestone${milestone.id}.jpg`')
            div.text
                h3 {{ milestone.title }}
                div {{ milestone.desc }}



</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'


const fund = inject('fund')

const milestones = computed(() => {
    const ms = [...fund.milestones]
    ms.sort((a, b) => (b.date?.getTime() ?? Infinity) - (a.date?.getTime() ?? Infinity))
    return ms
})

const month_only = (date:Date) => {
    return date.toLocaleDateString(undefined, {month: 'short', year: 'numeric'})
}

</script>


<style lang='sass' scoped>

.milestone
    display: flex
    justify-content: flex-end
    align-items: center
    margin: 24px 0

    &:nth-child(odd)
        flex-direction: row-reverse

        .date
            text-align: left

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
        text-align: right
        color: white
        margin: 0 24px
        font-weight: bold

        .icon
            opacity: 0.2
            margin-bottom: 12px

    .box
        background-color: #ccc
        color: #000c
        display: flex
        max-width: 300px
        border-radius: 8px
        overflow: hidden
        min-height: 100px

        img
            width: 40%
            object-fit: cover
            aspect-ratio: 10 / 1  // Really different just so height set by text and not image

        .text
            padding: 6px
            align-self: center

        h3
            font-size: 15px


</style>
