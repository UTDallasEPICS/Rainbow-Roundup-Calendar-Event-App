



<template>
    <div v-if="item">
      <h1>{{ item.name }}</h1>
      <img :src="item.imageUrl" alt="Item image" />
      <p>{{ item.description }}</p>
  
      <div>
        <label for="size">Size:</label>
        <select v-model="selectedSize" id="size">
          <option v-for="size in item.availableSizes" :key="size">{{ size }}</option>
        </select>
      </div>
  
      <div>
        <label for="fit">Fit:</label>
        <select v-model="selectedFit" id="fit">
          <option v-for="fit in item.availableFits" :key="fit">{{ fit }}</option>
        </select>
      </div>
  
      <div>
        <label for="quantity">Quantity:</label>
        <input type="number" v-model.number="quantity" min="1" />
      </div>
  
      <p>Total: ${{ calculatedPrice }}</p>
  
      <button @click="addToCart">Add to Cart</button>
    </div>
  
    <div v-else>
      <p>Loading item...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuth } from '@/composables/useAuth'; // adjust if different
  // TODO: import your fetch API function here
  
  const route = useRoute();
  const router = useRouter();
  const { data: userData } = useAuth();
  
  const item = ref(null);
  const selectedSize = ref('');
  const selectedFit = ref('');
  const quantity = ref(1);
  
  // On mount, fetch item by ID
  onMounted(async () => {
    const id = route.params.id;
    try {
      const res = await fetch(`/api/items/${id}`); // placeholder
      item.value = await res.json();
    } catch (err) {
      console.error('Failed to load item:', err);
    }
  });
  
  const calculatedPrice = computed(() => {
    if (!item.value) return 0;
    // Optional logic to adjust price per fit/size
    return item.value.basePrice * quantity.value;
  });
  
  const addToCart = async () => {
    if (!userData.value?.user) {
      alert('You must be logged in to add to cart');
      router.push('/login');
      return;
    }
  
    try {
      const payload = {
        itemId: item.value.id,
        size: selectedSize.value,
        fit: selectedFit.value,
        quantity: quantity.value,
      };
  
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error('Failed to add to cart');
      alert('Item added to cart!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };
  </script>
