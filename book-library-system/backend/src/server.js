const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const oracledb = require('oracledb');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

async function startServer() {
  const app = express();
  
  // Enable CORS for all routes
  app.use(cors());

  // Initialize Oracle connection pool
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });
    console.log('Connected to Oracle Database');
  } catch (err) {
    console.error('Failed to create connection pool:', err);
    process.exit(1);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      const connection = await oracledb.getConnection();
      return { connection };
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(console.error);