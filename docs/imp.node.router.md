# Implementation Of The Custom Router In The Supplier's Node API

Creating custom routes for the tRPC server within the WindingTree Market Protocol's Supplier Node offers developers a powerful way to extend the API's functionality to suit specific needs. This article delves into the process of defining custom routes, taking the implementation of `airplanesRoute` as a case study, and explaining how to integrate these custom routes into the main API router.

## Understanding the `airplanesRoute` Module

The `airplanesRoute` module (`./packages/node/src/api/airplanesRoute.ts`) showcases how to define a set of CRUD operations for managing suppliers property (airplanes) data within the node's storage system. It employs the `@trpc/server` library for route definition and the Zod library (`z`) for schema validation, ensuring robust data handling and error checking.

### Key Components

- **Schemas**: Defines the structure of airplane data (`AirplaneInputSchema`) and the update data structure (`AirplaneUpdateSchema`), using Zod for validation.

- **Router Definition**: Utilizes the `router` function from `@windingtree/sdk-node-api/server` to create a router instance with methods corresponding to adding, updating, deleting, and fetching airplane records.

- **Procedures**: Each route method (`add`, `update`, `delete`, `get`, `getAll`) is defined as a procedure with input validation, and access control (`authAdminProcedure` or `authProcedure`) to ensure secure data manipulation.

### Example: Adding a New Airplane

```typescript
add: authAdminProcedure
  .input(AirplaneInputSchema)
  .mutation(async ({ input, ctx }) => {
    const id = simpleUid();
    await ctx.storage['airplanes'].set(id, input);
  }),
```

This snippet from the `airplanesRouter` demonstrates how to define a route for adding a new airplane. It uses `authAdminProcedure` to restrict access to admin users, validates the input against `AirplaneInputSchema`, and utilizes the storage interface to save the data.

## Integrating Custom Routes into the Main API Router

Once you've defined your custom routes, integrating them into the main API router is the next step to make them part of your node's endpoint offerings. This process involves adding your custom router to the main application router, typically found in your node controller module (`nodeController.ts`).

### Step by Step Integration

1. **Import the Custom Router**: Start by importing your custom router module into the node controller file where the main API router is defined.

   ```typescript
   import { airplanesRouter } from '../api/airplanesRoute.js';
   ```

2. **Add to the Main Router**: Incorporate your custom router into the main router's configuration. This usually involves adding it to the object passed to the `router` function, alongside other predefined routes.

   ```typescript
   const appRouter = router({
     service: serviceRouter,
     admin: adminRouter,
     user: userRouter,
     deals: dealsRouter,
     airlines: airplanesRouter, // Your custom router
   });
   ```

3. **Ensure Proper Storage Access**: Custom routes often require access to specific storage instances (e.g., `airplanesStorage`). Make sure your router's context (`ctx`) is properly configured to include these storage instances, enabling your custom route handlers to interact with the data layer as needed.

## Best Practices for Custom Route Development

- **Schema Validation**: Always define and enforce input and output schemas using Zod or a similar library to ensure data integrity and clear API documentation.

- **Access Control**: Utilize `authProcedure` and `authAdminProcedure` to enforce appropriate access controls on your routes, keeping your node's data secure.

- **Error Handling**: Use `TRPCError` to handle and communicate errors effectively, providing meaningful error messages to the client.

- **Logging**: Implement logging throughout your route handlers to aid in debugging and monitoring route activities.

By following the example of the `airplanesRoute` module and adhering to these integration steps and best practices, developers can efficiently extend the functionality of their WindingTree Market Protocol Supplier Node's API, tailoring it to meet specific application requirements.
