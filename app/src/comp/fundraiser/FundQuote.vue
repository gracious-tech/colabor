
<template lang='pug'>


div.quote
    span.text #[span.q1 “]{{ quote.text }}#[span.q2 ”]
    div.attr
        span.author(v-if='quote.author') &mdash; {{ quote.author }}
        VChip(v-if='quote.context' size='x-small' rounded) {{ quote.context }}


</template>


<script lang='ts' setup>

import type {Quote} from '@/types'


const props = defineProps<{quote:Quote}>()


</script>


<style lang='sass' scoped>

.quote
    opacity: 0.8

.text
    line-height: 1.3
    font-size: 24px
    font-family: Caveat, serif

    .q1, .q2
        font-size: 1.8em
        opacity: 0.3
        vertical-align: middle
        line-height: 0

    .q1
        margin-right: 12px

    .q2
        margin-left: 2px
        margin-right: 18px

.attr
    display: inline-block  // So author+context always sticks together and not wrapped
    margin-top: 2px

.author
    font-weight: bold
    font-size: 13px
    margin-right: 8px

</style>
