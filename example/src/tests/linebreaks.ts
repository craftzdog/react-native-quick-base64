import {expect} from 'chai';
import {toByteArray} from 'react-native-quick-base64';
import {describe, it} from '../MochaRNAdapter';
import {mapArr} from './util';

describe('linebreaks', () => {
  // encoded `one\ntwo\nthree\nfour` in base64 online tool
  const str = 'b25lCnR3bw==\ndGhyZWUKZm91cg==';

  it('with linebreaks, leave them', () => {
    expect(() => toByteArray(str)).to.throw(
      /Input is not valid base64-encoded data/,
    );
  });

  it('with linebreaks, remove them', () => {
    const arr = toByteArray(str, true);
    const actual = mapArr(arr, (byte: number) => String.fromCharCode(byte));
    const expected = 'one\ntwothree\nfour';
    expect(actual).to.equal(expected);
  });
});
