import { curry } from 'ramda'
import chai, { expect } from 'chai'
import asPromised from 'chai-as-promised'
chai.use(asPromised)

/**
 * Curryable function to check primitive type equality
 *
 * @param  {String} type  primitive type to check for
 * @param  {*}      val   value of any type
 * @return {undefined}
 */
const shouldBeA = curry(
  (type, val) => {
    it(`should be an ${type}`, () => {
      expect(val).to.be.an(type)
    })
  }
)

/**
 * Curryable function to check that val is not of a given falsey type
 *
 * @param  {String}   falseyType  a supported mocha functinon of `not.be...`
 * @param  {*}        value under test
 * @return {undefined}
 */
const shouldNotBeFalseyFamily = curry(
  (falseyType, isPromise, val) => {
    it(`should not be ${falseyType}`, () => {
      if (isPromise) {
        expect(val).to.eventually.not.be[falseyType]
      } else {
        expect(val).to.not.be[falseyType]
      }
    })
  }
)

/**
 * Curryable function to check that val is of a given falsey type
 *
 * @param  {String}   falseyType  a supported mocha functinon of `not.be...`
 * @param  {*}        value under test
 * @return {undefined}
 */
const shouldBeFalseyFamily = curry(
  (falseyType, isPromise, val) => {
    it(`should be ${falseyType}`, () => {
      if (isPromise) {
        expect(val).to.eventually.be[falseyType]
      } else {
        expect(val).to.be[falseyType]
      }
    })
  }
)

/**
 * Returns a function that return the result of invoking the given function
 * with the given value
 *
 * @param  {Function} func  function to invoke`
 * @param  {*}        val   value to invoke the function with
 * @return {Function}
 */
const invoke = (func, val) => () => func(val);

/**
 * Curryable function to check whether a function given a certain value
 * will throw a certain error.
 *
 * Can be partially applied in order to check multiple error types
 * or multiple arguments with a more concise syntax
 *
 * @param  {Function} func  function to invoke
 * @param  {*}        val   arg to invoke function with
 * @param  {Error}    err   error type like 'RefereceError' or 'TypeError'
 * @return {undefined}
 */
export const shouldThrow = curry(
  (func, val, err) => {
    it(`should throw an ${err} error`, () => {
      expect(invoke(func, val)).to.throw(err)
    });
  }
)

/**
 * Curryable function to check whether a function given a certain value
 * will NOT throw a certain error.
 *
 * Can be partially applied in order to check multiple error types
 * or multiple arguments with a more concise syntax
 *
 * @param  {Function} func  function to invoke
 * @param  {*}        val   arg to invoke function with
 * @return {undefined}
 */
export const shouldNotThrow = curry(
  (func, val) => {
    it(`should not throw an error`, () => {
      expect(invoke(func, val)).to.not.throw()
    });
  }
)

/**
* Curryable function to check equality against any value
*
* @param  {*}  testVal value to check against
* @param  {*}  val     value to check
* @return {undefined}
*/
export const shouldEqual = curry(
  (testVal, val) => {
    it(`should equal ${testVal}`, () => {
      expect(val).to.equal(testVal)
    })
  }
)

export const shouldBeTrue = shouldEqual(true);
export const shouldBeFalse = shouldEqual(false);

export const shouldBeABoolean = shouldBeA('boolean')
export const shouldBeADate = shouldBeA('date')
export const shouldBeAFunction = shouldBeA('function')
export const shouldBeAnArray = shouldBeA('array')
export const shouldBeAnError = shouldBeA('error')
export const shouldBeAnObject = shouldBeA('object')
export const shouldBeANumber = shouldBeA('number')
export const shouldBeAString = shouldBeA('string')

export const shouldBeEmpty = shouldBeFalseyFamily('empty', false)
export const shouldBeNull = shouldBeFalseyFamily('null', false)
export const shouldBeUndefined = shouldBeFalseyFamily('undefined', false)
export const shouldNotBeEmpty = shouldNotBeFalseyFamily('empty', false)
export const shouldNotBeNull = shouldNotBeFalseyFamily('null', false)
export const shouldNotBeUndefined = shouldNotBeFalseyFamily('undefined', false)

export const shouldBeEmptyAsync = shouldBeFalseyFamily('empty', true)
export const shouldBeNullAsync = shouldBeFalseyFamily('null', true)
export const shouldBeUndefinedAsync = shouldBeFalseyFamily('undefined', true)
export const shouldNotBeEmptyAsync = shouldNotBeFalseyFamily('empty', true)
export const shouldNotBeNullAsync = shouldNotBeFalseyFamily('null', true)
export const shouldNotBeUndefinedAsync = shouldNotBeFalseyFamily('undefined', true)

/**
 * Creates a test with assertions to check for null, undefined, and empty values
 *
 * @param  {*}        val   value under test
 * @param  {Boolean}  async `optional` pass true if testing a promise resolution
 * @return {undefined}
 */
export function testIfExists(val, async) {
  if (async) {
    shouldNotBeNullAsync(val)
    shouldNotBeUndefinedAsync(val)
    shouldNotBeEmptyAsync(val)
  } else {
    shouldNotBeNull(val)
    shouldNotBeUndefined(val)
    shouldNotBeEmpty(val)
  }
}

/**
 * Curryable function to check that an object has a specific key, or a given list
 * of keys
 *
 * @param  {String / Array} key accepts a string or array of strings/objects
 * @param  {Object}         obj checks for existence / equality of the given keys
 * @return {undefined}
 */
export function shouldHaveKeys(obj, ...keys) {
  keys.forEach(key => {
    it(`should have a ${key} key`, () => {
      expect(obj).to.contain.all.keys(key)
    })
  })
}

/**
 * Runs a test case derived from three primitive values
 *
 * @param  {Function} func                              function under test
 * @param  {Array}    [description, testVal, expected]  destuctured respectively
 * @return {undefined}
 */
export function runCase(func, [description, testVal, expected]) {
  describe(description, () => {
    const result = func(testVal)

    it(`should return ${expected}`, () => {
      expect(result).to.equal(expected)
    })
  })
}

/**
 * Used to express groups of tests as arrays when a number of similar test cases
 * are being written
 *
 * @param  {Function} func  function under test
 * @param  {Array}    cases set of three element tuples strucutred like
 *                          [description, testVal, expected]
 * @return {undefined}
 */
export function testCases(func, ...cases) {
  cases.forEach(testCase => runCase(func, testCase))
}
