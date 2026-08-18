const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JMC Kepegawaian API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk Sistem Informasi Kepegawaian',
    },
    servers: [
      {
        url: 'https://jmc-test-fullstack-js-4le5.vercel.app/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };