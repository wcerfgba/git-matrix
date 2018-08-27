// @flow
var compact, debug, difference, inspect, isEmpty, last, sortBy, trim, union;

({inspect} = require('util'));

({compact, last, difference, isEmpty, trim, union, sortBy} = require('lodash'));

debug = (...xs) => {
  return console.debug(inspect(xs, {
    depth: null
  }));
};

module.exports = {debug, compact, last, difference, isEmpty, trim, union, sortBy};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsic3JjL3V0aWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBOztBQUVBLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBYyxPQUFBLENBQVEsTUFBUixDQUFkOztBQUNBLENBQUEsQ0FBRSxPQUFGLEVBQVcsSUFBWCxFQUFpQixVQUFqQixFQUE2QixPQUE3QixFQUFzQyxJQUF0QyxFQUE0QyxLQUE1QyxFQUFtRCxNQUFuRCxDQUFBLEdBQThELE9BQUEsQ0FBUSxRQUFSLENBQTlEOztBQUVBLEtBQUEsR0FBUSxDQUFBLEdBQUksRUFBSixDQUFBLEdBQUE7U0FBVyxPQUFPLENBQUMsS0FBUixDQUFjLE9BQUEsQ0FBUSxFQUFSLEVBQVk7SUFBRSxLQUFBLEVBQU87RUFBVCxDQUFaLENBQWQ7QUFBWDs7QUFFUixNQUFNLENBQUMsT0FBUCxHQUFpQixDQUNmLEtBRGUsRUFFZixPQUZlLEVBRU4sSUFGTSxFQUVBLFVBRkEsRUFFWSxPQUZaLEVBRXFCLElBRnJCLEVBRTJCLEtBRjNCLEVBRWtDLE1BRmxDIiwic291cmNlc0NvbnRlbnQiOlsiIyBAZmxvd1xuXG57IGluc3BlY3QgfSA9IHJlcXVpcmUgJ3V0aWwnXG57IGNvbXBhY3QsIGxhc3QsIGRpZmZlcmVuY2UsIGlzRW1wdHksIHRyaW0sIHVuaW9uLCBzb3J0QnkgfSA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuZGVidWcgPSAoLi4ueHMpID0+IGNvbnNvbGUuZGVidWcgaW5zcGVjdCB4cywgeyBkZXB0aDogbnVsbCB9XG5cbm1vZHVsZS5leHBvcnRzID0geyBcbiAgZGVidWdcbiAgY29tcGFjdCwgbGFzdCwgZGlmZmVyZW5jZSwgaXNFbXB0eSwgdHJpbSwgdW5pb24sIHNvcnRCeVxufSJdfQ==
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/util.coffee