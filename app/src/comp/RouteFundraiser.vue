
<template lang='pug'>

FundMain


div.footer(class='text-center')
    div.created created with
    AppLogo(clickable)

</template>


<script lang='ts' setup>

import {provide} from 'vue'

import AppLogo from './AppLogo.vue'
import FundMain from './fundraiser/FundMain.vue'



const data = {
    name: "Jordan & Sarah",
    subheading: "Writing and illustrating Bible stories for kids",
    currency: 'usd',
    intro: `
        <p>Hello, we are Jordan and Sarah, and we feel incredibly blessed to be able to share the love and teachings of God through our writing and illustrations. Our journey together has been one of faith, creativity, and a shared passion for storytelling.</p>
        <p>We are humbled by the opportunity to do this work and are continually inspired by the impact it can have. Our hope is to reach as many people as possible, sharing the message of Jesus in a way that is accessible and meaningful.</p>
        <p>We would be so grateful for your support as we continue on this journey. With your help, we can bring more stories to life and touch more hearts with the love and hope found in Christ. Thank you for being a part of our mission.</p>
    `,
    activities: [
        {
            id: 1,
            title: "Writing stories for children",
            desc: "Jordan writes engaging Bible stories for kids. He spends a lot of time in Scripture, drawing out truths, and carefully reflecting how they can be best communicated to kids today.",
        },
        {
            id: 2,
            title: "Illustrating stories",
            desc: "Sarah reads the passages Jordan is working off, and his own stories when they are ready. She comes up with a theme and color pallete and sketches out drafts for review. The best ones make it into our books.",
        },
        {
            id: 3,
            title: "Creative Kids church camp",
            desc: "In addition to our books, we run a camp for kids to write their own stories using Scripture. We train up leaders and together as a team we come up with fun activities that help kids engage with Scripture. We run the camp every Summer and a number of kids bring their non-Christian friends along too.",
        },
    ],
    steward: {
        towards: "livelihood",
        income_cap: 150000,
        assets_cap: 2000000,

    },
    milestones: [
        {
            id: 1,
            date: new Date(2023, 2, 3),
            title: "Fish and the Jonah - Illustrations finalised",
            desc: "",
            link: "",
        },
        {
            id: 2,
            date: new Date(2023, 8, 19),
            title: "Fish and the Jonah - Published!",
            desc: "",
            link: "",
        },
        {
            id: 3,
            date: new Date(2024, 3, 7),
            title: "Creative Kids camp 2024",
            desc: "",
            link: "",
        },
    ],
}

provide('fund', data)

</script>


<style lang='sass' scoped>

.footer
    margin-top: 200px

.created
    color: white
    opacity: 0.5

</style>
