import { defineEventHandler, getMethod } from 'h3';
import eventGet from './event.get';
import eventPost from './event.post';
import eventPut from './event.put';
import eventDelete from './event.delete';

export default defineEventHandler(async (event) => {
  const method = event.method; // Get the HTTP method (GET, POST, PUT, DELETE)

  switch (method) {
    case 'GET':
      return eventGet(event); // Handle GET request
    case 'POST':
      return eventPost(event); // Handle POST request
    case 'PUT':
      return eventPut(event); // Handle PUT request
    case 'DELETE':
      return eventDelete(event); // Handle DELETE request
    default:
      return {
        success: false,
        message: 'Method not allowed for /api/event',
      };
  }
});
