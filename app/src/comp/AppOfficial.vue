
<template lang='pug'>


div.nav
    RouterLink(to='/')
        img.logo(src='@/assets/logo.svg')
    div.btns(class='official-wide')
        VBtn(variant='outlined' color='' to='/official/intro') Introduction
        VBtn(variant='outlined' color='' to='/official/fundraisers') I'm fundraising
        VBtn(variant='outlined' color='' to='/official/supporters') I'm donating
    VMenu
        template(#activator='{props}')
            VBtn.menu(icon variant='text' color='' v-bind='props')
                AppIcon(name='more_vert' class='official-wide')
                AppIcon(name='menu' class='official-narrow')
        VList
            VListItem(to='/official/intro' class='official-narrow')
                VListItemTitle Introduction
            VListItem(to='/official/fundraisers' class='official-narrow')
                VListItemTitle I'm fundraising
            VListItem(to='/official/supporters' class='official-narrow')
                VListItemTitle I'm donating
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
    padding: 0 12px
    min-height: 70px

    .logo
        width: 120px
        @media (min-width: 800px)
            width: 200px

    .btns > *
        margin-left: 18px

    .menu
        margin-left: auto

.typo
    padding: 48px 36px
    @media (min-width: 860px)
        border-radius: 24px

    > :first-child
        margin-top: 0

</style>


<style lang='sass'>

// Needs to be unscoped as menu gets teleported outside of component when opened
@media (min-width: 800px)
    .official-narrow
        display: none

@media (max-width: 799px)
    .official-wide
        display: none

</style>
