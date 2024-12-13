# How to set up project to link with Google Calendar

Quick guide to create a way to test Google Calendar integration in the backend. Essentially just need to create a new Google Calendar and a service account in Google Cloud Platform to access/edit the calendar.

1. Go to [Google Cloud Platform console](https://console.cloud.google.com/) and create a new project.

2. Go to 'APIs & Services' and click 'ENABLE APIS AND SERVICES', search for the 'Google Calendar API' and enable it.
    
    - If it doesn't immediately open the 'API/Service Details' for the Google Calendar API, go back to 'Enabled APIs & Services' and select the Google Calendar API from the list, or search it up again and press 'MANAGE'.

3. Create Credentials on the 'API/Service Details' page of the Google Calendar API, select application data and create a **service account** (you can skip the two optional steps in creating a service account). The service account shuold then show up under the 'Credentials compatible with this API' under the 'API/Service Details' page.

4. Select the service account, go to 'KEYS' and add a new key. Create the private key as a JSON. The JSON containing the **private key** among other super secret identifiers of the service account should be downloaded. **DO NOT PLACE IN THE REPOSITORY FILES AT ALL, THE FILE OR ITS CONTENTS SHOULD NEVER BE PUSEHD TO GITHUB**

5. Go to [Google Calendar](https://calendar.google.com/) and create a new calendar to test with the application. Create a new calendar and open the Settings and sharing of the calendar.

6. Open 'Add people and groups', and share the calendar with the service account's email address under `client_email` from the service account JSON. Make sure to set permissions to 'Make changes to events'

7. In the `.env` file of the repository:

    - Set `NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL` as the service account email address shared with the Google calendar.
    
    - Set `NUXT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` as the `private_key` from the service account JSON (include the `-----BEGIN PRIVATE KEY-----\n` and the `\n-----END PRIVATE KEY-----\n`)
    
    - Take the Calendar ID from the google calendar (should look like `<some long string>@group.calendar.google.com`) set `NUXT_GOOGLE_CALENDAR_ID` as that ID

Refer to the `.env-example stucture` if you haven't created a new `.env` yet

At this point, any events in the Google calendar should be reflected by the events returned by the server API endpoints interfacing with the Google Calendar API.