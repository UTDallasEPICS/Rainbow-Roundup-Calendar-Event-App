import { PrismaClient, Event } from '@prisma/client';
import { defineEventHandler, readBody, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;

  //prevent duplicate signups
  const existingSignUp = await prisma.signUp.findUnique({
    where: {
      userId_eventId: {
        userId: body.userId,
        eventId: body.eventId
      }
    }
  })
  if(existingSignUp){
    setResponseStatus(event, 400)
    return{
      success: false,
      error: 'You have already signed up for this event'
    }
  }
  // find event
  const targetEvent = await prisma.event.findUnique({
    where: { id: body.eventId}
  });
  //check existence of event
  if(targetEvent){
    if(targetEvent.capacity != null && targetEvent.currentCapacity != null){
      if((targetEvent.currentCapacity >= targetEvent.capacity)){
        setResponseStatus(event, 400)
        return{
          success: false,
          error: 'event is full',
          capacity: 'this is the current capacity' + targetEvent.currentCapacity,
          maxCap: 'this is the max capacity' + targetEvent.capacity
        }
      }
    }
  }
  else if (!targetEvent){
    setResponseStatus(event, 404)
    return{
      success: false,
      error: "Event doesn't exist"
    }
  }
  // sign up does not already exist, event exists and has capacity to spare
  try {
    const newSignUp = await event.context.prisma.signUp.create({
      data: {
        userId: body.userId,
        eventId: body.eventId,
        Notifications: body.notifications || false
      },
    });
    // increment current capacity
    if(targetEvent && (targetEvent as Event).capacity != null && (targetEvent as Event).currentCapacity != null){
      await prisma.event.update({
        where: { id: body.eventId },
        data: {
          currentCapacity: {
            increment: 1
          }
        }
      })
    }
    return{
      success: true,
      signup: newSignUp
    } 
  }
  catch (error) {
    console.error((error as Error).message);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: "Failed to register for event"
    };
  }
});
