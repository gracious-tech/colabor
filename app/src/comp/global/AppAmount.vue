
<template lang='pug'>

div.amount(class='d-flex align-center flex-grow-1 my-4')
    VTextField(v-model='editable_amount' max-width='200' label='Amount' class='mr-3'
        @change='on_amount_change' hide-details)
    //- NOTE Not limiting to 3 chars since crypto etc may require more
    VCombobox(v-model='editable_currency' :items='top_currencies' max-width='125' label='Currency'
        @change='on_currency_change' :readonly='fixed_currency' hide-details)

</template>


<script lang='ts' setup>

import {ref, watch} from 'vue'

import {cents_to_display, display_to_cents, top_currencies} from '@/shared/currency'


const {cents, currency, fixed_currency=false}
    = defineProps<{cents:number, currency:string, fixed_currency?:boolean}>()
const emit = defineEmits(['update:cents', 'update:currency'])


function render_cents(){
    // Empty string for zero
    return cents ? cents_to_display(cents, currency, true) : ''
}


// Initial set of editable representations of values (used in fields)
const editable_currency = ref(currency.toUpperCase())
const editable_amount = ref(render_cents())


// Watch for changes to props and re-convert to editable values
watch(() => currency, () => {
    editable_currency.value = currency.toUpperCase()
    // A change of currency affects how cents is interpreted
    editable_amount.value = render_cents()
})
watch(() => cents, () => {
    editable_amount.value = render_cents()
})


function on_currency_change(){
    emit('update:currency', editable_currency.value.toLowerCase())
}


function on_amount_change(){
    emit('update:cents', display_to_cents(editable_amount.value, editable_currency.value))
}

</script>


<style lang='sass' scoped>


</style>
