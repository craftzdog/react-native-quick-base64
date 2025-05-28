import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import type { TestResult } from './types'

type TestItemProps = {
  description: string
  count: number
  results: TestResult[]
}

export const TestItem: React.FC<TestItemProps> = ({
  description,
  count,
  results
}: TestItemProps) => {
  // get pass/fail stats from results
  let pass = 0
  let fail = 0
  results.map((r: TestResult) => {
    if (r.type === 'correct') {
      pass++
    }
    if (r.type === 'incorrect') {
      fail++
    }
  })

  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={1}>
        {description}
      </Text>
      <Text style={[styles.pass, styles.count]} numberOfLines={1}>
        {pass || ''}
      </Text>
      <Text style={[styles.fail, styles.count]} numberOfLines={1}>
        {fail || ''}
      </Text>
      <Text style={styles.count} numberOfLines={1}>
        {count}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  label: {
    fontSize: 12,
    flex: 8
  },
  pass: {
    color: 'green',
    fontWeight: 'bold'
  },
  fail: {
    color: 'red',
    fontWeight: 'bold'
  },
  count: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold'
  }
})
