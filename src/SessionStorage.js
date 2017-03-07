import StorageHelper from './StorageHelper'

const SessionStorage = {
  set(key, value, options = {}, innerSet = false) {
    return StorageHelper.set('session', key, value, options)
  },
  get(key, innerGet = false) {
    return StorageHelper.get('session', key, innerGet)
  },
  remove(key) {
    return StorageHelper.remove('session', key)
  },
  clearAll() {
    return StorageHelper.clearAll('session')
  }
}

export default SessionStorage