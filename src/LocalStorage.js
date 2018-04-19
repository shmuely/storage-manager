import StorageHelper from './StorageHelper'

const LocalStorage = {
  set(key, value, options = {}) {
    return StorageHelper.set('local', key, value, options)
  },
  get(key, innerGet = false) {
    return StorageHelper.get('local', key, innerGet)
  },
  remove(key) {
    return StorageHelper.remove('local', key)
  },
  clearAll() {
    return StorageHelper.clearAll('local')
  }
}

export default LocalStorage