import monk, { IObjectID, ICollection, IMonkManager } from 'monk'
import monkDebug from 'monk-middleware-debug'
import monkTimestamps from 'monk-middleware-timestamps'

import { MONGODB_URI } from './env'

export const db: IMonkManager = monk(MONGODB_URI)
db.addMiddleware(monkDebug)
db.addMiddleware(monkTimestamps)

export const organizations: ICollection = db.get('organizations')

export { IObjectID, ICollection, IMonkManager }

