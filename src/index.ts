import express, { query } from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql'

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({
            message: "Server is up and running"
        })
    }) 

    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer));

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
}

init()