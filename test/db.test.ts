import { organizations } from '../src/infrastructure/db'

test(`DB: Organizations are loaded`, async () => {
  const results = await organizations.find()
  expect(results.length).toBeGreaterThanOrEqual(0)
})
