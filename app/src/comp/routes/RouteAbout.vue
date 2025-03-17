
<template lang='pug'>

h1 About

p.
    This platform is a ministry of Gracious Tech. We create apps to assist global mission,
    releasing them completely for free, and funding them with support from like-minded believers (colabor!).

div
    GO(href='https://gracious.tech')
        img.gt(src='@/assets/gracious_tech.jpg')

div(class='mt-4')
    VBtn(href='https://gracious.tech/contact' target='_blank' color='secondary') Contact Us

h2 Backstory

p Raising support for a ministry can be challenging. Many feel like they shouldn't raise support themselves and must instead do it under an organization, even though assumptions regarding the appropriateness of that are #[RouterLink(to='/official/compliance') often misguided]. If you choose not to join an organization, you must find ways to raise awareness of your ministry yourself. Those creating ministry resources usually make deals with commercial publishers who lock them down with #[GO(href='https://copy.church') restrictive copyright clauses] and exploit them for money.

p Those not wanting to #[GO(href='https://sellingjesus.org') commercialize their ministry] still face the dilemma of how to fundraise independently. Many fundraising platforms exist, but most of them try to take a large cut of the donations (as much as 8%) and/or take control away from donors. They force people to donate using credit cards even though bank transfers are low in fees and allow donors full control of their own donations.

p To solve all these issues, Gracious Tech is launching a new fundraising platform specifically for ministry. It has zero fees, in fact no money passes through it at all. Instead, donors stay 100% in control of their own donations and fundraisers receive 100% of the donations. Any transaction or currency conversion fees are entirely in the hands of the fundraiser and/or donor, and when giving domestically via bank transfer, they'll often simply be $0!

p While there are excellent Christian organizations out there, many have decided to use their size to dominate Christian fundraising, allocating large portions of their income for fundraising activities. Centralizing ministry into large organizations has not resulted in biblical faithfulness but rather the diluting of beliefs to stay compatible with a large pool of donors. Small ministries struggle to raise awareness of their own work and to stay on top of the level of admin expected of them based on the standards set by large organizations.

p I hope Colabor will be a blessing to those wanting to freely give their ministry, and an aid in connecting like-minded believers who would love to fund such ministry.

p In Christ,<br>Jon Here / Founder of Gracious Tech


</template>


<script lang='ts' setup>


</script>


<style lang='sass' scoped>

.gt
    margin-top: 24px
    border-radius: 12px
    width: 100%
    max-width: 600px

</style>
