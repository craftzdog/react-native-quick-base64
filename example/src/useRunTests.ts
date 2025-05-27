import { useCallback, useState } from 'react'
import 'mocha'
import type * as MochaTypes from 'mocha'
import { rootSuite } from './MochaRNAdapter'
import type { Stats, SuiteResults, TestResult } from './types'

export const useRunTests = (): [SuiteResults, () => void, boolean] => {
  const [results, setResults] = useState<SuiteResults>({})
  const [running, setRunning] = useState<boolean>(false)

  const addResult = useCallback(
    (newResult: TestResult) => {
      setResults((prev: SuiteResults) => {
        if (!prev[newResult.suiteName]) {
          prev[newResult.suiteName] = { results: [] }
        }
        prev[newResult.suiteName]?.results.push(newResult)
        return { ...prev }
      })
    },
    [setResults]
  )

  const defaultStats = {
    start: new Date(),
    end: new Date(),
    duration: 0,
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0
  }

  const run = () => {
    setResults({})
    setRunning(true)

    const {
      EVENT_RUN_BEGIN,
      EVENT_RUN_END,
      EVENT_TEST_FAIL,
      EVENT_TEST_PASS,
      EVENT_TEST_PENDING,
      EVENT_TEST_END,
      EVENT_SUITE_BEGIN,
      EVENT_SUITE_END
    } = Mocha.Runner.constants

    let stats: Stats = { ...defaultStats }

    var runner = new Mocha.Runner(rootSuite) as MochaTypes.Runner
    runner.stats = stats

    runner.suite.suites.map((s: MochaTypes.Suite) => {
      s.tests.map((t: MochaTypes.Test) => {
        // @ts-expect-error - not sure why this is erroring
        t.reset()
      })
    })

    let indents = -1
    const indent = () => Array(indents).join('  ')
    runner
      .once(EVENT_RUN_BEGIN, () => {
        stats.start = new Date()
      })
      .on(EVENT_SUITE_BEGIN, (suite: MochaTypes.Suite) => {
        suite.root || stats.suites++
        indents++
      })
      .on(EVENT_SUITE_END, () => {
        indents--
      })
      .on(EVENT_TEST_PASS, (test: MochaTypes.Runnable) => {
        const name = test.parent?.title || ''
        stats.passes++
        addResult({
          indentation: indents,
          description: test.title,
          suiteName: name,
          type: 'correct'
        })
        console.log(`${indent()}pass: ${test.title}`)
      })
      .on(EVENT_TEST_FAIL, (test: MochaTypes.Runnable, err: Error) => {
        const name = test.parent?.title || ''
        stats.failures++
        addResult({
          indentation: indents,
          description: test.title,
          suiteName: name,
          type: 'incorrect',
          errorMsg: err.message
        })
        console.log(`${indent()}fail: ${test.title} - error: ${err.message}`)
      })
      .on(EVENT_TEST_PENDING, function () {
        stats.pending++
      })
      .on(EVENT_TEST_END, function () {
        stats.tests++
      })
      .once(EVENT_RUN_END, () => {
        stats.end = new Date()
        stats.duration = stats.end.valueOf() - stats.start.valueOf()
        setRunning(false)
        console.log(JSON.stringify(runner.stats, null, 2))
      })

    runner.run()

    return () => {
      console.log('aborting')
      runner.abort()
    }
  }

  return [results, run, running]
}
