import LocalStorage from './LocalStorage'
import SessionStorage from './SessionStorage'

const BaseStorage = (storageType) => {
  return [`${storageType}Storage`]
}

export default BaseStorage
