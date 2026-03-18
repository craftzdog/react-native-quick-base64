import { expect } from 'chai'
import { toByteArray } from 'react-native-quick-base64'
import { describe, it } from '../MochaRNAdapter'
import { mapArr } from './util'

describe('linebreaks', () => {
  // `one\ntwothree\nfour` encoded as a single continuous base64 stream,
  // then split across two lines (MIME/PEM style line wrapping).
  const str = 'b25lCnR3b3Ro\ncmVlCmZvdXI='

  it('with linebreaks, leave them', () => {
    expect(() => toByteArray(str)).to.throw(
      /Input is not valid base64-encoded data/
    )
  })

  it('with linebreaks, remove them', () => {
    const arr = toByteArray(str, true)
    const actual = mapArr(arr, (byte: number) => String.fromCharCode(byte))
    const expected = 'one\ntwothree\nfour'
    expect(actual).to.equal(expected)
  })
})
