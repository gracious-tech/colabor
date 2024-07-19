
<template lang='pug'>


div.nav
    RouterLink(to='/')
        AppLogo(class='my-4')
    VBtn(variant='outlined' color='' to='/official/intro') Introduction
    VBtn(variant='outlined' color='' to='/official/fundraisers') Fundraisers
    VBtn(variant='outlined' color='' to='/official/supporters') Supporters
    VBtn(variant='outlined' color='' to='/official/about') About
    VBtn(color='secondary' to='/official/create') Create

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
    border-bottom: 1px solid #999

    > *
        margin-right: 24px

.typo
    padding: 0 24px

</style>
