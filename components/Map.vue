<script setup>
import { ref, onMounted } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";
import { useGoogleMaps } from "@/composables/useGoogleMaps";

const center = ref({ lat: 0, lng: 0 });
const markerPosition = ref({ lat: 0, lng: 0 });
const autocompleteInput = ref(null);
const emit = defineEmits(["update:location"]);
const config = useRuntimeConfig();
const apiKey = config.public.NUXT_GOOGLE_PLACES;
let autocomplete;

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        center.value = userLocation;
        markerPosition.value = userLocation;
      },
      () => {
        center.value = { lat: 40.689247, lng: -74.044502 };
        markerPosition.value = center.value;
      }
    );
  }
}

onMounted(async () => {
  getUserLocation();

  const google = await useGoogleMaps();
  if (autocompleteInput.value) {
    autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value);

    // Request the necessary fields
    autocomplete.setFields(["geometry", "name", "formatted_address"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        center.value = location;
        markerPosition.value = location;

        const placeName = place.name || "Unknown";
        const address = place.formatted_address || "Address not available";

        emit("update:location", {
          lat: location.lat,
          lng: location.lng,
          name: place.name || "",
          address: place.formatted_address || "",
        });
      }
    });
  }
});

function placeMarker(event) {
  // markerPosition.value = {
  //   lat: event.latLng.lat(),
  //   lng: event.latLng.lng(),
  // };
  const location = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };
  markerPosition.value = location;
  emit("update:location", location);
  // console.log(location);
  // console.log(markerPosition.value.lat, markerPosition.value.lng);
}
</script>

<template>
  <div>
    <input
      ref="autocompleteInput"
      type="text"
      placeholder="Search for a place..."
      style="width: 100%; padding: 8px; margin-bottom: 10px"
    />

    <GoogleMap
      :api-key="apiKey"
      :libraries="['places']"
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
      @click="placeMarker"
    >
      <Marker :options="{ position: markerPosition }" />
    </GoogleMap>
  </div>
</template>
