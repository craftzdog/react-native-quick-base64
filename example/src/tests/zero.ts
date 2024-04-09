import {expect} from 'chai';
import {
  byteLength,
  fromByteArray,
  toByteArray,
} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';
import {mapArr, mapStr} from './util';

const checks: string[] = [
  'no zero',
  'contains a \0zero somewhere',
  '\0starts with a zero',
  'ends with a zero\0',
];

describe('zero (\\0)', () => {
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

  const test = (data: Uint8Array, expected: string, descr: string) => {
    it(`known zero values: ${descr}`, async () => {
      const actual = fromByteArray(data);
      expect(actual).to.equal(expected);
    });
  };

  // zero
  const zero = new Uint8Array([122, 101, 114, 111]);
  test(zero, 'emVybw==', 'zero');

  // zer\0
  const zer0 = new Uint8Array([122, 101, 114, 0]);
  test(zer0, 'emVyAA==', 'zer\\0');

  // \0er0
  const ero = new Uint8Array([0, 101, 114, 111]);
  test(ero, 'AGVybw==', '\\0ero');

  // zer\0_value
  const zer0_value = new Uint8Array([
    122, 101, 114, 0, 95, 118, 97, 108, 117, 101,
  ]);
  test(zer0_value, 'emVyAF92YWx1ZQ==', 'zer\\0_value');
});
