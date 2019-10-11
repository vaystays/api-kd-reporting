import { organizations } from '../infrastructure/db'

export const save = async (organization) => organizations.insert(organization)
