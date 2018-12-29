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

const events = [];

// Setup GraphQL Path and Schema
app.use('/api', expressGraphQL({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString()
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
}),
);

app.listen(4000, () => {
    console.log(`Server Started on Port 4000`);
});