import {expect} from 'chai';
import {
  byteLength,
  fromByteArray,
  toByteArray,
} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';

// from base64-js library's test suite
describe('big data', () => {
  it('convert big data to base64', async () => {
    const big = new Uint8Array(64 * 1024 * 1024);
    for (let i = 0, length = big.length; i < length; ++i) {
      big[i] = i % 256;
    }
    const b64str = fromByteArray(big);
    const arr = toByteArray(b64str);
    expect(equal(arr, big)).to.be.true;
    expect(byteLength(b64str)).to.equal(arr.length);
  });
});

const equal = (a: Uint8Array, b: Uint8Array): boolean => {
  let i: number;
  const length = a.length;
  if (length !== b.length) {
    return false;
  }
  for (i = 0; i < length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
