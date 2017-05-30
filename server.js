const express = require('express');
const expressGraphQL = require('express-graphql');

const app = express();

app.use('/graphql', expressGraphQL({
  graphiql: true, // dev tool that allows us to make queries against our dev server

}));

app.listen(4000, () => {
  console.log('Listening on http://localhost:4000')
});

