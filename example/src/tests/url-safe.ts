import {expect} from 'chai';
import {
  byteLength,
  fromByteArray,
  toByteArray,
  trimBase64Padding,
} from 'react-native-quick-base64';
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

  // test vector string comes from
  // https://gist.github.com/pedrouid/b4056fd1f754918ddae86b32cf7d803e#aes-gcm---importkey
  it('encode/decode base64url string w padding', async () => {
    const expected = 'Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE';
    const ba = toByteArray(expected);
    const actual = fromByteArray(ba, true);
    expect(trimBase64Padding(actual)).to.equal(
      expected,
      'base64 encode (url=true, trimmed)',
    );
    expect(actual).to.equal(
      expected + '.',
      'base64 encode (url=true, not trimmed)',
    );
  });

  it('encode/decode base64 string w padding', async () => {
    const expected = 'Y0zt37HgOx+BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE';
    const ba = toByteArray(expected);
    const actual = fromByteArray(ba, false);
    expect(trimBase64Padding(actual)).to.equal(
      expected,
      'base64 encode (url=false, trimmed)',
    );
    expect(actual).to.equal(
      expected + '=',
      'base64 encode (url=false, not trimmed)',
    );
  });
});
