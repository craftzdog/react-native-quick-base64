import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useRunTests } from './useRunTests'
import { useTestList } from './useTestList'
import { TestItem } from './TestItem'

const Tests = () => {
  let totalCount = 0
  const tests = useTestList()
  const [results, runTests, running] = useRunTests()

  // TODO: maybe run upon button click?
  useEffect(
    () => runTests(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.labelName, styles.label]} numberOfLines={1}>
          name
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          pass
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          fail
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          total
        </Text>
      </View>
      <View>
        {Object.entries(tests).map(([suiteName, suite], index) => {
          totalCount += suite.count
          return (
            <TestItem
              key={index.toString()}
              description={suiteName}
              count={suite.count}
              results={results[suiteName]?.results || []}
            />
          )
        })}
      </View>
      <View style={styles.footer}>
        <View>{running && <ActivityIndicator size={'small'} />}</View>
        <View style={styles.footerItem}>
          <Text style={styles.totalCount}>{totalCount}</Text>
        </View>
      </View>
    </View>
  )
}

export default Tests

const styles = StyleSheet.create({
  header: {
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
  labelName: {
    flex: 8
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999'
  },
  footer: {
    width: '100%',
    flexDirection: 'row'
  },
  footerItem: {
    flex: 1,
    alignItems: 'flex-end'
  },
  totalCount: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 5
  }
})
