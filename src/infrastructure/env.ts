import Env from 'dotenv'

export const config = () => Env.config()

config()

export const KDD_API_URL = process.env.KDD_API_URL
export const KDD_KEY = process.env.KDD_KEY
export const KDD_SECRET = process.env.KDD_SECRET
export const MONGODB_URI = process.env.MONGODB_URI
