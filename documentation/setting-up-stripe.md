# How to Set Up Stripe for Project Integration

This guide helps you configure a Stripe account and link it with your backend for payment processing or billing features.

---

## 1. Create a Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register) and create a new account (or log in if you already have one).
2. Complete the basic setup including verifying your email and setting up your business or developer account.

---

## 2. Set Up a Stripe Project (API Keys)

1. Once logged in, navigate to the **Developers** tab in the left sidebar.
2. Go to **API keys**.
   - You will see:
     - **Publishable key** – starts with `pk_test_...`
     - **Secret key** – starts with `sk_test_...` (click "Reveal" to view)

**Never expose the secret key in client-side code.**

---

## 3. Add Keys to Your Environment File

Add the following variables to your `.env` file:

```env
# Stripe API Keys
STRIPE_PRIVATE_KEY="blah"
STRIPE_PUBLIC_KEY="blah"
```

## 4. Set Up Stripe Payment Links

Stripe Payment Links let you create hosted checkout pages without writing server-side code.

### To Create a Payment Link:

1. Go to [Payment Links Dashboard](https://dashboard.stripe.com/payment-links).
2. Click **“New”**.
3. Choose a product or create a new one (e.g., “Event Ticket”, “Donation”, etc.).
4. Set pricing, quantity, and other settings.
5. Click **Create Link** to generate a unique hosted URL.

You can now copy and share this URL in your frontend app, email, or anywhere.

For more info: [Stripe Docs - Create Payment Links](https://docs.stripe.com/payment-links/create)
