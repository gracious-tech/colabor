
<template lang='pug'>

h1 Introduction

p Scripture says we ought to support those who minister in God’s name “so that we may be fellow workers for the truth” (3 John 1:8). We call this “colabor”, where believers become partners in ministry by generously funding it. In that spirit, we offer this platform free of charge to <em>support</em> the support of those furthering the Kingdom of God.

h2
    em We're not your average crowdfunding platform…

p Unlike most alternatives, we are non-custodial, meaning we do not manage any money for you. Funds given by your supporters go straight to you and we do not have any access to them. When donors give via bank transfer, they transfer straight into your account. When donors pay by card, they pay via a third-party service that <em>you</em> manage an account with.

p This means 100% of donations go to you, but it also means you are responsible for all financial matters, such as tax obligations and refunds (if you decide to allow them).

p We also standout in our adherence to the following biblical principles:

h2 1. Non-commercial

p We only allow fundraisers that are for non-commercial ministry; ministry that is received by recipients free of charge and any other restrictions. Jesus commanded his servants to freely give in the context of ministry (Matt 10:8), and Paul opposed those who sold their ministry (2 Cor 2:17). You can learn more about this topic at #[GO(href='https://sellingjesus.org') #[em Selling Jesus]].

div.cs-negative
    div
    ul
        li An author raises money to write a book that is later sold under an exclusive deal with a mainstream publisher
        li An author wants to trial raising money to see if it works, and sell their book if it doesn't
div.cs-positive
    div
    ul
        li An author raises money to write a book and dedicates it the public domain and sells printed copies on Amazon at the cost of production

h2 2. Non-profit #[span.np (whether an individual or organisation)]

p We only allow fundraisers where there is a real need for funding; where money does not excessively accumulate or go towards things that are not ministry. Our definition is different to that of "non-profit" organisations in that we also consider high salaries as a form of profit.

div.cs-negative
    div
    ul
        li A non-profit organisation pays its CEO industry standard wages (e.g. $400k/year)
div.cs-positive
    div
    ul
        li An author receives $100k/year of donations into their personal bank account


h2 3. Authentically Christian

p We only allow fundraisers for ministries that are owned by Christians, operated by Christians, and are authentically Christian throughout. All staff in ministry roles and roles requiring a high degree of accountability (e.g. finance) must be Christian.

div.cs-negative
    div
    ul
        li A Christian ministry does amazing work but is owned by a secular investment firm
div.cs-positive
    div
    ul
        li A Christian ministry hires non-Christian staff for cleaning offices

h2 4. Character Before Compliance

p We do <span class='ul'>not</span> require fundraisers to be part of an organisation or comply with any specific accountability measures, as long as they are raising under $200,000 USD per year. It is biblical to support individuals directly (3 John 1:8) and they may receive funds directly into their personal bank account. We encourage givers to judge the <em>character</em> of those organising fundraisers rather than accountability measures alone, so more time and funds go directly to the ministry rather than to admin.

div.cs-negative
    div
    ul
        li Donations go into a personal bank account and get lost amongst the other transactions
div.cs-positive
    div
    ul
        li Donations go into a personal bank account and are carefully recorded

p This is not a common approach so we highly encourage you to read our explainer on the topic:

div(class='text-center mt-8')
    VBtn(to='/official/compliance' color='secondary') Read Explainer


</template>


<script lang='ts' setup>



</script>


<style lang='sass' scoped>

.ul
    text-decoration: underline

.np
    opacity: 0.5
    font-size: 14px
    margin-left: 12px

.cs-negative > div::after
    content: "Forbidden"

.cs-positive > div::after
    content: "Allowed"

</style>
