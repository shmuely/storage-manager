const LocalStorage = {
  set(key, value, options, innerSet) {
    if (!key || !value) { throw new Error("StorageManager -> Can't set without a key or value") }
    options = options || {}
    innerSet = innerSet || false
    !innerSet && this.remove(key)
    localStorage.setItem(this.getTTLKey(key), JSON.stringify({ calculatedTTL: this.getCalculatedTTL(options), ttlOptions: options }))
    return localStorage.setItem(key, JSON.stringify(value))
  },
  get(key, innerGet) {
    if (!key) { return undefined }
    if (!innerGet) {
      this.clearExpiredKeys(Object.keys(localStorage).filter(item => item.indexOf('__LocalStorage__') !== 0))
      this.handleTTL(key)
    }
    let result = localStorage.getItem(key)
    try {
      result = JSON.parse(result)
    } catch (ex) { }
    return result
  },
  remove(key) {
    localStorage.removeItem(this.getTTLKey(key))
    return localStorage.removeItem(key)
  },
  clearAll() {
    return localStorage.clear()
  },
  handleTTL(key) {
    const initTTLDate = this.initTTLDate(key)
    if (initTTLDate.calculatedTTLMilliseconds === 'forever') {
      return
    }
    if (initTTLDate.now > initTTLDate.calculatedTTLMilliseconds) {
      this.remove(key)
      return
    }
    const refreshTTL = (initTTLDate.ttlOptions.refreshTTL === false ? initTTLDate.ttlOptions.refreshTTL : true)
    if (initTTLDate.ttlOptions && refreshTTL) {
      const ttlObject = {
        calculatedTTL: this.getCalculatedTTL(initTTLDate.ttlOptions),
        ttlOptions: initTTLDate.ttlOptions
      }
      localStorage.setItem(this.getTTLKey(key), JSON.stringify(ttlObject))
    }
  },
  initTTLDate(key) {
    const result = {
      calculatedTTLMilliseconds: null,
      ttlOptions: null,
      now: new Date().getTime()
    }
    try {
      const ttlObject = this.get(this.getTTLKey(key), true)
      result.calculatedTTLMilliseconds = ttlObject.calculatedTTL
      result.ttlOptions = ttlObject.ttlOptions
    } catch (ex) {
      result.calculatedTTLMilliseconds = (result.now - 1)
    }
    return result
  },
  getTTLKey(key) {
    return (`__LocalStorage__${key}__TTL`)
  },
  getCalculatedTTL(ttl) {
    let calculatedTTLResult = 0
    if (ttl.milliseconds) { calculatedTTLResult += ttl.milliseconds }
    if (ttl.seconds) { calculatedTTLResult += (ttl.seconds * 1000) }
    if (ttl.minutes) { calculatedTTLResult += (ttl.minutes * 60 * 1000) }
    if (ttl.hours) { calculatedTTLResult += (ttl.hours * 60 * 60 * 1000) }
    if (ttl.days) { calculatedTTLResult += (ttl.days * 24 * 60 * 60 * 1000) }
    if (calculatedTTLResult) { calculatedTTLResult += new Date().getTime() }
    return calculatedTTLResult || 'forever'
  },
  clearExpiredKeys(keys) {
    keys.forEach(key => {
      const initTTLDate = this.initTTLDate(key)
      if (initTTLDate.now > initTTLDate.calculatedTTLMilliseconds) {
        this.remove(key)
      }
    })
  }
}

export default LocalStorage