import { curry } from 'ramda'
import chai, { expect } from 'chai'
import asPromised from 'chai-as-promised'
chai.use(asPromised)

/**
 * Curryable function to reduce boilerplate in other type checkers
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
 * Creates a test with assertions to check for null, undefined, and empty values
 *
 * @param  {*}        val   value under test
 * @param  {Boolean}  async `optional` pass true if testing a promise resolution
 * @return {undefined}
 */
export function testIfExists(val, async) {
  describe('should not return a falsey value', () => {
    it('not null', () => {
      if (async) {
        expect(val).to.eventually.not.be.null
      } else {
        expect(val).to.not.be.null
      }
    })

    it('not undefined', () => {
      if (async) {
        expect(val).to.eventually.not.be.undefined
      } else {
        expect(val).to.not.be.undefined
      }
    })

    it('not an empty object or array', () => {
      if (async) {
        expect(val).to.eventually.not.be.empty
      } else {
        expect(val).to.not.be.empty
      }
    })
  })
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
