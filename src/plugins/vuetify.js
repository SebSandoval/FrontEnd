import Vue from 'vue';


Vue.use(Vuetify);

import Vuetify from 'vuetify/lib'

import colors from 'vuetify/lib/util/colors'

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#EF5350',
                secondary: '#FFEBEE',
                accent: colors.shades.black,
                error: colors.red.accent3,
            },
            dark: {
                primary: colors.blue.lighten3,
            },
        },
    },
})
export default vuetify