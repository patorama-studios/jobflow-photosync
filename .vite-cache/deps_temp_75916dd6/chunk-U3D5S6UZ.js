import {
  require_baseGetTag,
  require_isObjectLike
} from "./chunk-L5AYU3LQ.js";
import {
  __commonJS
} from "./chunk-WOOG5QLI.js";

// node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS({
  "node_modules/lodash/isSymbol.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var symbolTag = "[object Symbol]";
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }
    module.exports = isSymbol;
  }
});

export {
  require_isSymbol
};
//# sourceMappingURL=chunk-U3D5S6UZ.js.map
