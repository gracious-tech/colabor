
<template lang='pug'>

div.policy(@click='show_explain = !show_explain')
    div.state
        AppIcon.check(v-if='!value' name='check')
        span.title {{ title }}
        span.value(v-if='value') {{ value }}
        AppIcon(:name='show_explain ? "expand_circle_up" : "help"')
    transition(name='explain')
        div.explain(v-if='show_explain') {{ explain }}


</template>


<script lang='ts' setup>

import {ref} from 'vue'


const props = defineProps<{title:string, value?:string, explain:string}>()

const show_explain = ref(false)

</script>


<style lang='sass' scoped>

.policy
    cursor: pointer

    .state
        display: flex
        align-items: center
        height: 45px

        .check
            margin-right: 18px
            color: #6f6a

        .value
            font-weight: 200

        .title, .value
            flex-basis: 0
            flex-grow: 1

    .explain
        opacity: 0.7
        font-weight: 300
        font-size: 0.9em


.explain-enter-active
    transition: opacity 1s ease-in, font-size 0.5s ease-out
.explain-leave-active
    transition: opacity 1s ease-out, font-size 0.5s ease-in

.explain-enter-from, .explain-leave-to
    opacity: 0 !important
    font-size: 0px !important

</style>
