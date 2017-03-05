import test from 'ava'
import LocalStorage from '../src/index'

test('LocalStorage exists', t => {
  if (LocalStorage) {
    t.pass()
  } else {
    t.fail()
  }
})
