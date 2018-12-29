/**
 * @author Sharad Shinde
 * Express App with GraphQL
 */

const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

// Setup GraphQL Path and Schema
app.use('/api', expressGraphQL({
    schema: buildSchema(`
    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        events: () => {
            return ['Coding', 'Watching Movies', 'Cooking', 'Traveling']
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}), 
);

app.listen(4000, () => {
    console.log(`Server Started on Port 4000`);
});