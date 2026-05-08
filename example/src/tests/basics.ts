import { expect } from 'chai'
import { toByteArray, fromByteArray } from 'react-native-quick-base64'
import { describe, it } from '../MochaRNAdapter'
import { data } from '../image.json'

describe('basics', () => {
  it('check native code availability', async () => {
    expect(toByteArray).to.not.be.undefined
    expect(fromByteArray).to.not.be.undefined
  })

  it('check decoding/encoding', async () => {
    const jsb64 = require('base-64')
    const bytes = toByteArray(data)
    const binaryString = String.fromCharCode(...Array.from(bytes))
    const binaryString2 = jsb64.decode(data)
    const b64 = fromByteArray(bytes)
    expect(binaryString).to.equal(binaryString2, 'Failed to decode base64')
    expect(b64).to.equal(data, 'Failed to encode back to base64')
  })
})
