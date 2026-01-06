// gets **UNARCHIVED** events

import { PrismaClient, User } from "@prisma/client";
import { auth } from "~/server/auth";
//
type SignUpCounts = {
  plusOneKids: number;
  plusOneAdults: number;
};
//
function computeCC_SignUp(signUps: SignUpCounts[]): number {
  const baseAttendees = signUps.length;
  const totalPlusOneKids = signUps.reduce(
    (total, signup) => total + (signup.plusOneKids ?? 0),
    0
  );
  const totalPlusOneAdults = signUps.reduce(
    (total, signup) => total + (signup.plusOneAdults ?? 0),
    0
  );
  return baseAttendees + totalPlusOneKids + totalPlusOneAdults;
}

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const session = await auth.api.getSession({
              headers:  event.headers
          })
  const user = session?.user as User | undefined;

  try {
    // Simple query first - no includes
    const events = await prisma.event.findMany({
      where: {
        isArchived: false
      },
      include: {
        User: true, // Event creator
        SignUps: {
          include: {
            User: { select: { id: true, firstname: true, profilePic: true } },
          },
        }, // Who signed up
      },
      orderBy: {
        startTime: "desc",
      },
    });

    console.log('Events found:', events.length); // Debug log
    if(!(user?.role === "SUPER" || user?.role === "ADMIN")){
      events.forEach(iEvent => {
      iEvent.SignUps.forEach( signup => {
        signup.plusOneAdults = (signup.plusOneAdults ?? 0) + (signup.plusOneKids ?? 0);
        signup.plusOneKids = 0
      })
    })
    }

      const out = events.map((e) => {
      const cc = computeCC_SignUp(e.SignUps);
      const rc = e.capacity == null ? null : Math.max(0, e.capacity - cc);

      return {
        ...e,
        currentCapacity: cc,     // computed (Issue #211)
        remainingCapacity: rc,   // optional but useful
      };
    });

    return out;  
    //return events; is now return out bc events is from prisma and out has computed capacity
  } catch (error) {
    console.error('Prisma error:', error); // Debug log
    setResponseStatus(event, 500);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

































// export default defineEventHandler(async (event) => {
//   const prisma = event.context.prisma;

//   try {
//     const events = await prisma.event.findMany({
//       include: {
//         User: true, // Event creator
//         SignUps: {
//           include: {
//             User: { select: { id: true, firstname: true, profilePic: true } },
//           },
//         }, // Who signed up
//       },
//       orderBy: {
//         startTime: "asc", // Optional: sort upcoming events first
//       },
//     });

//     return events;
//   } catch (error) {
//     setResponseStatus(event, 500);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     return {
//       success: false,
//       error: `Error fetching events: ${errorMessage}`,
//     };
//   }
// });
