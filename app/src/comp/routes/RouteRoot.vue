
<template lang='pug'>

div(class='text-center my-4')
    AppLogo

RouteRootSlideshow

div.features

    div.feature
        h3
            AppIcon(name='paid')
            span No fees
        p There are no fees or ads from us, and third-party transaction fees are under your control.

    div.feature
        h3
            AppIcon(name='emoji_people')
            | Any ministry
        p Whether you serve full-time or casually… create things or help people… you can raise money for it.

    div.feature
        h3
            AppIcon(name='world')
            | Any country
        p Anyone from anywhere can start a fundraiser, and can raise funds internationally.

div.cont(class='text-center')

    h2 Use Cases
    div.cases
        div.case Ministries that are seasonal
        div.case Ministries that are uncommon
        div.case Ministries that are typically commercialised

    h2(class='my-10') Example Fundraisers
    div.examples
        FundButton(id='example-people' name="Jordan & Sarah"
            subheading="Writing and illustrating Bible stories for kids" newtab)
        FundButton(id='example-cause' name="Reaching Refugees"
            subheading="Showing God's love to the neediest in Green Hills" newtab)

    div(class='my-16')
        VBtn(color='secondary' to='/official/intro' size='large') Get Started

</template>


<script lang='ts' setup>

import RouteRootSlideshow from './parts/RouteRootSlideshow.vue'



</script>


<style lang='sass' scoped>

.cont
    padding: 12px

.features
    display: flex
    justify-content: space-between
    margin: 24px 0

    @media (max-width: 860px)
        flex-direction: column
        padding: 0 24px

        .feature
            width: 100% !important
            margin: 12px 0

    .feature
        background-color: #222
        border-radius: 12px
        padding: 24px
        width: 31%

        h3
            display: flex
            align-items: center
            color: rgb(var(--v-theme-secondary-lighten-2))
            font-size: 16px

            .icon
                margin-right: 12px

.examples
    > *
        margin: 0 24px

</style>
