google_maps_readme = """# Google Places API & Maps JavaScript API Integration Guide

This guide walks you through setting up and integrating Google Places API and Maps JavaScript API in your Nuxt application. You’ll enable the APIs, secure your credentials, and test autocomplete and map rendering features.

---

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown (top left) → **New Project**.
3. Name your project (e.g., `Rainbow Round Up`) and click **Create**.

---

## 2. Enable Required APIs

1. Inside your project dashboard, navigate to **APIs & Services > Library**.
2. Search for and enable the following:
   - **Places API**
   - **Maps JavaScript API**

---

## 3. Create an API Key

1. Go to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** → **API key**.
3. Once generated, click **Restrict Key**:
   - Under **Application restrictions**: Choose **HTTP referrers (web sites)**.
     - Add entries like: `http://localhost:3000/*` and your production domain.
   - Under **API restrictions**: Select **Restrict key** and allow only:
     - Places API
     - Maps JavaScript API
4. Save your key.

---

## 4. Add Environment Variable

In your `.env` file, add:

```env
NUXT_GOOGLE_PLACES="YOUR_API_KEY"
```
