const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type Query {
    message: String
    clients(clientData: DataClient): Client
  }

  type Client {
    id: ID!
    email: String
    password: String
    name: String
    balance: Int
  }

  type ClientLogin {
    id: ID!
    name: String
    accessToken: String
  }

  type Message {
    msg: String
  }

  input DataClient {
    id: ID!
    token: String
  }

  input DataRegister {
    name: String
    email: String
    password: String
  }

  input DataLogin {
    email: String
    password: String
  }

  input DataWithdraw {
    id: ID!
    token: String
    nominal: Int
  }

  input DataDeposit {
    id: ID!
    token: String
    nominal: Int
  }

  type Mutation {
    register(registerData: DataRegister): Client
    login(loginData: DataLogin): ClientLogin
    withdraw(withdrawData: DataWithdraw): Message
    deposit(depositData: DataDeposit): Message
  }
`;

const resolvers = {
  Query: {
    async clients(parent, args, context, info) {
      try {
        const { data } = await axios({
          method: "GET",
          url: `http://localhost:4001/${args.clientData.id}`,
          headers: { token: args.clientData.token },
        });
        return data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
  Mutation: {
    async register(parent, args, context, info) {
      try {
        const { data } = await axios({
          method: "POST",
          url: `http://localhost:4001/registration`,
          data: args.registerData,
        });
        // console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    async login(parent, args, context, info) {
      try {
        const { data } = await axios({
          method: "POST",
          url: `http://localhost:4001/login`,
          data: args.loginData,
        });
        // console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    async withdraw(parent, args, context, info) {
      // console.log(args);
      try {
        const { data } = await axios({
          method: "PATCH",
          url: `http://localhost:4001/${args.withdrawData.id}/withdraw`,
          data: { nominal: args.withdrawData.nominal },
          headers: { token: args.withdrawData.token },
        });
        // console.log(data);
        return { msg: data };
      } catch (error) {
        console.log(error.response.data);
      }
    },

    async deposit(parent, args, context, info) {
      // console.log(args);
      try {
        const { data } = await axios({
          method: "PATCH",
          url: `http://localhost:4001/${args.depositData.id}/deposit`,
          data: { nominal: args.depositData.nominal },
          headers: { token: args.depositData.token },
        });
        // console.log(data);
        return { msg: data };
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) => console.log("Apollo siap di jalankan di url", url));
