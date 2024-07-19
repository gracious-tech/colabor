
<template lang='pug'>

div.slideshow(ref='slideshow_div')

    div.text A fundraising platform for Christian…

    div.line(ref='line_div')
        div.item(v-for='person of people')
            div.text {{ person }}.
            img(:src='`/_assets/slideshow/${person}.jpg`')

</template>


<script lang='ts' setup>

import {onBeforeUnmount, onMounted, ref} from 'vue'


const line_div = ref<HTMLDivElement>()
const slideshow_div = ref<HTMLDivElement>()

let people = ['artists', 'designers', 'disciplers', 'filmmakers', 'missionaries', 'musicians',
    'programmers', 'teachers', 'trainers', 'writers']

// Randomise
people = people.map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)

// Add ministry last so always ends animation on it
people.push('ministry')

const display_line_end = () => {
        const container_width = slideshow_div.value!.getBoundingClientRect().width
        const item_width = container_width / 100 * 50
        let margin = (people.length - 1) * item_width  // Sum width of all items except last
        const img_height = item_width / 16 * 9
        line_div.value!.querySelectorAll('img').forEach((img, i) => {
            const last = i === people.length -1
            // Give last width of full container so ends showing only last item
            img.style.width = (last ? container_width : item_width) + 'px'
            img.style.height = img_height + 'px'
        })
        line_div.value!.style.marginLeft = '-' + margin + 'px'
    }

let observer:ResizeObserver

onMounted(() => {
    setTimeout(display_line_end, 1)
    // line_div.value!.style.transitionProperty = 'none'
    observer = new ResizeObserver(display_line_end)
    observer.observe(slideshow_div.value!)
})

onBeforeUnmount(() => {
    observer.disconnect()
})

</script>


<style lang='sass' scoped>

.text
    text-align: center
    font-size: 30px
    font-weight: 200

.slideshow
    width: 100%
    overflow: hidden
    user-select: none

    > .text
        margin: 48px 24px 0 24px

    .line
        display: flex
        transition: margin-left 60s linear
        margin-left: 0
        .item
            .text
                margin-bottom: 24px

            img
                object-fit: cover

</style>
