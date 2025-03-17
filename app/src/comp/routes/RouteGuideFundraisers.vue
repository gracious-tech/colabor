
<template lang='pug'>

h1 Guide For Fundraisers


VAlert(color='secondary') #[strong Colabor is currently in private beta.] Once we've got it polished we'll release it for free use for any ministry that is non-profit and non-commercial. Subscribe to news from #[GO(href='https://gracious.tech/contact') Gracious Tech] to know when it'll open up. ETA is currently second-half of 2025.



h2 What does a fundraiser look like?
p You can check out our own:
FundButton(id='gracious.tech' name="Gracious Tech"
    subheading="Creating missional apps like this one!" newtab)



h2 What features does Colabor offer?

p Colabor provides for fundraisers:

ul
    li A page to promote your ministry
    li A donation form that supports bank transfers, card payments, and linking to third-party platforms
    li A database of pledges people have made to support your ministry
    li A means of sending people receipts for donations

p More features may be added in future as well.


h2 How does Colabor compare to other fundraising platforms?

p Many existing fundraising platforms take a large cut of all donations and/or take control away from donors.


p.
    #[strong Fee-based platforms:] The popular Patreon platform takes a minimum of 8%!
    This doesn't include payment processing fees and currency conversion fees which can take
    the total cost up to even 15%. So if an oversees supporter were to donate to you $1000, you could lose around $150 of that.

p.
    #[strong Donation-based platforms:] Platforms like GoFundMe charge no platform fees and prompt donors for an optional contribution to their platform instead, which defaults at a high 17.5%. So donating to the platform in addition to donating to the cause. But if you want to donate regularly (which most ministries rely on) the platform charges donors a 5% fee (not optional). The fundraiser also has to pay 2.9% in transaction fees.

p.
    #[strong No-cost platforms:] Platforms like Zeffy go even further by not charging transaction fees or recurring donation fees either (though currency conversion will still be charged by banks). Zeffy doesn't allow donors to simply do a bank transfer themselves and instead forces them to give over their account details so Zeffy can debit it. This takes control away from donors and benefits the platform and fundraiser by making it less convenient to change or cancel a recurring donation. Zeffy also doesn't allow individuals to raise money unless they form a non-profit organization.

p.
    #[strong Colabor] has zero fees, in fact no money passes through it at all. Instead, donors stay 100% in control of their own donations and fundraisers receive 100% of the donations. Any transaction or currency conversion fees are entirely in the hands of the fundraiser and/or donor, and when giving domestically via bank transfer, they'll often simply be $0!

small (figures are from March 2025)



h2 Fundraiser Agreement

p We make all fundraisers agree to the following before they can use our platform:

VAlert(color='#dfd' class='my-4') Please do actually read it... we've tried to keep it as simple as possible.

FundraiserAgreement



h2 What legal obligations do I have?

p We do not handle any legal or financial matters for you. You must comply with the laws of where you and your donors reside.

div
    VBtn(to='/official/legal' color='secondary') See Legal Guide



h2 Why is it wrong to earn more than this platform's limits?

p It may not be wrong. We set reasonable limits so that donors can be assured that any fundraiser on this platform is reasonably likely to be funding ministry rather than a life of leisure. There may be situations that are still reasonable but outside of our limits. We don't claim they are all wrong, we just don't permit them on our platform.



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

p Something we #[em can] be sure of is that God #[em will] eventually reward his servants based on what they have done. Rather than concern ourselves with how to get the level of funding we desire, we should concern ourselves with being faithful with what God #[em is] providing.



//- h3 Is it safe to share my bank account number?

//- p This is generally safe though might vary by country. However, it is recommended to open a new savings account to receive donations into so that transactions are easier to keep track of. This would also in turn increase your privacy by not exposing your main personal bank account number.



//- h3 What type of support is there for Bitcoin donations?

//- p We require you to provide us with a zpub public key so that we can generate unique taproot addresses for you per donation. This is to protect your privacy but also to protect the privacy of your donors, and means that you don't have to run your own server or enlist a third-party to generate unique addresses for you. We do not require any private key so you do not need to trust us with access to your funds.

//- p Lightning is also supported. We'll create invoices for you to receive funds as well as setup an LNURL and lightning address (user@colabor.ing) for you. Alternatively you can provide your own lightning address.


</template>


<script lang='ts' setup>

import FundraiserAgreement from '../common/FundraiserAgreement.vue'

</script>


<style lang='sass' scoped>


</style>
