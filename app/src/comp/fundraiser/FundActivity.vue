
<template lang='pug'>

div.activity
    img(:src='`/causes/example/activity${activity.id}.jpg`')
    div
        h3 {{ activity.title }}
        div(v-html='activity.desc')


</template>


<script lang='ts' setup>

const props = defineProps<{activity:unknown}>()

</script>


<style lang='sass' scoped>

.activity
    display: flex
    overflow: hidden
    width: 100%
    border-radius: 12px
    margin-bottom: 24px
    background-color: #eee
    font-size: 15px

    img
        width: 30%
        aspect-ratio: 10 / 1  // Really different just so height set by text and not image
        object-fit: cover

    & > div
        padding: calc(var(--gutter) / 2)

        p
            margin-top: 0


</style>
