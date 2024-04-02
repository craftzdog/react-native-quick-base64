import {expect} from 'chai';
import {atob, btoa, getNative} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';
import {data} from '../image.json';

describe('basics', () => {
  it('check native code availability', async () => {
    const {base64FromArrayBuffer, base64ToArrayBuffer} = getNative();
    expect(base64FromArrayBuffer).to.not.be.undefined;
    expect(base64ToArrayBuffer).to.not.be.undefined;
  });

  it('check decoding/encoding', async () => {
    const jsb64 = require('base-64');
    const binaryString = atob(data);
    const binaryString2 = jsb64.decode(data);
    const b64 = btoa(binaryString);
    expect(binaryString).to.equal(binaryString2, 'Failed to decode base64');
    expect(b64).to.equal(data, 'Failed to encode back to base64');
  });
});
