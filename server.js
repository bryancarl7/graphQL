import gql from 'graphql-tag';
import express from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
const express = require('express');
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

// Get this bad boys to configure the app
const port = process.env.PORT || 3000;

// Parse config.json wiht our db info (if necessary)
let rawdata = fs.readFileSync('config.json');
let parsed = JSON.parse(rawdata);
let pwd = parsed['password'];
let un  = parsed['username'];
let dbname = parsed['dbname'];

// Define the SDL
const definitions = gql`
    type Query{
        sayHello(name: String!): String!
    }

    type Mutation {
        sayHello(name: String!): String!
    }
`

// Keep our resolvers
const resolvers = {
    Query: {
        sayHello: (obj, args, context, info) =>{
            return `Hello $ { args.name }!`;
        } 
    },

    Mutation: {
        sayHello: (obj, args, context, info) => {
            return `Hello $ { args.name }!`;
        }
    }
}

// Setup our express app
const app = express();

// Setup our schema
const schema = makeExecutableSchema({ definitions, resolvers });

// Build Apollo server
const apolloServer = new ApolloServer({ schema });
apolloServer.applyMiddleware({ app });

// Run that bitch
app.listen({ port }, () => {
    console.log(`Server launched on port: ${port}: ${ apolloServer.graphqlPath }`);
});
