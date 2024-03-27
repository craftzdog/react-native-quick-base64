import {expect} from 'chai';
import {
  byteLength,
  fromByteArray,
  toByteArray,
} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';
import {mapArr, mapStr} from './util';

const checks: string[] = ['1ugyipX-Ka_Nwwl3uSUe-7IZAigH9rFLs0aVtrS9uT4'];

// from base64-js library's test suite
describe('node-crypto', () => {
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i] as string;
    it(`convert to base64 and back: '${check}'`, async () => {
      const b64Str = fromByteArray(
        mapStr(check, (char: string) => char.charCodeAt(0)),
      );
      console.log('node crypto x:', b64Str);
      const arr = toByteArray(b64Str);
      const str = mapArr(arr, (byte: number) => String.fromCharCode(byte));
      expect(str).to.equal(check);
      expect(byteLength(b64Str)).to.equal(arr.length);
    });
  }
});
