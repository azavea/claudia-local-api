'use strict';

const ApiBuilder = require('claudia-api-builder');
const fs = require('fs');
const path = require('path');

function handleGetRequest(app, req) {
    const body = {
        status: 'OK',
        body: req.body,
        pathParams: req.pathParams,
        query: req.queryString
    };
    return new app.ApiResponse(body, {
        called: 'handleGetRequest'
    }, 200);
}

function handlePostRequest(app, req) {
    const body = {
        status: 'OK',
        body: req.body,
        pathParams: req.pathParams,
        query: req.queryString
    };
    return new app.ApiResponse(body, {
        called: 'handlePostRequest'
    }, 201);
}

function handleImageRequest() {
    return fs.readFileSync(path.join(__dirname, 'img.png'));
}

function bootstrap() {
    const app = new ApiBuilder();

    app.get('/', handleGetRequest.bind(null, app));
    app.post('/', handlePostRequest.bind(null, app));

    app.get('/users/{id}', handleGetRequest.bind(null, app));
    app.get('/items/{itemId}/{partId}', handleGetRequest.bind(null, app));

    app.post('/objects', handlePostRequest.bind(null, app));

    app.get('/img', handleImageRequest, {
        requestContentHandling: 'CONVERT_TO_TEXT',
        success: {
            contentType: 'image/png',
            contentHandling: 'CONVERT_TO_BINARY'
        }
    });

    app.get('/error',
        function () {
            return new ApiBuilder.ApiResponse({message: 'This is an error and shouldn\'t be converted to binary'}, {'Content-Type': 'application/json'}, 500);
        },
        { success: { contentHandling: 'CONVERT_TO_BINARY' } }
    );

    app.get('/wildcard/{wildcard+}', (req) => req.pathParams);

    return app;
}

module.exports = bootstrap();
