import BaseStorage from './BaseStorage'

const StorageManager = {
  local: BaseStorage('Local'),
  session: BaseStorage('Session')
}

const LocalStorage = StorageManager.local
const SessionStorage = StorageManager.session

export { LocalStorage }
export { SessionStorage }

export default StorageManager