## Conceptual Overview

Rainbow Roundup is a calendar event management platform built to unify and uplift the LGBTQ+ community in the Dallas–Fort Worth area. It centralizes event discovery, RSVP management, and event moderation, making it easier for community members to find and engage with local happenings. The platform supports different user roles to ensure inclusive access control, secure moderation, and seamless event coordination across diverse organizations and interest groups.

### User Roles:

- **Visitor**: Can browse the calendar and view event details
- **Registered User**: Can RSVP to events and manage their profile
- **Admin**: Can create, edit, and delete events; view RSVPs
- **Super Admin**: Can manage user roles, access analytics, and oversee the entire system

---

## Functional Requirements (by page)

### `/` (Home)

- View calendar with events (month/week/day)
- Click events to view details
- There is also a section where you can view events that happening today

### `/calendar`

- A calendar view of events, with ability to click on a specific event to view the card for the event
- The event card displays:
   - Event name
   - Location
      - address
      - A google maps widget showing where the event is located, with a button to view it on the google maps website
   - Capacity
      - Including how much of it full
   - Current signups
      - Including plus one signups
- A regular user can sign up (RSVP) to events
   - Can include plus one signups (and specify which are kids, which are adults)
- Admin can additionally edit the event
   - Including start/end times
   - description
   - location (will automatically update the google maps card)
   - capacity
   - delete the event

### `/eventspage`

- Display all events, including descriptions
- Clicking on an event will bring up the same event card as in /calendar

### `/signup` and `/login`

- Register and log in using secure email otp authentication

### `/profile`

- View and update name, phone, and profile  of your own user
- Can delete your own user

### `/profile/:id`

- View a specific user's profile
- Super admin is also able to ban or revoke bans of a user on this page

### `/admin/`

- Admin dashboard to manage events, users, merchandise, and orders


### `/admin/users`

- Allow Super admins to manage users
   - Change user information (name, emails, role)
- View all user information
   - Including banned and archived users
- View reported users
   - For each report, the user is able to either delete the report, or ban the user
- Note: Regular admin is able to view all this information and visit profiles, but is unable to modify any of it

### `/admin/events`

- Allows admin to manage events

### `/admin/merchandise`

- Allow admins to manage items in merchandise
- The admin can change:
   - Item name
   - Price
   - Make sizes available or unavailable (like if XL is out of stock, but M is in stock)
   - Add item photos
   - Make the item visible or invisible (essentially an option to hide it from users if isn't currently sold)

### `/admin/orders`

- Allow admins to manage and view user orders
- There are two types of orders
   - PICKUP and SHIPPING
   - pickup orders are meant to be picked up at a certain event and need an associated event id
   - shipping orders are meant to be delivered and need to have a shipping address 
      - The admin can add a tracking number to the order once that is available
- Orders are initially unconfirmed when placed by user but can be marked as CONFIRMED, UNPAID, PAID, and DELIVERED by super admins
- Super admins can change the following field in an order
   - Order status, Order type
   - If shiiping order, the admin can additionally change shipping address and USPS tracking number
   - If pickup order, the admin can additionally change the pickup event id
- Fields that super admin can view
   - Order date and time
   - order id
   - order status
   - order type
   - Name of who placed the order
   - by clicking an individual order, the admin additionally view
      - Contact information
      - Items in order, their price, as well as total cost
      - If pickup order
         - A card showing which event is associated with the order
      - If shipping order
         - Shipping address
         - USPS tracking number

### `/admin/analytics` (TODO)

- View system engagement data (RSVP counts, user activity, etc.)

---

## Third-Party Integrations

### **Google Places API**

- Adds autocomplete for event location input

### **Google Calendar API**

- Allows RSVP’d users to add events to their Google Calendar

### **Stripe** (Planned)

- Enable donations or ticketed event payments in future versions

### **AWS S3**

- Stores user profile pictures securely

### **Nuxt Auth (Magic Link Authentication)**

- Handles authentication using Nuxt Auth module with email-based magic links
- Manages session tokens securely on the client and server

---

## Tech Stack

- **Meta Framework**: Nuxt.js (Vue-based, fullstack)
- **Database**: SQLite3
- **ORM**: Prisma
- **Authentication**: Next-Auth (via Nuxt Auth module)
- **Storage**: AWS S3 (for profile images)
- **Testing**: Vitest
- **UI**: Tailwind CSS + Headless UI
- **API Testing**: Postman

---

## Deployment Notes

The application is hosted on **AWS** infrastructure, using:

- **S3** for media storage
- (Future) Cloud-based database and deployment pipelines

---

## Migration Scripts

There are currently **no legacy systems** or required data imports from a previous system. All data is created natively in the new platform.

---

## Development Environment Setup

> Assumes Node.js, Docker, and Git are already installed.

1. **Clone the Repository**

   ```bash
   git clone https://github.com/UTDallasEPICS/Rainbow-Roundup-Calendar-Event-App.git
   cd Rainbow-Roundup-Calendar-Event-App
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   - Copy `.env.example` to `.env`
   - Fill in Stripe, Google, AWS, and DB credentials

4. **Initialize the Database**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Seed the Database (if applicable)**

   ```bash
   npx prisma db seed
   ```

6. **Start the Development Server**

   ```bash
   npm run dev
   ```

7. **Authentication Setup**
   - Configure email credentials in `.env`
   -  Do ``` npx prisma studio ``` to see the DB
   -  Change your user role to SUPER or ADMIN

---

For any deployment-specific scripts or secrets, refer to the `README.md` or `/scripts` directory.
