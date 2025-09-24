<template lang='pug'>

v-list-item(@click='navigate')
    v-list-item-title {{ statement.title }}
    v-list-item-subtitle {{ formatted_start }} - {{ formatted_end }}

</template>


<script setup lang='ts'>

import {defineProps, computed} from 'vue'
import {useRouter} from 'vue-router'

import {format_date_string} from '@/services/utils'

import type {StatementWithId} from '@/shared/schemas'


const props = defineProps<{statement: StatementWithId}>()
const router = useRouter()


const formatted_start = computed(() => format_date_string(props.statement.start))
const formatted_end = computed(() => format_date_string(props.statement.end))


function navigate(){
    router.push({name: 'statement', params: {statement: props.statement.id}})
}

</script>


<style lang='sass' scoped>

</style>
