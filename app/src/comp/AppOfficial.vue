
<template lang='pug'>


div.nav
    RouterLink(to='/')
        img.icon(src='@/assets/icon.svg')
    VBtn(variant='outlined' color='' to='/official/intro') Introduction
    VBtn(variant='outlined' color='' to='/official/fundraisers') Fundraisers
    VBtn(variant='outlined' color='' to='/official/supporters') Supporters
    VMenu
        template(#activator='{props}')
            VBtn(icon variant='text' color='' v-bind='props')
                AppIcon(name='more_vert')
        VList
            VListItem(to='/official/about')
                VListItemTitle About
            VListItem(to='/official/contact')
                VListItemTitle Contact

div.typo
    router-view

</template>


<script lang='ts' setup>

import {useRouter} from 'vue-router'
import {BibleEnhancer} from '@gracious.tech/fetch-enhancer'


import '@gracious.tech/fetch-client/client.css'
import '@gracious.tech/fetch-enhancer/styles.css'

const enhancer = new BibleEnhancer()
enhancer.discover_bible_references()

useRouter().afterEach((to) => {
    if (to.path.startsWith('/official/')){
        enhancer.discover_bible_references()
    }
})

</script>


<style lang='sass' scoped>

.nav
    display: flex
    align-items: center
    padding-left: 12px

    .icon
        width: 100px

    > *
        margin: 0 12px

.typo
    padding: 48px 36px
    border-radius: 24px

    > :first-child
        margin-top: 0

</style>
