import chai, { expect } from 'chai';
import asPromised from 'chai-as-promised';
chai.use(asPromised);

/**
 * Creates a test with assertions to check for null, undefined, and empty values
 *
 * @param  {*}        val   value under test
 * @param  {Boolean}  async `optional` pass true if testing a promise resolution
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

    it('not an empty object / array', () => {
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
 */
export function testSet([description, testVal, expected], func) {
  describe(description, () => {
    const result = func(testVal)

    it(`should return ${expected}`, () => {
      expect(result).to.equal(expected)
    })
  })
}
