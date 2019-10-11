import ky from 'ky-universal'
import {
  KDD_API_URL as BASE_URL,
  KDD_KEY as key,
  KDD_SECRET as secret
} from './env'

interface ISessionInformationResponse {
  uuid: string,
  name: string,
  dataProviderId: string
}

interface IPartnerIsReadyResponse {
  isReady: boolean,
  notReadyReasons: [any]
}

interface IPartnerRegistrationResponse {
  result: { pmId: string },
  succeeded: boolean,
  validationErrors: [any],
  error: any
}

const api = ky.create({
  prefixUrl: `${BASE_URL}/api`,
  credentials: 'omit',
  hooks: {
    beforeRequest: [
      async (input, options: any) => {
        const token = await getSessionToken()
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    ]
  }
})

export const getSessionToken = async (): Promise<string> => {
  const json = { key, secret }
  const { token } = await ky
    .post(`${BASE_URL}/api/account/auth/token`, {
      json
    })
    .json()
  return token
}

export const getSessionInformation = async (): Promise<ISessionInformationResponse> => {
  return await api.get(`session`).json()
}

export const isPartnerReady = async (organizationId): Promise<IPartnerIsReadyResponse> => {
  const json = { partnerParameters: { orgid: organizationId } }
  return api.post('partner/isready', { json }).json()
}

export const isPartnerRegistered = async (organizationId: number): Promise<boolean> => {
  const json = { partnerParameters: { orgid: organizationId } }
  const { isRegistered } = await api.post('partner/isregistered', { json }).json()
  return isRegistered
}

export const register = async (organization: any = {}): Promise<IPartnerRegistrationResponse> => {
  const json = {
    name: organization.name,
    countryCode: organization.countryCode,
    primaryContactEmail: organization.email,
    postalCodes: [],
    partnerParameters: { orgid: organization.id }
  }
  return await api.post('partner/register', { json }).json()
}
