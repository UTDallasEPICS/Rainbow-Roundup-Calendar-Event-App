import { defineEventHandler, getMethod } from 'h3';
import adminGet from './admin.get';
import adminPost from './admin.post';
import adminPut from './admin.put';
import adminDelete from './admin.delete';

export default defineEventHandler(async (event) => {
  const method = event.method; // Get the HTTP method (GET, POST, PUT, DELETE)

  switch (method) {
    case 'GET':
      return adminGet(event); // Handle GET request
    case 'POST':
      return adminPost(event); // Handle POST request
    case 'PUT':
      return adminPut(event); // Handle PUT request
    case 'DELETE':
      return adminDelete(event); // Handle DELETE request
    default:
      return {
        success: false,
        message: 'Method not allowed for /api/admin',
      };
  }
});
