import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
/**
 * Swagger API Documentation Configuration
 * Generates and serves OpenAPI documentation for the Gadget API.
 */
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Gadget API",
        version: "1.0.0",
        description: "API documentation for the Gadget service",
      },
      servers: [
        {
          url: process.env.BASE_URL || "http://localhost:3000",
          description: process.env.NODE_ENV === "production" ? "Production server" : "Local server",
        },
      ],
      components: {
        securitySchemes: {
          CookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "accessToken",
          },
        },
      },
      security: [{ CookieAuth: [] }],
    },
    apis: ["api/routes/*.js"],
  };
/**
 * Sets up Swagger UI for API documentation.
 * @param {import('express').Express} app - Express application instance.
 */
const swaggerSpec = swaggerJsdoc(options);
const setupSwagger = (app) => {
  const serverUrl = process.env.BASE_URL || "http://localhost:3000"; 
  swaggerSpec.servers = [{ url: serverUrl, description: "API Server" }];
  // Serve Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { withCredentials: true } }));
  if (process.env.NODE_ENV !== "production") {
    console.log(`📄 Swagger docs available at ${serverUrl}/docs`);
  }
};
export { setupSwagger };
