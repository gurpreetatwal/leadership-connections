'use strict';

const pairs = {};

/**
 * The following code does some very magical things.
 *
 * It was written over a couple of hours and has gotten to the point where
 * the array that's being iterated over has been optimized out.
 *
 * The code essentially iterates (row-wise) over a virtual 2D array that
 * represents permutations of all the indices of data. The 2D array is
 * structured in such a way that there is a split along a diagonal. Above the
 * diagonal are all the permutations where the first index is less than the
 * second and vice versa for below the diagonal.
 *
 * Example:
 * 01 12 23 34 04
 * 02 13 24 03 14
 * 03 14 02 13 24
 * 04 01 12 23 34
 *
 * In code, this is represented as:
 * [
 *   [ [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ],
 *   [ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 0, 1 ] ],
 *   [ [ 2, 3 ], [ 2, 4 ], [ 0, 2 ], [ 1, 2 ] ],
 *   [ [ 3, 4 ], [ 0, 3 ], [ 1, 3 ], [ 2, 3 ] ],
 *   [ [ 0, 4 ], [ 1, 4 ], [ 2, 4 ], [ 3, 4 ] ]
 * ]
 *
 * As it is iterating over this virtual array, the code uses the pairs of
 * indices to grab two elements from the data array and throws them into a
 * "pairs" array. It continues doing this until there are no more rows
 * or if each index has participated n times in pairs.
 *
 * Was inspired by http://www.cs.utexas.edu/users/djimenez/utsa/cs3343/lecture25.html
 *
 * @param {Array} data - the data to generate pairs for
 * @param {Number} n - number of times each item should participate in a pairing
 * @return {Object}
 */
pairs.generate = function(data, n) {

  const max = data.length - 1;

  let completed = 0;
  const pairs = [];
  const counts = new Array(data.length).fill(0);

  for (let row = 0; completed != data.length && row < max; row++) {

    for (let col = 0; col < data.length; col++) {
      const pivot = max - col;
      let pair;

      if (row < pivot) {
        pair = [col, col + row + 1];
      } else {
        pair = [row - pivot, col];
      }

      if (++counts[pair[0]] === n) {
        completed++;
      }

      if (++counts[pair[1]] === n) {
        completed++;
      }

      pairs.push([
        data[pair[0]],
        data[pair[1]],
      ]);
    }
  }

  return {counts, pairs};

};

module.exports = pairs;
