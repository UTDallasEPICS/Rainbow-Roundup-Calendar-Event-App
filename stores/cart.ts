// pinia/store.ts, for cart items
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type itemInCart = {
  // variant can refer to size and different descriptions
  itemVariantId: string
  productId: string
  name: string
  description?: string
  image?: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<itemInCart[]>([])

  const subtotal = computed(() =>
    items.value.reduce((s, item) => s + item.price * item.quantity, 0) //The calculates subtotal, then reduces it down to 0 after done
  )

  function addItem(newItem: itemInCart) {
    // If we already have item variant, increment instead
    const existing = items.value.find(i => i.itemVariantId === newItem.itemVariantId)
    if (existing) {
      existing.quantity += newItem.quantity
    } else {
      items.value.push({ ...newItem })
    }
  }

  function updateQuantity(itemVariantId: string, newQuantity: number) {
    const idx = items.value.findIndex(i => i.itemVariantId === itemVariantId)
    if (idx === -1) return //probably an error, get out
    if (newQuantity > 0) {
      items.value[idx].quantity = newQuantity //puts in new quantity
    } else {
      // remove if zero or lower somehow
      items.value.splice(idx, 1)
    }
  }

  function changeQuantityBy(itemVariantId: string, delta: number) {
    const item = items.value.find(i => i.itemVariantId === itemVariantId)
    if (!item) return
    const q = item.quantity + delta
    if (q > 0) item.quantity = q
    else removeItem(itemVariantId)
  }

  function removeItem(itemVariantId: string) {
    const idx = items.value.findIndex(i => i.itemVariantId === itemVariantId)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    subtotal,
    addItem,
    updateQuantity,
    changeQuantityBy,
    removeItem,
    clearCart
  }
})
