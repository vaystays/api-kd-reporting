import {
  getSessionToken,
  getSessionInformation,
  isPartnerReady,
  isPartnerRegistered
} from '../src/infrastructure/kdd-client'

test(`Session: Get token`, async () => {
  const token = await getSessionToken()
  expect(token.length).toBeGreaterThanOrEqual(1)
})

test(`Session: Get Session Information`, async () => {
  const { name } = await getSessionInformation()
  expect(name).toBe('Direct')
})

test(`isPartnerReady should fail with a bogus partner id`, async () => {
  const { isReady } = await isPartnerReady(1234)
  expect(isReady).toBeFalsy()
})

test(`isPartnerRegistered should fail with a bogus partner id`, async () => {
  const result = await isPartnerRegistered(1234)
  expect(result).toBeFalsy()
})


