
<template lang='pug'>

HtmlEditor(:modelValue='static_html' :init='config' @update:modelValue='emit("changed", $event)'
    license-key='gpl')

</template>


<script lang='ts' setup>

// All required by tinymce for basic function
import 'tinymce/tinymce'
import 'tinymce/models/dom'
import 'tinymce/icons/default'
import 'tinymce/themes/silver/theme'
import 'tinymce/skins/ui/oxide/skin.min.css'

// Optional plugins
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/link'

// These styles need to be inserted within the sandboxed iframe
import content_css from 'tinymce/skins/content/default/content.css?raw'
import content_skin_css from 'tinymce/skins/ui/oxide/content.css?raw'

import HtmlEditor from '@tinymce/tinymce-vue'


const config = {
    promotion: false,
    menubar: false,
    statusbar: false,
    plugins: 'lists advlist link',
    toolbar1: 'bold italic underline superscript subscript | link unlink | blocks bullist numlist | alignleft aligncenter alignright alignjustify | hr | undo redo',
    content_style: content_css + content_skin_css,
}


const props = defineProps<{html:string}>()
const emit = defineEmits<{changed:[value:string]}>()

// Make non-reactive copy so editor doesn't jump around when value changes
const static_html = props.html


</script>


<style lang='sass' scoped>

</style>
