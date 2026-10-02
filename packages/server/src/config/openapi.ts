import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Slow Rush API',
            version: '1.0.0',
            description: 'Documento de la API de Slow Rush',
        },
        apis: [{url: '/'}]
    },
    apis: ['./src/**/*.ts'],
};

export const openApiSpec = swaggerJsdoc(options);