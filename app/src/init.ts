// MUST come first
import '@/services/errors.sass'
import '@/services/errors'

// Old webkit doesn't have
import 'core-js/actual/object/has-own'
import 'core-js/actual/array/at'

// Embed global styles
import './styles.sass'
import 'vuetify/styles'

import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import {VueFire, VueFireAuth} from 'vuefire'
import {createVuetify} from 'vuetify'
import {md3} from 'vuetify/blueprints'
import {StringDateAdapter} from 'vuetify/date/adapters/string'
import CheckboxBlank from '@material-symbols/svg-400/rounded/check_box_outline_blank.svg?component'
import Checkbox from '@material-symbols/svg-400/rounded/check_box.svg?component'
import RadioChecked from '@material-symbols/svg-400/rounded/radio_button_checked.svg?component'
import RadioUnchecked from '@material-symbols/svg-400/rounded/radio_button_unchecked.svg?component'
import CalendarMonth from '@material-symbols/svg-400/outlined/calendar_month.svg?component'

import AppMain from './comp/AppMain.vue'
import AppIcon from './comp/global/AppIcon.vue'
import FundButton from './comp/global/FundButton.vue'
import RouteRoot from './comp/routes/RouteRoot.vue'
import RouteFundraiser from './comp/routes/RouteFundraiser.vue'
import RouteIntro from './comp/routes/RouteIntro.vue'
import RouteCreate from './comp/routes/RouteCreate.vue'
import RouteLegal from './comp/routes/RouteLegal.vue'
import RouteAbout from './comp/routes/RouteAbout.vue'
import RouteGuideFundraisers from './comp/routes/RouteGuideFundraisers.vue'
import RouteGuideSupporters from './comp/routes/RouteGuideSupporters.vue'
import AppOfficial from './comp/AppOfficial.vue'
import RouteCompliance from './comp/routes/RouteCompliance.vue'
import RouteBitcoin from '@/comp/routes/RouteBitcoin.vue'
import GO from './comp/global/GO.vue'
import {fire_app} from './services/backend'
import {vue_error_handler} from '@/services/errors'


// Create app
const app = createApp(AppMain)
app.config.errorHandler = vue_error_handler
app.component('GO', GO)
app.component('AppIcon', AppIcon)
app.component('FundButton', FundButton)


// Add router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: RouteRoot},
        {path: '/official', component: AppOfficial, children: [
            {path: '', component: RouteIntro},
            {path: 'compliance', component: RouteCompliance},
            {path: 'fundraisers', component: RouteGuideFundraisers},
            {path: 'supporters', component: RouteGuideSupporters},
            {path: 'bitcoin', component: RouteBitcoin},
            {path: 'legal', component: RouteLegal},
            {path: 'about', component: RouteAbout},
            {path: 'create', component: RouteCreate},
        ]},
        {path: '/admin', component: () => import('./comp/routes/admin/AdminContainer.vue'), children: [
            {path: '', component: () => import('./comp/routes/admin/AdminDashboard.vue')},
            {path: 'fundraisers', redirect: '/admin'},
            {path: 'fundraisers/:fundraiser', component: () => import('./comp/routes/admin/AdminFundraiser.vue'), children: [
                {path: '', redirect: {name: 'pledges'}},
                {path: 'pledges', name: 'pledges', component: () => import('./comp/routes/admin/AdminPledges.vue')},
                {path: 'contacts', component: () => import('./comp/routes/admin/AdminContacts.vue')},
                {path: 'payments', component: () => import('./comp/routes/admin/AdminPayments.vue')},
            ]},
        ]},
        {path: '/:fundraiser', component: RouteFundraiser, name: 'fundraiser', props: true},
    ],
    scrollBehavior(to, from, saved){
        return saved ?? {top: 0}
    },
})
app.use(router)


// Add VueFire
app.use(VueFire, {
    firebaseApp: fire_app,
    modules: [VueFireAuth()],
})


// Add Vuetify
app.use(createVuetify({
    blueprint: md3,
    theme: {
        defaultTheme: 'custom',
        variations: {
            colors: ['primary', 'secondary'],
            lighten: 2,
            darken: 2,
        },
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
        VTextField: {
            color: 'secondary',
        },
    },
    icons: {
        aliases: {
            checkboxOn: Checkbox,
            checkboxOff: CheckboxBlank,
            radioOn: RadioChecked,
            radioOff: RadioUnchecked,
            calendar: CalendarMonth,
        },
    },
    date: {
        // Make date widgets in/out dates as string rather than date object (to avoid TZ issues)
        adapter: StringDateAdapter,
    },
}))


app.mount('#app')
