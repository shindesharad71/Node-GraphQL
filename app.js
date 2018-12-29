/**
 * @author Sharad Shinde
 * Express App with GraphQL
 */

const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
require('dotenv').config()

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

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
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event.id };
                    });
                }).catch(err => {
                    throw err;
                });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save()
                .then(result => { return { ...result._doc } })
                .catch(err => { throw err });
        }
    },
    graphiql: true
}),
);

mongoose.connect(process.env.CONNECTION_URL).
    then(() => app.listen(4000))
    .catch(err => console.log(err));