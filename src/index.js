import { curry } from 'ramda'
import chai, { expect } from 'chai'
import asPromised from 'chai-as-promised'
chai.use(asPromised)

/**
 * Curryable function to check primitive equality
 *
 * @param  {String} type  primitive type to check for
 * @param  {*}      val   value of any type
 * @return {undefined}
 */
const primitiveEquals = curry(
  (type, val) => {
    it(`should be an ${type}`, () => {
      expect(val).to.be.an(type)
    })
  }
)

export const shouldBeAnObject = primitiveEquals('object')
export const shouldBeAnArray = primitiveEquals('array')
export const shouldBeAString = primitiveEquals('string')
export const shouldBeANumber = primitiveEquals('number')
export const shouldBeAnError = primitiveEquals('error')
export const shouldBeAFunction = primitiveEquals('function')

/**
 * Curryable function to check that val is not of a given falsey type
 *
 * @param  {String}   falseyType  a supported mocha functinon of `not.be...`
 * @param  {*}        value under test
 * @return {undefined}
 */
const shouldNotBe = curry(
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

export const shouldNotBeUndefined = shouldNotBe('undefined', false)
export const shouldNotBeNull = shouldNotBe('null', false)
export const shouldNotBeEmpty = shouldNotBe('empty', false)

export const shouldNotBeUndefinedAsync = shouldNotBe('undefined', true)
export const shouldNotBeNullAsync = shouldNotBe('null', true)
export const shouldNotBeEmptyAsync = shouldNotBe('empty', true)

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
 * Used to express groups of tests as arrays when a number of similar test cases
 * are being written
 *
 * @param  {Array}    [description, testVal, expected]  destuctured respectively
 * @param  {Function} func                              function under test
 * @return {undefined}
 */
export function testSet([description, testVal, expected], func) {
  describe(description, () => {
    const result = func(testVal)

    it(`should return ${expected}`, () => {
      expect(result).to.equal(expected)
    })
  })
}
