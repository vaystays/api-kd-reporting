import { GraphQLServer } from 'graphql-yoga'
import { config } from './infrastructure/env'
import { isPartnerRegistered } from './infrastructure/kdd-client'

config()

const resolvers = {
  Query: {
    async getEmbedCode(_, { organizationId }) {
      return organizationId.toString()
    },
    async isPartnerRegistered(_, { organizationId }) {
      return await isPartnerRegistered(organizationId)
    }
  },

  Mutation: {
    async register(_, { organization }) {
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
