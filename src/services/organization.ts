import { organizations, IObjectID } from '../infrastructure/db'
import * as client from '../infrastructure/kdd-client'
import { IPartnerRegistrationResponse } from '../infrastructure/kdd-client'

const registerOrganization = async (organization: IBasicOrganization): Promise<any> => {
  const [isRegistered, isReady, reasons] = await isReadyAndRegistered(organization)
  console.log('Registered?:', isRegistered)

  if (!isRegistered && !isReady) {
    if (reasons.length > 0) {
      console.log('KD reasons: ', reasons)
      KeydataRegistrationError.throw(reasons)
    }

    const registrationResult: IPartnerRegistrationResponse = await client.register(organization)
    console.log('KD registration response: ', registrationResult)
    if (registrationResult.succeeded) {
      console.log(registrationResult.result)

      return registrationResult.result
    }
    KeydataRegistrationError.throw(registrationResult.error)
  }
}

const isReadyAndRegistered = async (organization: IBasicOrganization): Promise<[boolean, boolean, any[]]> => {
  const [isPartyReadyResponse, isPartnerRegistered] = await Promise.all([
    client.isPartnerReady(organization.id),
    client.isPartnerRegistered(organization.id)
  ])

  return [isPartnerRegistered, isPartyReadyResponse.isReady, [...isPartyReadyResponse.notReadyReasons]]
}

/**
 * Find One By Organization Id
 * @param id
 *
 * @returns Promise<IDbOrganization>
 */
export const findOneByOrganizationId = async (id: number|any): Promise<IDbOrganization> => organizations.findOne<IDbOrganization>({ id })

/**
 * Saves the organization's information
 * @param {IBasicOrganization} organization
 *
 * @returns Promise<IDbOrganization>
 *
 * @throws KeydataRegistrationError
 */
export const save = async (organization: IBasicOrganization): Promise<IDbOrganization> => {
  console.log(organization)
  const existingOrganization = await findOneByOrganizationId(organization.id)
  console.log(existingOrganization)
  if (existingOrganization) return existingOrganization

  const result = await registerOrganization(organization)
  console.log(result)

  return await organizations.insert<IDbOrganization>({
    ...organization,
    kdUserId: result.pmId,
    isActive: true
  })
}

export const getEmbedCode = async (organization: IBasicOrganization): Promise<string> => {
  const existingOrganization = await findOneByOrganizationId(organization.id)
  if (!existingOrganization) throw Error('Organization not found')

  if (existingOrganization.embedUrl)
    return existingOrganization.embedUrl

  const request = { ...organization, partnerParameters: { orgid: organization.id } }
  const { embedUrl } = await client.getEmbedCode(request, existingOrganization.kdUserId)
  console.log('KD Embeded Response', embedUrl)
  // @TODO fix this code
  // await organizations.findOneAndUpdate(existingOrganization._id,
  //   { $set: { embedUrl: embedUrl } }
  // )

  return embedUrl
}

export interface IBasicOrganization {
  id: number|any,
  name: string,
  countryCode: string,
  firstName: string,
  lastName: string,
  email: string,
}

export interface IOrganization extends IBasicOrganization {
  embedUrl?: string,
  kdUserId: string,
  isActive: boolean
}

export interface IDbOrganization extends IOrganization {
  _id: IObjectID,
  createdAt: Date,
  updatedAt: Date,
}

export class KeydataRegistrationError extends Error {

  public data: any

  constructor(data = {}) {
    super('Keydata Registration Error')
    this.data = data
  }

  static throw(data?) {
    throw new KeydataRegistrationError(data)
  }
}
