import { PrismaClient, Event } from "@prisma/client";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
//import { getServerSession } from "#auth";
import { auth } from '~/server/auth';
import type { User } from "../../../types/session";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;
  const numPlusOneVal = 0;
  //prevent duplicate signups
  const session = await auth.api.getSession({
      headers:  event.headers
  })
  const user = session?.user as User | undefined;
  if (!user) {
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  const existingSignUp = await prisma.signUp.findUnique({
    where: {
      userId_eventId: {
        userId: body.userId,
        eventId: body.eventId,
      },
    },
  });
  if (existingSignUp) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "You have already signed up for this event",
    };
  }
  // find event
  const targetEvent = await prisma.event.findUnique({
    where: { id: body.eventId },
  });

  if (!targetEvent) {
    setResponseStatus(event, 404);
    return {
      success: false,
      error: "Event doesn't exist",
    };
  }
  // capacity check (Issue#211: currentCapacity is computed ad-hoc)
  //check existence of event
if (targetEvent.capacity != null) {
    const agg = await prisma.signUp.aggregate({
      where: { eventId: body.eventId },
      _count: { _all: true },
      _sum: { plusOneKids: true, plusOneAdults: true },
    });

    const used =
      (agg._count._all ?? 0) +
      (agg._sum.plusOneKids ?? 0) +
      (agg._sum.plusOneAdults ?? 0);

    const adding =
      1 + (body.numPlusOneAdultsVal ?? 0) + (body.numPlusOneKidsVal ?? 0);

    // if this signup would exceed capacity, block it
    if (used + adding > targetEvent.capacity) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: "Sorry you have exceeded the capacity.  ", 
        capacity: "This is the current capacity. " + used,
        maxCap: "This is the max capacity. " + targetEvent.capacity,
      };
    }
  }

  
  // sign up does not already exist, event exists and has capacity to spare
  try {
    const newSignUp = await event.context.prisma.signUp.create({
      data: {
        userId: body.userId,
        eventId: body.eventId,
        Notifications: body.notifications || false,
        plusOneAdults: body.numPlusOneAdultsVal || 0,
        plusOneKids: body.numPlusOneKidsVal || 0,
      },
    });






    // // increment current capacity
    // if (
    //   targetEvent &&
    //   (targetEvent as Event).capacity != null &&
    //   (targetEvent as Event).currentCapacity != null
    // ) {
    //   await prisma.event.update({
    //     where: { id: body.eventId },
    //     data: {
    //       currentCapacity: {
    //         increment: 1 + body.numPlusOneKidsVal + body.numPlusOneAdultsVal,
    //       },
    //     },
    //   });
    // }



    return {
      success: true,
      signup: newSignUp,
    };
  } catch (error) {
    console.error((error as Error).message);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: "Failed to register for event",
    };
  }
});
