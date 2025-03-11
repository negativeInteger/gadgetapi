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
          url: "http://localhost:3000",
          description: "Local server",
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
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { withCredentials: true } }));
  console.log("📄 Swagger docs available at http://localhost:3000/docs");
};

export { setupSwagger };
