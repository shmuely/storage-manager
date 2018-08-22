const StorageHelper = {
  set(storageType, key, value, options, innerSet) {
    if (key === undefined || key === null || value === undefined || value === null) {
      throw new Error("StorageManager -> Can't set without a key or value")
    }
    options = options || {}
    innerSet = innerSet || false
    !innerSet && this.remove(storageType, key)
    window[`${storageType}Storage`].setItem(this.getTTLKey(storageType, key), JSON.stringify({ calculatedTTL: this.getCalculatedTTL(storageType, options), ttlOptions: options }))
    return window[`${storageType}Storage`].setItem(`${this.getTTLKey(storageType, key)}__VALUE`, JSON.stringify(value))
  },
  get(storageType, key, innerGet) {
    if (!key) { return undefined }
    if (!innerGet) {
      this.clearExpiredKeys(storageType, Object.keys(window[`${storageType}Storage`]).filter(item => !item.includes('__StorageManager__')))
      this.handleTTL(storageType, key)
      key = `${this.getTTLKey(storageType, key)}__VALUE`
    }
    let result = window[`${storageType}Storage`].getItem(key)
    try {
      result = JSON.parse(result)
    } catch (ex) { }
    return result
  },
  remove(storageType, key) {
    window[`${storageType}Storage`].removeItem(this.getTTLKey(storageType, key))
    return window[`${storageType}Storage`].removeItem(`${this.getTTLKey(storageType, key)}__VALUE`)
  },
  clearAll(storageType) {
    return window[`${storageType}Storage`].clear()
  },
  handleTTL(storageType, key) {
    const initTTLDate = this.initTTLDate(storageType, key)
    if (initTTLDate.calculatedTTLMilliseconds === 'forever') {
      return
    }
    if (initTTLDate.now > initTTLDate.calculatedTTLMilliseconds) {
      this.remove(storageType, key)
      return
    }
    const refreshTTL = (initTTLDate.ttlOptions.refreshTTL === false ? initTTLDate.ttlOptions.refreshTTL : true)
    if (initTTLDate.ttlOptions && refreshTTL) {
      const ttlObject = {
        calculatedTTL: this.getCalculatedTTL(storageType, initTTLDate.ttlOptions),
        ttlOptions: initTTLDate.ttlOptions
      }
      window[`${storageType}Storage`].setItem(this.getTTLKey(storageType, key), JSON.stringify(ttlObject))
    }
  },
  initTTLDate(storageType, key) {
    const result = {
      calculatedTTLMilliseconds: null,
      ttlOptions: null,
      now: new Date().getTime()
    }
    try {
      const ttlObject = this.get(storageType, this.getTTLKey(storageType, key), true)
      result.calculatedTTLMilliseconds = ttlObject.calculatedTTL
      result.ttlOptions = ttlObject.ttlOptions
    } catch (ex) {
      result.calculatedTTLMilliseconds = (result.now - 1)
    }
    return result
  },
  getTTLKey(storageType, key) {
    return (`__StorageManager__${key}__TTL`)
  },
  getCalculatedTTL(storageType, ttl) {
    let calculatedTTLResult = 0
    if (ttl.milliseconds) { calculatedTTLResult += ttl.milliseconds }
    if (ttl.seconds) { calculatedTTLResult += (ttl.seconds * 1000) }
    if (ttl.minutes) { calculatedTTLResult += (ttl.minutes * 60 * 1000) }
    if (ttl.hours) { calculatedTTLResult += (ttl.hours * 60 * 60 * 1000) }
    if (ttl.days) { calculatedTTLResult += (ttl.days * 24 * 60 * 60 * 1000) }
    if (calculatedTTLResult) { calculatedTTLResult += new Date().getTime() }
    return calculatedTTLResult || 'forever'
  },
  clearExpiredKeys(storageType, keys) {
    keys.forEach(key => {
      const initTTLDate = this.initTTLDate(storageType, key)
      if (initTTLDate.now > initTTLDate.calculatedTTLMilliseconds) {
        this.remove(storageType, key)
      }
    })
  }
}

export default StorageHelper
