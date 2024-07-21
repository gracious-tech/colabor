
<template lang='pug'>

h1 Introduction

div.cs-neutral
    div How we stand out
    ul
        li We have no access to any money, we just help you set things up
        li Fundraisers must be non-commercial, non-profit, and authentically Christian
        li We have a $200,000 USD/year fundraising limit
        li We encourage directly giving to individuals in ministry (see below)

p Scripture says we ought to support those who minister in God’s name “so that we may be fellow workers for the truth” (3 John 1:8). We call this “colabor”, where believers become partners in ministry by generously funding it. In that spirit, we offer this platform free of charge to <em>support</em> the support of those furthering the Kingdom of God.

h2
    em We're not your average crowdfunding platform…

p Unlike most alternatives, we are non-custodial, meaning we do not manage any money for you. Funds given by your supporters go straight to you and we do not have any access to them. When donors give via bank transfer, they transfer straight into your account. When donors pay by card, they pay via a third-party service that <em>you</em> manage an account with.

p This means 100% of donations go to you, but it also means you are responsible for all financial matters, such as tax obligations and refunds.

p We also standout in our adherence to the following biblical principles:

h2 1. Non-commercial

p We only allow fundraisers that are for non-commercial ministry; ministry that is received by recipients free of charge. All resources created must be free of #[GO(href='https://copy.church') copyright restrictions]. Jesus commanded his servants to freely give in the context of ministry (Matt 10:8), and Paul opposed those who sold their ministry (2 Cor 2:17). Charging to cover costs for things that are not Christian teaching or ministry is permitted. You can learn more about this topic at #[GO(href='https://sellingjesus.org') #[em Selling Jesus]].

div.cs-negative
    div
    ul
        li An author raises money to write a book that is later sold under an exclusive deal with a mainstream publisher
        li A conference charges for access to the sermons given and raises money to keep the fees low
        li A musician wants to trial raising money to see if it works, and sell their music if it doesn't
div.cs-positive
    div
    ul
        li An author raises money to write a book, openly licenses it, and sells printed copies on Amazon at the cost of production
        li A conference charges entrance fees but ensures livestream attendance is free of charge
        li A musician dedicates their music to the public domain so churches can sing it without a license

h2 2. Non-profit #[span.np (whether an individual or organisation)]

p We only allow fundraisers where there is a real need for funding; where money does not excessively accumulate or go towards things that are not ministry. Our definition is different to that of "non-profit" organisations in that we also consider high salaries and large savings as a form of profit. We do not allow anyone to raise more than $200,000 USD/year and they cannot fundraise if they have personal assets (aside from a single home of residence or savings for one) that exceed $400,000 USD.

div.cs-negative
    div
    ul
        li A non-profit organisation pays its CEO industry standard wages (e.g. $400k/year)
        li An unmarried man raises $180,000 USD despite the median wage in his country being only $50,000.
div.cs-positive
    div
    ul
        li An author receives $100k/year of donations into their personal bank account
        li An unmarried man raises $180,000 USD, with $100,000 going towards ministry expenses


h2 3. Authentically Christian

p We only allow fundraisers for Christian ministry or for causes that are explicitly Christian in nature, such as poverty relief. We also require you to agree to our statement of beliefs.

div.cs-negative
    div
    ul
        li A Christian raises money so he can go to college and study accounting
        li A gym ministry helps people lose weight but there is no evangelism or discipleship involved
div.cs-positive
    div
    ul
        li A Christian raises money so he can go to seminary
        li An English club is started for refugees and teachers look for opportunities to share the gospel informally

h2 4. Character Before Compliance

p We do <span class='ul'>not</span> require fundraisers to be part of an organisation. It is biblical to support individuals directly (3 John 1:8) and they may receive funds directly into their personal bank account. However, we do require basic record keeping. We encourage givers to judge the <em>character</em> of those organising fundraisers rather than accountability measures alone, so more time and funds go directly to the ministry rather than to admin.

div.cs-negative
    div
    ul
        li Donations go into a personal bank account and get lost amongst the other transactions
        li A fundraiser says donations are for helping the poor but actually personally benefit the organiser
div.cs-positive
    div
    ul
        li Donations go into a personal bank account and are kept track of
        li A fundraiser makes clear that donations both help the poor and supply the organiser with an income

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
