<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Left Section - Cart Items -->
      <div class="lg:w-2/3">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">YOUR CART</h1>
          <button 
            class="text-black border-2 border-black bg-blue-400 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors duration-200"
            @click="continueShopping"
          >
            Continue Shopping
          </button>
        </div>

        <!-- Cart Items -->
        <div v-if="cartItems.length > 0" class="space-y-6">
          <div v-for="(item, index) in cartItems" :key="item.id" class="flex justify-between items-start border-b pb-6">
            <div class="flex gap-4">
              <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded">
              <div>
                <h3 class="font-medium">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm">{{ item.description }}</p>
                <div class="flex items-center mt-2">
                  <button @click="updateQuantity(index, -1)" class="px-2 border rounded-l">
                    -
                  </button>
                  <span class="px-4 border-t border-b">{{ item.quantity }}</span>
                  <button @click="updateQuantity(index, 1)" class="px-2 border rounded-r">
                    +
                  </button>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <button @click="removeItem(index)" class="text-red-500 text-sm mt-2">Remove</button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p>Your cart is empty</p>
          <button 
            @click="continueShopping" 
            class="mt-4 text-black border-2 border-black bg-blue-400 hover:bg-blue-600 px-6 py-2 rounded-md transition-colors duration-200 mx-auto"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <!-- Right Section - Order Summary -->
      <div class="lg:w-1/3">
        <div class="bg-gray-50 p-6 rounded-lg sticky top-8">
          <h2 class="text-xl font-bold mb-6">ORDER SUMMARY</h2>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Save Info Section -->
          <div class="mb-6">
            <label class="flex items-start">
              <input type="checkbox" v-model="saveInfo" class="mt-1 mr-2">
              <div>
                <span class="text-sm block">Save my information for faster checkout</span>
                <p class="text-xs text-gray-500 mt-1">
                  Securely pay on RainbowRoundUp Test and everywhere Link is accepted.
                </p>
                <div class="mt-2 flex items-center">
                  <span class="mr-2">📧</span>
                  <input
                    type="tel"
                    v-model="phoneNumber"
                    placeholder="(201) 555-0123"
                    class="bg-gray-100 border-0 focus:ring-0 p-1 text-sm w-full placeholder-gray-400"
                  >
                </div>
              </div>
            </label>
          </div>

          <button @click="checkout" 
                  class="w-full bg-green-400 text-white py-3 rounded-md font-bold mb-4 hover:bg-green-600 transition-colors">
            Checkout
          </button>

          <div class="text-center text-xs text-gray-500">
            <p>Powered by Stripe</p>
            <div class="flex justify-center gap-2 mt-1">
              <a href="#" class="hover:underline">Terms</a>
              <a href="#" class="hover:underline">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: 'Rainbow Pride T-Shirt',
          description: 'Unisex size M',
          price: 24.99,
          quantity: 1,
          image: '/images/tshirt.png'
        },
        {
          id: 2,
          name: 'Pride Flag Hoodie',
          description: 'Black hoodie with rainbow print',
          price: 49.99,
          quantity: 1,
          image: '/images/hoodie.png'
        },
        {
          id: 3,
          name: 'Pride Onesie',
          description: 'Baby onesie with rainbow design',
          price: 19.99,
          quantity: 2,
          image: '/images/onsie.png'
        },
        {
          id: 4,
          name: 'Classic Pride Shirt',
          description: 'White shirt with rainbow stripes',
          price: 29.99,
          quantity: 1,
          image: '/images/shirt.png'
        }
      ],
      saveInfo: false,
      phoneNumber: ''
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },
  methods: {
    updateQuantity(index, change) {
      const newQuantity = this.cartItems[index].quantity + change
      if (newQuantity > 0) {
        this.cartItems[index].quantity = newQuantity
      } else {
        this.removeItem(index)
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
    },
    continueShopping() {
      this.$router.push('/merchandise')
    },
    checkout() {
      alert(`Processing payment of $${this.subtotal.toFixed(2)}`)
    }
  }
}
</script>