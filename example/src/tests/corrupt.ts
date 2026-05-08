import { expect } from 'chai'
import { toByteArray } from 'react-native-quick-base64'
import { describe, it } from '../MochaRNAdapter'

// from base64-js library's test suite
describe('corrupt', () => {
  it('padding bytes found inside base64 string', async () => {
    // TC39-compliant: characters after padding '==' are invalid.
    expect(() => toByteArray('SQ==QU0=')).to.throw(
      /Input is not valid base64-encoded data/
    )
  })
})
