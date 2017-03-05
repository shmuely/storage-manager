import LocalStorage from './LocalStorage'
import SessionStorage from './SessionStorage'

const StorageManager = {
  local: LocalStorage,
  session: SessionStorage
}

export { LocalStorage };
export { SessionStorage };

export default StorageManager