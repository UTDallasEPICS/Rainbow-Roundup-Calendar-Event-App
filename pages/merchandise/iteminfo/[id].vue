<template>
  <div v-if="item" class="item-details">
    <h1 class="item-name">{{ item.name }}</h1>

    <div class="item-content">
      <img :src="item?.ItemPhotos?.[0]?.url || '/placeholder.jpg'" alt="Item image">
      <div class="item-info">
        <p class="item-description">{{ item.description }}</p>

        <div class="selectors">
          <label>
            Size:
            <select v-model="selectedSize" class="select-input">
              <option disabled value="">Select size</option>
              <option v-for="size in item.availableSizes" :key="size">{{ size }}</option>
            </select>
          </label>

          <label>
            Fit:
            <select v-model="selectedFit" class="select-input">
              <option disabled value="">Select fit</option>
              <option v-for="fit in item.availableFits" :key="fit">{{ fit }}</option>
            </select>
          </label>

          <label>
            Quantity:
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              class="quantity-input"
            />
          </label>
        </div>

        <p class="total-price">
          Total: <strong>${{ formattedPrice }}</strong>
        </p>

        <button
          :disabled="!canAddToCart"
          @click="addToCart"
          class="add-to-cart-btn"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>Loading item details...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const item = ref(null);
const selectedSize = ref('');
const selectedFit = ref('');
const quantity = ref(1);
const imageUrl = ref('');

// Simulate user logged-in state, replace with your auth logic
const userData = ref({ user: { id: '123' } });

onMounted(async () => {
  try {
    const res = await fetch(`/api/item/${route.params.id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch item');

    item.value = data.data;

    // Set defaults to empty so user must select
    selectedSize.value = '';
    selectedFit.value = '';
  } catch (error) {
    console.error('Failed to load item:', error);
    alert('Failed to load item.');
    router.push('/merchandise');
  }
});

const formattedPrice = computed(() => {
  if (!item.value) return '0.00';
  const basePrice = Number(item.value.basePrice);
  if (!basePrice || quantity.value < 1) return '0.00';
  return (basePrice * quantity.value).toFixed(2);
});

const canAddToCart = computed(() => {
  return (
    userData.value?.user &&
    item.value &&
    selectedSize.value !== '' &&
    selectedFit.value !== '' &&
    quantity.value > 0
  );
});

const addToCart = async () => {
  if (!userData.value?.user) {
    alert('Please log in to add items to your cart.');
    router.push('/login');
    return;
  }

  if (!canAddToCart.value) {
    alert('Please select size, fit, and quantity.');
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
    alert('Something went wrong adding the item to the cart.');
  }
};
</script>

<style scoped>
.item-details {
  max-width: 900px;
  margin: auto;
  padding: 1.5rem;
  font-family: Arial, sans-serif;
}

.item-name {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.item-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.item-image {
  width: 300px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 0 8px rgba(0,0,0,0.15);
}

.item-info {
  flex: 1;
}

.item-description {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.selectors label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
}

.select-input,
.quantity-input {
  margin-left: 0.5rem;
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.quantity-input {
  width: 60px;
}

.total-price {
  font-size: 1.25rem;
  margin: 1.5rem 0;
}

.add-to-cart-btn {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.add-to-cart-btn:not(:disabled):hover {
  background-color: #0056b3;
}

.loading {
  max-width: 600px;
  margin: 3rem auto;
  font-size: 1.2rem;
  text-align: center;
}
</style>