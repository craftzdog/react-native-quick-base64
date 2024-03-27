import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Benchmarks from './Benchmarks';
import Tests from './Tests';

// @ts-ignore
const isHermes = () => !!global.HermesInternal;

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>react-native-quick-base64</Text>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Setup</Text>
          <Text>Hermes enabled: {JSON.stringify(isHermes())}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Benchmarks</Text>
          <Benchmarks />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Tests</Text>
          <Tests />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 15,
  },
  section: {
    marginBottom: 18,
  },
  sectionText: {
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});
