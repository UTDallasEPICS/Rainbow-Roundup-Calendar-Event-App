// for preventing regular user access to admin pages, and regular admins should not be able to access non-event management pages

import { authClient } from "~/composables/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.getSession()

  // if logged in as admin
  if (session?.user?.role === 'ADMIN') {
    console.log("Logged in as ADMIN")
    // prevent admin access to user list, merch, and order pages
    if (to.path === '/admin/users' || to.path === '/admin/merchandise' || to.path === '/admin/orders') {
      return navigateTo('/admin/events')
    }
    // redirect regular admins to only managing events
    if (to.path === '/admin') {
      return navigateTo('/admin/events')
    }
  }
  // if logged in as user  
  else if (session?.user?.role === 'USER') {
    console.log("Logged in as USER")
    // prevent user access to admin pages
    if (to.path === '/admin' || to.path === '/admin/users' || to.path === '/admin/events' || to.path === '/admin/merchandise' || to.path === '/admin/orders' ) {
      return navigateTo('/')
    }
  }
  else if (session?.user?.role !== 'SUPER') { // if not logged in
    console.log("No session")
    // prevent user access to admin pages
    if (to.path === '/admin' || to.path === '/admin/users' || to.path === '/admin/events' || to.path === '/admin/merchandise' || to.path === '/admin/orders' ) {
      return navigateTo('/login')
    }
    // must be logged in to access merch cart and checkout
    if (to.path === '/merchandise/checkout' || to.path === '/merchandise/cart' || to.path === '/merchandise/CheckoutSuccess') {
      return navigateTo('/login')
    }
  } 
})