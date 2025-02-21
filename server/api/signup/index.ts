import { defineEventHandler, getMethod } from 'h3';
import signupGet from './[id]';
import signupPost from './signup.post';
//import signupPut from './signup.put';
import signupDelete from './[id].delete';

export default defineEventHandler(async (event) => {
  const method = event.method; // Get the HTTP method (GET, POST, PUT, DELETE)

  switch (method) {
    case 'GET':
      return signupGet(event); // Handle GET request
    case 'POST':
      return signupPost(event); // Handle POST request
    // case 'PUT':
    //   return signupPut(event); // Handle PUT request
    case 'DELETE':
      return signupDelete(event); // Handle DELETE request
    default:
      return {
        success: false,
        message: 'Method not allowed for /api/signup',
      };
  }
});
