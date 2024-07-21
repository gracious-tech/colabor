
<template lang='pug'>

h1 Guide For Fundraisers

h2 What legal obligations do I have?

div
    VBtn(to='/official/legal' color='secondary') Legal Guide

h2 Fundraiser Agreement

p We make all fundraisers agree to the following before they can use our platform:

FundraiserAgreement


h2 Why is it wrong to earn more than your limits?

p It may not be wrong. We set reasonable limits so that donors can be assured that any fundraiser on this platform is reasonably likely to be funding ministry rather than a life of leisure. There may be situations that are still reasonable but outside of our limits. We don't claim they are all wrong, we just don't permit them on our particular platform.


h2 What's the best way to get funding?

p There is a lot of different advice on fundraising for ministry, and not a lot of it is biblical.

p A reality check: If you are a poor believer in an impoverished country, what do you think your chances are in raising funds? And if you don't raise enough funds, is it because Western believers are more godly than you?

p The reality is:

ul
    li There are ungodly ministries that are well funded
    li There are excellent ministries that are poorly funded
    li Some ministries aggressively raise funds and it works
    li Some ministries aggressively raise funds and it doesn't work
    li Some ministries don't ask for money and are well funded
    li Some ministries don't ask for money and are poorly funded

p This reality is articulated well in proverbs:

blockquote
    p There is a futility that is done on the earth: There are righteous men who get what the actions of the wicked deserve, and there are wicked men who get what the actions of the righteous deserve. I say that this too is futile. (Ecc 8:14)

p However, the author doesn't conclude that things are completely random but rather:

blockquote
    p So I took all this to heart and concluded that the righteous and the wise, as well as their deeds, are in God’s hands. Man does not know what lies ahead, whether love or hate. (Ecc 9:1)

p God does provide for his people and supply those who do his work, but there are multiple factors at play. We cannot conclude that God is pleased with a ministry simply because it is well funded, nor can we conclude that God is displeased with a ministry because it is poorly funded.

p Something we #[em can] be sure of is that God #[em will] eventually reward his servants based on what they have done. Rather than concern ourselves with how to get the level of funding we desire, we should concern ourselves with being faithful with what God is providing.

p So let's change the question:

h3 How can I honour God in the way I go about fundraising?



//- h3 Is it safe to share my bank account number?

//- p This is generally safe though might vary by country. However, it is recommended to open a new savings account to receive donations into so that transactions are easier to keep track of. This would also in turn increase your privacy by not exposing your main personal bank account number.

//- h3 What type of support is there for Bitcoin donations?

//- p We require you to provide us with a zpub public key so that we can generate unique taproot addresses for you per donation. This is to protect your privacy but also to protect the privacy of your donors, and means that you don't have to run your own server or enlist a third-party to generate unique addresses for you. We do not require any private key so you do not need to trust us with access to your funds.

//- p Lightning is also supported. We'll create invoices for you to receive funds as well as setup an LNURL and lightning address (user@fund.freely.giving) for you. Alternatively you can provide your own lightning address.


</template>


<script lang='ts' setup>

import FundraiserAgreement from '../common/FundraiserAgreement.vue'

</script>


<style lang='sass' scoped>


</style>
