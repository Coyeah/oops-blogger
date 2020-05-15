'use strict';
module.exports = function (
  func,
  ...args
) {
  return new Promise((resolve, reject) => {
    func(...args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};