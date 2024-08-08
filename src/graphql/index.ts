import { ApolloServer } from "@apollo/server";
import {User} from './user'

async function createApolloGraphqServer(){
    // Creating Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
               ${User.queries}
            }
            type Mutation {
               ${User.mutations}
           
            }
        `, // Schema 
        resolvers: {
            Query:{
              ...User.resolvers.queries
            },
            Mutation: {
              ...User.resolvers.mutations
            }
        }, // Logic
    })

    // Starting gql server
    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphqServer();