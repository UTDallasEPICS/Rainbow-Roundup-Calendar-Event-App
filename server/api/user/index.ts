import { defineEventHandler, getMethod } from 'h3';
import userGet from './user.get';
import userPost from './user.post';
import userPut from './user.put';
import userDelete from './user.delete';

export default defineEventHandler(async (event) => {
  const method = event.method; // Get the HTTP method (GET, POST, PUT, DELETE)

  switch (method) {
    case 'GET':
      return userGet(event); // Handle GET request
    case 'POST':
      return userPost(event); // Handle POST request
    case 'PUT':
      return userPut(event); // Handle PUT request
    case 'DELETE':
      return userDelete(event); // Handle DELETE request
    default:
      return {
        success: false,
        message: 'Method not allowed for /api/user',
      };
  }
});
