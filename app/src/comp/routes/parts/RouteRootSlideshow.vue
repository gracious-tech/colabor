
<template lang='pug'>

div.slideshow(ref='slideshow_div')

    div.text A fundraising platform for Christian…

    div.line(ref='line_div')
        div.item(v-for='person of people' :key='person')
            div.text {{ person }}.
            img(:src='`/_assets/slideshow/${person}.jpg`')

</template>


<script lang='ts' setup>

import {onBeforeUnmount, onMounted, ref} from 'vue'

import {debounce} from '@/services/utils'


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
    if (!line_div.value){
        return  // Unmounted already
    }
    const container_width = slideshow_div.value!.getBoundingClientRect().width
    const item_width = container_width / 100 * 50
    const margin = (people.length - 1) * item_width  // Sum width of all items except last
    const img_height = item_width / 16 * 9
    line_div.value.querySelectorAll('img').forEach((img, i) => {
        const last = i === people.length -1
        // Give last width of full container so ends showing only last item
        img.style.width = (last ? container_width : item_width) + 'px'
        img.style.height = img_height + 'px'
    })
    line_div.value.style.marginLeft = '-' + margin + 'px'
}


// Get debounced version so can add/remove event listener
const debounced_display_line_end = debounce(display_line_end)

onMounted(() => {
    // Can't calc properly till after DOM fully mounted
    setTimeout(display_line_end, 1)
    // Need to recalc if window size changes
    // WARN Was using ResizeObserver but it caused infinite loop issues due to triggering resize
    self.addEventListener('resize', debounced_display_line_end)
})

onBeforeUnmount(() => {
    self.removeEventListener('resize', debounced_display_line_end)
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
