import { PrismaClient, Role } from "./generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { google } from "googleapis";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter }); 

async function main() {
  console.log('Start seeding...')

  const samUser = await prisma.user.findUnique({
    where: {
      email: 'samuel.ma@npts.tech'
    }
  })

  if (!samUser) {
    await prisma.user.create
      ({
        data: {
            email: 'samuel.ma@npts.tech',
            firstname: 'Samuel',
            lastname: 'Ma',
            role: Role.SUPER,
        }
      })
    } 

  const kimberlyUser = await prisma.user.findUnique({
    where: {
      email: 'kimberly@rrup.org'
    }
  })

  if (!kimberlyUser) {
    await prisma.user.create({
      data: {
        email: 'kimberly@rrup.org',
        firstname: 'Kimberly',
        lastname: 'Kantor',
        role: Role.SUPER,
      }
    })
  }

  const adityaUser = await prisma.user.findUnique({
    where: {
      email: 'aditya@npts.tech'
    }
  })

  if (!adityaUser) {
    await prisma.user.create({
      data: {
        email: 'aditya@npts.tech',
        firstname: 'Aditya',
        lastname: 'Shivapooja',
        role: Role.SUPER,
      }
    })
  }

  // Seed leadership team for About Us page
  const kimberlyKantor = await prisma.leadershipTeam.findUnique({
    where: {
      name: 'Kimberly Kantor'
    }
  })

  if (!kimberlyKantor) {
    await prisma.leadershipTeam.create
      ({
        data: {
            name: 'Kimberly Kantor',
            role: 'Executive Director',
            description: 'Kimberly Kantor is an Adapted Physical Education Consultant for school districts across North Texas (Region X). Focusing on students with special needs in physical education and recreation, she dedicates time to helping students celebrate their accomplishments and showcase their athletic abilities.',
        }
      })
    } 
  
  const melodySmith = await prisma.leadershipTeam.findUnique({
    where: {
      name: 'Melody Smith'
    }
  })

  if (!melodySmith) {
    await prisma.leadershipTeam.create
      ({
        data: {
            name: 'Melody Smith',
            role: 'President',
            description: 'Melody Smith has been an active leader in promoting LGBTQ+ inclusion and awareness in communities across the state.',
        }
      })
    }
  
  const ashley = await prisma.leadershipTeam.findUnique({
    where: {
      name: 'Ashley'
    }
  })

  if (!ashley) {
    await prisma.leadershipTeam.create
      ({
        data: {
            name: 'Ashley',
            role: 'Vice President',
            description: 'Hello All! My name is Ashley, I am married to the love of my life, Elsa and we have 3 beautiful kids. I am a Bachelor prepared RN of 16 years and am currently a Nurse Manager at Parkland Hospital in critical care services. My family and I love the mission and values of Rainbow Roundup and love all the memories we have made.',
        }
      })
    }
  
  const raganMcCoy = await prisma.leadershipTeam.findUnique({
    where: {
      name: 'Ragan McCoy'
    }
  })

  if (!raganMcCoy) {
    await prisma.leadershipTeam.create
      ({
        data: {
            name: 'Ragan McCoy',
            role: 'Treasurer',
            description: 'Ragan is a trusted tax advisor and leads Rainbow Roundup in all financial matters. She has a long history of providing guidance to businesses and individuals in making important decisions related to limiting tax exposure and maximizing cash flow.',
        }
      })
    }
  
  const lauraHogan = await prisma.leadershipTeam.findUnique({
    where: {
      name: 'Laura Hogan'
    }
  })

  if (!lauraHogan) {
    await prisma.leadershipTeam.create
      ({
        data: {
            name: 'Laura Hogan',
            role: 'Secretary',
            description: 'Laura is a trusted leader in the LGBT community and was named a Future Pioneer by the Dallas Voice. Since 2004, she has owned and operated Benchmark Legal Media, which provides creative and practical solutions for litigation technology. Laura has worked with many high profile clients, including Disney, Oprah Winfrey, GM, Viacom and MTV.',
        }
      })
    }

  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod') {
    console.log('Environment is not production. Seeding test data...');
    
    // Create multiple Test Users
    const testUsers = [];
    for (let i = 1; i <= 5; i++) {
      const email = `testuser${i}@example.com`;
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            firstname: `TestUser${i}`,
            lastname: 'Account',
            role: Role.USER,
          }
        });
      }
      testUsers.push(user);
    }

    // Test Admin
    const adminEmail = 'testadmin@example.com';
    let testAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!testAdmin) {
      testAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          firstname: 'Test',
          lastname: 'Admin',
          role: Role.ADMIN,
        }
      });
    }

    // Push test event to Google Calendar if it doesn't already exist in Prisma
    const existingTestEvent = await prisma.event.findFirst({
      where: { title: 'Seed Test Event' }
    });

    let eventId = existingTestEvent?.id;

    if (!existingTestEvent) {
      console.log('Pushing test event to Google Calendar...');
      try {
        const auth = new google.auth.JWT({
          email: process.env.NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.NUXT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ],
        });
        
        const calendarClient = google.calendar({ version: 'v3', auth });
        
        const startTime = new Date();
        startTime.setDate(startTime.getDate() + 1); // Tomorrow
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2); // 2 hours long

        const response = await calendarClient.events.insert({
          calendarId: process.env.NUXT_GOOGLE_CALENDAR_ID!,
          requestBody: {
            summary: 'Seed Test Event',
            description: 'This is an autogenerated test event from the seed script.',
            start: {
              dateTime: startTime.toISOString(),
              timeZone: 'America/Chicago',
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: 'America/Chicago',
            },
            location: 'Seed Test Location',
          },
        });

        eventId = response.data.id;
        
        if (eventId) {
          console.log(`Successfully created Google Calendar Event with ID: ${eventId}`);
          // Insert event into Prisma
          await prisma.event.create({
            data: {
              id: eventId,
              title: 'Seed Test Event',
              description: 'This is an autogenerated test event from the seed script.',
              userId: testAdmin.id,
              startTime: startTime,
              endTime: endTime,
              capacity: 50,
              location: 'Seed Test Location',
            }
          });
        }
      } catch (error) {
        console.error('Failed to create event in Google Calendar during seed:', error);
      }
    }

    // Sign up users to the test event
    if (eventId) {
      for (const user of testUsers) {
        const existingSignup = await prisma.signUp.findUnique({
          where: {
            userId_eventId: { userId: user.id, eventId: eventId }
          }
        });

        if (!existingSignup) {
          await prisma.signUp.create({
            data: {
              userId: user.id,
              eventId: eventId,
              Notifications: true,
              plusOneKids: 0,
              plusOneAdults: 1,
            }
          });
        }
      }
      console.log(`Signed up ${testUsers.length} test users to the event ${eventId}.`);
    }

    // Test Merchandise
    const testItemId = 'test-item-1';
    const testItem = await prisma.abstractItem.findUnique({
      where: { id: testItemId }
    });

    if (!testItem) {
      await prisma.abstractItem.create({
        data: {
          id: testItemId,
          name: 'Test T-Shirt',
          price: 20.0,
          description: 'A test t-shirt',
          pickupAvailable: true,
          ItemVariants: {
            create: [
              { size: 'M', availability: true, stockRemaining: 10 },
              { size: 'L', availability: true, stockRemaining: 15 }
            ]
          }
        }
      });
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });