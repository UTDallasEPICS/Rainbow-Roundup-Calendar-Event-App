<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
        <!-- navigating back arrow -->
        <div class="w-full px-6 py-4 inline-flex hover:text-zinc-900 hover:cursor-pointer" @click="$router.back()">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
                />
            </svg>
            <p>Back</p>
        </div>

        <div class="w-full max-w-4xl flex flex-col items-center">
         
            <div v-if="isLoading">
                <h1 class="text-gray-400">Loading...</h1>
            </div>
            <div v-else-if="order == null || order == undefined || !order">
                <h1 class="text-3xl font-bold mt-6"><b>Unable to find order.</b></h1>
            </div>
            <div v-else class="w-full my-6 space-y-3"> 
                <!-- title -->
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl col-span-1 font-bold">
                        <p>Order ID</p>
                        <p>{{ order.id }}</p>
                    </h1>
                    <div v-if="isAdmin && !isEditing" class="text-right">
                        <button class="bg-blue-300 p-2 rounded-md font-bold hover:bg-blue-400 cursor-pointer transition duration-150" @click="makeEdits()">
                            Edit
                        </button>
                    </div>
                </div>
                <!-- box -->
                <div class="w-full my-3 rounded-lg bg-white shadow-lg">
                    <!-- header color -->
                    <div class="h-8 bg-blue-300 rounded-t-lg"></div>

                    <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2">
                        <!-- left side -->
                        <div class="col-span-1 flex flex-col gap-2 p-4">
                            <div>
                                <h2 class="text-lg font-bold">Customer Name</h2>
                                <p>{{ order.User.firstname }} {{ order.User.lastname }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Contact Information</h2>
                                <p>{{ order.User.email }}</p>
                                <p v-if="order.User.phone != null && order.User.phone != ''">{{ order.User.phone }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Placed At</h2>
                                <p>{{ formatDateTime(order.placedAt) }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Order Status</h2>
                                <p>{{ order.status }}</p>
                            </div>
                            <!-- order list -->
                            <div>
                                <h2 class="text-lg font-bold">Items</h2>
                                <div class="grid grid-cols-3">
                                    <div class="col-span-1 font-bold">
                                        Item
                                    </div>
                                    <div class="col-span-1 text-right font-bold">
                                        Quantity
                                    </div>
                                    <div class="col-span-1 text-right font-bold">
                                        Price
                                    </div>
                                </div>
                                <div v-for="item in order.OrderItems" class="grid grid-cols-3">
                                    <div class="col-span-1">
                                        {{ item.ItemVariants.item.name }} - {{ item.ItemVariants.size }}
                                    </div>
                                    <div class="col-span-1 text-right">
                                        {{ item.quantity }}
                                    </div>
                                    <div class="col-span-1 text-right">
                                        $ {{ (item.ItemVariants.item.price * item.quantity).toFixed(2) }}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 border-t-2">
                                    <div class="col-span-1 font-bold">
                                        Total
                                    </div>
                                    <div class="col-span-1 text-right">
                                        $ {{ totalOrderPrice.toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- right side -->
                        <div class="col-span-1 flex flex-col gap-2 p-4">
                            <div>
                                <h2 class="text-lg font-bold">Order Type</h2>
                                <p>{{ order.orderType }}</p>
                            </div>
                            <!-- pickup -->
                            <div v-if="order.orderType == 'PICKUP' || order.orderType == OrderType.PICKUP" class="flex flex-col gap-2">
                                <div>
                                    <h2 class="text-lg font-bold">Pickup At</h2>
                                    <EventCard :event="order.event" />
                                </div>
                            </div>
                            <!-- shipping -->
                            <div v-else class="flex flex-col gap-2">
                                <div>
                                    <h2 class="text-lg font-bold">Shipping Address</h2>
                                    <p>{{ order.shippingAddress }}</p>
                                </div>
                                <div>
                                    <h2 class="text-lg font-bold">USPS Tracking Number</h2>
                                    <p v-if="order.trackingNumber != null && order.trackingNumber != undefined">
                                        {{ order.trackingNumber }}
                                    </p>
                                    <p v-else class="text-gray-400 text-sm font-normal">N/A</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- EDITS SECTION -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2">
                        <!-- left side -->
                        <div class="col-span-1 flex flex-col gap-2 p-4">
                            <div>
                                <h2 class="text-lg font-bold">Customer Name</h2>
                                <p>{{ order.User.firstname }} {{ order.User.lastname }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Contact Information</h2>
                                <p>{{ order.User.email }}</p>
                                <p v-if="order.User.phone != null && order.User.phone != ''">{{ order.User.phone }}</p>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold">Placed At</h2>
                                <p>{{ formatDateTime(order.placedAt) }}</p>
                            </div>
                            <div>
                                <label for="status" class="text-lg font-bold">Order Status</label>
                                <div class="border border-gray-400 p-1 rounded">
                                    <select name="status" v-model="editedOrder.status" class="w-full">
                                        <option value="UNCONFIRMED">UNCONFIRMED</option>
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="PAID">PAID</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                    </select>
                                </div>
                            </div>
                            <!-- order list -->
                            <div>
                                <h2 class="text-lg font-bold">Items</h2>
                                <div class="grid grid-cols-3">
                                    <div class="col-span-1 font-bold">
                                        Item
                                    </div>
                                    <div class="col-span-1 text-right font-bold">
                                        Quantity
                                    </div>
                                    <div class="col-span-1 text-right font-bold">
                                        Price
                                    </div>
                                </div>
                                <div v-for="item in order.OrderItems" class="grid grid-cols-3">
                                    <div class="col-span-1">
                                        {{ item.ItemVariants.item.name }} - {{ item.ItemVariants.size }}
                                    </div>
                                    <div class="col-span-1 text-right">
                                        {{ item.quantity }}
                                    </div>
                                    <div class="col-span-1 text-right">
                                        $ {{ (item.ItemVariants.item.price * item.quantity).toFixed(2) }}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 border-t-2">
                                    <div class="col-span-1 font-bold">
                                        Total
                                    </div>
                                    <div class="col-span-1 text-right">
                                        $ {{ totalOrderPrice.toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- right side -->
                        <div class="col-span-1 flex flex-col gap-2 p-4">
                            <div>
                                <h2 class="text-lg font-bold">Order Type</h2>
                                <div class="border border-gray-400 p-1 rounded">
                                    <select name="orderType" v-model="editedOrder.orderType" class="w-full">
                                        <option value="PICKUP">PICKUP</option>
                                        <option value="SHIPPING">SHIPPING</option>
                                    </select>
                                </div>
                            </div>
                            <!-- pickup -->
                            <div v-if="editedOrder.orderType == 'PICKUP' || editedOrder.orderType == OrderType.PICKUP" class="flex flex-col gap-2">
                                <div>
                                    <h2 class="text-lg font-bold">Pickup Event ID</h2>
                                    <input v-model="editedOrder.pickupEventID" class="w-full border border-gray-400 p-1 rounded"></input>
                                </div>
                            </div>
                            <!-- shipping -->
                            <div v-else class="flex flex-col gap-2">
                                <div>
                                    <h2 class="text-lg font-bold">Shipping Address</h2>
                                    <input v-model="editedOrder.shippingAddress" class="w-full border border-gray-400 p-1 rounded"></input>
                                </div>
                                <div>
                                    <h2 class="text-lg font-bold">USPS Tracking Number</h2>
                                    <input v-model="editedOrder.trackingNumber" class="w-full border border-gray-400 p-1 rounded"></input>
                                </div>
                            </div>
                        </div>
                        <!-- manage buttons -->
                        <div class="col-span-2 flex justify-center gap-4 p-4">
                            <button class="bg-lime-300 px-4 py-2 mx-1 rounded hover:bg-lime-400 cursor-pointer transition" @click="saveChanges()">
                                Save
                            </button>
                            <button class="bg-gray-300 px-4 py-2 mx-1 rounded hover:bg-gray-400 cursor-pointer transition" @click="cancelEdit()">
                                Revert
                            </button>
                        </div>
                    </div>
                    
                </div>
                

                <div v-if="!isAdmin" class="text-gray-400 text-sm font-normal text-center mt-2">
                    Email info@rrup.org to make changes to your order.
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { OrderType, OrderStatus } from '@prisma/client'

// Access the route and router
const route = useRoute()

// Get user session using better Auth composable
import { authClient } from "~/server/auth"
const { data: session } = await authClient.getSession();
// Reactive user data and loading state
const order = ref(null)
const isLoading = ref(true)
const totalOrderPrice = ref(0)
const isEditing = ref(false);

const editedOrder = reactive({
    status: OrderStatus.UNCONFIRMED,
    orderType: OrderType.PICKUP,
    shippingAddress: null,
    pickupEventID: null,
    trackingNumber: 0,
    updatedAt: Date.now(),
})




// Fetch user info from API

isLoading.value = true
try {
    const response = await useFetch(`/api/order/${route.params.id}`, {
        query: {
        method: "GET"
        }
    })
    order.value = response.data.value.data
    calculateOrderPrice()
} catch (e) {
    console.error('Failed to fetch order:', e)
    order.value = null
} finally {
    isLoading.value = false
}

const isAdmin = computed(() => {
  const role = session?.user?.role
  if (!role) return false
  if (role === 'SUPER') return true
  if (role === 'ADMIN') return true
  return false
})

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    fractionalSecondDigits: 3
  });
}


function calculateOrderPrice() { 
    let price = 0;

    for (let i = 0; i < order.value.OrderItems.length; i++) {
        price += (order.value.OrderItems[i].ItemVariants.item.price * order.value.OrderItems[i].quantity);
    }

   totalOrderPrice.value = price;

}

function makeEdits() {
    setEditedOrderToOrder();
    isEditing.value = true;
}

async function saveChanges() {
    // put changes
    console.log(editedOrder)

    // verify inputs

    // if pickup order
    if (editedOrder.orderType == 'PICKUP' || editedOrder.orderType == OrderType.PICKUP) {
        if (!editedOrder.pickupEventID || editedOrder.pickupEventID == '' || editedOrder.pickupEventID == null)
        {
            alert("Pickup Event ID is required.")
            return;
        }

        // check event existence
        try {
            const response = await $fetch(`/api/event/${editedOrder.pickupEventID}`, {
                method: "GET"
            })

            if (!response.success) {
                alert("Failed to verify pickup event ID. Please try again.")
            }
        }
        catch (err) {
            alert("Failed to verify event ID: " + err)
            return;
        }
         
        
        // set shipping to null
        editedOrder.shippingAddress = null;
        editedOrder.trackingNumber = null;
    }
    else {
        // set pickup event stuff to null
        editedOrder.pickupEventID == null;
    }

    try {
        await $fetch(`/api/order/${order.value.id}`, {
            method: "PUT",
            body: editedOrder
        })
    }
    catch (err) {
        alert("Unable to save changes. Please try again. Error: " + err)
    }

    order.value.status = editedOrder.status
    order.value.orderType = editedOrder.orderType
    order.value.pickupEventID = editedOrder.pickupEventID
    order.value.shippingAddress = editedOrder.shippingAddress
    order.value.trackingNumber = editedOrder.trackingNumber
    isEditing.value = false
}

function cancelEdit() {
    setEditedOrderToOrder();
    isEditing.value = false
}

function setEditedOrderToOrder() {
    editedOrder.status = order.value.status
    editedOrder.orderType = order.value.orderType
    editedOrder.shippingAddress = order.value.shippingAddress
    editedOrder.pickupEventID = order.value.pickupEventID
    editedOrder.trackingNumber = order.value.trackingNumber
}

</script>
