
<template lang='pug'>

div.milestones
    div.milestone(v-for='milestone of milestones' :key='milestone.id')
        div.date {{ month_only(milestone.date) }}
        div.box
            img(:src='`/causes/example/milestone${milestone.id}.jpg`')
            div.text
                h3 {{ milestone.title }}
                div {{ milestone.desc }}



</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'


const fund = inject('fund')

const milestones = computed(() => {
    const ms = [...fund.milestones]
    ms.sort((a, b) => b.date.getTime() - a.date.getTime())
    return ms
})

const month_only = (date:Date) => {
    return date.toLocaleDateString(undefined, {month: 'short', year: 'numeric'})
}

</script>


<style lang='sass' scoped>

.milestone
    display: flex
    align-items: center
    margin: 24px 0

    &:nth-child(odd)
        flex-direction: row-reverse

        .date
            text-align: left

.date
    text-align: right
    color: white
    margin: 0 24px
    width: 100%
    font-weight: bold

.box
    background-color: #ccc
    display: flex
    max-width: 300px
    border-radius: 8px
    overflow: hidden

    img
        width: 40%

    .text
        padding: 6px

    h3
        font-size: 16px


</style>
