import { GraphQLServer } from 'graphql-yoga'

const resolvers = {
  Query: {
    // hello: (_, { name }) => {
    //   const returnValue = `Hello ${ name || 'World!' }`
    //   return returnValue
    // },
    async getEmbedCode(_, { organizationId }) {
      return organizationId.toString()
    }
  },

  Mutation: {
    async register(_, {organization}) {
      console.log(organization)
      return {
        ...organization
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs: ['./schema.graphql'],
  resolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
