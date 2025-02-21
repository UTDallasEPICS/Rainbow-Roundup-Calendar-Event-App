import { defineNuxtPlugin } from '#app'
import FullCalendar from '@fullcalendar/vue3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FullCalendar', FullCalendar)
})
