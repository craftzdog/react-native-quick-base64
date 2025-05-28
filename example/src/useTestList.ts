import { useEffect, useState } from 'react'
import type * as MochaTypes from 'mocha'
import type { Suites } from '../src/types'
import { rootSuite } from '../src/MochaRNAdapter'

// these imports load the tests into the root suite
import './tests/basics'
import './tests/convert'
import './tests/corrupt'
import './tests/url-safe'
import './tests/linebreaks'
import './tests/zero'
import './tests/big-data'

export const useTestList = (): Suites => {
  const [suites, setSuites] = useState<Suites>({})

  // this sets suites initially
  useEffect(
    () => {
      if (Object.entries(suites).length === 0) {
        setSuites(getInitialSuites())
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return suites
}

const getInitialSuites = (): Suites => {
  let localSuites: Suites = {}

  // interrogate the loaded mocha suites/tests via a temporary runner
  const runner = new Mocha.Runner(rootSuite) as MochaTypes.Runner
  runner.suite.suites.map((s: MochaTypes.Suite) => {
    localSuites[s.title] = { value: false, count: s.total() }
  })

  // return count-enhanced list and totals
  return localSuites
}
