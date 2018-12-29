/**
 * @author Sharad Shinde
 * Express App with GraphQL
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.json('Hello World...!');
});

app.listen(3000, () => {
    console.log(`Server Started on Port 3000`);
});