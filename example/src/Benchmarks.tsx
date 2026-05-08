/* global performance */
import { useState } from 'react'
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native'
import jsBase64 from 'base64-js'
import { toByteArray, fromByteArray } from 'react-native-quick-base64'
import { data } from './image.json'

const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, t))

const round = (num: number, decimalPlaces = 0): string => {
  return num.toFixed(decimalPlaces)
}

const Benchmarks = () => {
  const [processingJSBase64, setProcessingJSBase64] = useState<boolean>(false)
  const [jsBase64Result, setJSBase64Result] = useState<number>(0)
  const [processingNativeBase64, setProcessingNativeBase64] =
    useState<boolean>(false)
  const [nativeBase64Result, setNativeBase64Result] = useState<number>(0)
  const [processingHermes, setProcessingHermes] = useState<boolean>(false)
  const [hermesResult, setHermesResult] = useState<number>(0)
  const ITER_COUNT = 3000

  const handleNativeBase64Press = async () => {
    setProcessingNativeBase64(true)
    let dataToProcess = data
    await sleep(1)
    const startTime = performance.now()

    for (let iter = 0; iter < ITER_COUNT; iter++) {
      const decoded = toByteArray(dataToProcess)
      dataToProcess = fromByteArray(decoded)
      if (dataToProcess !== data) {
        throw new Error('Data does not match')
      }
    }
    const finishedTime = performance.now()
    console.log('done! took', finishedTime - startTime, 'milliseconds')
    setNativeBase64Result(finishedTime - startTime)
    setProcessingNativeBase64(false)
  }

  const handleJSBase64Press = async () => {
    setProcessingJSBase64(true)
    let dataToProcess = data
    await sleep(1)
    const startTime = performance.now()

    for (let iter = 0; iter < ITER_COUNT; iter++) {
      const decoded = jsBase64.toByteArray(dataToProcess)
      dataToProcess = jsBase64.fromByteArray(decoded)
    }
    const finishedTime = performance.now()
    console.log('done! took', finishedTime - startTime, 'milliseconds')
    setJSBase64Result(finishedTime - startTime)
    setProcessingJSBase64(false)
  }

  const handleHermesPress = async () => {
    setProcessingHermes(true)
    let dataToProcess = data
    await sleep(1)
    const startTime = performance.now()

    for (let iter = 0; iter < ITER_COUNT; iter++) {
      const binary = atob(dataToProcess)
      dataToProcess = btoa(binary)
      if (dataToProcess !== data) {
        throw new Error('Data does not match')
      }
    }
    const finishedTime = performance.now()
    console.log('done! took', finishedTime - startTime, 'milliseconds')
    setHermesResult(finishedTime - startTime)
    setProcessingHermes(false)
  }

  const speedupVsJs =
    jsBase64Result && nativeBase64Result
      ? round(jsBase64Result / nativeBase64Result) + 'x vs base64-js'
      : ''
  const speedupVsHermes =
    hermesResult && nativeBase64Result
      ? round(hermesResult / nativeBase64Result) + 'x vs Hermes'
      : ''
  const isProcessing =
    processingNativeBase64 || processingJSBase64 || processingHermes

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

      <View style={styles.lib}>
        <Text style={styles.heading}>Hermes atob/btoa</Text>
        <Text style={styles.result}>
          {hermesResult > 0 ? `${round(hermesResult, 6)} milliseconds` : ''}
        </Text>
      </View>

      <Text style={styles.speedup}>{speedupVsJs}</Text>
      <Text style={styles.speedup}>{speedupVsHermes}</Text>

      <Pressable
        onPress={() => {
          handleNativeBase64Press()
          handleJSBase64Press()
          handleHermesPress()
        }}
        style={styles.button}
      >
        <Text style={styles.pressable}>
          {isProcessing ? 'Processing...' : 'Run Benchmarks'}
        </Text>
      </Pressable>
    </View>
  )
}

export default Benchmarks

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    marginVertical: 20
  },
  lib: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  heading: {
    fontSize: 14,
    marginVertical: 5
  },
  pressable: {
    textAlign: 'center'
  },
  result: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: 5
  },
  button: { backgroundColor: 'skyblue', padding: 12 },
  speedup: {
    marginVertical: 5,
    fontSize: 18,
    textAlign: 'center'
  }
})
