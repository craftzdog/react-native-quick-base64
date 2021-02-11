/* global performance */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import jsBase64 from 'base64-js';
import * as cppBase64 from 'react-native-quick-base64';
import { data } from './image.json';

const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

export default function App() {
  const [processingJSBase64, setProcessingJSBase64] = useState<boolean>(false);
  const [jsBase64Result, setJSBase64Result] = useState<number>(0);
  const [processingNativeBase64, setProcessingNativeBase64] = useState<boolean>(
    false
  );
  const [nativeBase64Result, setNativeBase64Result] = useState<number>(0);

  useEffect(() => {
    const jsb64 = require('base-64');
    const binaryString = cppBase64.atob(data);
    const binaryString2 = jsb64.decode(data);
    const b64 = cppBase64.btoa(binaryString);
    if (binaryString !== binaryString2)
      throw new Error('Failed to decode base64');
    if (b64 !== data) throw new Error('Failed to encode back to base64');
  }, []);

  const handleNativeBase64Press = async () => {
    setProcessingNativeBase64(true);
    let dataToProcess = data;
    await sleep(1);
    const startTime = performance.now();

    for (let iter = 0; iter < 30; iter++) {
      const decoded = cppBase64.toByteArray(dataToProcess);
      dataToProcess = cppBase64.fromByteArray(decoded);
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Base64 in C++</Text>
      <Text style={styles.result}>
        {nativeBase64Result > 0 ? nativeBase64Result + `milliseconds` : ''}
      </Text>
      <Pressable onPress={handleNativeBase64Press} style={styles.button}>
        <Text>
          {processingNativeBase64 ? `Processing..` : 'Perform a benchmark test'}
        </Text>
      </Pressable>

      <Text style={styles.heading}>base64-js</Text>
      <Text style={styles.result}>
        {jsBase64Result > 0 ? jsBase64Result + ` milliseconds` : ''}
      </Text>
      <Pressable onPress={handleJSBase64Press} style={styles.button}>
        <Text>
          {processingJSBase64 ? `Processing..` : 'Perform a benchmark test'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  heading: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  result: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: { backgroundColor: 'skyblue', padding: 12 },
});
