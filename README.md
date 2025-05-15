## Conceptual Overview

Rainbow Roundup is a calendar event management platform designed to streamline student organization events at UT Dallas. It centralizes event discovery, RSVP management, and event moderation in one system. The platform supports different user roles to ensure efficient access control and functionality.

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

### `/events/:id`

- Display full event details
- Allow registered users to RSVP (if not full)

### `/signup` and `/login`

- Register and log in using secure authentication

### `/profile`

- View and update name, phone, and profile picture

### `/admin/dashboard` (TODO)

- View upcoming and past events

### `event/:id`

- Create, edit, or delete events

### `/admin/userLust`

- Promote or demote users (Super Admin only)

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
- **Database**: MySQL
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

---

For any deployment-specific scripts or secrets, refer to the `README.md` or `/scripts` directory.
