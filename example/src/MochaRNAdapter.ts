import 'mocha'
import type * as MochaTypes from 'mocha'

export let rootSuite: MochaTypes.Suite
let mochaContext: MochaTypes.Suite
let only = false

export const resetRootSuite = (): void => {
  rootSuite = new Mocha.Suite('') as MochaTypes.Suite
  rootSuite.timeout(30 * 1000) // big-data test can be time-consuming :|
  mochaContext = rootSuite
}

export const it = (
  name: string,
  f: MochaTypes.Func | MochaTypes.AsyncFunc
): void => {
  if (!only) {
    const test = new Mocha.Test(name, f)
    mochaContext.addTest(test)
  }
}

export const describe = (name: string, f: () => void): void => {
  const prevMochaContext = mochaContext
  mochaContext = new Mocha.Suite(name, prevMochaContext.ctx) as MochaTypes.Suite
  prevMochaContext.addSuite(mochaContext)
  f()
  mochaContext = prevMochaContext
}

resetRootSuite()
