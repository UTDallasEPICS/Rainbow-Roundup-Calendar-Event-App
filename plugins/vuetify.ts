import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VCalendar } from 'vuetify/components'
import * as directives from 'vuetify/directives'
//import VCalendar from 'vuetify/lib/components/';


export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components: {...components, VCalendar},
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
