import { GraphQLServer } from 'graphql-yoga'
import { config } from './infrastructure/env'
import { isPartnerRegistered } from './infrastructure/kdd-client'
import {
  getEmbedCode,
  save,
  findOneByOrganizationId
} from './services/organization'

config()

const resolvers = {
  Query: {
    async getEmbedCode(_, { organizationId }) {
      const organization = await findOneByOrganizationId(organizationId)
      if (!organization)
        throw Error('Organization not found')

      return getEmbedCode(organization)
    },
    async isPartnerRegistered(_, { organizationId }) {
      return await isPartnerRegistered(organizationId)
    }
  },

  Mutation: {
    async register(_, { organization }) {
      return await save(organization)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: ['./schema.graphql'],
  resolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
