import monk from 'monk'
import monkDebug from 'monk-middleware-debug'
import monkTimestamps from 'monk-middleware-timestamps'

import { MONGODB_URI } from './env'

export const db = monk(MONGODB_URI)
db.addMiddleware(monkDebug)
db.addMiddleware(monkTimestamps)

export const organizations = db.get('organizations')

