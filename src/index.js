import LocalStorage from './LocalStorage'
import SessionStorage from './SessionStorage'

export { LocalStorage };
export { SessionStorage };

const StorageManager = {
  local: LocalStorage,
  session: SessionStorage
}

export default StorageManager