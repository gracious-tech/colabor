<template lang='pug'>

v-dialog(v-model='show' max-width='400')
    v-card
        v-card-title New Statement
        v-card-text
            v-form(v-model='valid')
                v-text-field(v-model='title' label='Title' :rules='[v => !!v]')
                v-date-input(v-model='start' label='Start' :rules='[v => !!v]')
                v-date-input(v-model='end' label='End' :rules='end_rules')
        v-card-actions
            v-spacer
            v-btn(text @click='show = false') Cancel
            v-btn(@click='create' :disabled='!valid') Create

</template>


<script setup lang='ts'>

import {ref, inject, defineEmits, type Ref} from 'vue'
import {useRouter} from 'vue-router'
import {VDateInput} from 'vuetify/labs/VDateInput'

import {create_statement} from '@/services/backend'


const router = useRouter()

const fundraiser = inject('fundraiser') as Ref<string>
const show = defineModel<boolean>({required: true})

const valid = ref(false)
const title = ref('')
const start = ref(null)
const end = ref(null)


const end_rules = [() => {
    if ((start.value ?? '') >= (end.value ?? '')){
        return "End date must come after start date"
    }
    return !!end.value
}]


async function create() {
    const id = await create_statement(fundraiser.value, {
        title: title.value,
        start: start.value!,
        end: end.value!,
        message: '',
    })
    show.value = false
    router.push({name: 'statement', params: {statement: id}})
}

</script>


<style lang='sass' scoped>

</style>
