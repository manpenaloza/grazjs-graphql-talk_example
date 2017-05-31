const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // takes in a root query and returns a GraphQL schema
} = graphql;

// const users = [
//   { id: "abc1", firstName: "Bob", age: 20},
//   { id: "def2", firstName: "John", age: 35},
// ];

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User', // REQUIRED - name prop is a string naming the type
  fields: { // REQUIRED - most important prop, telling graphql all the fields a node has
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // now note: parentValue arg to the rescue to reslove this :D!
        // parentValue: "pure" returend db object including the companyId!
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
              .then(response => response.data);
      },
    },
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
        // axios - as Promise-based lib - handles async Promise behavior
        return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(response => response.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});