import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';

export const swaggerDocs = (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};