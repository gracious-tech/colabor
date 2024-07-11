
// Embed global styles
import './styles.sass'
import 'vuetify/styles'

import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import {createVuetify} from 'vuetify'
import CheckboxBlank from '@material-symbols/svg-400/rounded/check_box_outline_blank.svg'
import Checkbox from '@material-symbols/svg-400/rounded/check_box.svg'
import RadioChecked from '@material-symbols/svg-400/rounded/radio_button_checked.svg'
import RadioUnchecked from '@material-symbols/svg-400/rounded/radio_button_unchecked.svg'

import AppMain from './comp/AppMain.vue'
import AppIcon from './comp/global/AppIcon.vue'
import AppHtml from './comp/global/AppHtml.vue'
import RouteRoot from './comp/RouteRoot.vue'
import RouteFundraiser from './comp/RouteFundraiser.vue'


// Create app
const app = createApp(AppMain)
app.component('AppIcon', AppIcon)
app.component('AppHtml', AppHtml)


// Add router
const router = createRouter({history: createWebHistory(), routes: [
    {path: '/', component: RouteRoot},
    {path: '/:fundraiser', component: RouteFundraiser},
]})
app.use(router)


// Add Vuetify
app.use(createVuetify({
    theme: {
        defaultTheme: 'custom',
        themes: {
            custom: {
                dark: false,
                colors: {
                    primary: '#642b4c',  // 325deg
                    secondary: '#638cff',
                },
            },
        },
    },
    defaults: {
        global: {
            hideDetails: true,
        },
    },
    icons: {
        aliases: {
            checkboxOn: Checkbox,
            checkboxOff: CheckboxBlank,
            radioOn: RadioChecked,
            radioOff: RadioUnchecked,
        },
    },
}))


app.mount('#app')
