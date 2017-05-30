const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in a root query and returns a GraphQL schema
} = graphql;

const users = [
  { id: "abc1", firstName: "Bob", age: 20},
  { id: "def2", firstName: "John", age: 35},
];

const UserType = new GraphQLObjectType({
  name: 'User', // REQUIRED - name prop is a string naming the type
  fields: { // REQUIRED - most important prop, telling graphql all the fields a node has
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

// ROOTQUERY to enable GraphQL jump into our data landscape and build up the graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType, // ... "and I'll return you the user you're looking for"
      args: { id: { type: GraphQLString }}, // "Give me the id of the user you're looking for as an argument" ...^
      resolve(parentValue, args) { // >> so finally let's go to the database/api and get the data we are looking for
        return _.find(users, { id: args.id });
        // THIS IS BOOOOOOOOOORING!
        // Let's fetch dynamic "realworld" data
        // From a db directly, from an api? 
        // Well. GraphQL doesn't give a shit!
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});