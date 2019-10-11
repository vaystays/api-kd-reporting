import { save, getEmbedCode, IDbOrganization, IOrganization, IBasicOrganization } from '../../src/services/organization'
import { organizations } from '../../src/infrastructure/db'
import uuid from 'uuid'

test(`save: with valid information`, async () => {
  const id = uuid()
  const organization: IBasicOrganization = {
    countryCode: 'US',
    email: `test-${id}@directsoftware.com`,
    firstName: 'Test First Name',
    lastName: 'Test Last Name',
    id,
    name: 'Test Name'
  }

  const result = await save(organization)
  expect(result.kdUserId).toBeTruthy()
})

test(`getEmbedCode: with valid parameters`, async () => {
  const organization = await organizations.findOne<IDbOrganization>()
  expect(organization.kdUserId).toBeTruthy()

  const response = await getEmbedCode(organization)
  console.log(response)
  expect(response.length).toBeGreaterThan(0)
})

