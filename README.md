# storage-manager
Storage Manager module that help you manage your local and session storage
* Support TTL functionality ```{ minutes: 2 }```
* Support multiple values like ```{ minutes: 3, seconds: 30 }```

## Installing
`npm install storage-manager --save`

## Some examples
```js
/**
 * Supported TTL values: { milliseconds, seconds, minutes, hours, days }
 * You can use multiple values like { minutes: 3, seconds: 30 }
 * SessionStorage works the same implementation as LocalStorage
 * */
```

```js
import { LocalStorage } from 'storage-manager';

const options = { minutes: 2 }

// this will update the ttl everytime you'll get the key
LocalStorage.set('some-key', 'some-value', options)

// it will refresh the TTL of this key to it's default value (2 minutes in that case)
LocalStorage.get('some-key')
```

```js
import { LocalStorage } from 'storage-manager';

// it will save the key forever untill you will remove it manually
LocalStorage.set('forever-key', 'some-value')
LocalStorage.remove('forever-key')
```

```js
import { LocalStorage } from 'storage-manager';

// refreshTTL is true by default.
// refreshTTL means that everytime you'll get this key, it will refresh his TTL to what it was before
const options = { minutes: 4, seconds: 30, refreshTTL: false }

LocalStorage.set('some-key', 'some-value', options)
// this will not update the ttl everytime you'll get the key

LocalStorage.get('some-key')
// it will NOT refresh the TTL of this key, this key will stay 4 minutes and 30 seconds
```

```js
import { LocalStorage } from 'storage-manager';

LocalStorage.clearAll() // clear all storage
```
