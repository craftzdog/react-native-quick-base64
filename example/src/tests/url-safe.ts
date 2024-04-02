import {expect} from 'chai';
import {byteLength, toByteArray} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';

// from base64-js library's test suite
describe('url-safe', () => {
  it('decode url-safe style base64 strings', async () => {
    const expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff];

    let str = '//++/++/++//';
    let actual = toByteArray(str);
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).to.equal(expected[i]);
    }

    expect(byteLength(str)).to.equal(actual.length);

    str = '__--_--_--__';
    actual = toByteArray(str);
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).to.equal(expected[i]);
    }

    expect(actual.length).to.equal(byteLength(str));
  });
});
