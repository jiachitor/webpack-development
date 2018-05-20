// import _ from 'lodash'
import Vue from 'vue'
import Index from '@script/components/index.vue'

import '@static/sass/test.js'

// import '@static/sass/test.scss'
require('@static/sass/test.scss')

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<Index/>',
    components: { Index }
})
