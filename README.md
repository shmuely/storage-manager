# storage-manager
Storage Manager module that help you manage your local and session storage
* Support TTL functionality

## Installing
`npm install storage-manager --save`

## Example usage
```js
import { LocalStorage } from 'storage-manager';

LocalStorage.set('some-key', 'some-value', { minutes: 2 })
LocalStorage.get('some-key') // it will refresh the TTL of this key to it's default value (2 minutes in that case)

LocalStorage.set('forever-key', 'some-value') // it will save the key forever untill you will remove it manually
LocalStorage.remove('forever-key')
```
