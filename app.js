/**
 * @author Sharad Shinde
 * Express App with GraphQL
 */

const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config()

const Event = require('./models/event');
const User = require('./models/user')

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

    type User {
        _id: ID!
        email: String!,
        password: String
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
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
                date: new Date(args.eventInput.date),
                creator: '5c285f6d4c60c521dfc29cc1'
            });
            return event.save()
                .then(result => { return { ...result._doc } })
                .catch(err => { throw err });
        },
        createUser: args => {
            return bcrypt.hash(args.userInput.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => { return { ...result._doc, password: null, _id: result.id } })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true
}),
);

mongoose.connect(process.env.CONNECTION_URL).
    then(() => app.listen(4000))
    .catch(err => console.log(err));