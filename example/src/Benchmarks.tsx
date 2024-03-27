/* global performance */
import React from 'react';
import {useState} from 'react';
import {StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import jsBase64 from 'base64-js';
import {toByteArray, fromByteArray} from 'react-native-quick-base64';
import {data} from './image.json';

const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, t));

const round = (num: number, decimalPlaces = 0): string => {
  return num.toFixed(decimalPlaces);
};

const Benchmarks = () => {
  const [processingJSBase64, setProcessingJSBase64] = useState<boolean>(false);
  const [jsBase64Result, setJSBase64Result] = useState<number>(0);
  const [processingNativeBase64, setProcessingNativeBase64] =
    useState<boolean>(false);
  const [nativeBase64Result, setNativeBase64Result] = useState<number>(0);

  const handleNativeBase64Press = async () => {
    setProcessingNativeBase64(true);
    let dataToProcess = data;
    await sleep(1);
    const startTime = performance.now();

    for (let iter = 0; iter < 30; iter++) {
      const decoded = toByteArray(dataToProcess);
      dataToProcess = fromByteArray(decoded);
      if (dataToProcess !== data) {
        throw new Error('Data does not match');
      }
    }
    const finishedTime = performance.now();
    console.log('done! took', finishedTime - startTime, 'milliseconds');
    setNativeBase64Result(finishedTime - startTime);
    setProcessingNativeBase64(false);
  };

  const handleJSBase64Press = async () => {
    setProcessingJSBase64(true);
    let dataToProcess = data;
    await sleep(1);
    const startTime = performance.now();

    for (let iter = 0; iter < 30; iter++) {
      const decoded = jsBase64.toByteArray(dataToProcess);
      dataToProcess = jsBase64.fromByteArray(decoded);
    }
    const finishedTime = performance.now();
    console.log('done! took', finishedTime - startTime, 'milliseconds');
    setJSBase64Result(finishedTime - startTime);
    setProcessingJSBase64(false);
  };
  const speedup =
    jsBase64Result && nativeBase64Result
      ? round(jsBase64Result / nativeBase64Result) + 'x faster'
      : ' ';

  return (
    <View>
      <View style={styles.lib}>
        <Text style={styles.heading}>Base64 in C++</Text>
        <Text style={styles.result}>
          {nativeBase64Result > 0
            ? `${round(nativeBase64Result, 6)} milliseconds`
            : ''}
        </Text>
      </View>

      <View style={styles.lib}>
        <Text style={styles.heading}>base64-js</Text>
        <Text style={styles.result}>
          {jsBase64Result > 0 ? `${round(jsBase64Result, 6)} milliseconds` : ''}
        </Text>
      </View>

      <Text style={styles.speedup}>{speedup}</Text>

      <Pressable
        onPress={() => {
          handleNativeBase64Press();
          handleJSBase64Press();
        }}
        style={styles.button}>
        <Text style={styles.pressable}>
          {processingNativeBase64 || processingJSBase64
            ? 'Processing...'
            : 'Run Benchmarks'}
        </Text>
      </Pressable>
    </View>
  );
};

export default Benchmarks;

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  lib: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 14,
    marginVertical: 5,
  },
  pressable: {
    textAlign: 'center',
  },
  result: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: 5,
  },
  button: {backgroundColor: 'skyblue', padding: 12},
  speedup: {
    marginVertical: 5,
    fontSize: 18,
    textAlign: 'center',
  },
});
