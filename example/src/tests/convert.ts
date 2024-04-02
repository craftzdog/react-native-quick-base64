import {expect} from 'chai';
import {
  byteLength,
  fromByteArray,
  toByteArray,
} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';
import {mapArr, mapStr} from './util';

const checks: string[] = [
  'a',
  'aa',
  'aaa',
  'hi',
  'hi!',
  'hi!!',
  'sup',
  'sup?',
  'sup?!',
];

const data: [number[], string][] = [
  [[0, 0, 0], 'AAAA'],
  [[0, 0, 1], 'AAAB'],
  [[0, 1, -1], 'AAH/'],
  [[1, 1, 1], 'AQEB'],
  [[0, -73, 23], 'ALcX'],
];

// from base64-js library's test suite
describe('convert', () => {
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i] as string;
    it(`convert to base64 and back: '${check}'`, async () => {
      const b64Str = fromByteArray(
        mapStr(check, (char: string) => char.charCodeAt(0)),
      );

      const arr = toByteArray(b64Str);
      const str = mapArr(arr, (byte: number) => String.fromCharCode(byte));
      expect(str).to.equal(check);
      expect(byteLength(b64Str)).to.equal(arr.length);
    });
  }

  for (let i = 0; i < data.length; i++) {
    // @ts-ignore
    it(`convert known data to string: '${data[i][1]}'`, async () => {
      // @ts-ignore
      const bytes = new Uint8Array(data[i][0]);
      // @ts-ignore
      const expected = data[i][1];
      const actual = fromByteArray(bytes);
      expect(actual).to.equal(
        expected,
        'Ensure that ' + bytes + ' serialise to ' + expected,
      );
    });
  }

  for (let i = 0; i < data.length; i++) {
    // @ts-ignore
    it(`convert known data from string: '${data[i][1]}'`, async () => {
      // @ts-ignore
      const expected = new Uint8Array(data[i][0]);
      // @ts-ignore
      const string = data[i][1];
      const actual = toByteArray(string);
      expect(equal(actual, expected)).to.equal(
        true,
        'Ensure that ' + string + ' deserialise to ' + expected,
      );
      const length = byteLength(string);
      expect(length).to.equal(
        expected.length,
        'Ensure that ' + string + ' has byte lentgh of ' + expected.length,
      );
    });
  }
});

const equal = (a: Uint8Array, b: Uint8Array) => {
  let i;
  const length = a.length;
  if (length !== b.length) {
    return false;
  }
  for (i = 0; i < length; ++i) {
    // @ts-ignore
    // eslint-disable-next-line no-bitwise
    if ((a[i] & 0xff) !== (b[i] & 0xff)) {
      return false;
    }
  }
  return true;
};
