/* eslint-disable no-console */
/// <reference lib='WebWorker' />
/// <reference types="vite/client" />

import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener("push", onPush);
self.addEventListener("notificationclick", onNotificationClick);

function onPush(event: PushEvent) {
  console.log("[Service Worker] push received");

  if (!event.data) return;

  const { title, ...options } = event.data.json();

  event.waitUntil(self.registration.showNotification(title, options));
}

function onNotificationClick(event: NotificationEvent) {
  console.log("[Service Worker] notification clicked");

  const handleNotificationClick = new Promise((resolve) => {
    event.notification.close();

    const url = event.notification.data.url;
    if (!url) return;

    resolve(openUrl(url));
  });

  event.waitUntil(handleNotificationClick);
}

function getIdealClient(clients: Readonly<WindowClient[]>) {
  const focusedClient = clients.find((c) => c.focused);
  const visibleClient = clients.find((c) => c.visibilityState === "visible");
  return focusedClient || visibleClient || clients[0];
}

async function openUrl(url: string) {
  const clients = await self.clients.matchAll({ type: "window" });

  // Chrome 42-48 does not support navigate
  if (clients.length !== 0 && "navigate" in clients[0]!) {
    const client = getIdealClient(clients);
    await client?.navigate(url).then((client) => client?.focus());
  }

  await self.clients.openWindow(url);
}
