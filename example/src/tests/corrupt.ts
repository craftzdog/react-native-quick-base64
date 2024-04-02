import {expect} from 'chai';
import {byteLength, toByteArray} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';

// from base64-js library's test suite
describe('corrupt', () => {
  it('padding bytes found inside base64 string', async () => {
    // See https://github.com/beatgammit/base64-js/issues/42 for discussion.
    // This lib uses a C++ lib that doesn't abort like 'base64-js' does.
    const str = 'SQ==QU0=';
    const b64 = toByteArray(str);
    expect(b64).to.deep.equal(new Uint8Array([73, 65, 77]));
    expect(byteLength(str)).to.equal(1);
  });
});
