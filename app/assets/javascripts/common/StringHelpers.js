var _ = require('underscore');

var StringHelpers = {
  clean: function (str, mode = 'NXQL') {
    if (mode == 'NXQL') {
      // Escape single quotes
      str = str.replace(/'/g, "\\'");
    }

    return str;
  }
}

module.exports = StringHelpers;