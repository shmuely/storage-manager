const StorageHelper = {
    DATA_UNIQUE_KEY: '__StorageManager__DATA',
    TTL_UNIQUE_KEY: '__StorageManager__TTL',
    set(storageType, key, value, options, innerSet) {
        if (!key || !value) { throw new Error("StorageManager -> Can't set without a key or value") }
        options = options || {}
        innerSet = innerSet || false
        !innerSet && this.remove(storageType, key)
        this.updateData(storageType, key, value)
        this.updateTTL(storageType, options, key)
    },
    get(storageType, key, innerGet, fromTTL) {
        if (!key) { throw new Error('Key property cannot be null or undefined') }
        if (!innerGet) {
            this.clearExpiredKeys(storageType)
            this.handleTTL(storageType, key)
        }
        const section = fromTTL ? this.TTL_UNIQUE_KEY : this.DATA_UNIQUE_KEY;
        const currentObject = JSON.parse(window[`${storageType}Storage`].getItem(section) || {});
        return currentObject[key];
    },
    remove(storageType, key) {
        [this.TTL_UNIQUE_KEY, this.DATA_UNIQUE_KEY].forEach(keyName => {
            const storageObject = window[`${storageType}Storage`].getItem(keyName) || '{}';
            const currentObject = JSON.parse(storageObject)
            delete currentObject[key]
            window[`${storageType}Storage`].setItem(keyName, JSON.stringify(currentObject))
        })
    },
    clearAll(storageType) {
        [this.DATA_UNIQUE_KEY, this.TTL_UNIQUE_KEY].forEach(key => window[`${storageType}Storage`].setItem(key, '{}'))
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
            const currentTTLStorage = JSON.parse(window[`${storageType}Storage`].getItem(this.TTL_UNIQUE_KEY))
            currentTTLStorage[key] = ttlObject;
            window[`${storageType}Storage`].setItem(this.TTL_UNIQUE_KEY, JSON.stringify(currentTTLStorage))
        }
    },
    initTTLDate(storageType, key) {
        const result = {
            calculatedTTLMilliseconds: null,
            ttlOptions: null,
            now: new Date().getTime()
        }
        try {
            const { calculatedTTL, ttlOptions } = this.get(storageType, key, true, true)
            result.calculatedTTLMilliseconds = calculatedTTL
            result.ttlOptions = ttlOptions
        } catch (ex) {
            result.calculatedTTLMilliseconds = (result.now - 1)
        }
        return result
    },
    updateData(storageType, key, value) {
        const oldValue = JSON.parse(window[`${storageType}Storage`].getItem(this.DATA_UNIQUE_KEY));
        const newValue = Object.assign({}, oldValue, { [key]: value })
        window[`${storageType}Storage`].setItem(this.DATA_UNIQUE_KEY, JSON.stringify(newValue))
    },
    updateTTL(storageType, options, key){
        const oldValue = JSON.parse(window[`${storageType}Storage`].getItem(this.TTL_UNIQUE_KEY))
        const newValue = Object.assign({}, oldValue, { [key]: { calculatedTTL: this.getCalculatedTTL(storageType, options), ttlOptions: options }})
        window[`${storageType}Storage`].setItem(this.TTL_UNIQUE_KEY, JSON.stringify(newValue))
    },
    getCalculatedTTL(storageType, { milliseconds, seconds, minutes, hours, days } = {}) {
        let calculatedTTLResult = 0
        if (milliseconds) { calculatedTTLResult += milliseconds }
        if (seconds) { calculatedTTLResult += (seconds * 1000) }
        if (minutes) { calculatedTTLResult += (minutes * 60 * 1000) }
        if (hours) { calculatedTTLResult += (hours * 60 * 60 * 1000) }
        if (days) { calculatedTTLResult += (days * 24 * 60 * 60 * 1000) }
        if (calculatedTTLResult) { calculatedTTLResult += new Date().getTime() }
        return calculatedTTLResult || 'forever'
    },
    clearExpiredKeys(storageType) {
        const keys = Object.keys(window[`${storageType}Storage`].getItem(this.DATA_UNIQUE_KEY))
        keys.forEach(key => {
            const initTTLDate = this.initTTLDate(storageType, key)
            if (initTTLDate.now > initTTLDate.calculatedTTLMilliseconds) {
                this.remove(storageType, key)
            }
        })
    },
}
export default StorageHelper