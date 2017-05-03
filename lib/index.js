"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = gravatary;

var _pnglib = require("pnglib");

var _pnglib2 = _interopRequireDefault(_pnglib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageGen = function () {
  function ImageGen(hash, options) {
    _classCallCheck(this, ImageGen);

    this.defaults = {
      background: [238, 238, 238],
      hash: this.createHashFromString(new Date().toISOString()),
      margin: 0.08,
      size: 128
    };
    this.options = (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" ? options : this.defaults;

    // backward compatibility with old constructor (hash, size, margin)
    if (arguments[1] && typeof arguments[1] === "number") {
      this.options.size = arguments[1];
    }
    if (arguments[2]) {
      this.options.margin = arguments[2];
    }

    this.hash = hash || this.defaults.hash;
    this.background = this.options.background || this.defaults.background;
    this.margin = this.options.margin || this.defaults.margin;
    this.size = this.options.size || this.defaults.size;
  }

  _createClass(ImageGen, [{
    key: "rectangle",
    value: function rectangle(x, y, w, h, color, image) {
      var i = void 0,
          j = void 0;
      for (i = x; i < x + w; i++) {
        for (j = y; j < y + h; j++) {
          image.buffer[image.index(i, j)] = color;
        }
      }
    }

    // adapted from: https://gist.github.com/aemkei/1325937

  }, {
    key: "hsl2rgb",
    value: function hsl2rgb(h, s, b) {
      h *= 6;
      s = [b += s *= b < .5 ? b : 1 - b, b - h % 1 * s * 2, b -= s *= 2, b, b + h % 1 * s, b + s];

      return [s[~~h % 6], // red
      s[(h | 16) % 6], // green
      s[(h | 8) % 6] // blue
      ];
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.render().getBase64();
    }

    // Creates a consistent-length hash from a string

  }, {
    key: "createHashFromString",
    value: function createHashFromString(str) {
      var hash = "0";
      var salt = "identicon";
      var i = void 0;
      var chr = void 0;
      var len = void 0;

      if (!str) {
        return hash;
      }

      str += salt + str; // Better randomization for short inputs.

      for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash.toString();
    }
  }, {
    key: "render",
    value: function render() {
      var hash = this.hash,
          size = this.size,
          baseMargin = Math.floor(size * this.margin),
          cell = Math.floor((size - baseMargin * 2) / 5),
          margin = Math.floor((size - cell * 5) / 2),
          image = new _pnglib2.default(size, size, 256);

      // light-grey background
      var bg = image.color(this.background[0], this.background[1], this.background[2], this.background[3]);

      // foreground is last 7 chars as hue at 50% saturation, 70% brightness
      var rgb = this.hsl2rgb(parseInt(hash.substr(-7), 16) / 0xfffffff, 0.5, 0.7),
          fg = image.color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);

      // the first 15 characters of the hash control the pixels (even/odd)
      // they are drawn down the middle first, then mirrored outwards
      var i = void 0,
          color = void 0;
      for (i = 0; i < 15; i++) {
        color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
        if (i < 5) {
          this.rectangle(2 * cell + margin, i * cell + margin, cell, cell, color, image);
        } else if (i < 10) {
          this.rectangle(1 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
          this.rectangle(3 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
        } else if (i < 15) {
          this.rectangle(0 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
          this.rectangle(4 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
        }
      }

      return image;
    }
  }]);

  return ImageGen;
}();

function gravatary(hash, options) {
  var imageBlob = new ImageGen(hash, options).toString();
  return "data:image/png;base64," + imageBlob;
}