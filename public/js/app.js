/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* binding */ afterMain),
/* harmony export */   afterRead: () => (/* binding */ afterRead),
/* harmony export */   afterWrite: () => (/* binding */ afterWrite),
/* harmony export */   auto: () => (/* binding */ auto),
/* harmony export */   basePlacements: () => (/* binding */ basePlacements),
/* harmony export */   beforeMain: () => (/* binding */ beforeMain),
/* harmony export */   beforeRead: () => (/* binding */ beforeRead),
/* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
/* harmony export */   bottom: () => (/* binding */ bottom),
/* harmony export */   clippingParents: () => (/* binding */ clippingParents),
/* harmony export */   end: () => (/* binding */ end),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   main: () => (/* binding */ main),
/* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   popper: () => (/* binding */ popper),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   reference: () => (/* binding */ reference),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   top: () => (/* binding */ top),
/* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
/* harmony export */   viewport: () => (/* binding */ viewport),
/* harmony export */   write: () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   round: () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: () => (/* binding */ within),
/* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ITERATE_KEY: () => (/* binding */ ITERATE_KEY),
/* harmony export */   computed: () => (/* binding */ computed),
/* harmony export */   customRef: () => (/* binding */ customRef),
/* harmony export */   effect: () => (/* binding */ effect),
/* harmony export */   enableTracking: () => (/* binding */ enableTracking),
/* harmony export */   isProxy: () => (/* binding */ isProxy),
/* harmony export */   isReactive: () => (/* binding */ isReactive),
/* harmony export */   isReadonly: () => (/* binding */ isReadonly),
/* harmony export */   isRef: () => (/* binding */ isRef),
/* harmony export */   markRaw: () => (/* binding */ markRaw),
/* harmony export */   pauseTracking: () => (/* binding */ pauseTracking),
/* harmony export */   proxyRefs: () => (/* binding */ proxyRefs),
/* harmony export */   reactive: () => (/* binding */ reactive),
/* harmony export */   readonly: () => (/* binding */ readonly),
/* harmony export */   ref: () => (/* binding */ ref),
/* harmony export */   resetTracking: () => (/* binding */ resetTracking),
/* harmony export */   shallowReactive: () => (/* binding */ shallowReactive),
/* harmony export */   shallowReadonly: () => (/* binding */ shallowReadonly),
/* harmony export */   shallowRef: () => (/* binding */ shallowRef),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   toRaw: () => (/* binding */ toRaw),
/* harmony export */   toRef: () => (/* binding */ toRef),
/* harmony export */   toRefs: () => (/* binding */ toRefs),
/* harmony export */   track: () => (/* binding */ track),
/* harmony export */   trigger: () => (/* binding */ trigger),
/* harmony export */   triggerRef: () => (/* binding */ triggerRef),
/* harmony export */   unref: () => (/* binding */ unref)
/* harmony export */ });
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");


const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol(( true) ? 'iterate' : 0);
const MAP_KEY_ITERATE_KEY = Symbol(( true) ? 'Map key iterate' : 0);
function isEffect(fn) {
    return fn && fn._isEffect === true;
}
function effect(fn, options = _vue_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ) {
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
let uid = 0;
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effect.active) {
            return fn();
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            }
            finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect.allowRecurse = !!options.allowRecurse;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function cleanup(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}
function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (( true) && activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            });
        }
    }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    const effects = new Set();
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect || effect.allowRecurse) {
                    effects.add(effect);
                }
            });
        }
    };
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        switch (type) {
            case "add" /* ADD */:
                if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
                    add(depsMap.get(ITERATE_KEY));
                    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY));
                    }
                }
                else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key)) {
                    // new index added to array -> length changes
                    add(depsMap.get('length'));
                }
                break;
            case "delete" /* DELETE */:
                if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
                    add(depsMap.get(ITERATE_KEY));
                    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY));
                    }
                }
                break;
            case "set" /* SET */:
                if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
                    add(depsMap.get(ITERATE_KEY));
                }
                break;
        }
    }
    const run = (effect) => {
        if (( true) && effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    effects.forEach(run);
}

const isNonTrackableKeys = /*#__PURE__*/ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.makeMap)(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol));
const get = /*#__PURE__*/ createGetter();
const shallowGet = /*#__PURE__*/ createGetter(false, true);
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations();
function createArrayInstrumentations() {
    const instrumentations = {};
    ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
        instrumentations[key] = function (...args) {
            const arr = toRaw(this);
            for (let i = 0, l = this.length; i < l; i++) {
                track(arr, "get" /* GET */, i + '');
            }
            // we run the method using the original args first (which may be reactive)
            const res = arr[key](...args);
            if (res === -1 || res === false) {
                // if that didn't work, run it again using raw values.
                return arr[key](...args.map(toRaw));
            }
            else {
                return res;
            }
        };
    });
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
        instrumentations[key] = function (...args) {
            pauseTracking();
            const res = toRaw(this)[key].apply(this, args);
            resetTracking();
            return res;
        };
    });
    return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* RAW */ &&
            receiver ===
                (isReadonly
                    ? shallow
                        ? shallowReadonlyMap
                        : readonlyMap
                    : shallow
                        ? shallowReactiveMap
                        : reactiveMap).get(target)) {
            return target;
        }
        const targetIsArray = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target);
        if (!isReadonly && targetIsArray && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
        }
        if (!isReadonly) {
            track(target, "get" /* GET */, key);
        }
        if (shallow) {
            return res;
        }
        if (isRef(res)) {
            // ref unwrapping - does not apply for Array + integer key.
            const shouldUnwrap = !targetIsArray || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key);
            return shouldUnwrap ? res.value : res;
        }
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(res)) {
            // Convert returned value into a proxy as well. we do the isObject check
            // here to avoid invalid value warning. Also need to lazy access readonly
            // and reactive here to avoid circular dependency.
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        let oldValue = target[key];
        if (!shallow) {
            value = toRaw(value);
            oldValue = toRaw(oldValue);
            if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key)
            ? Number(key) < target.length
            : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key);
        const result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, "add" /* ADD */, key, value);
            }
            else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue)) {
                trigger(target, "set" /* SET */, key, value, oldValue);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)(key) || !builtInSymbols.has(key)) {
        track(target, "has" /* HAS */, key);
    }
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) ? 'length' : ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        if ((true)) {
            console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    },
    deleteProperty(target, key) {
        if ((true)) {
            console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    }
};
const shallowReactiveHandlers = /*#__PURE__*/ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
});
// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
const shallowReadonlyHandlers = /*#__PURE__*/ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

const toReactive = (value) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) ? reactive(value) : value;
const toReadonly = (value) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) ? readonly(value) : value;
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
    // #1772: readonly(reactive(Map)) should return readonly + reactive version
    // of the value
    target = target["__v_raw" /* RAW */];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        !isReadonly && track(rawTarget, "get" /* GET */, key);
    }
    !isReadonly && track(rawTarget, "get" /* GET */, rawKey);
    const { has } = getProto(rawTarget);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
    }
    else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
    }
    else if (target !== rawTarget) {
        // #3602 readonly(reactive(Map))
        // ensure that the nested reactive `Map` can do tracking for itself
        target.get(key);
    }
}
function has$1(key, isReadonly = false) {
    const target = this["__v_raw" /* RAW */];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        !isReadonly && track(rawTarget, "has" /* HAS */, key);
    }
    !isReadonly && track(rawTarget, "has" /* HAS */, rawKey);
    return key === rawKey
        ? target.has(key)
        : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
    target = target["__v_raw" /* RAW */];
    !isReadonly && track(toRaw(target), "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.get(target, 'size', target);
}
function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
        target.add(value);
        trigger(target, "add" /* ADD */, value, value);
    }
    return this;
}
function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has, get } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else if ((true)) {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get.call(target, key);
    target.set(key, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, key, value);
    }
    else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue)) {
        trigger(target, "set" /* SET */, key, value, oldValue);
    }
    return this;
}
function deleteEntry(key) {
    const target = toRaw(this);
    const { has, get } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else if ((true)) {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get ? get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    const result = target.delete(key);
    if (hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = ( true)
        ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)
            ? new Map(target)
            : new Set(target)
        : 0;
    // forward the operation before queueing reactions
    const result = target.clear();
    if (hadItems) {
        trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
    }
    return result;
}
function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw" /* RAW */];
        const rawTarget = toRaw(target);
        const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
        !isReadonly && track(rawTarget, "iterate" /* ITERATE */, ITERATE_KEY);
        return target.forEach((value, key) => {
            // important: make sure the callback is
            // 1. invoked with the reactive map as `this` and 3rd arg
            // 2. the value received should be a corresponding reactive/readonly.
            return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
    };
}
function createIterableMethod(method, isReadonly, isShallow) {
    return function (...args) {
        const target = this["__v_raw" /* RAW */];
        const rawTarget = toRaw(target);
        const targetIsMap = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(rawTarget);
        const isPair = method === 'entries' || (method === Symbol.iterator && targetIsMap);
        const isKeyOnly = method === 'keys' && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
        !isReadonly &&
            track(rawTarget, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        // return a wrapped iterator which returns observed versions of the
        // values emitted from the real iterator
        return {
            // iterator protocol
            next() {
                const { value, done } = innerIterator.next();
                return done
                    ? { value, done }
                    : {
                        value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                        done
                    };
            },
            // iterable protocol
            [Symbol.iterator]() {
                return this;
            }
        };
    };
}
function createReadonlyMethod(type) {
    return function (...args) {
        if ((true)) {
            const key = args[0] ? `on key "${args[0]}" ` : ``;
            console.warn(`${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.capitalize)(type)} operation ${key}failed: target is readonly.`, toRaw(this));
        }
        return type === "delete" /* DELETE */ ? false : this;
    };
}
function createInstrumentations() {
    const mutableInstrumentations = {
        get(key) {
            return get$1(this, key);
        },
        get size() {
            return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, false)
    };
    const shallowInstrumentations = {
        get(key) {
            return get$1(this, key, false, true);
        },
        get size() {
            return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, true)
    };
    const readonlyInstrumentations = {
        get(key) {
            return get$1(this, key, true);
        },
        get size() {
            return size(this, true);
        },
        has(key) {
            return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add" /* ADD */),
        set: createReadonlyMethod("set" /* SET */),
        delete: createReadonlyMethod("delete" /* DELETE */),
        clear: createReadonlyMethod("clear" /* CLEAR */),
        forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations = {
        get(key) {
            return get$1(this, key, true, true);
        },
        get size() {
            return size(this, true);
        },
        has(key) {
            return has$1.call(this, key, true);
        },
        add: createReadonlyMethod("add" /* ADD */),
        set: createReadonlyMethod("set" /* SET */),
        delete: createReadonlyMethod("delete" /* DELETE */),
        clear: createReadonlyMethod("clear" /* CLEAR */),
        forEach: createForEach(true, true)
    };
    const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
    iteratorMethods.forEach(method => {
        mutableInstrumentations[method] = createIterableMethod(method, false, false);
        readonlyInstrumentations[method] = createIterableMethod(method, true, false);
        shallowInstrumentations[method] = createIterableMethod(method, false, true);
        shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
    });
    return [
        mutableInstrumentations,
        readonlyInstrumentations,
        shallowInstrumentations,
        shallowReadonlyInstrumentations
    ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* #__PURE__*/ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow
        ? isReadonly
            ? shallowReadonlyInstrumentations
            : shallowInstrumentations
        : isReadonly
            ? readonlyInstrumentations
            : mutableInstrumentations;
    return (target, key, receiver) => {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* RAW */) {
            return target;
        }
        return Reflect.get((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(instrumentations, key) && key in target
            ? instrumentations
            : target, key, receiver);
    };
}
const mutableCollectionHandlers = {
    get: /*#__PURE__*/ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
    get: /*#__PURE__*/ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
    get: /*#__PURE__*/ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
    get: /*#__PURE__*/ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
        const type = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.toRawType)(target);
        console.warn(`Reactive ${type} contains both the raw and reactive ` +
            `versions of the same object${type === `Map` ? ` as keys` : ``}, ` +
            `which can lead to inconsistencies. ` +
            `Avoid differentiating between the raw and reactive versions ` +
            `of an object and only use the reactive version if possible.`);
    }
}

const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
    switch (rawType) {
        case 'Object':
        case 'Array':
            return 1 /* COMMON */;
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return 2 /* COLLECTION */;
        default:
            return 0 /* INVALID */;
    }
}
function getTargetType(value) {
    return value["__v_skip" /* SKIP */] || !Object.isExtensible(value)
        ? 0 /* INVALID */
        : targetTypeMap((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.toRawType)(value));
}
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly" /* IS_READONLY */]) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
/**
 * Creates a readonly copy of the original object. Note the returned copy is not
 * made reactive, but `readonly` can be called on an already reactive object.
 */
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(target)) {
        if ((true)) {
            console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target["__v_raw" /* RAW */] &&
        !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
        return target;
    }
    // target already has corresponding Proxy
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // only a whitelist of value types can be observed.
    const targetType = getTargetType(target);
    if (targetType === 0 /* INVALID */) {
        return target;
    }
    const proxy = new Proxy(target, targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* RAW */]);
    }
    return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
}
function isReadonly(value) {
    return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
}
function markRaw(value) {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.def)(value, "__v_skip" /* SKIP */, true);
    return value;
}

const convert = (val) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(val) ? reactive(val) : val;
function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
}
function ref(value) {
    return createRef(value);
}
function shallowRef(value) {
    return createRef(value, true);
}
class RefImpl {
    constructor(value, _shallow = false) {
        this._shallow = _shallow;
        this.__v_isRef = true;
        this._rawValue = _shallow ? value : toRaw(value);
        this._value = _shallow ? value : convert(value);
    }
    get value() {
        track(toRaw(this), "get" /* GET */, 'value');
        return this._value;
    }
    set value(newVal) {
        newVal = this._shallow ? newVal : toRaw(newVal);
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(newVal, this._rawValue)) {
            this._rawValue = newVal;
            this._value = this._shallow ? newVal : convert(newVal);
            trigger(toRaw(this), "set" /* SET */, 'value', newVal);
        }
    }
}
function createRef(rawValue, shallow = false) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    return new RefImpl(rawValue, shallow);
}
function triggerRef(ref) {
    trigger(toRaw(ref), "set" /* SET */, 'value', ( true) ? ref.value : 0);
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
        }
        else {
            return Reflect.set(target, key, value, receiver);
        }
    }
};
function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs)
        ? objectWithRefs
        : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
    constructor(factory) {
        this.__v_isRef = true;
        const { get, set } = factory(() => track(this, "get" /* GET */, 'value'), () => trigger(this, "set" /* SET */, 'value'));
        this._get = get;
        this._set = set;
    }
    get value() {
        return this._get();
    }
    set value(newVal) {
        this._set(newVal);
    }
}
function customRef(factory) {
    return new CustomRefImpl(factory);
}
function toRefs(object) {
    if (( true) && !isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
class ObjectRefImpl {
    constructor(_object, _key) {
        this._object = _object;
        this._key = _key;
        this.__v_isRef = true;
    }
    get value() {
        return this._object[this._key];
    }
    set value(newVal) {
        this._object[this._key] = newVal;
    }
}
function toRef(object, key) {
    return isRef(object[key])
        ? object[key]
        : new ObjectRefImpl(object, key);
}

class ComputedRefImpl {
    constructor(getter, _setter, isReadonly) {
        this._setter = _setter;
        this._dirty = true;
        this.__v_isRef = true;
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(toRaw(this), "set" /* SET */, 'value');
                }
            }
        });
        this["__v_isReadonly" /* IS_READONLY */] = isReadonly;
    }
    get value() {
        // the computed ref may get wrapped by other proxies e.g. readonly() #3376
        const self = toRaw(this);
        if (self._dirty) {
            self._value = this.effect();
            self._dirty = false;
        }
        track(self, "get" /* GET */, 'value');
        return self._value;
    }
    set value(newValue) {
        this._setter(newValue);
    }
}
function computed(getterOrOptions) {
    let getter;
    let setter;
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(getterOrOptions)) {
        getter = getterOrOptions;
        setter = ( true)
            ? () => {
                console.warn('Write operation failed: computed value is readonly');
            }
            : 0;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(getterOrOptions) || !getterOrOptions.set);
}




/***/ }),

/***/ "./node_modules/@vue/shared/dist/shared.esm-bundler.js":
/*!*************************************************************!*\
  !*** ./node_modules/@vue/shared/dist/shared.esm-bundler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_ARR: () => (/* binding */ EMPTY_ARR),
/* harmony export */   EMPTY_OBJ: () => (/* binding */ EMPTY_OBJ),
/* harmony export */   NO: () => (/* binding */ NO),
/* harmony export */   NOOP: () => (/* binding */ NOOP),
/* harmony export */   PatchFlagNames: () => (/* binding */ PatchFlagNames),
/* harmony export */   babelParserDefaultPlugins: () => (/* binding */ babelParserDefaultPlugins),
/* harmony export */   camelize: () => (/* binding */ camelize),
/* harmony export */   capitalize: () => (/* binding */ capitalize),
/* harmony export */   def: () => (/* binding */ def),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   escapeHtmlComment: () => (/* binding */ escapeHtmlComment),
/* harmony export */   extend: () => (/* binding */ extend),
/* harmony export */   generateCodeFrame: () => (/* binding */ generateCodeFrame),
/* harmony export */   getGlobalThis: () => (/* binding */ getGlobalThis),
/* harmony export */   hasChanged: () => (/* binding */ hasChanged),
/* harmony export */   hasOwn: () => (/* binding */ hasOwn),
/* harmony export */   hyphenate: () => (/* binding */ hyphenate),
/* harmony export */   invokeArrayFns: () => (/* binding */ invokeArrayFns),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isBooleanAttr: () => (/* binding */ isBooleanAttr),
/* harmony export */   isDate: () => (/* binding */ isDate),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isGloballyWhitelisted: () => (/* binding */ isGloballyWhitelisted),
/* harmony export */   isHTMLTag: () => (/* binding */ isHTMLTag),
/* harmony export */   isIntegerKey: () => (/* binding */ isIntegerKey),
/* harmony export */   isKnownAttr: () => (/* binding */ isKnownAttr),
/* harmony export */   isMap: () => (/* binding */ isMap),
/* harmony export */   isModelListener: () => (/* binding */ isModelListener),
/* harmony export */   isNoUnitNumericStyleProp: () => (/* binding */ isNoUnitNumericStyleProp),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isOn: () => (/* binding */ isOn),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPromise: () => (/* binding */ isPromise),
/* harmony export */   isReservedProp: () => (/* binding */ isReservedProp),
/* harmony export */   isSSRSafeAttrName: () => (/* binding */ isSSRSafeAttrName),
/* harmony export */   isSVGTag: () => (/* binding */ isSVGTag),
/* harmony export */   isSet: () => (/* binding */ isSet),
/* harmony export */   isSpecialBooleanAttr: () => (/* binding */ isSpecialBooleanAttr),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isSymbol: () => (/* binding */ isSymbol),
/* harmony export */   isVoidTag: () => (/* binding */ isVoidTag),
/* harmony export */   looseEqual: () => (/* binding */ looseEqual),
/* harmony export */   looseIndexOf: () => (/* binding */ looseIndexOf),
/* harmony export */   makeMap: () => (/* binding */ makeMap),
/* harmony export */   normalizeClass: () => (/* binding */ normalizeClass),
/* harmony export */   normalizeStyle: () => (/* binding */ normalizeStyle),
/* harmony export */   objectToString: () => (/* binding */ objectToString),
/* harmony export */   parseStringStyle: () => (/* binding */ parseStringStyle),
/* harmony export */   propsToAttrMap: () => (/* binding */ propsToAttrMap),
/* harmony export */   remove: () => (/* binding */ remove),
/* harmony export */   slotFlagsText: () => (/* binding */ slotFlagsText),
/* harmony export */   stringifyStyle: () => (/* binding */ stringifyStyle),
/* harmony export */   toDisplayString: () => (/* binding */ toDisplayString),
/* harmony export */   toHandlerKey: () => (/* binding */ toHandlerKey),
/* harmony export */   toNumber: () => (/* binding */ toNumber),
/* harmony export */   toRawType: () => (/* binding */ toRawType),
/* harmony export */   toTypeString: () => (/* binding */ toTypeString)
/* harmony export */ });
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

/**
 * dev only flag -> name mapping
 */
const PatchFlagNames = {
    [1 /* TEXT */]: `TEXT`,
    [2 /* CLASS */]: `CLASS`,
    [4 /* STYLE */]: `STYLE`,
    [8 /* PROPS */]: `PROPS`,
    [16 /* FULL_PROPS */]: `FULL_PROPS`,
    [32 /* HYDRATE_EVENTS */]: `HYDRATE_EVENTS`,
    [64 /* STABLE_FRAGMENT */]: `STABLE_FRAGMENT`,
    [128 /* KEYED_FRAGMENT */]: `KEYED_FRAGMENT`,
    [256 /* UNKEYED_FRAGMENT */]: `UNKEYED_FRAGMENT`,
    [512 /* NEED_PATCH */]: `NEED_PATCH`,
    [1024 /* DYNAMIC_SLOTS */]: `DYNAMIC_SLOTS`,
    [2048 /* DEV_ROOT_FRAGMENT */]: `DEV_ROOT_FRAGMENT`,
    [-1 /* HOISTED */]: `HOISTED`,
    [-2 /* BAIL */]: `BAIL`
};

/**
 * Dev only
 */
const slotFlagsText = {
    [1 /* STABLE */]: 'STABLE',
    [2 /* DYNAMIC */]: 'DYNAMIC',
    [3 /* FORWARDED */]: 'FORWARDED'
};

const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
    'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
    'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED);

const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
    // Split the content into individual lines but capture the newline sequence
    // that separated each line. This is important because the actual sequence is
    // needed to properly take into account the full line length for offset
    // comparison
    let lines = source.split(/(\r?\n)/);
    // Separate the lines and newline sequences into separate arrays for easier referencing
    const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
    lines = lines.filter((_, idx) => idx % 2 === 0);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
        count +=
            lines[i].length +
                ((newlineSequences[i] && newlineSequences[i].length) || 0);
        if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
                if (j < 0 || j >= lines.length)
                    continue;
                const line = j + 1;
                res.push(`${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
                const lineLength = lines[j].length;
                const newLineSeqLength = (newlineSequences[j] && newlineSequences[j].length) || 0;
                if (j === i) {
                    // push underline
                    const pad = start - (count - (lineLength + newLineSeqLength));
                    const length = Math.max(1, end > count ? lineLength - pad : end - start);
                    res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
                }
                else if (j > i) {
                    if (end > count) {
                        const length = Math.max(Math.min(end - count, lineLength), 1);
                        res.push(`   |  ` + '^'.repeat(length));
                    }
                    count += lineLength + newLineSeqLength;
                }
            }
            break;
        }
    }
    return res.join('\n');
}

/**
 * On the client we only need to offer special cases for boolean attributes that
 * have different names from their corresponding dom properties:
 * - itemscope -> N/A
 * - allowfullscreen -> allowFullscreen
 * - formnovalidate -> formNoValidate
 * - ismap -> isMap
 * - nomodule -> noModule
 * - novalidate -> noValidate
 * - readonly -> readOnly
 */
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs);
/**
 * The full list is needed during SSR to produce the correct initial markup.
 */
const isBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs +
    `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`);
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
    if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
    }
    const isUnsafe = unsafeAttrCharRE.test(name);
    if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
    }
    return (attrValidationCache[name] = !isUnsafe);
}
const propsToAttrMap = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
};
/**
 * CSS properties that accept plain numbers
 */
const isNoUnitNumericStyleProp = /*#__PURE__*/ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,` +
    `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` +
    `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` +
    `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` +
    `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` +
    `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` +
    // SVG
    `fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` +
    `stroke-miterlimit,stroke-opacity,stroke-width`);
/**
 * Known attributes, this is used for stringification of runtime static nodes
 * so that we don't stringify bindings that cannot be set from HTML.
 * Don't also forget to allow `data-*` and `aria-*`!
 * Generated from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
const isKnownAttr = /*#__PURE__*/ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,` +
    `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` +
    `border,buffered,capture,challenge,charset,checked,cite,class,code,` +
    `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` +
    `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` +
    `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` +
    `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` +
    `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` +
    `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` +
    `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` +
    `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` +
    `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` +
    `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` +
    `start,step,style,summary,tabindex,target,title,translate,type,usemap,` +
    `value,width,wrap`);

function normalizeStyle(value) {
    if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
            if (normalized) {
                for (const key in normalized) {
                    res[key] = normalized[key];
                }
            }
        }
        return res;
    }
    else if (isObject(value)) {
        return value;
    }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach(item => {
        if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return ret;
}
function stringifyStyle(styles) {
    let ret = '';
    if (!styles) {
        return ret;
    }
    for (const key in styles) {
        const value = styles[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) ||
            (typeof value === 'number' && isNoUnitNumericStyleProp(normalizedKey))) {
            // only render valid values
            ret += `${normalizedKey}:${value};`;
        }
    }
    return ret;
}
function normalizeClass(value) {
    let res = '';
    if (isString(value)) {
        res = value;
    }
    else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
                res += normalized + ' ';
            }
        }
    }
    else if (isObject(value)) {
        for (const name in value) {
            if (value[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}

// These tag configs are shared between compiler-dom and runtime-dom, so they
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,' +
    'summary,template,blockquote,iframe,tfoot';
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
    'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
    'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
    'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
    'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
    'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
    'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
    'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
    'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
    'text,textPath,title,tspan,unknown,use,view';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
const isSVGTag = /*#__PURE__*/ makeMap(SVG_TAGS);
const isVoidTag = /*#__PURE__*/ makeMap(VOID_TAGS);

const escapeRE = /["'&<>]/;
function escapeHtml(string) {
    const str = '' + string;
    const match = escapeRE.exec(str);
    if (!match) {
        return str;
    }
    let html = '';
    let escaped;
    let index;
    let lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escaped = '&quot;';
                break;
            case 38: // &
                escaped = '&amp;';
                break;
            case 39: // '
                escaped = '&#39;';
                break;
            case 60: // <
                escaped = '&lt;';
                break;
            case 62: // >
                escaped = '&gt;';
                break;
            default:
                continue;
        }
        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
    }
    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
// https://www.w3.org/TR/html52/syntax.html#comments
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
    return src.replace(commentStripRE, '');
}

function looseCompareArrays(a, b) {
    if (a.length !== b.length)
        return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
    }
    return equal;
}
function looseEqual(a, b) {
    if (a === b)
        return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
        /* istanbul ignore if: this if will probably never be called */
        if (!aValidType || !bValidType) {
            return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
            return false;
        }
        for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if ((aHasKey && !bHasKey) ||
                (!aHasKey && bHasKey) ||
                !looseEqual(a[key], b[key])) {
                return false;
            }
        }
    }
    return String(a) === String(b);
}
function looseIndexOf(arr, val) {
    return arr.findIndex(item => looseEqual(item, val));
}

/**
 * For converting {{ interpolation }} values to displayed strings.
 * @private
 */
const toDisplayString = (val) => {
    return val == null
        ? ''
        : isObject(val)
            ? JSON.stringify(val, replacer, 2)
            : String(val);
};
const replacer = (_key, val) => {
    if (isMap(val)) {
        return {
            [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
                entries[`${key} =>`] = val;
                return entries;
            }, {})
        };
    }
    else if (isSet(val)) {
        return {
            [`Set(${val.size})`]: [...val.values()]
        };
    }
    else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
    }
    return val;
};

/**
 * List of @babel/parser plugins that are used for template expression
 * transforms and SFC script transforms. By default we enable proposals slated
 * for ES2020. This will need to be updated as the spec moves forward.
 * Full list at https://babeljs.io/docs/en/next/babel-parser#plugins
 */
const babelParserDefaultPlugins = [
    'bigInt',
    'optionalChaining',
    'nullishCoalescingOperator'
];
const EMPTY_OBJ = ( true)
    ? Object.freeze({})
    : 0;
const EMPTY_ARR = ( true) ? Object.freeze([]) : 0;
const NOOP = () => { };
/**
 * Always return false.
 */
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith('onUpdate:');
const extend = Object.assign;
const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === '[object Map]';
const isSet = (val) => toTypeString(val) === '[object Set]';
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
    // extract "RawType" from strings like "[object RawType]"
    return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === '[object Object]';
const isIntegerKey = (key) => isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' &&
    '' + parseInt(key, 10) === key;
const isReservedProp = /*#__PURE__*/ makeMap(
// the leading comma is intentional so empty string "" is also included
',key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted');
const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
const camelizeRE = /-(\w)/g;
/**
 * @private
 */
const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, '-$1').toLowerCase());
/**
 * @private
 */
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
/**
 * @private
 */
const toHandlerKey = cacheStringFunction((str) => (str ? `on${capitalize(str)}` : ``));
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
    }
};
const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
    });
};
const toNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
    return (_globalThis ||
        (_globalThis =
            typeof globalThis !== 'undefined'
                ? globalThis
                : typeof self !== 'undefined'
                    ? self
                    : typeof window !== 'undefined'
                        ? window
                        : typeof __webpack_require__.g !== 'undefined'
                            ? __webpack_require__.g
                            : {}));
};




/***/ }),

/***/ "./node_modules/alpinejs/dist/module.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/alpinejs/dist/module.esm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
/* harmony import */ var _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/reactivity */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");
// packages/alpinejs/src/scheduler.js
var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1 && index > lastFlushedIndex)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
    lastFlushedIndex = i;
  }
  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}

// packages/alpinejs/src/reactivity.js
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, { scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  } });
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = /* @__PURE__ */ new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup();
  }];
}

// packages/alpinejs/src/mutation.js
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var recordQueue = [];
var willProcessRecordQueue = false;
function flushObserver() {
  recordQueue = recordQueue.concat(observer.takeRecords());
  if (recordQueue.length && !willProcessRecordQueue) {
    willProcessRecordQueue = true;
    queueMicrotask(() => {
      processRecordQueue();
      willProcessRecordQueue = false;
    });
  }
}
function processRecordQueue() {
  onMutate(recordQueue);
  recordQueue.length = 0;
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = [];
  let addedAttributes = /* @__PURE__ */ new Map();
  let removedAttributes = /* @__PURE__ */ new Map();
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].addedNodes.forEach((node) => node.nodeType === 1 && addedNodes.push(node));
      mutations[i].removedNodes.forEach((node) => node.nodeType === 1 && removedNodes.push(node));
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add();
      } else if (el.hasAttribute(name)) {
        remove();
        add();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.includes(node))
      continue;
    onElRemoveds.forEach((i) => i(node));
    if (node._x_cleanups) {
      while (node._x_cleanups.length)
        node._x_cleanups.pop()();
    }
  }
  addedNodes.forEach((node) => {
    node._x_ignoreSelf = true;
    node._x_ignore = true;
  });
  for (let node of addedNodes) {
    if (removedNodes.includes(node))
      continue;
    if (!node.isConnected)
      continue;
    delete node._x_ignoreSelf;
    delete node._x_ignore;
    onElAddeds.forEach((i) => i(node));
    node._x_ignore = true;
    node._x_ignoreSelf = true;
  }
  addedNodes.forEach((node) => {
    delete node._x_ignoreSelf;
    delete node._x_ignore;
  });
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}

// packages/alpinejs/src/scope.js
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  let thisProxy = new Proxy({}, {
    ownKeys: () => {
      return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
    },
    has: (target, name) => {
      return objects.some((obj) => obj.hasOwnProperty(name));
    },
    get: (target, name) => {
      return (objects.find((obj) => {
        if (obj.hasOwnProperty(name)) {
          let descriptor = Object.getOwnPropertyDescriptor(obj, name);
          if (descriptor.get && descriptor.get._x_alreadyBound || descriptor.set && descriptor.set._x_alreadyBound) {
            return true;
          }
          if ((descriptor.get || descriptor.set) && descriptor.enumerable) {
            let getter = descriptor.get;
            let setter = descriptor.set;
            let property = descriptor;
            getter = getter && getter.bind(thisProxy);
            setter = setter && setter.bind(thisProxy);
            if (getter)
              getter._x_alreadyBound = true;
            if (setter)
              setter._x_alreadyBound = true;
            Object.defineProperty(obj, name, {
              ...property,
              get: getter,
              set: setter
            });
          }
          return true;
        }
        return false;
      }) || {})[name];
    },
    set: (target, name, value) => {
      let closestObjectWithKey = objects.find((obj) => obj.hasOwnProperty(name));
      if (closestObjectWithKey) {
        closestObjectWithKey[name] = value;
      } else {
        objects[objects.length - 1][name] = value;
      }
      return true;
    }
  });
  return thisProxy;
}

// packages/alpinejs/src/interceptor.js
function initInterceptors(data2) {
  let isObject = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
      if (enumerable === false || value === void 0)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}

// packages/alpinejs/src/magics.js
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  Object.entries(magics).forEach(([name, callback]) => {
    let memoizedUtilities = null;
    function getUtilities() {
      if (memoizedUtilities) {
        return memoizedUtilities;
      } else {
        let [utilities, cleanup] = getElementBoundUtilities(el);
        memoizedUtilities = { interceptor, ...utilities };
        onElRemoved(el, cleanup);
        return memoizedUtilities;
      }
    }
    Object.defineProperty(obj, `$${name}`, {
      get() {
        return callback(el, getUtilities());
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/utils/error.js
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(error2, el, expression = void 0) {
  Object.assign(error2, { el, expression });
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}

// packages/alpinejs/src/evaluator.js
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  callback();
  shouldAutoEvaluateFunctions = cache;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [] } = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression) || /^(let|const)\s/.test(expression) ? `(async()=>{ ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      return new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [] } = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i) => receiver(i));
  } else {
    receiver(value);
  }
}

// packages/alpinejs/src/directives.js
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
  return {
    before(directive2) {
      if (!directiveHandlers[directive2]) {
        console.warn(
          "Cannot find directive `${directive}`. `${name}` will use the default order of execution"
        );
        return;
      }
      const pos = directiveOrder.indexOf(directive2);
      directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
    }
  };
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler3 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler3.inline && handler3.inline(el, directive2, utilities);
    handler3 = handler3.bind(handler3, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler3) : handler3();
  };
  fullHandler.runCleanups = cleanup;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return { name, value };
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {
}) {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, { name, value });
    if (newName !== name)
      callback(newName, name);
    return { name: newName, value: newValue };
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({ name, value }) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}

// packages/alpinejs/src/utils/dispatch.js
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      // Allows events to pass the shadow DOM barrier.
      composed: true,
      cancelable: true
    })
  );
}

// packages/alpinejs/src/utils/walk.js
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}

// packages/alpinejs/src/utils/warn.js
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}

// packages/alpinejs/src/lifecycle.js
var started = false;
function start() {
  if (started)
    warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
  started = true;
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors())).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
  initInterceptors2.push(callback);
}
function initTree(el, walker = walk, intercept = () => {
}) {
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      intercept(el2, skip);
      initInterceptors2.forEach((i) => i(el2, skip));
      directives(el2, el2.attributes).forEach((handle) => handle());
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root) {
  walk(root, (el) => cleanupAttributes(el));
}

// packages/alpinejs/src/nextTick.js
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}

// packages/alpinejs/src/utils/classes.js
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}

// packages/alpinejs/src/utils/styles.js
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// packages/alpinejs/src/utils/once.js
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}

// packages/alpinejs/src/directives/x-transition.js
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (expression === false)
    return;
  if (!expression || typeof expression === "boolean") {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    "enter": (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    "leave": (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0) / 1e3;
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: { during: defaultValue, start: defaultValue, end: defaultValue },
      leave: { during: defaultValue, start: defaultValue, end: defaultValue },
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      ;
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration" || key === "delay") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}

// packages/alpinejs/src/clone.js
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
  return (...args) => isCloning && callback(...args);
}
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}

// packages/alpinejs/src/utils/bind.js
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    case "selected":
    case "checked":
      bindAttributeAndProperty(el, name, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (el.type === "radio") {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      el.checked = checkedAttrLooseCompare(el.value, value);
    }
  } else if (el.type === "checkbox") {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Number.isInteger(value) && !Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
  bindAttribute(el, name, value);
  setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function setPropertyIfChanged(el, propName, value) {
  if (el[propName] !== value) {
    el[propName] = value;
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function isBooleanAttr(attrName) {
  const booleanAttributes = [
    "disabled",
    "checked",
    "required",
    "readonly",
    "hidden",
    "open",
    "selected",
    "autofocus",
    "itemscope",
    "multiple",
    "novalidate",
    "allowfullscreen",
    "allowpaymentrequest",
    "formnovalidate",
    "autoplay",
    "controls",
    "loop",
    "muted",
    "playsinline",
    "default",
    "ismap",
    "reversed",
    "async",
    "defer",
    "nomodule"
  ];
  return booleanAttributes.includes(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}

// packages/alpinejs/src/utils/debounce.js
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// packages/alpinejs/src/utils/throttle.js
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// packages/alpinejs/src/plugin.js
function plugin(callback) {
  let callbacks = Array.isArray(callback) ? callback : [callback];
  callbacks.forEach((i) => i(alpine_default));
}

// packages/alpinejs/src/store.js
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
  initInterceptors(stores[name]);
}
function getStores() {
  return stores;
}

// packages/alpinejs/src/binds.js
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
}

// packages/alpinejs/src/datas.js
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/alpine.js
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.12.1",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  startObservingMutations,
  stopObservingMutations,
  setReactivityEngine,
  closestDataStack,
  skipDuringClone,
  onlyDuringClone,
  addRootSelector,
  addInitSelector,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  interceptInit,
  setEvaluator,
  mergeProxies,
  findClosest,
  closestRoot,
  destroyTree,
  interceptor,
  // INTERNAL: not public API and is subject to change without major release.
  transition,
  // INTERNAL
  setStyles,
  // INTERNAL
  mutateDom,
  directive,
  throttle,
  debounce,
  evaluate,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  bound: getBinding,
  $data: scope,
  walk,
  data,
  bind: bind2
};
var alpine_default = Alpine;

// packages/alpinejs/src/index.js


// packages/alpinejs/src/magics/$nextTick.js
magic("nextTick", () => nextTick);

// packages/alpinejs/src/magics/$dispatch.js
magic("dispatch", (el) => dispatch.bind(dispatch, el));

// packages/alpinejs/src/magics/$watch.js
magic("watch", (el, { evaluateLater: evaluateLater2, effect: effect3 }) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let firstTime = true;
  let oldValue;
  let effectReference = effect3(() => evaluate2((value) => {
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  }));
  el._x_effects.delete(effectReference);
});

// packages/alpinejs/src/magics/$store.js
magic("store", getStores);

// packages/alpinejs/src/magics/$data.js
magic("data", (el) => scope(el));

// packages/alpinejs/src/magics/$root.js
magic("root", (el) => closestRoot(el));

// packages/alpinejs/src/magics/$refs.js
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  let currentEl = el;
  while (currentEl) {
    if (currentEl._x_refs)
      refObjects.push(currentEl._x_refs);
    currentEl = currentEl.parentNode;
  }
  return refObjects;
}

// packages/alpinejs/src/ids.js
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}

// packages/alpinejs/src/magics/$id.js
magic("id", (el) => (name, key = null) => {
  let root = closestIdRoot(el, name);
  let id = root ? root._x_ids[name] : findAndIncrementId(name);
  return key ? `${name}-${id}-${key}` : `${name}-${id}`;
});

// packages/alpinejs/src/magics/$el.js
magic("el", (el) => el);

// packages/alpinejs/src/magics/index.js
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/entangle.js
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
  let firstRun = true;
  let outerHash, innerHash, outerHashLatest, innerHashLatest;
  let reference = effect(() => {
    let outer, inner;
    if (firstRun) {
      outer = outerGet();
      innerSet(outer);
      inner = innerGet();
      firstRun = false;
    } else {
      outer = outerGet();
      inner = innerGet();
      outerHashLatest = JSON.stringify(outer);
      innerHashLatest = JSON.stringify(inner);
      if (outerHashLatest !== outerHash) {
        inner = innerGet();
        innerSet(outer);
        inner = outer;
      } else {
        outerSet(inner);
        outer = inner;
      }
    }
    outerHash = JSON.stringify(outer);
    innerHash = JSON.stringify(inner);
  });
  return () => {
    release(reference);
  };
}

// packages/alpinejs/src/directives/x-modelable.js
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup }) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, { scope: { "__placeholder": val } });
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    let releaseEntanglement = entangle(
      {
        get() {
          return outerGet();
        },
        set(value) {
          outerSet(value);
        }
      },
      {
        get() {
          return innerGet();
        },
        set(value) {
          innerSet(value);
        }
      }
    );
    cleanup(releaseEntanglement);
  });
});

// packages/alpinejs/src/directives/x-teleport.js
var teleportContainerDuringClone = document.createElement("div");
directive("teleport", (el, { modifiers, expression }, { cleanup }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = skipDuringClone(() => {
    return document.querySelector(expression);
  }, () => {
    return teleportContainerDuringClone;
  })();
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  mutateDom(() => {
    if (modifiers.includes("prepend")) {
      target.parentNode.insertBefore(clone2, target);
    } else if (modifiers.includes("append")) {
      target.parentNode.insertBefore(clone2, target.nextSibling);
    } else {
      target.appendChild(clone2);
    }
    initTree(clone2);
    clone2._x_ignore = true;
  });
  cleanup(() => clone2.remove());
});

// packages/alpinejs/src/directives/x-ignore.js
var handler = () => {
};
handler.inline = (el, { modifiers }, { cleanup }) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);

// packages/alpinejs/src/directives/x-effect.js
directive("effect", (el, { expression }, { effect: effect3 }) => effect3(evaluateLater(el, expression)));

// packages/alpinejs/src/utils/on.js
function on(el, event, modifiers, callback) {
  let listenerTarget = el;
  let handler3 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event = dotSyntax(event);
  if (modifiers.includes("camel"))
    event = camelCase2(event);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler3 = debounce(handler3, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler3 = throttle(handler3, wait);
  }
  if (modifiers.includes("prevent"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("self"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.target === el && next(e);
    });
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler3 = wrapHandler(handler3, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("once")) {
    handler3 = wrapHandler(handler3, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event, handler3, options);
    });
  }
  handler3 = wrapHandler(handler3, (next, e) => {
    if (isKeyEvent(event)) {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
    }
    next(e);
  });
  listenerTarget.addEventListener(event, handler3, options);
  return () => {
    listenerTarget.removeEventListener(event, handler3, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  if ([" ", "_"].includes(
    subject
  ))
    return subject;
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
  return ["keydown", "keyup"].includes(event);
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once", "capture"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.includes("throttle")) {
    let debounceIndex = keyModifiers.indexOf("throttle");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    "ctrl": "control",
    "slash": "/",
    "space": " ",
    "spacebar": " ",
    "cmd": "meta",
    "esc": "escape",
    "up": "arrow-up",
    "down": "arrow-down",
    "left": "arrow-left",
    "right": "arrow-right",
    "period": ".",
    "equal": "=",
    "minus": "-",
    "underscore": "_"
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}

// packages/alpinejs/src/directives/x-model.js
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup }) => {
  let scopeTarget = el;
  if (modifiers.includes("parent")) {
    scopeTarget = el.parentNode;
  }
  let evaluateGet = evaluateLater(scopeTarget, expression);
  let evaluateSet;
  if (typeof expression === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
  } else if (typeof expression === "function" && typeof expression() === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
  } else {
    evaluateSet = () => {
    };
  }
  let getValue = () => {
    let result;
    evaluateGet((value) => result = value);
    return isGetterSetter(result) ? result.get() : result;
  };
  let setValue = (value) => {
    let result;
    evaluateGet((value2) => result = value2);
    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {
      }, {
        scope: { "__placeholder": value }
      });
    }
  };
  if (typeof expression === "string" && el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let removeListener = isCloning ? () => {
  } : on(el, event, modifiers, (e) => {
    setValue(getInputValue(el, modifiers, e, getValue()));
  });
  if (modifiers.includes("fill") && [null, ""].includes(getValue())) {
    el.dispatchEvent(new Event(event, {}));
  }
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup(() => el._x_removeModelListeners["default"]());
  if (el.form) {
    let removeResetListener = on(el.form, "reset", [], (e) => {
      nextTick(() => el._x_model && el._x_model.set(el.value));
    });
    cleanup(() => removeResetListener());
  }
  el._x_model = {
    get() {
      return getValue();
    },
    set(value) {
      setValue(value);
    }
  };
  el._x_forceModelUpdate = (value) => {
    value = value === void 0 ? getValue() : value;
    if (value === void 0 && typeof expression === "string" && expression.match(/\./))
      value = "";
    window.fromModel = true;
    mutateDom(() => bind(el, "value", value));
    delete window.fromModel;
  };
  effect3(() => {
    let value = getValue();
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate(value);
  });
});
function getInputValue(el, modifiers, event, currentValue) {
  return mutateDom(() => {
    if (event instanceof CustomEvent && event.detail !== void 0)
      return event.detail ?? event.target.value;
    else if (el.type === "checkbox") {
      if (Array.isArray(currentValue)) {
        let newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
        return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
      } else {
        return event.target.checked;
      }
    } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
      return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
        let rawValue = option.value || option.text;
        return safeParseNumber(rawValue);
      }) : Array.from(event.target.selectedOptions).map((option) => {
        return option.value || option.text;
      });
    } else {
      let rawValue = event.target.value;
      return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
    }
  });
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
  return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}

// packages/alpinejs/src/directives/x-cloak.js
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));

// packages/alpinejs/src/directives/x-init.js
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));

// packages/alpinejs/src/directives/x-text.js
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-html.js
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-bind.js
mapAttributes(startingWith(":", into(prefix("bind:"))));
directive("bind", (el, { value, modifiers, expression, original }, { effect: effect3 }) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, { scope: bindingProviders });
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
});
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}

// packages/alpinejs/src/directives/x-data.js
addRootSelector(() => `[${prefix("data")}]`);
directive("data", skipDuringClone((el, { expression }, { cleanup }) => {
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, { scope: dataProviderContext });
  if (data2 === void 0 || data2 === true)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
}));

// packages/alpinejs/src/directives/x-show.js
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once(
    (value) => value ? show() : hide(),
    (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    }
  );
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});

// packages/alpinejs/src/directives/x-for.js
directive("for", (el, { expression }, { effect: effect3, cleanup }) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(
    el,
    // the x-bind:key expression is stored for our use instead of evaluated.
    el._x_keyExpression || "index"
  );
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup(() => {
    Object.values(el._x_lookup).forEach((el2) => el2.remove());
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => keys.push(value2), { scope: { index: key, ...scope2 } });
        scopes.push(scope2);
      });
    } else {
      for (let i = 0; i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => keys.push(value), { scope: { index: i, ...scope2 } });
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0; i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0; i < removes.length; i++) {
      let key = removes[i];
      if (!!lookup[key]._x_effects) {
        lookup[key]._x_effects.forEach(dequeueJob);
      }
      lookup[key].remove();
      lookup[key] = null;
      delete lookup[key];
    }
    for (let i = 0; i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        if (!elForSpot)
          warn(`x-for ":key" is undefined or invalid`, templateEl);
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0; i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      let reactiveScope = reactive(scope2);
      addScopeToNode(clone2, reactiveScope, templateEl);
      clone2._x_refreshXForScope = (newScope) => {
        Object.entries(newScope).forEach(([key2, value]) => {
          reactiveScope[key2] = value;
        });
      };
      mutateDom(() => {
        lastEl.after(clone2);
        initTree(clone2);
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0; i < sames.length; i++) {
      lookup[sames[i]]._x_refreshXForScope(scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-ref.js
function handler2() {
}
handler2.inline = (el, { expression }, { cleanup }) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup(() => delete root._x_refs[expression]);
};
directive("ref", handler2);

// packages/alpinejs/src/directives/x-if.js
directive("if", (el, { expression }, { effect: effect3, cleanup }) => {
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      initTree(clone2);
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      walk(clone2, (node) => {
        if (!!node._x_effects) {
          node._x_effects.forEach(dequeueJob);
        }
      });
      clone2.remove();
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup(() => el._x_undoIf && el._x_undoIf());
});

// packages/alpinejs/src/directives/x-id.js
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});

// packages/alpinejs/src/directives/x-on.js
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup }) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {
    }, { scope: { "$event": e }, params: [e] });
  });
  cleanup(() => removeListener());
}));

// packages/alpinejs/src/directives/index.js
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName2, slug) {
  directive(directiveName2, (el) => warn(`You can't use [x-${directiveName2}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/index.js
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({ reactive: _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.reactive, effect: _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.effect, release: _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.stop, raw: _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw });
var src_default = alpine_default;

// packages/alpinejs/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = __webpack_require__.g.TYPED_ARRAY_SUPPORT !== undefined
  ? __webpack_require__.g.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/accordion/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/accordion/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initAccordions: () => (/* binding */ initAccordions)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    alwaysOpen: false,
    activeClasses: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
    inactiveClasses: 'text-gray-500 dark:text-gray-400',
    onOpen: function () { },
    onClose: function () { },
    onToggle: function () { },
};
var Accordion = /** @class */ (function () {
    function Accordion(items, options) {
        if (items === void 0) { items = []; }
        if (options === void 0) { options = Default; }
        this._items = items;
        this._options = __assign(__assign({}, Default), options);
        this._init();
    }
    Accordion.prototype._init = function () {
        var _this = this;
        if (this._items.length) {
            // show accordion item based on click
            this._items.map(function (item) {
                if (item.active) {
                    _this.open(item.id);
                }
                item.triggerEl.addEventListener('click', function () {
                    _this.toggle(item.id);
                });
            });
        }
    };
    Accordion.prototype.getItem = function (id) {
        return this._items.filter(function (item) { return item.id === id; })[0];
    };
    Accordion.prototype.open = function (id) {
        var _a, _b;
        var _this = this;
        var item = this.getItem(id);
        // don't hide other accordions if always open
        if (!this._options.alwaysOpen) {
            this._items.map(function (i) {
                var _a, _b;
                if (i !== item) {
                    (_a = i.triggerEl.classList).remove.apply(_a, _this._options.activeClasses.split(' '));
                    (_b = i.triggerEl.classList).add.apply(_b, _this._options.inactiveClasses.split(' '));
                    i.targetEl.classList.add('hidden');
                    i.triggerEl.setAttribute('aria-expanded', 'false');
                    i.active = false;
                    // rotate icon if set
                    if (i.iconEl) {
                        i.iconEl.classList.remove('rotate-180');
                    }
                }
            });
        }
        // show active item
        (_a = item.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(' '));
        (_b = item.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(' '));
        item.triggerEl.setAttribute('aria-expanded', 'true');
        item.targetEl.classList.remove('hidden');
        item.active = true;
        // rotate icon if set
        if (item.iconEl) {
            item.iconEl.classList.add('rotate-180');
        }
        // callback function
        this._options.onOpen(this, item);
    };
    Accordion.prototype.toggle = function (id) {
        var item = this.getItem(id);
        if (item.active) {
            this.close(id);
        }
        else {
            this.open(id);
        }
        // callback function
        this._options.onToggle(this, item);
    };
    Accordion.prototype.close = function (id) {
        var _a, _b;
        var item = this.getItem(id);
        (_a = item.triggerEl.classList).remove.apply(_a, this._options.activeClasses.split(' '));
        (_b = item.triggerEl.classList).add.apply(_b, this._options.inactiveClasses.split(' '));
        item.targetEl.classList.add('hidden');
        item.triggerEl.setAttribute('aria-expanded', 'false');
        item.active = false;
        // rotate icon if set
        if (item.iconEl) {
            item.iconEl.classList.remove('rotate-180');
        }
        // callback function
        this._options.onClose(this, item);
    };
    return Accordion;
}());
if (typeof window !== 'undefined') {
    window.Accordion = Accordion;
}
function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function ($accordionEl) {
        var alwaysOpen = $accordionEl.getAttribute('data-accordion');
        var activeClasses = $accordionEl.getAttribute('data-active-classes');
        var inactiveClasses = $accordionEl.getAttribute('data-inactive-classes');
        var items = [];
        $accordionEl
            .querySelectorAll('[data-accordion-target]')
            .forEach(function ($triggerEl) {
            var item = {
                id: $triggerEl.getAttribute('data-accordion-target'),
                triggerEl: $triggerEl,
                targetEl: document.querySelector($triggerEl.getAttribute('data-accordion-target')),
                iconEl: $triggerEl.querySelector('[data-accordion-icon]'),
                active: $triggerEl.getAttribute('aria-expanded') === 'true'
                    ? true
                    : false,
            };
            items.push(item);
        });
        new Accordion(items, {
            alwaysOpen: alwaysOpen === 'open' ? true : false,
            activeClasses: activeClasses
                ? activeClasses
                : Default.activeClasses,
            inactiveClasses: inactiveClasses
                ? inactiveClasses
                : Default.inactiveClasses,
        });
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Accordion);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/accordion/interface.js":
/*!*************************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/accordion/interface.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/accordion/types.js":
/*!*********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/accordion/types.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/carousel/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/carousel/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initCarousels: () => (/* binding */ initCarousels)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    defaultPosition: 0,
    indicators: {
        items: [],
        activeClasses: 'bg-white dark:bg-gray-800',
        inactiveClasses: 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
    },
    interval: 3000,
    onNext: function () { },
    onPrev: function () { },
    onChange: function () { },
};
var Carousel = /** @class */ (function () {
    function Carousel(items, options) {
        if (items === void 0) { items = []; }
        if (options === void 0) { options = Default; }
        this._items = items;
        this._options = __assign(__assign(__assign({}, Default), options), { indicators: __assign(__assign({}, Default.indicators), options.indicators) });
        this._activeItem = this.getItem(this._options.defaultPosition);
        this._indicators = this._options.indicators.items;
        this._intervalDuration = this._options.interval;
        this._intervalInstance = null;
        this._init();
    }
    /**
     * initialize carousel and items based on active one
     */
    Carousel.prototype._init = function () {
        var _this = this;
        this._items.map(function (item) {
            item.el.classList.add('absolute', 'inset-0', 'transition-transform', 'transform');
        });
        // if no active item is set then first position is default
        if (this._getActiveItem()) {
            this.slideTo(this._getActiveItem().position);
        }
        else {
            this.slideTo(0);
        }
        this._indicators.map(function (indicator, position) {
            indicator.el.addEventListener('click', function () {
                _this.slideTo(position);
            });
        });
    };
    Carousel.prototype.getItem = function (position) {
        return this._items[position];
    };
    /**
     * Slide to the element based on id
     * @param {*} position
     */
    Carousel.prototype.slideTo = function (position) {
        var nextItem = this._items[position];
        var rotationItems = {
            left: nextItem.position === 0
                ? this._items[this._items.length - 1]
                : this._items[nextItem.position - 1],
            middle: nextItem,
            right: nextItem.position === this._items.length - 1
                ? this._items[0]
                : this._items[nextItem.position + 1],
        };
        this._rotate(rotationItems);
        this._setActiveItem(nextItem);
        if (this._intervalInstance) {
            this.pause();
            this.cycle();
        }
        this._options.onChange(this);
    };
    /**
     * Based on the currently active item it will go to the next position
     */
    Carousel.prototype.next = function () {
        var activeItem = this._getActiveItem();
        var nextItem = null;
        // check if last item
        if (activeItem.position === this._items.length - 1) {
            nextItem = this._items[0];
        }
        else {
            nextItem = this._items[activeItem.position + 1];
        }
        this.slideTo(nextItem.position);
        // callback function
        this._options.onNext(this);
    };
    /**
     * Based on the currently active item it will go to the previous position
     */
    Carousel.prototype.prev = function () {
        var activeItem = this._getActiveItem();
        var prevItem = null;
        // check if first item
        if (activeItem.position === 0) {
            prevItem = this._items[this._items.length - 1];
        }
        else {
            prevItem = this._items[activeItem.position - 1];
        }
        this.slideTo(prevItem.position);
        // callback function
        this._options.onPrev(this);
    };
    /**
     * This method applies the transform classes based on the left, middle, and right rotation carousel items
     * @param {*} rotationItems
     */
    Carousel.prototype._rotate = function (rotationItems) {
        // reset
        this._items.map(function (item) {
            item.el.classList.add('hidden');
        });
        // left item (previously active)
        rotationItems.left.el.classList.remove('-translate-x-full', 'translate-x-full', 'translate-x-0', 'hidden', 'z-20');
        rotationItems.left.el.classList.add('-translate-x-full', 'z-10');
        // currently active item
        rotationItems.middle.el.classList.remove('-translate-x-full', 'translate-x-full', 'translate-x-0', 'hidden', 'z-10');
        rotationItems.middle.el.classList.add('translate-x-0', 'z-20');
        // right item (upcoming active)
        rotationItems.right.el.classList.remove('-translate-x-full', 'translate-x-full', 'translate-x-0', 'hidden', 'z-20');
        rotationItems.right.el.classList.add('translate-x-full', 'z-10');
    };
    /**
     * Set an interval to cycle through the carousel items
     */
    Carousel.prototype.cycle = function () {
        var _this = this;
        if (typeof window !== 'undefined') {
            this._intervalInstance = window.setInterval(function () {
                _this.next();
            }, this._intervalDuration);
        }
    };
    /**
     * Clears the cycling interval
     */
    Carousel.prototype.pause = function () {
        clearInterval(this._intervalInstance);
    };
    /**
     * Get the currently active item
     */
    Carousel.prototype._getActiveItem = function () {
        return this._activeItem;
    };
    /**
     * Set the currently active item and data attribute
     * @param {*} position
     */
    Carousel.prototype._setActiveItem = function (item) {
        var _a, _b;
        var _this = this;
        this._activeItem = item;
        var position = item.position;
        // update the indicators if available
        if (this._indicators.length) {
            this._indicators.map(function (indicator) {
                var _a, _b;
                indicator.el.setAttribute('aria-current', 'false');
                (_a = indicator.el.classList).remove.apply(_a, _this._options.indicators.activeClasses.split(' '));
                (_b = indicator.el.classList).add.apply(_b, _this._options.indicators.inactiveClasses.split(' '));
            });
            (_a = this._indicators[position].el.classList).add.apply(_a, this._options.indicators.activeClasses.split(' '));
            (_b = this._indicators[position].el.classList).remove.apply(_b, this._options.indicators.inactiveClasses.split(' '));
            this._indicators[position].el.setAttribute('aria-current', 'true');
        }
    };
    return Carousel;
}());
if (typeof window !== 'undefined') {
    window.Carousel = Carousel;
}
function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function ($carouselEl) {
        var interval = $carouselEl.getAttribute('data-carousel-interval');
        var slide = $carouselEl.getAttribute('data-carousel') === 'slide'
            ? true
            : false;
        var items = [];
        var defaultPosition = 0;
        if ($carouselEl.querySelectorAll('[data-carousel-item]').length) {
            Array.from($carouselEl.querySelectorAll('[data-carousel-item]')).map(function ($carouselItemEl, position) {
                items.push({
                    position: position,
                    el: $carouselItemEl,
                });
                if ($carouselItemEl.getAttribute('data-carousel-item') ===
                    'active') {
                    defaultPosition = position;
                }
            });
        }
        var indicators = [];
        if ($carouselEl.querySelectorAll('[data-carousel-slide-to]').length) {
            Array.from($carouselEl.querySelectorAll('[data-carousel-slide-to]')).map(function ($indicatorEl) {
                indicators.push({
                    position: parseInt($indicatorEl.getAttribute('data-carousel-slide-to')),
                    el: $indicatorEl,
                });
            });
        }
        var carousel = new Carousel(items, {
            defaultPosition: defaultPosition,
            indicators: {
                items: indicators,
            },
            interval: interval ? interval : Default.interval,
        });
        if (slide) {
            carousel.cycle();
        }
        // check for controls
        var carouselNextEl = $carouselEl.querySelector('[data-carousel-next]');
        var carouselPrevEl = $carouselEl.querySelector('[data-carousel-prev]');
        if (carouselNextEl) {
            carouselNextEl.addEventListener('click', function () {
                carousel.next();
            });
        }
        if (carouselPrevEl) {
            carouselPrevEl.addEventListener('click', function () {
                carousel.prev();
            });
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Carousel);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/carousel/interface.js":
/*!************************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/carousel/interface.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/carousel/types.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/carousel/types.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/collapse/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/collapse/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initCollapses: () => (/* binding */ initCollapses)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    onCollapse: function () { },
    onExpand: function () { },
    onToggle: function () { },
};
var Collapse = /** @class */ (function () {
    function Collapse(targetEl, triggerEl, options) {
        if (targetEl === void 0) { targetEl = null; }
        if (triggerEl === void 0) { triggerEl = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign(__assign({}, Default), options);
        this._visible = false;
        this._init();
    }
    Collapse.prototype._init = function () {
        var _this = this;
        if (this._triggerEl) {
            if (this._triggerEl.hasAttribute('aria-expanded')) {
                this._visible =
                    this._triggerEl.getAttribute('aria-expanded') === 'true';
            }
            else {
                // fix until v2 not to break previous single collapses which became dismiss
                this._visible = !this._targetEl.classList.contains('hidden');
            }
            this._triggerEl.addEventListener('click', function () {
                _this.toggle();
            });
        }
    };
    Collapse.prototype.collapse = function () {
        this._targetEl.classList.add('hidden');
        if (this._triggerEl) {
            this._triggerEl.setAttribute('aria-expanded', 'false');
        }
        this._visible = false;
        // callback function
        this._options.onCollapse(this);
    };
    Collapse.prototype.expand = function () {
        this._targetEl.classList.remove('hidden');
        if (this._triggerEl) {
            this._triggerEl.setAttribute('aria-expanded', 'true');
        }
        this._visible = true;
        // callback function
        this._options.onExpand(this);
    };
    Collapse.prototype.toggle = function () {
        if (this._visible) {
            this.collapse();
        }
        else {
            this.expand();
        }
        // callback function
        this._options.onToggle(this);
    };
    return Collapse;
}());
if (typeof window !== 'undefined') {
    window.Collapse = Collapse;
}
function initCollapses() {
    document
        .querySelectorAll('[data-collapse-toggle]')
        .forEach(function ($triggerEl) {
        var targetId = $triggerEl.getAttribute('data-collapse-toggle');
        var $targetEl = document.getElementById(targetId);
        // check if the target element exists
        if ($targetEl) {
            new Collapse($targetEl, $triggerEl);
        }
        else {
            console.error("The target element with id \"".concat(targetId, "\" does not exist. Please check the data-collapse-toggle attribute."));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Collapse);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/collapse/interface.js":
/*!************************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/collapse/interface.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/collapse/types.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/collapse/types.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dial/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dial/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initDials: () => (/* binding */ initDials)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    triggerType: 'hover',
    onShow: function () { },
    onHide: function () { },
    onToggle: function () { },
};
var Dial = /** @class */ (function () {
    function Dial(parentEl, triggerEl, targetEl, options) {
        if (parentEl === void 0) { parentEl = null; }
        if (triggerEl === void 0) { triggerEl = null; }
        if (targetEl === void 0) { targetEl = null; }
        if (options === void 0) { options = Default; }
        this._parentEl = parentEl;
        this._triggerEl = triggerEl;
        this._targetEl = targetEl;
        this._options = __assign(__assign({}, Default), options);
        this._visible = false;
        this._init();
    }
    Dial.prototype._init = function () {
        var _this = this;
        if (this._triggerEl) {
            var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
            triggerEventTypes.showEvents.forEach(function (ev) {
                _this._triggerEl.addEventListener(ev, function () {
                    _this.show();
                });
                _this._targetEl.addEventListener(ev, function () {
                    _this.show();
                });
            });
            triggerEventTypes.hideEvents.forEach(function (ev) {
                _this._parentEl.addEventListener(ev, function () {
                    if (!_this._parentEl.matches(':hover')) {
                        _this.hide();
                    }
                });
            });
        }
    };
    Dial.prototype.hide = function () {
        this._targetEl.classList.add('hidden');
        if (this._triggerEl) {
            this._triggerEl.setAttribute('aria-expanded', 'false');
        }
        this._visible = false;
        // callback function
        this._options.onHide(this);
    };
    Dial.prototype.show = function () {
        this._targetEl.classList.remove('hidden');
        if (this._triggerEl) {
            this._triggerEl.setAttribute('aria-expanded', 'true');
        }
        this._visible = true;
        // callback function
        this._options.onShow(this);
    };
    Dial.prototype.toggle = function () {
        if (this._visible) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    Dial.prototype.isHidden = function () {
        return !this._visible;
    };
    Dial.prototype.isVisible = function () {
        return this._visible;
    };
    Dial.prototype._getTriggerEventTypes = function (triggerType) {
        switch (triggerType) {
            case 'hover':
                return {
                    showEvents: ['mouseenter', 'focus'],
                    hideEvents: ['mouseleave', 'blur'],
                };
            case 'click':
                return {
                    showEvents: ['click', 'focus'],
                    hideEvents: ['focusout', 'blur'],
                };
            case 'none':
                return {
                    showEvents: [],
                    hideEvents: [],
                };
            default:
                return {
                    showEvents: ['mouseenter', 'focus'],
                    hideEvents: ['mouseleave', 'blur'],
                };
        }
    };
    return Dial;
}());
if (typeof window !== 'undefined') {
    window.Dial = Dial;
}
function initDials() {
    document.querySelectorAll('[data-dial-init]').forEach(function ($parentEl) {
        var $triggerEl = $parentEl.querySelector('[data-dial-toggle]');
        if ($triggerEl) {
            var dialId = $triggerEl.getAttribute('data-dial-toggle');
            var $dialEl = document.getElementById(dialId);
            if ($dialEl) {
                var triggerType = $triggerEl.getAttribute('data-dial-trigger');
                new Dial($parentEl, $triggerEl, $dialEl, {
                    triggerType: triggerType
                        ? triggerType
                        : Default.triggerType,
                });
            }
            else {
                console.error("Dial with id ".concat(dialId, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"));
            }
        }
        else {
            console.error("Dial with id ".concat($parentEl.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dial);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dial/interface.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dial/interface.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dial/types.js":
/*!****************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dial/types.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dismiss/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dismiss/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initDismisses: () => (/* binding */ initDismisses)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    transition: 'transition-opacity',
    duration: 300,
    timing: 'ease-out',
    onHide: function () { },
};
var Dismiss = /** @class */ (function () {
    function Dismiss(targetEl, triggerEl, options) {
        if (targetEl === void 0) { targetEl = null; }
        if (triggerEl === void 0) { triggerEl = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign(__assign({}, Default), options);
        this._init();
    }
    Dismiss.prototype._init = function () {
        var _this = this;
        if (this._triggerEl) {
            this._triggerEl.addEventListener('click', function () {
                _this.hide();
            });
        }
    };
    Dismiss.prototype.hide = function () {
        var _this = this;
        this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, 'opacity-0');
        setTimeout(function () {
            _this._targetEl.classList.add('hidden');
        }, this._options.duration);
        // callback function
        this._options.onHide(this, this._targetEl);
    };
    return Dismiss;
}());
if (typeof window !== 'undefined') {
    window.Dismiss = Dismiss;
}
function initDismisses() {
    document.querySelectorAll('[data-dismiss-target]').forEach(function ($triggerEl) {
        var targetId = $triggerEl.getAttribute('data-dismiss-target');
        var $dismissEl = document.querySelector(targetId);
        if ($dismissEl) {
            new Dismiss($dismissEl, $triggerEl);
        }
        else {
            console.error("The dismiss element with id \"".concat(targetId, "\" does not exist. Please check the data-dismiss-target attribute."));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dismiss);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dismiss/interface.js":
/*!***********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dismiss/interface.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dismiss/types.js":
/*!*******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dismiss/types.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/drawer/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/drawer/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initDrawers: () => (/* binding */ initDrawers)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    placement: 'left',
    bodyScrolling: false,
    backdrop: true,
    edge: false,
    edgeOffset: 'bottom-[60px]',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30',
    onShow: function () { },
    onHide: function () { },
    onToggle: function () { },
};
var Drawer = /** @class */ (function () {
    function Drawer(targetEl, options) {
        if (targetEl === void 0) { targetEl = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetEl;
        this._options = __assign(__assign({}, Default), options);
        this._visible = false;
        this._init();
    }
    Drawer.prototype._init = function () {
        var _this = this;
        // set initial accessibility attributes
        if (this._targetEl) {
            this._targetEl.setAttribute('aria-hidden', 'true');
            this._targetEl.classList.add('transition-transform');
        }
        // set base placement classes
        this._getPlacementClasses(this._options.placement).base.map(function (c) {
            _this._targetEl.classList.add(c);
        });
        // add keyboard event listener to document
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                // if 'Escape' key is pressed
                if (_this.isVisible()) {
                    // if the Drawer is visible
                    _this.hide(); // hide the Drawer
                }
            }
        });
    };
    Drawer.prototype.hide = function () {
        var _this = this;
        // based on the edge option show placement classes
        if (this._options.edge) {
            this._getPlacementClasses(this._options.placement + '-edge').active.map(function (c) {
                _this._targetEl.classList.remove(c);
            });
            this._getPlacementClasses(this._options.placement + '-edge').inactive.map(function (c) {
                _this._targetEl.classList.add(c);
            });
        }
        else {
            this._getPlacementClasses(this._options.placement).active.map(function (c) {
                _this._targetEl.classList.remove(c);
            });
            this._getPlacementClasses(this._options.placement).inactive.map(function (c) {
                _this._targetEl.classList.add(c);
            });
        }
        // set accessibility attributes
        this._targetEl.setAttribute('aria-hidden', 'true');
        this._targetEl.removeAttribute('aria-modal');
        this._targetEl.removeAttribute('role');
        // enable body scroll
        if (!this._options.bodyScrolling) {
            document.body.classList.remove('overflow-hidden');
        }
        // destroy backdrop
        if (this._options.backdrop) {
            this._destroyBackdropEl();
        }
        this._visible = false;
        // callback function
        this._options.onHide(this);
    };
    Drawer.prototype.show = function () {
        var _this = this;
        if (this._options.edge) {
            this._getPlacementClasses(this._options.placement + '-edge').active.map(function (c) {
                _this._targetEl.classList.add(c);
            });
            this._getPlacementClasses(this._options.placement + '-edge').inactive.map(function (c) {
                _this._targetEl.classList.remove(c);
            });
        }
        else {
            this._getPlacementClasses(this._options.placement).active.map(function (c) {
                _this._targetEl.classList.add(c);
            });
            this._getPlacementClasses(this._options.placement).inactive.map(function (c) {
                _this._targetEl.classList.remove(c);
            });
        }
        // set accessibility attributes
        this._targetEl.setAttribute('aria-modal', 'true');
        this._targetEl.setAttribute('role', 'dialog');
        this._targetEl.removeAttribute('aria-hidden');
        // disable body scroll
        if (!this._options.bodyScrolling) {
            document.body.classList.add('overflow-hidden');
        }
        // show backdrop
        if (this._options.backdrop) {
            this._createBackdrop();
        }
        this._visible = true;
        // callback function
        this._options.onShow(this);
    };
    Drawer.prototype.toggle = function () {
        if (this.isVisible()) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    Drawer.prototype._createBackdrop = function () {
        var _a;
        var _this = this;
        if (!this._visible) {
            var backdropEl = document.createElement('div');
            backdropEl.setAttribute('drawer-backdrop', '');
            (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(' '));
            document.querySelector('body').append(backdropEl);
            backdropEl.addEventListener('click', function () {
                _this.hide();
            });
        }
    };
    Drawer.prototype._destroyBackdropEl = function () {
        if (this._visible) {
            document.querySelector('[drawer-backdrop]').remove();
        }
    };
    Drawer.prototype._getPlacementClasses = function (placement) {
        switch (placement) {
            case 'top':
                return {
                    base: ['top-0', 'left-0', 'right-0'],
                    active: ['transform-none'],
                    inactive: ['-translate-y-full'],
                };
            case 'right':
                return {
                    base: ['right-0', 'top-0'],
                    active: ['transform-none'],
                    inactive: ['translate-x-full'],
                };
            case 'bottom':
                return {
                    base: ['bottom-0', 'left-0', 'right-0'],
                    active: ['transform-none'],
                    inactive: ['translate-y-full'],
                };
            case 'left':
                return {
                    base: ['left-0', 'top-0'],
                    active: ['transform-none'],
                    inactive: ['-translate-x-full'],
                };
            case 'bottom-edge':
                return {
                    base: ['left-0', 'top-0'],
                    active: ['transform-none'],
                    inactive: ['translate-y-full', this._options.edgeOffset],
                };
            default:
                return {
                    base: ['left-0', 'top-0'],
                    active: ['transform-none'],
                    inactive: ['-translate-x-full'],
                };
        }
    };
    Drawer.prototype.isHidden = function () {
        return !this._visible;
    };
    Drawer.prototype.isVisible = function () {
        return this._visible;
    };
    return Drawer;
}());
if (typeof window !== 'undefined') {
    window.Drawer = Drawer;
}
var getDrawerInstance = function (id, instances) {
    if (instances.some(function (drawerInstance) { return drawerInstance.id === id; })) {
        return instances.find(function (drawerInstance) { return drawerInstance.id === id; });
    }
};
function initDrawers() {
    var drawerInstances = [];
    document.querySelectorAll('[data-drawer-target]').forEach(function ($triggerEl) {
        // mandatory
        var drawerId = $triggerEl.getAttribute('data-drawer-target');
        var $drawerEl = document.getElementById(drawerId);
        if ($drawerEl) {
            // optional
            var placement = $triggerEl.getAttribute('data-drawer-placement');
            var bodyScrolling = $triggerEl.getAttribute('data-drawer-body-scrolling');
            var backdrop = $triggerEl.getAttribute('data-drawer-backdrop');
            var edge = $triggerEl.getAttribute('data-drawer-edge');
            var edgeOffset = $triggerEl.getAttribute('data-drawer-edge-offset');
            if (!getDrawerInstance(drawerId, drawerInstances)) {
                drawerInstances.push({
                    id: drawerId,
                    object: new Drawer($drawerEl, {
                        placement: placement ? placement : Default.placement,
                        bodyScrolling: bodyScrolling
                            ? bodyScrolling === 'true'
                                ? true
                                : false
                            : Default.bodyScrolling,
                        backdrop: backdrop
                            ? backdrop === 'true'
                                ? true
                                : false
                            : Default.backdrop,
                        edge: edge
                            ? edge === 'true'
                                ? true
                                : false
                            : Default.edge,
                        edgeOffset: edgeOffset
                            ? edgeOffset
                            : Default.edgeOffset,
                    }),
                });
            }
        }
        else {
            console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
        }
    });
    document.querySelectorAll('[data-drawer-toggle]').forEach(function ($triggerEl) {
        var drawerId = $triggerEl.getAttribute('data-drawer-toggle');
        var $drawerEl = document.getElementById(drawerId);
        if ($drawerEl) {
            var drawer_1 = getDrawerInstance(drawerId, drawerInstances);
            if (drawer_1) {
                $triggerEl.addEventListener('click', function () {
                    drawer_1.object.toggle();
                });
            }
            else {
                console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
            }
        }
        else {
            console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
        }
    });
    document
        .querySelectorAll('[data-drawer-dismiss], [data-drawer-hide]')
        .forEach(function ($triggerEl) {
        var drawerId = $triggerEl.getAttribute('data-drawer-dismiss')
            ? $triggerEl.getAttribute('data-drawer-dismiss')
            : $triggerEl.getAttribute('data-drawer-hide');
        var $drawerEl = document.getElementById(drawerId);
        if ($drawerEl) {
            var drawer_2 = getDrawerInstance(drawerId, drawerInstances);
            if (drawer_2) {
                $triggerEl.addEventListener('click', function () {
                    drawer_2.object.hide();
                });
            }
            else {
                console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
            }
        }
        else {
            console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"));
        }
    });
    document.querySelectorAll('[data-drawer-show]').forEach(function ($triggerEl) {
        var drawerId = $triggerEl.getAttribute('data-drawer-show');
        var $drawerEl = document.getElementById(drawerId);
        if ($drawerEl) {
            var drawer_3 = getDrawerInstance(drawerId, drawerInstances);
            if (drawer_3) {
                $triggerEl.addEventListener('click', function () {
                    drawer_3.object.show();
                });
            }
            else {
                console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
            }
        }
        else {
            console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Drawer);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/drawer/interface.js":
/*!**********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/drawer/interface.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/drawer/types.js":
/*!******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/drawer/types.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dropdown/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dropdown/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initDropdowns: () => (/* binding */ initDropdowns)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable @typescript-eslint/no-empty-function */

var Default = {
    placement: 'bottom',
    triggerType: 'click',
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    onShow: function () { },
    onHide: function () { },
    onToggle: function () { },
};
var Dropdown = /** @class */ (function () {
    function Dropdown(targetElement, triggerElement, options) {
        if (targetElement === void 0) { targetElement = null; }
        if (triggerElement === void 0) { triggerElement = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetElement;
        this._triggerEl = triggerElement;
        this._options = __assign(__assign({}, Default), options);
        this._popperInstance = this._createPopperInstance();
        this._visible = false;
        this._init();
    }
    Dropdown.prototype._init = function () {
        if (this._triggerEl) {
            this._setupEventListeners();
        }
    };
    Dropdown.prototype._setupEventListeners = function () {
        var _this = this;
        var triggerEvents = this._getTriggerEvents();
        // click event handling for trigger element
        if (this._options.triggerType === 'click') {
            triggerEvents.showEvents.forEach(function (ev) {
                _this._triggerEl.addEventListener(ev, function () {
                    _this.toggle();
                });
            });
        }
        // hover event handling for trigger element
        if (this._options.triggerType === 'hover') {
            triggerEvents.showEvents.forEach(function (ev) {
                _this._triggerEl.addEventListener(ev, function () {
                    if (ev === 'click') {
                        _this.toggle();
                    }
                    else {
                        setTimeout(function () {
                            _this.show();
                        }, _this._options.delay);
                    }
                });
                _this._targetEl.addEventListener(ev, function () {
                    _this.show();
                });
            });
            triggerEvents.hideEvents.forEach(function (ev) {
                _this._triggerEl.addEventListener(ev, function () {
                    setTimeout(function () {
                        if (!_this._targetEl.matches(':hover')) {
                            _this.hide();
                        }
                    }, _this._options.delay);
                });
                _this._targetEl.addEventListener(ev, function () {
                    setTimeout(function () {
                        if (!_this._triggerEl.matches(':hover')) {
                            _this.hide();
                        }
                    }, _this._options.delay);
                });
            });
        }
    };
    Dropdown.prototype._createPopperInstance = function () {
        return (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_0__.createPopper)(this._triggerEl, this._targetEl, {
            placement: this._options.placement,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [
                            this._options.offsetSkidding,
                            this._options.offsetDistance,
                        ],
                    },
                },
            ],
        });
    };
    Dropdown.prototype._setupClickOutsideListener = function () {
        var _this = this;
        this._clickOutsideEventListener = function (ev) {
            _this._handleClickOutside(ev, _this._targetEl);
        };
        document.body.addEventListener('click', this._clickOutsideEventListener, true);
    };
    Dropdown.prototype._removeClickOutsideListener = function () {
        document.body.removeEventListener('click', this._clickOutsideEventListener, true);
    };
    Dropdown.prototype._handleClickOutside = function (ev, targetEl) {
        var clickedEl = ev.target;
        if (clickedEl !== targetEl &&
            !targetEl.contains(clickedEl) &&
            !this._triggerEl.contains(clickedEl) &&
            this.isVisible()) {
            this.hide();
        }
    };
    Dropdown.prototype._getTriggerEvents = function () {
        switch (this._options.triggerType) {
            case 'hover':
                return {
                    showEvents: ['mouseenter', 'click'],
                    hideEvents: ['mouseleave'],
                };
            case 'click':
                return {
                    showEvents: ['click'],
                    hideEvents: [],
                };
            case 'none':
                return {
                    showEvents: [],
                    hideEvents: [],
                };
            default:
                return {
                    showEvents: ['click'],
                    hideEvents: [],
                };
        }
    };
    Dropdown.prototype.toggle = function () {
        if (this.isVisible()) {
            this.hide();
        }
        else {
            this.show();
        }
        this._options.onToggle(this);
    };
    Dropdown.prototype.isVisible = function () {
        return this._visible;
    };
    Dropdown.prototype.show = function () {
        this._targetEl.classList.remove('hidden');
        this._targetEl.classList.add('block');
        // Enable the event listeners
        this._popperInstance.setOptions(function (options) { return (__assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                { name: 'eventListeners', enabled: true },
            ], false) })); });
        this._setupClickOutsideListener();
        // Update its position
        this._popperInstance.update();
        this._visible = true;
        // callback function
        this._options.onShow(this);
    };
    Dropdown.prototype.hide = function () {
        this._targetEl.classList.remove('block');
        this._targetEl.classList.add('hidden');
        // Disable the event listeners
        this._popperInstance.setOptions(function (options) { return (__assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                { name: 'eventListeners', enabled: false },
            ], false) })); });
        this._visible = false;
        this._removeClickOutsideListener();
        // callback function
        this._options.onHide(this);
    };
    return Dropdown;
}());
if (typeof window !== 'undefined') {
    window.Dropdown = Dropdown;
}
function initDropdowns() {
    document
        .querySelectorAll('[data-dropdown-toggle]')
        .forEach(function ($triggerEl) {
        var dropdownId = $triggerEl.getAttribute('data-dropdown-toggle');
        var $dropdownEl = document.getElementById(dropdownId);
        if ($dropdownEl) {
            var placement = $triggerEl.getAttribute('data-dropdown-placement');
            var offsetSkidding = $triggerEl.getAttribute('data-dropdown-offset-skidding');
            var offsetDistance = $triggerEl.getAttribute('data-dropdown-offset-distance');
            var triggerType = $triggerEl.getAttribute('data-dropdown-trigger');
            var delay = $triggerEl.getAttribute('data-dropdown-delay');
            new Dropdown($dropdownEl, $triggerEl, {
                placement: placement ? placement : Default.placement,
                triggerType: triggerType
                    ? triggerType
                    : Default.triggerType,
                offsetSkidding: offsetSkidding
                    ? parseInt(offsetSkidding)
                    : Default.offsetSkidding,
                offsetDistance: offsetDistance
                    ? parseInt(offsetDistance)
                    : Default.offsetDistance,
                delay: delay ? parseInt(delay) : Default.delay,
            });
        }
        else {
            console.error("The dropdown element with id \"".concat(dropdownId, "\" does not exist. Please check the data-dropdown-toggle attribute."));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dropdown);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dropdown/interface.js":
/*!************************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dropdown/interface.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/dropdown/types.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/dropdown/types.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initFlowbite: () => (/* binding */ initFlowbite)
/* harmony export */ });
/* harmony import */ var _accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordion */ "./node_modules/flowbite/lib/esm/components/accordion/index.js");
/* harmony import */ var _carousel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./carousel */ "./node_modules/flowbite/lib/esm/components/carousel/index.js");
/* harmony import */ var _collapse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./collapse */ "./node_modules/flowbite/lib/esm/components/collapse/index.js");
/* harmony import */ var _dial__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dial */ "./node_modules/flowbite/lib/esm/components/dial/index.js");
/* harmony import */ var _dismiss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dismiss */ "./node_modules/flowbite/lib/esm/components/dismiss/index.js");
/* harmony import */ var _drawer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./drawer */ "./node_modules/flowbite/lib/esm/components/drawer/index.js");
/* harmony import */ var _dropdown__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dropdown */ "./node_modules/flowbite/lib/esm/components/dropdown/index.js");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modal */ "./node_modules/flowbite/lib/esm/components/modal/index.js");
/* harmony import */ var _popover__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./popover */ "./node_modules/flowbite/lib/esm/components/popover/index.js");
/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tabs */ "./node_modules/flowbite/lib/esm/components/tabs/index.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./tooltip */ "./node_modules/flowbite/lib/esm/components/tooltip/index.js");











function initFlowbite() {
    (0,_accordion__WEBPACK_IMPORTED_MODULE_0__.initAccordions)();
    (0,_collapse__WEBPACK_IMPORTED_MODULE_2__.initCollapses)();
    (0,_carousel__WEBPACK_IMPORTED_MODULE_1__.initCarousels)();
    (0,_dismiss__WEBPACK_IMPORTED_MODULE_4__.initDismisses)();
    (0,_dropdown__WEBPACK_IMPORTED_MODULE_6__.initDropdowns)();
    (0,_modal__WEBPACK_IMPORTED_MODULE_7__.initModals)();
    (0,_drawer__WEBPACK_IMPORTED_MODULE_5__.initDrawers)();
    (0,_tabs__WEBPACK_IMPORTED_MODULE_9__.initTabs)();
    (0,_tooltip__WEBPACK_IMPORTED_MODULE_10__.initTooltips)();
    (0,_popover__WEBPACK_IMPORTED_MODULE_8__.initPopovers)();
    (0,_dial__WEBPACK_IMPORTED_MODULE_3__.initDials)();
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/modal/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/modal/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initModals: () => (/* binding */ initModals)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    placement: 'center',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    backdrop: 'dynamic',
    closable: true,
    onHide: function () { },
    onShow: function () { },
    onToggle: function () { },
};
var Modal = /** @class */ (function () {
    function Modal(targetEl, options) {
        if (targetEl === void 0) { targetEl = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetEl;
        this._options = __assign(__assign({}, Default), options);
        this._isHidden = true;
        this._backdropEl = null;
        this._init();
    }
    Modal.prototype._init = function () {
        var _this = this;
        if (this._targetEl) {
            this._getPlacementClasses().map(function (c) {
                _this._targetEl.classList.add(c);
            });
        }
    };
    Modal.prototype._createBackdrop = function () {
        var _a;
        if (this._isHidden) {
            var backdropEl = document.createElement('div');
            backdropEl.setAttribute('modal-backdrop', '');
            (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(' '));
            document.querySelector('body').append(backdropEl);
            this._backdropEl = backdropEl;
        }
    };
    Modal.prototype._destroyBackdropEl = function () {
        if (!this._isHidden) {
            document.querySelector('[modal-backdrop]').remove();
        }
    };
    Modal.prototype._setupModalCloseEventListeners = function () {
        var _this = this;
        if (this._options.backdrop === 'dynamic') {
            this._clickOutsideEventListener = function (ev) {
                _this._handleOutsideClick(ev.target);
            };
            this._targetEl.addEventListener('click', this._clickOutsideEventListener, true);
        }
        this._keydownEventListener = function (ev) {
            if (ev.key === 'Escape') {
                _this.hide();
            }
        };
        document.body.addEventListener('keydown', this._keydownEventListener, true);
    };
    Modal.prototype._removeModalCloseEventListeners = function () {
        if (this._options.backdrop === 'dynamic') {
            this._targetEl.removeEventListener('click', this._clickOutsideEventListener, true);
        }
        document.body.removeEventListener('keydown', this._keydownEventListener, true);
    };
    Modal.prototype._handleOutsideClick = function (target) {
        if (target === this._targetEl ||
            (target === this._backdropEl && this.isVisible())) {
            this.hide();
        }
    };
    Modal.prototype._getPlacementClasses = function () {
        switch (this._options.placement) {
            // top
            case 'top-left':
                return ['justify-start', 'items-start'];
            case 'top-center':
                return ['justify-center', 'items-start'];
            case 'top-right':
                return ['justify-end', 'items-start'];
            // center
            case 'center-left':
                return ['justify-start', 'items-center'];
            case 'center':
                return ['justify-center', 'items-center'];
            case 'center-right':
                return ['justify-end', 'items-center'];
            // bottom
            case 'bottom-left':
                return ['justify-start', 'items-end'];
            case 'bottom-center':
                return ['justify-center', 'items-end'];
            case 'bottom-right':
                return ['justify-end', 'items-end'];
            default:
                return ['justify-center', 'items-center'];
        }
    };
    Modal.prototype.toggle = function () {
        if (this._isHidden) {
            this.show();
        }
        else {
            this.hide();
        }
        // callback function
        this._options.onToggle(this);
    };
    Modal.prototype.show = function () {
        if (this.isHidden) {
            this._targetEl.classList.add('flex');
            this._targetEl.classList.remove('hidden');
            this._targetEl.setAttribute('aria-modal', 'true');
            this._targetEl.setAttribute('role', 'dialog');
            this._targetEl.removeAttribute('aria-hidden');
            this._createBackdrop();
            this._isHidden = false;
            // prevent body scroll
            document.body.classList.add('overflow-hidden');
            // Add keyboard event listener to the document
            if (this._options.closable) {
                this._setupModalCloseEventListeners();
            }
            // callback function
            this._options.onShow(this);
        }
    };
    Modal.prototype.hide = function () {
        if (this.isVisible) {
            this._targetEl.classList.add('hidden');
            this._targetEl.classList.remove('flex');
            this._targetEl.setAttribute('aria-hidden', 'true');
            this._targetEl.removeAttribute('aria-modal');
            this._targetEl.removeAttribute('role');
            this._destroyBackdropEl();
            this._isHidden = true;
            // re-apply body scroll
            document.body.classList.remove('overflow-hidden');
            if (this._options.closable) {
                this._removeModalCloseEventListeners();
            }
            // callback function
            this._options.onHide(this);
        }
    };
    Modal.prototype.isVisible = function () {
        return !this._isHidden;
    };
    Modal.prototype.isHidden = function () {
        return this._isHidden;
    };
    return Modal;
}());
if (typeof window !== 'undefined') {
    window.Modal = Modal;
}
var getModalInstance = function (id, instances) {
    if (instances.some(function (modalInstance) { return modalInstance.id === id; })) {
        return instances.find(function (modalInstance) { return modalInstance.id === id; });
    }
    return null;
};
function initModals() {
    var modalInstances = [];
    // initiate modal based on data-modal-target
    document.querySelectorAll('[data-modal-target]').forEach(function ($triggerEl) {
        var modalId = $triggerEl.getAttribute('data-modal-target');
        var $modalEl = document.getElementById(modalId);
        if ($modalEl) {
            var placement = $modalEl.getAttribute('data-modal-placement');
            var backdrop = $modalEl.getAttribute('data-modal-backdrop');
            if (!getModalInstance(modalId, modalInstances)) {
                modalInstances.push({
                    id: modalId,
                    object: new Modal($modalEl, {
                        placement: placement
                            ? placement
                            : Default.placement,
                        backdrop: backdrop ? backdrop : Default.backdrop,
                    }),
                });
            }
        }
        else {
            console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."));
        }
    });
    // support pre v1.6.0 data-modal-toggle initialization
    document.querySelectorAll('[data-modal-toggle]').forEach(function ($triggerEl) {
        var modalId = $triggerEl.getAttribute('data-modal-toggle');
        var $modalEl = document.getElementById(modalId);
        if ($modalEl) {
            var placement = $modalEl.getAttribute('data-modal-placement');
            var backdrop = $modalEl.getAttribute('data-modal-backdrop');
            var modal_1 = getModalInstance(modalId, modalInstances);
            if (!modal_1) {
                modal_1 = {
                    id: modalId,
                    object: new Modal($modalEl, {
                        placement: placement
                            ? placement
                            : Default.placement,
                        backdrop: backdrop ? backdrop : Default.backdrop,
                    }),
                };
                modalInstances.push(modal_1);
            }
            $triggerEl.addEventListener('click', function () {
                modal_1.object.toggle();
            });
        }
        else {
            console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"));
        }
    });
    // show modal on click if exists based on id
    document.querySelectorAll('[data-modal-show]').forEach(function ($triggerEl) {
        var modalId = $triggerEl.getAttribute('data-modal-show');
        var $modalEl = document.getElementById(modalId);
        if ($modalEl) {
            var modal_2 = getModalInstance(modalId, modalInstances);
            if (modal_2) {
                $triggerEl.addEventListener('click', function () {
                    if (modal_2.object.isHidden) {
                        modal_2.object.show();
                    }
                });
            }
            else {
                console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
            }
        }
        else {
            console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"));
        }
    });
    // hide modal on click if exists based on id
    document.querySelectorAll('[data-modal-hide]').forEach(function ($triggerEl) {
        var modalId = $triggerEl.getAttribute('data-modal-hide');
        var $modalEl = document.getElementById(modalId);
        if ($modalEl) {
            var modal_3 = getModalInstance(modalId, modalInstances);
            if (modal_3) {
                $triggerEl.addEventListener('click', function () {
                    if (modal_3.object.isVisible) {
                        modal_3.object.hide();
                    }
                });
            }
            else {
                console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
            }
        }
        else {
            console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/modal/interface.js":
/*!*********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/modal/interface.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/modal/types.js":
/*!*****************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/modal/types.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/popover/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/popover/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initPopovers: () => (/* binding */ initPopovers)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable @typescript-eslint/no-empty-function */

var Default = {
    placement: 'top',
    offset: 10,
    triggerType: 'hover',
    onShow: function () { },
    onHide: function () { },
    onToggle: function () { },
};
var Popover = /** @class */ (function () {
    function Popover(targetEl, triggerEl, options) {
        if (targetEl === void 0) { targetEl = null; }
        if (triggerEl === void 0) { triggerEl = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign(__assign({}, Default), options);
        this._popperInstance = this._createPopperInstance();
        this._visible = false;
        this._init();
    }
    Popover.prototype._init = function () {
        if (this._triggerEl) {
            this._setupEventListeners();
        }
    };
    Popover.prototype._setupEventListeners = function () {
        var _this = this;
        var triggerEvents = this._getTriggerEvents();
        triggerEvents.showEvents.forEach(function (ev) {
            _this._triggerEl.addEventListener(ev, function () {
                _this.show();
            });
            _this._targetEl.addEventListener(ev, function () {
                _this.show();
            });
        });
        triggerEvents.hideEvents.forEach(function (ev) {
            _this._triggerEl.addEventListener(ev, function () {
                setTimeout(function () {
                    if (!_this._targetEl.matches(':hover')) {
                        _this.hide();
                    }
                }, 100);
            });
            _this._targetEl.addEventListener(ev, function () {
                setTimeout(function () {
                    if (!_this._triggerEl.matches(':hover')) {
                        _this.hide();
                    }
                }, 100);
            });
        });
    };
    Popover.prototype._createPopperInstance = function () {
        return (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_0__.createPopper)(this._triggerEl, this._targetEl, {
            placement: this._options.placement,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, this._options.offset],
                    },
                },
            ],
        });
    };
    Popover.prototype._getTriggerEvents = function () {
        switch (this._options.triggerType) {
            case 'hover':
                return {
                    showEvents: ['mouseenter', 'focus'],
                    hideEvents: ['mouseleave', 'blur'],
                };
            case 'click':
                return {
                    showEvents: ['click', 'focus'],
                    hideEvents: ['focusout', 'blur'],
                };
            case 'none':
                return {
                    showEvents: [],
                    hideEvents: [],
                };
            default:
                return {
                    showEvents: ['mouseenter', 'focus'],
                    hideEvents: ['mouseleave', 'blur'],
                };
        }
    };
    Popover.prototype._setupKeydownListener = function () {
        var _this = this;
        this._keydownEventListener = function (ev) {
            if (ev.key === 'Escape') {
                _this.hide();
            }
        };
        document.body.addEventListener('keydown', this._keydownEventListener, true);
    };
    Popover.prototype._removeKeydownListener = function () {
        document.body.removeEventListener('keydown', this._keydownEventListener, true);
    };
    Popover.prototype._setupClickOutsideListener = function () {
        var _this = this;
        this._clickOutsideEventListener = function (ev) {
            _this._handleClickOutside(ev, _this._targetEl);
        };
        document.body.addEventListener('click', this._clickOutsideEventListener, true);
    };
    Popover.prototype._removeClickOutsideListener = function () {
        document.body.removeEventListener('click', this._clickOutsideEventListener, true);
    };
    Popover.prototype._handleClickOutside = function (ev, targetEl) {
        var clickedEl = ev.target;
        if (clickedEl !== targetEl &&
            !targetEl.contains(clickedEl) &&
            !this._triggerEl.contains(clickedEl) &&
            this.isVisible()) {
            this.hide();
        }
    };
    Popover.prototype.isVisible = function () {
        return this._visible;
    };
    Popover.prototype.toggle = function () {
        if (this.isVisible()) {
            this.hide();
        }
        else {
            this.show();
        }
        this._options.onToggle(this);
    };
    Popover.prototype.show = function () {
        this._targetEl.classList.remove('opacity-0', 'invisible');
        this._targetEl.classList.add('opacity-100', 'visible');
        // Enable the event listeners
        this._popperInstance.setOptions(function (options) { return (__assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                { name: 'eventListeners', enabled: true },
            ], false) })); });
        // handle click outside
        this._setupClickOutsideListener();
        // handle esc keydown
        this._setupKeydownListener();
        // Update its position
        this._popperInstance.update();
        // set visibility to true
        this._visible = true;
        // callback function
        this._options.onShow(this);
    };
    Popover.prototype.hide = function () {
        this._targetEl.classList.remove('opacity-100', 'visible');
        this._targetEl.classList.add('opacity-0', 'invisible');
        // Disable the event listeners
        this._popperInstance.setOptions(function (options) { return (__assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                { name: 'eventListeners', enabled: false },
            ], false) })); });
        // handle click outside
        this._removeClickOutsideListener();
        // handle esc keydown
        this._removeKeydownListener();
        // set visibility to false
        this._visible = false;
        // callback function
        this._options.onHide(this);
    };
    return Popover;
}());
if (typeof window !== 'undefined') {
    window.Popover = Popover;
}
function initPopovers() {
    document.querySelectorAll('[data-popover-target]').forEach(function ($triggerEl) {
        var popoverID = $triggerEl.getAttribute('data-popover-target');
        var $popoverEl = document.getElementById(popoverID);
        if ($popoverEl) {
            var triggerType = $triggerEl.getAttribute('data-popover-trigger');
            var placement = $triggerEl.getAttribute('data-popover-placement');
            var offset = $triggerEl.getAttribute('data-popover-offset');
            new Popover($popoverEl, $triggerEl, {
                placement: placement ? placement : Default.placement,
                offset: offset ? parseInt(offset) : Default.offset,
                triggerType: triggerType
                    ? triggerType
                    : Default.triggerType,
            });
        }
        else {
            console.error("The popover element with id \"".concat(popoverID, "\" does not exist. Please check the data-popover-target attribute."));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Popover);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/popover/interface.js":
/*!***********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/popover/interface.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/popover/types.js":
/*!*******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/popover/types.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/tabs/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/tabs/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initTabs: () => (/* binding */ initTabs)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Default = {
    defaultTabId: null,
    activeClasses: 'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500',
    inactiveClasses: 'dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
    onShow: function () { },
};
var Tabs = /** @class */ (function () {
    function Tabs(items, options) {
        if (items === void 0) { items = []; }
        if (options === void 0) { options = Default; }
        this._items = items;
        this._activeTab = options ? this.getTab(options.defaultTabId) : null;
        this._options = __assign(__assign({}, Default), options);
        this._init();
    }
    Tabs.prototype._init = function () {
        var _this = this;
        if (this._items.length) {
            // set the first tab as active if not set by explicitly
            if (!this._activeTab) {
                this._setActiveTab(this._items[0]);
            }
            // force show the first default tab
            this.show(this._activeTab.id, true);
            // show tab content based on click
            this._items.map(function (tab) {
                tab.triggerEl.addEventListener('click', function () {
                    _this.show(tab.id);
                });
            });
        }
    };
    Tabs.prototype.getActiveTab = function () {
        return this._activeTab;
    };
    Tabs.prototype._setActiveTab = function (tab) {
        this._activeTab = tab;
    };
    Tabs.prototype.getTab = function (id) {
        return this._items.filter(function (t) { return t.id === id; })[0];
    };
    Tabs.prototype.show = function (id, forceShow) {
        var _a, _b;
        var _this = this;
        if (forceShow === void 0) { forceShow = false; }
        var tab = this.getTab(id);
        // don't do anything if already active
        if (tab === this._activeTab && !forceShow) {
            return;
        }
        // hide other tabs
        this._items.map(function (t) {
            var _a, _b;
            if (t !== tab) {
                (_a = t.triggerEl.classList).remove.apply(_a, _this._options.activeClasses.split(' '));
                (_b = t.triggerEl.classList).add.apply(_b, _this._options.inactiveClasses.split(' '));
                t.targetEl.classList.add('hidden');
                t.triggerEl.setAttribute('aria-selected', 'false');
            }
        });
        // show active tab
        (_a = tab.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(' '));
        (_b = tab.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(' '));
        tab.triggerEl.setAttribute('aria-selected', 'true');
        tab.targetEl.classList.remove('hidden');
        this._setActiveTab(tab);
        // callback function
        this._options.onShow(this, tab);
    };
    return Tabs;
}());
if (typeof window !== 'undefined') {
    window.Tabs = Tabs;
}
function initTabs() {
    document.querySelectorAll('[data-tabs-toggle]').forEach(function ($triggerEl) {
        var tabItems = [];
        var defaultTabId = null;
        $triggerEl
            .querySelectorAll('[role="tab"]')
            .forEach(function ($triggerEl) {
            var isActive = $triggerEl.getAttribute('aria-selected') === 'true';
            var tab = {
                id: $triggerEl.getAttribute('data-tabs-target'),
                triggerEl: $triggerEl,
                targetEl: document.querySelector($triggerEl.getAttribute('data-tabs-target')),
            };
            tabItems.push(tab);
            if (isActive) {
                defaultTabId = tab.id;
            }
        });
        new Tabs(tabItems, {
            defaultTabId: defaultTabId,
        });
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tabs);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/tabs/interface.js":
/*!********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/tabs/interface.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/tabs/types.js":
/*!****************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/tabs/types.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/tooltip/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/tooltip/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initTooltips: () => (/* binding */ initTooltips)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable @typescript-eslint/no-empty-function */

var Default = {
    placement: 'top',
    triggerType: 'hover',
    onShow: function () { },
    onHide: function () { },
    onToggle: function () { },
};
var Tooltip = /** @class */ (function () {
    function Tooltip(targetEl, triggerEl, options) {
        if (targetEl === void 0) { targetEl = null; }
        if (triggerEl === void 0) { triggerEl = null; }
        if (options === void 0) { options = Default; }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign(__assign({}, Default), options);
        this._popperInstance = this._createPopperInstance();
        this._visible = false;
        this._init();
    }
    Tooltip.prototype._init = function () {
        if (this._triggerEl) {
            this._setupEventListeners();
        }
    };
    Tooltip.prototype._setupEventListeners = function () {
        var _this = this;
        var triggerEvents = this._getTriggerEvents();
        triggerEvents.showEvents.forEach(function (ev) {
            _this._triggerEl.addEventListener(ev, function () {
                _this.show();
            });
        });
        triggerEvents.hideEvents.forEach(function (ev) {
            _this._triggerEl.addEventListener(ev, function () {
                _this.hide();
            });
        });
    };
    Tooltip.prototype._createPopperInstance = function () {
        return (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_0__.createPopper)(this._triggerEl, this._targetEl, {
            placement: this._options.placement,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
            ],
        });
    };
    Tooltip.prototype._getTriggerEvents = function () {
        switch (this._options.triggerType) {
            case 'hover':
                return {
                    showEvents: ['mouseenter', 'focus'],
                    hideEvents: ['mouseleave', 'blur'],
                };
            case 'click':
                return {
                    showEvents: ['click', 'focus'],
                    hideEvents: ['focusout', 'blur'],
                };
            case 'none':
                return {
                    showEvents: [],
                    hideEvents: [],
                };
            default:
                return {
                    showEvents: ['mouseenter', 'focus'],
                    hideEvents: ['mouseleave', 'blur'],
                };
        }
    };
    Tooltip.prototype._setupKeydownListener = function () {
        var _this = this;
        this._keydownEventListener = function (ev) {
            if (ev.key === 'Escape') {
                _this.hide();
            }
        };
        document.body.addEventListener('keydown', this._keydownEventListener, true);
    };
    Tooltip.prototype._removeKeydownListener = function () {
        document.body.removeEventListener('keydown', this._keydownEventListener, true);
    };
    Tooltip.prototype._setupClickOutsideListener = function () {
        var _this = this;
        this._clickOutsideEventListener = function (ev) {
            _this._handleClickOutside(ev, _this._targetEl);
        };
        document.body.addEventListener('click', this._clickOutsideEventListener, true);
    };
    Tooltip.prototype._removeClickOutsideListener = function () {
        document.body.removeEventListener('click', this._clickOutsideEventListener, true);
    };
    Tooltip.prototype._handleClickOutside = function (ev, targetEl) {
        var clickedEl = ev.target;
        if (clickedEl !== targetEl &&
            !targetEl.contains(clickedEl) &&
            !this._triggerEl.contains(clickedEl) &&
            this.isVisible()) {
            this.hide();
        }
    };
    Tooltip.prototype.isVisible = function () {
        return this._visible;
    };
    Tooltip.prototype.toggle = function () {
        if (this.isVisible()) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    Tooltip.prototype.show = function () {
        this._targetEl.classList.remove('opacity-0', 'invisible');
        this._targetEl.classList.add('opacity-100', 'visible');
        // Enable the event listeners
        this._popperInstance.setOptions(function (options) { return (__assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                { name: 'eventListeners', enabled: true },
            ], false) })); });
        // handle click outside
        this._setupClickOutsideListener();
        // handle esc keydown
        this._setupKeydownListener();
        // Update its position
        this._popperInstance.update();
        // set visibility
        this._visible = true;
        // callback function
        this._options.onShow(this);
    };
    Tooltip.prototype.hide = function () {
        this._targetEl.classList.remove('opacity-100', 'visible');
        this._targetEl.classList.add('opacity-0', 'invisible');
        // Disable the event listeners
        this._popperInstance.setOptions(function (options) { return (__assign(__assign({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
                { name: 'eventListeners', enabled: false },
            ], false) })); });
        // handle click outside
        this._removeClickOutsideListener();
        // handle esc keydown
        this._removeKeydownListener();
        // set visibility
        this._visible = false;
        // callback function
        this._options.onHide(this);
    };
    return Tooltip;
}());
if (typeof window !== 'undefined') {
    window.Tooltip = Tooltip;
}
function initTooltips() {
    document.querySelectorAll('[data-tooltip-target]').forEach(function ($triggerEl) {
        var tooltipId = $triggerEl.getAttribute('data-tooltip-target');
        var $tooltipEl = document.getElementById(tooltipId);
        if ($tooltipEl) {
            var triggerType = $triggerEl.getAttribute('data-tooltip-trigger');
            var placement = $triggerEl.getAttribute('data-tooltip-placement');
            new Tooltip($tooltipEl, $triggerEl, {
                placement: placement ? placement : Default.placement,
                triggerType: triggerType
                    ? triggerType
                    : Default.triggerType,
            });
        }
        else {
            console.error("The tooltip element with id \"".concat(tooltipId, "\" does not exist. Please check the data-tooltip-target attribute."));
        }
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tooltip);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/tooltip/interface.js":
/*!***********************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/tooltip/interface.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=interface.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/components/tooltip/types.js":
/*!*******************************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/components/tooltip/types.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/dom/events.js":
/*!*****************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/dom/events.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Events = /** @class */ (function () {
    function Events(eventType, eventFunctions) {
        if (eventFunctions === void 0) { eventFunctions = []; }
        this._eventType = eventType;
        this._eventFunctions = eventFunctions;
    }
    Events.prototype.init = function () {
        var _this = this;
        this._eventFunctions.forEach(function (eventFunction) {
            if (typeof window !== 'undefined') {
                window.addEventListener(_this._eventType, eventFunction);
            }
        });
    };
    return Events;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Events);
//# sourceMappingURL=events.js.map

/***/ }),

/***/ "./node_modules/flowbite/lib/esm/index.js":
/*!************************************************!*\
  !*** ./node_modules/flowbite/lib/esm/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Accordion: () => (/* reexport safe */ _components_accordion__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   Carousel: () => (/* reexport safe */ _components_carousel__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   Collapse: () => (/* reexport safe */ _components_collapse__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   Dial: () => (/* reexport safe */ _components_dial__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   Dismiss: () => (/* reexport safe */ _components_dismiss__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   Drawer: () => (/* reexport safe */ _components_drawer__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   Dropdown: () => (/* reexport safe */ _components_dropdown__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   Modal: () => (/* reexport safe */ _components_modal__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   Popover: () => (/* reexport safe */ _components_popover__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   Tabs: () => (/* reexport safe */ _components_tabs__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   Tooltip: () => (/* reexport safe */ _components_tooltip__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   initAccordions: () => (/* reexport safe */ _components_accordion__WEBPACK_IMPORTED_MODULE_1__.initAccordions),
/* harmony export */   initCarousels: () => (/* reexport safe */ _components_carousel__WEBPACK_IMPORTED_MODULE_3__.initCarousels),
/* harmony export */   initCollapses: () => (/* reexport safe */ _components_collapse__WEBPACK_IMPORTED_MODULE_2__.initCollapses),
/* harmony export */   initDials: () => (/* reexport safe */ _components_dial__WEBPACK_IMPORTED_MODULE_11__.initDials),
/* harmony export */   initDismisses: () => (/* reexport safe */ _components_dismiss__WEBPACK_IMPORTED_MODULE_4__.initDismisses),
/* harmony export */   initDrawers: () => (/* reexport safe */ _components_drawer__WEBPACK_IMPORTED_MODULE_7__.initDrawers),
/* harmony export */   initDropdowns: () => (/* reexport safe */ _components_dropdown__WEBPACK_IMPORTED_MODULE_5__.initDropdowns),
/* harmony export */   initFlowbite: () => (/* reexport safe */ _components_index__WEBPACK_IMPORTED_MODULE_34__.initFlowbite),
/* harmony export */   initModals: () => (/* reexport safe */ _components_modal__WEBPACK_IMPORTED_MODULE_6__.initModals),
/* harmony export */   initPopovers: () => (/* reexport safe */ _components_popover__WEBPACK_IMPORTED_MODULE_10__.initPopovers),
/* harmony export */   initTabs: () => (/* reexport safe */ _components_tabs__WEBPACK_IMPORTED_MODULE_8__.initTabs),
/* harmony export */   initTooltips: () => (/* reexport safe */ _components_tooltip__WEBPACK_IMPORTED_MODULE_9__.initTooltips)
/* harmony export */ });
/* harmony import */ var _dom_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom/events */ "./node_modules/flowbite/lib/esm/dom/events.js");
/* harmony import */ var _components_accordion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/accordion */ "./node_modules/flowbite/lib/esm/components/accordion/index.js");
/* harmony import */ var _components_collapse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/collapse */ "./node_modules/flowbite/lib/esm/components/collapse/index.js");
/* harmony import */ var _components_carousel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/carousel */ "./node_modules/flowbite/lib/esm/components/carousel/index.js");
/* harmony import */ var _components_dismiss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/dismiss */ "./node_modules/flowbite/lib/esm/components/dismiss/index.js");
/* harmony import */ var _components_dropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/dropdown */ "./node_modules/flowbite/lib/esm/components/dropdown/index.js");
/* harmony import */ var _components_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/modal */ "./node_modules/flowbite/lib/esm/components/modal/index.js");
/* harmony import */ var _components_drawer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/drawer */ "./node_modules/flowbite/lib/esm/components/drawer/index.js");
/* harmony import */ var _components_tabs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/tabs */ "./node_modules/flowbite/lib/esm/components/tabs/index.js");
/* harmony import */ var _components_tooltip__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/tooltip */ "./node_modules/flowbite/lib/esm/components/tooltip/index.js");
/* harmony import */ var _components_popover__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/popover */ "./node_modules/flowbite/lib/esm/components/popover/index.js");
/* harmony import */ var _components_dial__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/dial */ "./node_modules/flowbite/lib/esm/components/dial/index.js");
/* harmony import */ var _components_accordion_types__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/accordion/types */ "./node_modules/flowbite/lib/esm/components/accordion/types.js");
/* harmony import */ var _components_carousel_types__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/carousel/types */ "./node_modules/flowbite/lib/esm/components/carousel/types.js");
/* harmony import */ var _components_collapse_types__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/collapse/types */ "./node_modules/flowbite/lib/esm/components/collapse/types.js");
/* harmony import */ var _components_dial_types__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/dial/types */ "./node_modules/flowbite/lib/esm/components/dial/types.js");
/* harmony import */ var _components_dismiss_types__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/dismiss/types */ "./node_modules/flowbite/lib/esm/components/dismiss/types.js");
/* harmony import */ var _components_drawer_types__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/drawer/types */ "./node_modules/flowbite/lib/esm/components/drawer/types.js");
/* harmony import */ var _components_dropdown_types__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/dropdown/types */ "./node_modules/flowbite/lib/esm/components/dropdown/types.js");
/* harmony import */ var _components_modal_types__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/modal/types */ "./node_modules/flowbite/lib/esm/components/modal/types.js");
/* harmony import */ var _components_popover_types__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/popover/types */ "./node_modules/flowbite/lib/esm/components/popover/types.js");
/* harmony import */ var _components_tabs_types__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/tabs/types */ "./node_modules/flowbite/lib/esm/components/tabs/types.js");
/* harmony import */ var _components_tooltip_types__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/tooltip/types */ "./node_modules/flowbite/lib/esm/components/tooltip/types.js");
/* harmony import */ var _components_accordion_interface__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/accordion/interface */ "./node_modules/flowbite/lib/esm/components/accordion/interface.js");
/* harmony import */ var _components_carousel_interface__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/carousel/interface */ "./node_modules/flowbite/lib/esm/components/carousel/interface.js");
/* harmony import */ var _components_collapse_interface__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./components/collapse/interface */ "./node_modules/flowbite/lib/esm/components/collapse/interface.js");
/* harmony import */ var _components_dial_interface__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./components/dial/interface */ "./node_modules/flowbite/lib/esm/components/dial/interface.js");
/* harmony import */ var _components_dismiss_interface__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./components/dismiss/interface */ "./node_modules/flowbite/lib/esm/components/dismiss/interface.js");
/* harmony import */ var _components_drawer_interface__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/drawer/interface */ "./node_modules/flowbite/lib/esm/components/drawer/interface.js");
/* harmony import */ var _components_dropdown_interface__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./components/dropdown/interface */ "./node_modules/flowbite/lib/esm/components/dropdown/interface.js");
/* harmony import */ var _components_modal_interface__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./components/modal/interface */ "./node_modules/flowbite/lib/esm/components/modal/interface.js");
/* harmony import */ var _components_popover_interface__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/popover/interface */ "./node_modules/flowbite/lib/esm/components/popover/interface.js");
/* harmony import */ var _components_tabs_interface__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./components/tabs/interface */ "./node_modules/flowbite/lib/esm/components/tabs/interface.js");
/* harmony import */ var _components_tooltip_interface__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./components/tooltip/interface */ "./node_modules/flowbite/lib/esm/components/tooltip/interface.js");
/* harmony import */ var _components_index__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./components/index */ "./node_modules/flowbite/lib/esm/components/index.js");












// setup events for data attributes
var events = new _dom_events__WEBPACK_IMPORTED_MODULE_0__["default"]('load', [
    _components_accordion__WEBPACK_IMPORTED_MODULE_1__.initAccordions,
    _components_collapse__WEBPACK_IMPORTED_MODULE_2__.initCollapses,
    _components_carousel__WEBPACK_IMPORTED_MODULE_3__.initCarousels,
    _components_dismiss__WEBPACK_IMPORTED_MODULE_4__.initDismisses,
    _components_dropdown__WEBPACK_IMPORTED_MODULE_5__.initDropdowns,
    _components_modal__WEBPACK_IMPORTED_MODULE_6__.initModals,
    _components_drawer__WEBPACK_IMPORTED_MODULE_7__.initDrawers,
    _components_tabs__WEBPACK_IMPORTED_MODULE_8__.initTabs,
    _components_tooltip__WEBPACK_IMPORTED_MODULE_9__.initTooltips,
    _components_popover__WEBPACK_IMPORTED_MODULE_10__.initPopovers,
    _components_dial__WEBPACK_IMPORTED_MODULE_11__.initDials,
]);
events.init();
// export all components











// export all types











// export all interfaces











// export init functions











// export all init functions

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/axios/dist/browser/axios.cjs":
/*!***************************************************!*\
  !*** ./node_modules/axios/dist/browser/axios.cjs ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
// Axios v1.4.0 Copyright (c) 2023 Matt Zabriskie and contributors


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : __webpack_require__.g)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0];
  }

  return str;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

var utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


var platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': undefined
};

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

var cookies = platform.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })();

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

var isURLSameOrigin = platform.isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else {
        requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (platform.isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};

utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const VERSION = "1.4.0";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    let contextHeaders;

    // Flatten headers
    contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    contextHeaders && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _twElements = __webpack_require__(/*! tw-elements */ "./node_modules/tw-elements/dist/js/tw-elements.es.min.js");
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");
__webpack_require__(/*! flowbite */ "./node_modules/flowbite/lib/esm/index.js");
var Alpine = __webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/module.esm.js");
window.Alpine = Alpine;

// Initialization for ES Users

(0, _twElements.initTE)({
  Collapse: _twElements.Collapse,
  Ripple: _twElements.Ripple
});
document.addEventListener('DOMContentLoaded', function () {
  var imageContainer = document.querySelector('.image-container');
  imageContainer.addEventListener('mouseover', function () {
    imageContainer.classList.add('hovered');
  });
  imageContainer.addEventListener('mouseout', function () {
    imageContainer.classList.remove('hovered');
  });
});

// const mainImageContainer = document.getElementById('main-image-container');
var mainImage = document.getElementById('main-image');
var imageContainers = document.querySelectorAll('.image-container');
imageContainers.forEach(function (container) {
  container.addEventListener('click', function () {
    var currentMainImage = mainImage.getAttribute('src');
    var clickedImage = container.querySelector('img');
    var clickedImageSrc = clickedImage.getAttribute('src');
    mainImage.setAttribute('src', clickedImageSrc);
    clickedImage.setAttribute('src', currentMainImage);
    container.dataset.image = currentMainImage;
  });
});

// function changeImage(img) {
//     document.getElementById('main-image').src=img.src;
// }

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "./node_modules/axios/dist/browser/axios.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = _axios["default"];
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });

/***/ }),

/***/ "./node_modules/tw-elements/dist/js/tw-elements.es.min.js":
/*!****************************************************************!*\
  !*** ./node_modules/tw-elements/dist/js/tw-elements.es.min.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: () => (/* binding */ Rn),
/* harmony export */   Animate: () => (/* binding */ ml),
/* harmony export */   Button: () => (/* binding */ $a),
/* harmony export */   Carousel: () => (/* binding */ Yt),
/* harmony export */   Chart: () => (/* binding */ Wl),
/* harmony export */   Chip: () => (/* binding */ ii),
/* harmony export */   ChipsInput: () => (/* binding */ Zg),
/* harmony export */   Collapse: () => (/* binding */ Ut),
/* harmony export */   Datepicker: () => (/* binding */ Gg),
/* harmony export */   Dropdown: () => (/* binding */ wt),
/* harmony export */   Input: () => (/* binding */ V),
/* harmony export */   Modal: () => (/* binding */ Pn),
/* harmony export */   Offcanvas: () => (/* binding */ rs),
/* harmony export */   Popover: () => (/* binding */ ll),
/* harmony export */   Ripple: () => (/* binding */ Cs),
/* harmony export */   ScrollSpy: () => (/* binding */ Bn),
/* harmony export */   Select: () => (/* binding */ Nl),
/* harmony export */   Sidenav: () => (/* binding */ ni),
/* harmony export */   Stepper: () => (/* binding */ Qg),
/* harmony export */   Tab: () => (/* binding */ hl),
/* harmony export */   Timepicker: () => (/* binding */ qg),
/* harmony export */   Toast: () => (/* binding */ Vn),
/* harmony export */   Tooltip: () => (/* binding */ vi),
/* harmony export */   initTE: () => (/* binding */ eg)
/* harmony export */ });
/*!
* Taliwind Elements 1.0.0-beta2
* 
* Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
* Copyright © 2023 MDBootstrap.com
* 
* Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
* In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
* 
*/
var Xl = Object.defineProperty;
var Gl = (s, t, e) => t in s ? Xl(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var Tt = (s, t, e) => (Gl(s, typeof t != "symbol" ? t + "" : t, e), e);
const Bs = (() => {
  const s = {};
  let t = 1;
  return {
    set(e, i, n) {
      typeof e[i] > "u" && (e[i] = {
        key: i,
        id: t
      }, t++), s[e[i].id] = n;
    },
    get(e, i) {
      if (!e || typeof e[i] > "u")
        return null;
      const n = e[i];
      return n.key === i ? s[n.id] : null;
    },
    delete(e, i) {
      if (typeof e[i] > "u")
        return;
      const n = e[i];
      n.key === i && (delete s[n.id], delete e[i]);
    }
  };
})(), I = {
  setData(s, t, e) {
    Bs.set(s, t, e);
  },
  getData(s, t) {
    return Bs.get(s, t);
  },
  removeData(s, t) {
    Bs.delete(s, t);
  }
}, ql = 1e6, Ql = 1e3, Dn = "transitionend", Zl = (s) => s == null ? `${s}` : {}.toString.call(s).match(/\s([a-z]+)/i)[1].toLowerCase(), Ot = (s) => {
  do
    s += Math.floor(Math.random() * ql);
  while (document.getElementById(s));
  return s;
}, va = (s) => {
  let t = s.getAttribute("data-te-target");
  if (!t || t === "#") {
    let e = s.getAttribute("href");
    if (!e || !e.includes("#") && !e.startsWith("."))
      return null;
    e.includes("#") && !e.startsWith("#") && (e = `#${e.split("#")[1]}`), t = e && e !== "#" ? e.trim() : null;
  }
  return t;
}, Xn = (s) => {
  const t = va(s);
  return t && document.querySelector(t) ? t : null;
}, Xt = (s) => {
  const t = va(s);
  return t ? document.querySelector(t) : null;
}, Jl = (s) => {
  if (!s)
    return 0;
  let { transitionDuration: t, transitionDelay: e } = window.getComputedStyle(s);
  const i = Number.parseFloat(t), n = Number.parseFloat(e);
  return !i && !n ? 0 : (t = t.split(",")[0], e = e.split(",")[0], (Number.parseFloat(t) + Number.parseFloat(e)) * Ql);
}, Ea = (s) => {
  s.dispatchEvent(new Event(Dn));
}, Ne = (s) => !s || typeof s != "object" ? !1 : (typeof s.jquery < "u" && (s = s[0]), typeof s.nodeType < "u"), Gt = (s) => Ne(s) ? s.jquery ? s[0] : s : typeof s == "string" && s.length > 0 ? document.querySelector(s) : null, N = (s, t, e) => {
  Object.keys(e).forEach((i) => {
    const n = e[i], o = t[i], r = o && Ne(o) ? "element" : Zl(o);
    if (!new RegExp(n).test(r))
      throw new Error(
        `${s.toUpperCase()}: Option "${i}" provided type "${r}" but expected type "${n}".`
      );
  });
}, St = (s) => {
  if (!s || s.getClientRects().length === 0)
    return !1;
  if (s.style && s.parentNode && s.parentNode.style) {
    const t = getComputedStyle(s), e = getComputedStyle(s.parentNode);
    return getComputedStyle(s).getPropertyValue("visibility") === "visible" || t.display !== "none" && e.display !== "none" && t.visibility !== "hidden";
  }
  return !1;
}, ue = (s) => !s || s.nodeType !== Node.ELEMENT_NODE || s.classList.contains("disabled") ? !0 : typeof s.disabled < "u" ? s.disabled : s.hasAttribute("disabled") && s.getAttribute("disabled") !== "false", Ta = (s) => {
  if (!document.documentElement.attachShadow)
    return null;
  if (typeof s.getRootNode == "function") {
    const t = s.getRootNode();
    return t instanceof ShadowRoot ? t : null;
  }
  return s instanceof ShadowRoot ? s : s.parentNode ? Ta(s.parentNode) : null;
}, vs = () => function() {
}, Fe = (s) => {
  s.offsetHeight;
}, Ca = () => {
  const { jQuery: s } = window;
  return s && !document.body.hasAttribute("data-te-no-jquery") ? s : null;
}, Vs = [], Aa = (s) => {
  document.readyState === "loading" ? (Vs.length || document.addEventListener("DOMContentLoaded", () => {
    Vs.forEach((t) => t());
  }), Vs.push(s)) : s();
}, F = () => document.documentElement.dir === "rtl", tc = (s) => Array.from(s), M = (s) => document.createElement(s), he = (s) => {
  typeof s == "function" && s();
}, ya = (s, t, e = !0) => {
  if (!e) {
    he(s);
    return;
  }
  const i = 5, n = Jl(t) + i;
  let o = !1;
  const r = ({ target: a }) => {
    a === t && (o = !0, t.removeEventListener(Dn, r), he(s));
  };
  t.addEventListener(Dn, r), setTimeout(() => {
    o || Ea(t);
  }, n);
}, wa = (s, t, e, i) => {
  let n = s.indexOf(t);
  if (n === -1)
    return s[!e && i ? s.length - 1 : 0];
  const o = s.length;
  return n += e ? 1 : -1, i && (n = (n + o) % o), s[Math.max(0, Math.min(n, o - 1))];
}, ec = /[^.]*(?=\..*)\.|.*/, ic = /\..*/, sc = /::\d+$/, Ws = {};
let Eo = 1;
const nc = {
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, oc = /^(mouseenter|mouseleave)/i, ka = /* @__PURE__ */ new Set([
  "click",
  "dblclick",
  "mouseup",
  "mousedown",
  "contextmenu",
  "mousewheel",
  "DOMMouseScroll",
  "mouseover",
  "mouseout",
  "mousemove",
  "selectstart",
  "selectend",
  "keydown",
  "keypress",
  "keyup",
  "orientationchange",
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerleave",
  "pointercancel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "focus",
  "blur",
  "change",
  "reset",
  "select",
  "submit",
  "focusin",
  "focusout",
  "load",
  "unload",
  "beforeunload",
  "resize",
  "move",
  "DOMContentLoaded",
  "readystatechange",
  "error",
  "abort",
  "scroll"
]);
function Oa(s, t) {
  return t && `${t}::${Eo++}` || s.uidEvent || Eo++;
}
function xa(s) {
  const t = Oa(s);
  return s.uidEvent = t, Ws[t] = Ws[t] || {}, Ws[t];
}
function rc(s, t) {
  return function e(i) {
    return i.delegateTarget = s, e.oneOff && u.off(s, i.type, t), t.apply(s, [i]);
  };
}
function ac(s, t, e) {
  return function i(n) {
    const o = s.querySelectorAll(t);
    for (let { target: r } = n; r && r !== this; r = r.parentNode)
      for (let a = o.length; a--; "")
        if (o[a] === r)
          return n.delegateTarget = r, i.oneOff && u.off(s, n.type, e), e.apply(r, [n]);
    return null;
  };
}
function Sa(s, t, e = null) {
  const i = Object.keys(s);
  for (let n = 0, o = i.length; n < o; n++) {
    const r = s[i[n]];
    if (r.originalHandler === t && r.delegationSelector === e)
      return r;
  }
  return null;
}
function Da(s, t, e) {
  const i = typeof t == "string", n = i ? e : t;
  let o = Ia(s);
  return ka.has(o) || (o = s), [i, n, o];
}
function To(s, t, e, i, n) {
  if (typeof t != "string" || !s)
    return;
  if (e || (e = i, i = null), oc.test(t)) {
    const m = (g) => function(b) {
      if (!b.relatedTarget || b.relatedTarget !== b.delegateTarget && !b.delegateTarget.contains(b.relatedTarget))
        return g.call(this, b);
    };
    i ? i = m(i) : e = m(e);
  }
  const [o, r, a] = Da(
    t,
    e,
    i
  ), l = xa(s), c = l[a] || (l[a] = {}), d = Sa(
    c,
    r,
    o ? e : null
  );
  if (d) {
    d.oneOff = d.oneOff && n;
    return;
  }
  const _ = Oa(
    r,
    t.replace(ec, "")
  ), f = o ? ac(s, e, i) : rc(s, e);
  f.delegationSelector = o ? e : null, f.originalHandler = r, f.oneOff = n, f.uidEvent = _, c[_] = f, s.addEventListener(a, f, o);
}
function In(s, t, e, i, n) {
  const o = Sa(t[e], i, n);
  o && (s.removeEventListener(e, o, !!n), delete t[e][o.uidEvent]);
}
function lc(s, t, e, i) {
  const n = t[e] || {};
  Object.keys(n).forEach((o) => {
    if (o.includes(i)) {
      const r = n[o];
      In(
        s,
        t,
        e,
        r.originalHandler,
        r.delegationSelector
      );
    }
  });
}
function Ia(s) {
  return s = s.replace(ic, ""), nc[s] || s;
}
const u = {
  on(s, t, e, i) {
    To(s, t, e, i, !1);
  },
  one(s, t, e, i) {
    To(s, t, e, i, !0);
  },
  off(s, t, e, i) {
    if (typeof t != "string" || !s)
      return;
    const [n, o, r] = Da(
      t,
      e,
      i
    ), a = r !== t, l = xa(s), c = t.startsWith(".");
    if (typeof o < "u") {
      if (!l || !l[r])
        return;
      In(
        s,
        l,
        r,
        o,
        n ? e : null
      );
      return;
    }
    c && Object.keys(l).forEach((_) => {
      lc(
        s,
        l,
        _,
        t.slice(1)
      );
    });
    const d = l[r] || {};
    Object.keys(d).forEach((_) => {
      const f = _.replace(sc, "");
      if (!a || t.includes(f)) {
        const m = d[_];
        In(
          s,
          l,
          r,
          m.originalHandler,
          m.delegationSelector
        );
      }
    });
  },
  trigger(s, t, e) {
    if (typeof t != "string" || !s)
      return null;
    const i = Ca(), n = Ia(t), o = t !== n, r = ka.has(n);
    let a, l = !0, c = !0, d = !1, _ = null;
    return o && i && (a = i.Event(t, e), i(s).trigger(a), l = !a.isPropagationStopped(), c = !a.isImmediatePropagationStopped(), d = a.isDefaultPrevented()), r ? (_ = document.createEvent("HTMLEvents"), _.initEvent(n, l, !0)) : _ = new CustomEvent(t, {
      bubbles: l,
      cancelable: !0
    }), typeof e < "u" && Object.keys(e).forEach((f) => {
      Object.defineProperty(_, f, {
        get() {
          return e[f];
        }
      });
    }), d && _.preventDefault(), c && s.dispatchEvent(_), _.defaultPrevented && typeof a < "u" && a.preventDefault(), _;
  }
}, ee = {
  on(s, t, e, i) {
    const n = t.split(" ");
    for (let o = 0; o < n.length; o++)
      u.on(s, n[o], e, i);
  },
  off(s, t, e, i) {
    const n = t.split(" ");
    for (let o = 0; o < n.length; o++)
      u.off(s, n[o], e, i);
  }
}, cc = "5.1.3";
class vt {
  constructor(t) {
    t = Gt(t), t && (this._element = t, I.setData(this._element, this.constructor.DATA_KEY, this));
  }
  dispose() {
    I.removeData(this._element, this.constructor.DATA_KEY), u.off(this._element, this.constructor.EVENT_KEY), Object.getOwnPropertyNames(this).forEach((t) => {
      this[t] = null;
    });
  }
  _queueCallback(t, e, i = !0) {
    ya(t, e, i);
  }
  /** Static */
  static getInstance(t) {
    return I.getData(Gt(t), this.DATA_KEY);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
  static get VERSION() {
    return cc;
  }
  static get NAME() {
    throw new Error(
      'You have to implement the static method "NAME", for each component!'
    );
  }
  static get DATA_KEY() {
    return `te.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
}
const dc = "button", hc = "active";
class $a extends vt {
  // Getters
  static get NAME() {
    return dc;
  }
  // Public
  toggle() {
    this._element.setAttribute(
      "aria-pressed",
      this._element.classList.toggle(hc)
    );
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = $a.getOrCreateInstance(this);
      t === "toggle" && e[t]();
    });
  }
}
var Z = "top", dt = "bottom", ht = "right", J = "left", mi = "auto", Ye = [Z, dt, ht, J], _e = "start", Re = "end", La = "clippingParents", Gn = "viewport", ye = "popper", Ma = "reference", $n = /* @__PURE__ */ Ye.reduce(function(s, t) {
  return s.concat([t + "-" + _e, t + "-" + Re]);
}, []), qn = /* @__PURE__ */ [].concat(Ye, [mi]).reduce(function(s, t) {
  return s.concat([t, t + "-" + _e, t + "-" + Re]);
}, []), Na = "beforeRead", Ra = "read", Pa = "afterRead", Ha = "beforeMain", Ba = "main", Va = "afterMain", Wa = "beforeWrite", Fa = "write", Ya = "afterWrite", Es = [Na, Ra, Pa, Ha, Ba, Va, Wa, Fa, Ya];
function It(s) {
  return s ? (s.nodeName || "").toLowerCase() : null;
}
function ut(s) {
  if (s == null)
    return window;
  if (s.toString() !== "[object Window]") {
    var t = s.ownerDocument;
    return t && t.defaultView || window;
  }
  return s;
}
function me(s) {
  var t = ut(s).Element;
  return s instanceof t || s instanceof Element;
}
function ct(s) {
  var t = ut(s).HTMLElement;
  return s instanceof t || s instanceof HTMLElement;
}
function Qn(s) {
  if (typeof ShadowRoot > "u")
    return !1;
  var t = ut(s).ShadowRoot;
  return s instanceof t || s instanceof ShadowRoot;
}
function uc(s) {
  var t = s.state;
  Object.keys(t.elements).forEach(function(e) {
    var i = t.styles[e] || {}, n = t.attributes[e] || {}, o = t.elements[e];
    !ct(o) || !It(o) || (Object.assign(o.style, i), Object.keys(n).forEach(function(r) {
      var a = n[r];
      a === !1 ? o.removeAttribute(r) : o.setAttribute(r, a === !0 ? "" : a);
    }));
  });
}
function pc(s) {
  var t = s.state, e = {
    popper: {
      position: t.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(t.elements.popper.style, e.popper), t.styles = e, t.elements.arrow && Object.assign(t.elements.arrow.style, e.arrow), function() {
    Object.keys(t.elements).forEach(function(i) {
      var n = t.elements[i], o = t.attributes[i] || {}, r = Object.keys(t.styles.hasOwnProperty(i) ? t.styles[i] : e[i]), a = r.reduce(function(l, c) {
        return l[c] = "", l;
      }, {});
      !ct(n) || !It(n) || (Object.assign(n.style, a), Object.keys(o).forEach(function(l) {
        n.removeAttribute(l);
      }));
    });
  };
}
const Zn = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: uc,
  effect: pc,
  requires: ["computeStyles"]
};
function gt(s) {
  return s.split("-")[0];
}
var pe = Math.max, Ts = Math.min, Pe = Math.round;
function Ln() {
  var s = navigator.userAgentData;
  return s != null && s.brands && Array.isArray(s.brands) ? s.brands.map(function(t) {
    return t.brand + "/" + t.version;
  }).join(" ") : navigator.userAgent;
}
function ja() {
  return !/^((?!chrome|android).)*safari/i.test(Ln());
}
function He(s, t, e) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  var i = s.getBoundingClientRect(), n = 1, o = 1;
  t && ct(s) && (n = s.offsetWidth > 0 && Pe(i.width) / s.offsetWidth || 1, o = s.offsetHeight > 0 && Pe(i.height) / s.offsetHeight || 1);
  var r = me(s) ? ut(s) : window, a = r.visualViewport, l = !ja() && e, c = (i.left + (l && a ? a.offsetLeft : 0)) / n, d = (i.top + (l && a ? a.offsetTop : 0)) / o, _ = i.width / n, f = i.height / o;
  return {
    width: _,
    height: f,
    top: d,
    right: c + _,
    bottom: d + f,
    left: c,
    x: c,
    y: d
  };
}
function Jn(s) {
  var t = He(s), e = s.offsetWidth, i = s.offsetHeight;
  return Math.abs(t.width - e) <= 1 && (e = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
    x: s.offsetLeft,
    y: s.offsetTop,
    width: e,
    height: i
  };
}
function Ka(s, t) {
  var e = t.getRootNode && t.getRootNode();
  if (s.contains(t))
    return !0;
  if (e && Qn(e)) {
    var i = t;
    do {
      if (i && s.isSameNode(i))
        return !0;
      i = i.parentNode || i.host;
    } while (i);
  }
  return !1;
}
function bt(s) {
  return ut(s).getComputedStyle(s);
}
function fc(s) {
  return ["table", "td", "th"].indexOf(It(s)) >= 0;
}
function qt(s) {
  return ((me(s) ? s.ownerDocument : (
    // $FlowFixMe[prop-missing]
    s.document
  )) || window.document).documentElement;
}
function ws(s) {
  return It(s) === "html" ? s : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    s.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    s.parentNode || // DOM Element detected
    (Qn(s) ? s.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    qt(s)
  );
}
function Co(s) {
  return !ct(s) || // https://github.com/popperjs/popper-core/issues/837
  bt(s).position === "fixed" ? null : s.offsetParent;
}
function _c(s) {
  var t = /firefox/i.test(Ln()), e = /Trident/i.test(Ln());
  if (e && ct(s)) {
    var i = bt(s);
    if (i.position === "fixed")
      return null;
  }
  var n = ws(s);
  for (Qn(n) && (n = n.host); ct(n) && ["html", "body"].indexOf(It(n)) < 0; ) {
    var o = bt(n);
    if (o.transform !== "none" || o.perspective !== "none" || o.contain === "paint" || ["transform", "perspective"].indexOf(o.willChange) !== -1 || t && o.willChange === "filter" || t && o.filter && o.filter !== "none")
      return n;
    n = n.parentNode;
  }
  return null;
}
function gi(s) {
  for (var t = ut(s), e = Co(s); e && fc(e) && bt(e).position === "static"; )
    e = Co(e);
  return e && (It(e) === "html" || It(e) === "body" && bt(e).position === "static") ? t : e || _c(s) || t;
}
function to(s) {
  return ["top", "bottom"].indexOf(s) >= 0 ? "x" : "y";
}
function li(s, t, e) {
  return pe(s, Ts(t, e));
}
function mc(s, t, e) {
  var i = li(s, t, e);
  return i > e ? e : i;
}
function Ua() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function za(s) {
  return Object.assign({}, Ua(), s);
}
function Xa(s, t) {
  return t.reduce(function(e, i) {
    return e[i] = s, e;
  }, {});
}
var gc = function(t, e) {
  return t = typeof t == "function" ? t(Object.assign({}, e.rects, {
    placement: e.placement
  })) : t, za(typeof t != "number" ? t : Xa(t, Ye));
};
function bc(s) {
  var t, e = s.state, i = s.name, n = s.options, o = e.elements.arrow, r = e.modifiersData.popperOffsets, a = gt(e.placement), l = to(a), c = [J, ht].indexOf(a) >= 0, d = c ? "height" : "width";
  if (!(!o || !r)) {
    var _ = gc(n.padding, e), f = Jn(o), m = l === "y" ? Z : J, g = l === "y" ? dt : ht, b = e.rects.reference[d] + e.rects.reference[l] - r[l] - e.rects.popper[d], T = r[l] - e.rects.reference[l], C = gi(o), w = C ? l === "y" ? C.clientHeight || 0 : C.clientWidth || 0 : 0, v = b / 2 - T / 2, E = _[m], A = w - f[d] - _[g], y = w / 2 - f[d] / 2 + v, S = li(E, y, A), O = l;
    e.modifiersData[i] = (t = {}, t[O] = S, t.centerOffset = S - y, t);
  }
}
function vc(s) {
  var t = s.state, e = s.options, i = e.element, n = i === void 0 ? "[data-popper-arrow]" : i;
  if (n != null && !(typeof n == "string" && (n = t.elements.popper.querySelector(n), !n))) {
    if ({}.NODE_ENV !== "production" && (ct(n) || console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "))), !Ka(t.elements.popper, n)) {
      ({}).NODE_ENV !== "production" && console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
      return;
    }
    t.elements.arrow = n;
  }
}
const Ga = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: bc,
  effect: vc,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function Be(s) {
  return s.split("-")[1];
}
var Ec = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function Tc(s, t) {
  var e = s.x, i = s.y, n = t.devicePixelRatio || 1;
  return {
    x: Pe(e * n) / n || 0,
    y: Pe(i * n) / n || 0
  };
}
function Ao(s) {
  var t, e = s.popper, i = s.popperRect, n = s.placement, o = s.variation, r = s.offsets, a = s.position, l = s.gpuAcceleration, c = s.adaptive, d = s.roundOffsets, _ = s.isFixed, f = r.x, m = f === void 0 ? 0 : f, g = r.y, b = g === void 0 ? 0 : g, T = typeof d == "function" ? d({
    x: m,
    y: b
  }) : {
    x: m,
    y: b
  };
  m = T.x, b = T.y;
  var C = r.hasOwnProperty("x"), w = r.hasOwnProperty("y"), v = J, E = Z, A = window;
  if (c) {
    var y = gi(e), S = "clientHeight", O = "clientWidth";
    if (y === ut(e) && (y = qt(e), bt(y).position !== "static" && a === "absolute" && (S = "scrollHeight", O = "scrollWidth")), y = y, n === Z || (n === J || n === ht) && o === Re) {
      E = dt;
      var k = _ && y === A && A.visualViewport ? A.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        y[S]
      );
      b -= k - i.height, b *= l ? 1 : -1;
    }
    if (n === J || (n === Z || n === dt) && o === Re) {
      v = ht;
      var D = _ && y === A && A.visualViewport ? A.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        y[O]
      );
      m -= D - i.width, m *= l ? 1 : -1;
    }
  }
  var x = Object.assign({
    position: a
  }, c && Ec), $ = d === !0 ? Tc({
    x: m,
    y: b
  }, ut(e)) : {
    x: m,
    y: b
  };
  if (m = $.x, b = $.y, l) {
    var P;
    return Object.assign({}, x, (P = {}, P[E] = w ? "0" : "", P[v] = C ? "0" : "", P.transform = (A.devicePixelRatio || 1) <= 1 ? "translate(" + m + "px, " + b + "px)" : "translate3d(" + m + "px, " + b + "px, 0)", P));
  }
  return Object.assign({}, x, (t = {}, t[E] = w ? b + "px" : "", t[v] = C ? m + "px" : "", t.transform = "", t));
}
function Cc(s) {
  var t = s.state, e = s.options, i = e.gpuAcceleration, n = i === void 0 ? !0 : i, o = e.adaptive, r = o === void 0 ? !0 : o, a = e.roundOffsets, l = a === void 0 ? !0 : a;
  if ({}.NODE_ENV !== "production") {
    var c = bt(t.elements.popper).transitionProperty || "";
    r && ["transform", "top", "right", "bottom", "left"].some(function(_) {
      return c.indexOf(_) >= 0;
    }) && console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', `

`, 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", `

`, "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
  }
  var d = {
    placement: gt(t.placement),
    variation: Be(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: n,
    isFixed: t.options.strategy === "fixed"
  };
  t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, Ao(Object.assign({}, d, {
    offsets: t.modifiersData.popperOffsets,
    position: t.options.strategy,
    adaptive: r,
    roundOffsets: l
  })))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, Ao(Object.assign({}, d, {
    offsets: t.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: l
  })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-placement": t.placement
  });
}
const eo = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Cc,
  data: {}
};
var Di = {
  passive: !0
};
function Ac(s) {
  var t = s.state, e = s.instance, i = s.options, n = i.scroll, o = n === void 0 ? !0 : n, r = i.resize, a = r === void 0 ? !0 : r, l = ut(t.elements.popper), c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return o && c.forEach(function(d) {
    d.addEventListener("scroll", e.update, Di);
  }), a && l.addEventListener("resize", e.update, Di), function() {
    o && c.forEach(function(d) {
      d.removeEventListener("scroll", e.update, Di);
    }), a && l.removeEventListener("resize", e.update, Di);
  };
}
const io = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: Ac,
  data: {}
};
var yc = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function ss(s) {
  return s.replace(/left|right|bottom|top/g, function(t) {
    return yc[t];
  });
}
var wc = {
  start: "end",
  end: "start"
};
function yo(s) {
  return s.replace(/start|end/g, function(t) {
    return wc[t];
  });
}
function so(s) {
  var t = ut(s), e = t.pageXOffset, i = t.pageYOffset;
  return {
    scrollLeft: e,
    scrollTop: i
  };
}
function no(s) {
  return He(qt(s)).left + so(s).scrollLeft;
}
function kc(s, t) {
  var e = ut(s), i = qt(s), n = e.visualViewport, o = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (n) {
    o = n.width, r = n.height;
    var c = ja();
    (c || !c && t === "fixed") && (a = n.offsetLeft, l = n.offsetTop);
  }
  return {
    width: o,
    height: r,
    x: a + no(s),
    y: l
  };
}
function Oc(s) {
  var t, e = qt(s), i = so(s), n = (t = s.ownerDocument) == null ? void 0 : t.body, o = pe(e.scrollWidth, e.clientWidth, n ? n.scrollWidth : 0, n ? n.clientWidth : 0), r = pe(e.scrollHeight, e.clientHeight, n ? n.scrollHeight : 0, n ? n.clientHeight : 0), a = -i.scrollLeft + no(s), l = -i.scrollTop;
  return bt(n || e).direction === "rtl" && (a += pe(e.clientWidth, n ? n.clientWidth : 0) - o), {
    width: o,
    height: r,
    x: a,
    y: l
  };
}
function oo(s) {
  var t = bt(s), e = t.overflow, i = t.overflowX, n = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(e + n + i);
}
function qa(s) {
  return ["html", "body", "#document"].indexOf(It(s)) >= 0 ? s.ownerDocument.body : ct(s) && oo(s) ? s : qa(ws(s));
}
function ci(s, t) {
  var e;
  t === void 0 && (t = []);
  var i = qa(s), n = i === ((e = s.ownerDocument) == null ? void 0 : e.body), o = ut(i), r = n ? [o].concat(o.visualViewport || [], oo(i) ? i : []) : i, a = t.concat(r);
  return n ? a : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    a.concat(ci(ws(r)))
  );
}
function Mn(s) {
  return Object.assign({}, s, {
    left: s.x,
    top: s.y,
    right: s.x + s.width,
    bottom: s.y + s.height
  });
}
function xc(s, t) {
  var e = He(s, !1, t === "fixed");
  return e.top = e.top + s.clientTop, e.left = e.left + s.clientLeft, e.bottom = e.top + s.clientHeight, e.right = e.left + s.clientWidth, e.width = s.clientWidth, e.height = s.clientHeight, e.x = e.left, e.y = e.top, e;
}
function wo(s, t, e) {
  return t === Gn ? Mn(kc(s, e)) : me(t) ? xc(t, e) : Mn(Oc(qt(s)));
}
function Sc(s) {
  var t = ci(ws(s)), e = ["absolute", "fixed"].indexOf(bt(s).position) >= 0, i = e && ct(s) ? gi(s) : s;
  return me(i) ? t.filter(function(n) {
    return me(n) && Ka(n, i) && It(n) !== "body";
  }) : [];
}
function Dc(s, t, e, i) {
  var n = t === "clippingParents" ? Sc(s) : [].concat(t), o = [].concat(n, [e]), r = o[0], a = o.reduce(function(l, c) {
    var d = wo(s, c, i);
    return l.top = pe(d.top, l.top), l.right = Ts(d.right, l.right), l.bottom = Ts(d.bottom, l.bottom), l.left = pe(d.left, l.left), l;
  }, wo(s, r, i));
  return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
function Qa(s) {
  var t = s.reference, e = s.element, i = s.placement, n = i ? gt(i) : null, o = i ? Be(i) : null, r = t.x + t.width / 2 - e.width / 2, a = t.y + t.height / 2 - e.height / 2, l;
  switch (n) {
    case Z:
      l = {
        x: r,
        y: t.y - e.height
      };
      break;
    case dt:
      l = {
        x: r,
        y: t.y + t.height
      };
      break;
    case ht:
      l = {
        x: t.x + t.width,
        y: a
      };
      break;
    case J:
      l = {
        x: t.x - e.width,
        y: a
      };
      break;
    default:
      l = {
        x: t.x,
        y: t.y
      };
  }
  var c = n ? to(n) : null;
  if (c != null) {
    var d = c === "y" ? "height" : "width";
    switch (o) {
      case _e:
        l[c] = l[c] - (t[d] / 2 - e[d] / 2);
        break;
      case Re:
        l[c] = l[c] + (t[d] / 2 - e[d] / 2);
        break;
    }
  }
  return l;
}
function Ve(s, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, n = i === void 0 ? s.placement : i, o = e.strategy, r = o === void 0 ? s.strategy : o, a = e.boundary, l = a === void 0 ? La : a, c = e.rootBoundary, d = c === void 0 ? Gn : c, _ = e.elementContext, f = _ === void 0 ? ye : _, m = e.altBoundary, g = m === void 0 ? !1 : m, b = e.padding, T = b === void 0 ? 0 : b, C = za(typeof T != "number" ? T : Xa(T, Ye)), w = f === ye ? Ma : ye, v = s.rects.popper, E = s.elements[g ? w : f], A = Dc(me(E) ? E : E.contextElement || qt(s.elements.popper), l, d, r), y = He(s.elements.reference), S = Qa({
    reference: y,
    element: v,
    strategy: "absolute",
    placement: n
  }), O = Mn(Object.assign({}, v, S)), k = f === ye ? O : y, D = {
    top: A.top - k.top + C.top,
    bottom: k.bottom - A.bottom + C.bottom,
    left: A.left - k.left + C.left,
    right: k.right - A.right + C.right
  }, x = s.modifiersData.offset;
  if (f === ye && x) {
    var $ = x[n];
    Object.keys(D).forEach(function(P) {
      var tt = [ht, dt].indexOf(P) >= 0 ? 1 : -1, et = [Z, dt].indexOf(P) >= 0 ? "y" : "x";
      D[P] += $[et] * tt;
    });
  }
  return D;
}
function Ic(s, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, n = e.boundary, o = e.rootBoundary, r = e.padding, a = e.flipVariations, l = e.allowedAutoPlacements, c = l === void 0 ? qn : l, d = Be(i), _ = d ? a ? $n : $n.filter(function(g) {
    return Be(g) === d;
  }) : Ye, f = _.filter(function(g) {
    return c.indexOf(g) >= 0;
  });
  f.length === 0 && (f = _, {}.NODE_ENV !== "production" && console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" ")));
  var m = f.reduce(function(g, b) {
    return g[b] = Ve(s, {
      placement: b,
      boundary: n,
      rootBoundary: o,
      padding: r
    })[gt(b)], g;
  }, {});
  return Object.keys(m).sort(function(g, b) {
    return m[g] - m[b];
  });
}
function $c(s) {
  if (gt(s) === mi)
    return [];
  var t = ss(s);
  return [yo(s), t, yo(t)];
}
function Lc(s) {
  var t = s.state, e = s.options, i = s.name;
  if (!t.modifiersData[i]._skip) {
    for (var n = e.mainAxis, o = n === void 0 ? !0 : n, r = e.altAxis, a = r === void 0 ? !0 : r, l = e.fallbackPlacements, c = e.padding, d = e.boundary, _ = e.rootBoundary, f = e.altBoundary, m = e.flipVariations, g = m === void 0 ? !0 : m, b = e.allowedAutoPlacements, T = t.options.placement, C = gt(T), w = C === T, v = l || (w || !g ? [ss(T)] : $c(T)), E = [T].concat(v).reduce(function(be, Nt) {
      return be.concat(gt(Nt) === mi ? Ic(t, {
        placement: Nt,
        boundary: d,
        rootBoundary: _,
        padding: c,
        flipVariations: g,
        allowedAutoPlacements: b
      }) : Nt);
    }, []), A = t.rects.reference, y = t.rects.popper, S = /* @__PURE__ */ new Map(), O = !0, k = E[0], D = 0; D < E.length; D++) {
      var x = E[D], $ = gt(x), P = Be(x) === _e, tt = [Z, dt].indexOf($) >= 0, et = tt ? "width" : "height", z = Ve(t, {
        placement: x,
        boundary: d,
        rootBoundary: _,
        altBoundary: f,
        padding: c
      }), _t = tt ? P ? ht : J : P ? dt : Z;
      A[et] > y[et] && (_t = ss(_t));
      var wi = ss(_t), Zt = [];
      if (o && Zt.push(z[$] <= 0), a && Zt.push(z[_t] <= 0, z[wi] <= 0), Zt.every(function(be) {
        return be;
      })) {
        k = x, O = !1;
        break;
      }
      S.set(x, Zt);
    }
    if (O)
      for (var ki = g ? 3 : 1, Ns = function(Nt) {
        var Xe = E.find(function(xi) {
          var Jt = S.get(xi);
          if (Jt)
            return Jt.slice(0, Nt).every(function(Rs) {
              return Rs;
            });
        });
        if (Xe)
          return k = Xe, "break";
      }, ze = ki; ze > 0; ze--) {
        var Oi = Ns(ze);
        if (Oi === "break")
          break;
      }
    t.placement !== k && (t.modifiersData[i]._skip = !0, t.placement = k, t.reset = !0);
  }
}
const Za = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Lc,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function ko(s, t, e) {
  return e === void 0 && (e = {
    x: 0,
    y: 0
  }), {
    top: s.top - t.height - e.y,
    right: s.right - t.width + e.x,
    bottom: s.bottom - t.height + e.y,
    left: s.left - t.width - e.x
  };
}
function Oo(s) {
  return [Z, ht, dt, J].some(function(t) {
    return s[t] >= 0;
  });
}
function Mc(s) {
  var t = s.state, e = s.name, i = t.rects.reference, n = t.rects.popper, o = t.modifiersData.preventOverflow, r = Ve(t, {
    elementContext: "reference"
  }), a = Ve(t, {
    altBoundary: !0
  }), l = ko(r, i), c = ko(a, n, o), d = Oo(l), _ = Oo(c);
  t.modifiersData[e] = {
    referenceClippingOffsets: l,
    popperEscapeOffsets: c,
    isReferenceHidden: d,
    hasPopperEscaped: _
  }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-reference-hidden": d,
    "data-popper-escaped": _
  });
}
const Ja = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Mc
};
function Nc(s, t, e) {
  var i = gt(s), n = [J, Z].indexOf(i) >= 0 ? -1 : 1, o = typeof e == "function" ? e(Object.assign({}, t, {
    placement: s
  })) : e, r = o[0], a = o[1];
  return r = r || 0, a = (a || 0) * n, [J, ht].indexOf(i) >= 0 ? {
    x: a,
    y: r
  } : {
    x: r,
    y: a
  };
}
function Rc(s) {
  var t = s.state, e = s.options, i = s.name, n = e.offset, o = n === void 0 ? [0, 0] : n, r = qn.reduce(function(d, _) {
    return d[_] = Nc(_, t.rects, o), d;
  }, {}), a = r[t.placement], l = a.x, c = a.y;
  t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += c), t.modifiersData[i] = r;
}
const tl = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: Rc
};
function Pc(s) {
  var t = s.state, e = s.name;
  t.modifiersData[e] = Qa({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement
  });
}
const ro = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Pc,
  data: {}
};
function Hc(s) {
  return s === "x" ? "y" : "x";
}
function Bc(s) {
  var t = s.state, e = s.options, i = s.name, n = e.mainAxis, o = n === void 0 ? !0 : n, r = e.altAxis, a = r === void 0 ? !1 : r, l = e.boundary, c = e.rootBoundary, d = e.altBoundary, _ = e.padding, f = e.tether, m = f === void 0 ? !0 : f, g = e.tetherOffset, b = g === void 0 ? 0 : g, T = Ve(t, {
    boundary: l,
    rootBoundary: c,
    padding: _,
    altBoundary: d
  }), C = gt(t.placement), w = Be(t.placement), v = !w, E = to(C), A = Hc(E), y = t.modifiersData.popperOffsets, S = t.rects.reference, O = t.rects.popper, k = typeof b == "function" ? b(Object.assign({}, t.rects, {
    placement: t.placement
  })) : b, D = typeof k == "number" ? {
    mainAxis: k,
    altAxis: k
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, k), x = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, $ = {
    x: 0,
    y: 0
  };
  if (y) {
    if (o) {
      var P, tt = E === "y" ? Z : J, et = E === "y" ? dt : ht, z = E === "y" ? "height" : "width", _t = y[E], wi = _t + T[tt], Zt = _t - T[et], ki = m ? -O[z] / 2 : 0, Ns = w === _e ? S[z] : O[z], ze = w === _e ? -O[z] : -S[z], Oi = t.elements.arrow, be = m && Oi ? Jn(Oi) : {
        width: 0,
        height: 0
      }, Nt = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : Ua(), Xe = Nt[tt], xi = Nt[et], Jt = li(0, S[z], be[z]), Rs = v ? S[z] / 2 - ki - Jt - Xe - D.mainAxis : Ns - Jt - Xe - D.mainAxis, Fl = v ? -S[z] / 2 + ki + Jt + xi + D.mainAxis : ze + Jt + xi + D.mainAxis, Ps = t.elements.arrow && gi(t.elements.arrow), Yl = Ps ? E === "y" ? Ps.clientTop || 0 : Ps.clientLeft || 0 : 0, ho = (P = x == null ? void 0 : x[E]) != null ? P : 0, jl = _t + Rs - ho - Yl, Kl = _t + Fl - ho, uo = li(m ? Ts(wi, jl) : wi, _t, m ? pe(Zt, Kl) : Zt);
      y[E] = uo, $[E] = uo - _t;
    }
    if (a) {
      var po, Ul = E === "x" ? Z : J, zl = E === "x" ? dt : ht, te = y[A], Si = A === "y" ? "height" : "width", fo = te + T[Ul], _o = te - T[zl], Hs = [Z, J].indexOf(C) !== -1, mo = (po = x == null ? void 0 : x[A]) != null ? po : 0, go = Hs ? fo : te - S[Si] - O[Si] - mo + D.altAxis, bo = Hs ? te + S[Si] + O[Si] - mo - D.altAxis : _o, vo = m && Hs ? mc(go, te, bo) : li(m ? go : fo, te, m ? bo : _o);
      y[A] = vo, $[A] = vo - te;
    }
    t.modifiersData[i] = $;
  }
}
const el = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Bc,
  requiresIfExists: ["offset"]
};
function Vc(s) {
  return {
    scrollLeft: s.scrollLeft,
    scrollTop: s.scrollTop
  };
}
function Wc(s) {
  return s === ut(s) || !ct(s) ? so(s) : Vc(s);
}
function Fc(s) {
  var t = s.getBoundingClientRect(), e = Pe(t.width) / s.offsetWidth || 1, i = Pe(t.height) / s.offsetHeight || 1;
  return e !== 1 || i !== 1;
}
function Yc(s, t, e) {
  e === void 0 && (e = !1);
  var i = ct(t), n = ct(t) && Fc(t), o = qt(t), r = He(s, n, e), a = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = {
    x: 0,
    y: 0
  };
  return (i || !i && !e) && ((It(t) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  oo(o)) && (a = Wc(t)), ct(t) ? (l = He(t, !0), l.x += t.clientLeft, l.y += t.clientTop) : o && (l.x = no(o))), {
    x: r.left + a.scrollLeft - l.x,
    y: r.top + a.scrollTop - l.y,
    width: r.width,
    height: r.height
  };
}
function jc(s) {
  var t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), i = [];
  s.forEach(function(o) {
    t.set(o.name, o);
  });
  function n(o) {
    e.add(o.name);
    var r = [].concat(o.requires || [], o.requiresIfExists || []);
    r.forEach(function(a) {
      if (!e.has(a)) {
        var l = t.get(a);
        l && n(l);
      }
    }), i.push(o);
  }
  return s.forEach(function(o) {
    e.has(o.name) || n(o);
  }), i;
}
function Kc(s) {
  var t = jc(s);
  return Es.reduce(function(e, i) {
    return e.concat(t.filter(function(n) {
      return n.phase === i;
    }));
  }, []);
}
function Uc(s) {
  var t;
  return function() {
    return t || (t = new Promise(function(e) {
      Promise.resolve().then(function() {
        t = void 0, e(s());
      });
    })), t;
  };
}
function Rt(s) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return [].concat(e).reduce(function(n, o) {
    return n.replace(/%s/, o);
  }, s);
}
var ie = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s', zc = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available', xo = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
function Xc(s) {
  s.forEach(function(t) {
    [].concat(Object.keys(t), xo).filter(function(e, i, n) {
      return n.indexOf(e) === i;
    }).forEach(function(e) {
      switch (e) {
        case "name":
          typeof t.name != "string" && console.error(Rt(ie, String(t.name), '"name"', '"string"', '"' + String(t.name) + '"'));
          break;
        case "enabled":
          typeof t.enabled != "boolean" && console.error(Rt(ie, t.name, '"enabled"', '"boolean"', '"' + String(t.enabled) + '"'));
          break;
        case "phase":
          Es.indexOf(t.phase) < 0 && console.error(Rt(ie, t.name, '"phase"', "either " + Es.join(", "), '"' + String(t.phase) + '"'));
          break;
        case "fn":
          typeof t.fn != "function" && console.error(Rt(ie, t.name, '"fn"', '"function"', '"' + String(t.fn) + '"'));
          break;
        case "effect":
          t.effect != null && typeof t.effect != "function" && console.error(Rt(ie, t.name, '"effect"', '"function"', '"' + String(t.fn) + '"'));
          break;
        case "requires":
          t.requires != null && !Array.isArray(t.requires) && console.error(Rt(ie, t.name, '"requires"', '"array"', '"' + String(t.requires) + '"'));
          break;
        case "requiresIfExists":
          Array.isArray(t.requiresIfExists) || console.error(Rt(ie, t.name, '"requiresIfExists"', '"array"', '"' + String(t.requiresIfExists) + '"'));
          break;
        case "options":
        case "data":
          break;
        default:
          console.error('PopperJS: an invalid property has been provided to the "' + t.name + '" modifier, valid properties are ' + xo.map(function(i) {
            return '"' + i + '"';
          }).join(", ") + '; but "' + e + '" was provided.');
      }
      t.requires && t.requires.forEach(function(i) {
        s.find(function(n) {
          return n.name === i;
        }) == null && console.error(Rt(zc, String(t.name), i, i));
      });
    });
  });
}
function Gc(s, t) {
  var e = /* @__PURE__ */ new Set();
  return s.filter(function(i) {
    var n = t(i);
    if (!e.has(n))
      return e.add(n), !0;
  });
}
function qc(s) {
  var t = s.reduce(function(e, i) {
    var n = e[i.name];
    return e[i.name] = n ? Object.assign({}, n, i, {
      options: Object.assign({}, n.options, i.options),
      data: Object.assign({}, n.data, i.data)
    }) : i, e;
  }, {});
  return Object.keys(t).map(function(e) {
    return t[e];
  });
}
var So = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.", Qc = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.", Do = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Io() {
  for (var s = arguments.length, t = new Array(s), e = 0; e < s; e++)
    t[e] = arguments[e];
  return !t.some(function(i) {
    return !(i && typeof i.getBoundingClientRect == "function");
  });
}
function ks(s) {
  s === void 0 && (s = {});
  var t = s, e = t.defaultModifiers, i = e === void 0 ? [] : e, n = t.defaultOptions, o = n === void 0 ? Do : n;
  return function(a, l, c) {
    c === void 0 && (c = o);
    var d = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Do, o),
      modifiersData: {},
      elements: {
        reference: a,
        popper: l
      },
      attributes: {},
      styles: {}
    }, _ = [], f = !1, m = {
      state: d,
      setOptions: function(C) {
        var w = typeof C == "function" ? C(d.options) : C;
        b(), d.options = Object.assign({}, o, d.options, w), d.scrollParents = {
          reference: me(a) ? ci(a) : a.contextElement ? ci(a.contextElement) : [],
          popper: ci(l)
        };
        var v = Kc(qc([].concat(i, d.options.modifiers)));
        if (d.orderedModifiers = v.filter(function(x) {
          return x.enabled;
        }), {}.NODE_ENV !== "production") {
          var E = Gc([].concat(v, d.options.modifiers), function(x) {
            var $ = x.name;
            return $;
          });
          if (Xc(E), gt(d.options.placement) === mi) {
            var A = d.orderedModifiers.find(function(x) {
              var $ = x.name;
              return $ === "flip";
            });
            A || console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
          }
          var y = bt(l), S = y.marginTop, O = y.marginRight, k = y.marginBottom, D = y.marginLeft;
          [S, O, k, D].some(function(x) {
            return parseFloat(x);
          }) && console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
        }
        return g(), m.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!f) {
          var C = d.elements, w = C.reference, v = C.popper;
          if (!Io(w, v)) {
            ({}).NODE_ENV !== "production" && console.error(So);
            return;
          }
          d.rects = {
            reference: Yc(w, gi(v), d.options.strategy === "fixed"),
            popper: Jn(v)
          }, d.reset = !1, d.placement = d.options.placement, d.orderedModifiers.forEach(function(x) {
            return d.modifiersData[x.name] = Object.assign({}, x.data);
          });
          for (var E = 0, A = 0; A < d.orderedModifiers.length; A++) {
            if ({}.NODE_ENV !== "production" && (E += 1, E > 100)) {
              console.error(Qc);
              break;
            }
            if (d.reset === !0) {
              d.reset = !1, A = -1;
              continue;
            }
            var y = d.orderedModifiers[A], S = y.fn, O = y.options, k = O === void 0 ? {} : O, D = y.name;
            typeof S == "function" && (d = S({
              state: d,
              options: k,
              name: D,
              instance: m
            }) || d);
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Uc(function() {
        return new Promise(function(T) {
          m.forceUpdate(), T(d);
        });
      }),
      destroy: function() {
        b(), f = !0;
      }
    };
    if (!Io(a, l))
      return {}.NODE_ENV !== "production" && console.error(So), m;
    m.setOptions(c).then(function(T) {
      !f && c.onFirstUpdate && c.onFirstUpdate(T);
    });
    function g() {
      d.orderedModifiers.forEach(function(T) {
        var C = T.name, w = T.options, v = w === void 0 ? {} : w, E = T.effect;
        if (typeof E == "function") {
          var A = E({
            state: d,
            name: C,
            instance: m,
            options: v
          }), y = function() {
          };
          _.push(A || y);
        }
      });
    }
    function b() {
      _.forEach(function(T) {
        return T();
      }), _ = [];
    }
    return m;
  };
}
var Zc = /* @__PURE__ */ ks(), Jc = [io, ro, eo, Zn], td = /* @__PURE__ */ ks({
  defaultModifiers: Jc
}), ed = [io, ro, eo, Zn, tl, Za, el, Ga, Ja], je = /* @__PURE__ */ ks({
  defaultModifiers: ed
});
const il = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  afterMain: Va,
  afterRead: Pa,
  afterWrite: Ya,
  applyStyles: Zn,
  arrow: Ga,
  auto: mi,
  basePlacements: Ye,
  beforeMain: Ha,
  beforeRead: Na,
  beforeWrite: Wa,
  bottom: dt,
  clippingParents: La,
  computeStyles: eo,
  createPopper: je,
  createPopperBase: Zc,
  createPopperLite: td,
  detectOverflow: Ve,
  end: Re,
  eventListeners: io,
  flip: Za,
  hide: Ja,
  left: J,
  main: Ba,
  modifierPhases: Es,
  offset: tl,
  placements: qn,
  popper: ye,
  popperGenerator: ks,
  popperOffsets: ro,
  preventOverflow: el,
  read: Ra,
  reference: Ma,
  right: ht,
  start: _e,
  top: Z,
  variationPlacements: $n,
  viewport: Gn,
  write: Fa
}, Symbol.toStringTag, { value: "Module" }));
function Fs(s) {
  return s === "true" ? !0 : s === "false" ? !1 : s === Number(s).toString() ? Number(s) : s === "" || s === "null" ? null : s;
}
function Ys(s) {
  return s.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
const p = {
  setDataAttribute(s, t, e) {
    s.setAttribute(`data-te-${Ys(t)}`, e);
  },
  removeDataAttribute(s, t) {
    s.removeAttribute(`data-te-${Ys(t)}`);
  },
  getDataAttributes(s) {
    if (!s)
      return {};
    const t = {};
    return Object.keys(s.dataset).filter((e) => e.startsWith("te")).forEach((e) => {
      if (e.startsWith("teClass"))
        return;
      let i = e.replace(/^te/, "");
      i = i.charAt(0).toLowerCase() + i.slice(1, i.length), t[i] = Fs(s.dataset[e]);
    }), t;
  },
  getDataClassAttributes(s) {
    if (!s)
      return {};
    const t = {
      ...s.dataset
    };
    return Object.keys(t).filter((e) => e.startsWith("teClass")).forEach((e) => {
      let i = e.replace(/^teClass/, "");
      i = i.charAt(0).toLowerCase() + i.slice(1, i.length), t[i] = Fs(t[e]);
    }), t;
  },
  getDataAttribute(s, t) {
    return Fs(
      s.getAttribute(`data-te-${Ys(t)}`)
    );
  },
  offset(s) {
    const t = s.getBoundingClientRect();
    return {
      top: t.top + document.body.scrollTop,
      left: t.left + document.body.scrollLeft
    };
  },
  position(s) {
    return {
      top: s.offsetTop,
      left: s.offsetLeft
    };
  },
  style(s, t) {
    Object.assign(s.style, t);
  },
  toggleClass(s, t) {
    s && js(t).forEach((e) => {
      s.classList.contains(e) ? s.classList.remove(e) : s.classList.add(e);
    });
  },
  addClass(s, t) {
    js(t).forEach(
      (e) => !s.classList.contains(e) && s.classList.add(e)
    );
  },
  addStyle(s, t) {
    Object.keys(t).forEach((e) => {
      s.style[e] = t[e];
    });
  },
  removeClass(s, t) {
    js(t).forEach(
      (e) => s.classList.contains(e) && s.classList.remove(e)
    );
  },
  hasClass(s, t) {
    return s.classList.contains(t);
  }
};
function js(s) {
  return typeof s == "string" ? s.split(" ") : Array.isArray(s) ? s : !1;
}
const id = 3, h = {
  closest(s, t) {
    return s.closest(t);
  },
  matches(s, t) {
    return s.matches(t);
  },
  find(s, t = document.documentElement) {
    return [].concat(
      ...Element.prototype.querySelectorAll.call(t, s)
    );
  },
  findOne(s, t = document.documentElement) {
    return Element.prototype.querySelector.call(t, s);
  },
  children(s, t) {
    return [].concat(...s.children).filter((i) => i.matches(t));
  },
  parents(s, t) {
    const e = [];
    let i = s.parentNode;
    for (; i && i.nodeType === Node.ELEMENT_NODE && i.nodeType !== id; )
      this.matches(i, t) && e.push(i), i = i.parentNode;
    return e;
  },
  prev(s, t) {
    let e = s.previousElementSibling;
    for (; e; ) {
      if (e.matches(t))
        return [e];
      e = e.previousElementSibling;
    }
    return [];
  },
  next(s, t) {
    let e = s.nextElementSibling;
    for (; e; ) {
      if (this.matches(e, t))
        return [e];
      e = e.nextElementSibling;
    }
    return [];
  },
  focusableChildren(s) {
    const t = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "details",
      "[tabindex]",
      '[contenteditable="true"]'
    ].map((e) => `${e}:not([tabindex^="-"])`).join(", ");
    return this.find(t, s).filter(
      (e) => !ue(e) && St(e)
    );
  }
}, Ks = "dropdown", sd = "te.dropdown", ge = `.${sd}`, ao = ".data-api", ns = "Escape", $o = "Space", Lo = "Tab", Nn = "ArrowUp", os = "ArrowDown", nd = 2, od = new RegExp(
  `${Nn}|${os}|${ns}`
), rd = `hide${ge}`, ad = `hidden${ge}`, ld = `show${ge}`, cd = `shown${ge}`, dd = `click${ge}${ao}`, Mo = `keydown${ge}${ao}`, hd = `keyup${ge}${ao}`, Pt = "show", ud = "dropup", pd = "dropend", fd = "dropstart", _d = "[data-te-navbar-ref]", Ii = "[data-te-dropdown-toggle-ref]", Us = "[data-te-dropdown-menu-ref]", md = "[data-te-navbar-nav-ref]", gd = "[data-te-dropdown-menu-ref] [data-te-dropdown-item-ref]:not(.disabled):not(:disabled)", bd = F() ? "top-end" : "top-start", vd = F() ? "top-start" : "top-end", Ed = F() ? "bottom-end" : "bottom-start", Td = F() ? "bottom-start" : "bottom-end", Cd = F() ? "left-start" : "right-start", Ad = F() ? "right-start" : "left-start", yd = [{ opacity: "0" }, { opacity: "1" }], wd = [{ opacity: "1" }, { opacity: "0" }], $i = {
  duration: 550,
  iterations: 1,
  easing: "ease",
  fill: "both"
}, kd = {
  offset: [0, 2],
  boundary: "clippingParents",
  reference: "toggle",
  display: "dynamic",
  popperConfig: null,
  autoClose: !0,
  dropdownAnimation: "on"
}, Od = {
  offset: "(array|string|function)",
  boundary: "(string|element)",
  reference: "(string|element|object)",
  display: "string",
  popperConfig: "(null|object|function)",
  autoClose: "(boolean|string)",
  dropdownAnimation: "string"
};
class wt extends vt {
  constructor(t, e) {
    super(t), this._popper = null, this._config = this._getConfig(e), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._fadeOutAnimate = null;
    const i = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    this._animationCanPlay = this._config.dropdownAnimation === "on" && !i, this._didInit = !1, this._init();
  }
  // Getters
  static get Default() {
    return kd;
  }
  static get DefaultType() {
    return Od;
  }
  static get NAME() {
    return Ks;
  }
  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (ue(this._element) || this._isShown(this._menu))
      return;
    const t = {
      relatedTarget: this._element
    };
    if (u.trigger(
      this._element,
      ld,
      t
    ).defaultPrevented)
      return;
    const i = wt.getParentFromElement(this._element);
    this._inNavbar ? p.setDataAttribute(this._menu, "popper", "none") : this._createPopper(i), "ontouchstart" in document.documentElement && !i.closest(md) && [].concat(...document.body.children).forEach((n) => u.on(n, "mouseover", vs)), this._element.focus(), this._element.setAttribute("aria-expanded", !0), this._menu.setAttribute(`data-te-dropdown-${Pt}`, ""), this._animationCanPlay && this._menu.animate(yd, $i), this._element.setAttribute(`data-te-dropdown-${Pt}`, ""), setTimeout(
      () => {
        u.trigger(this._element, cd, t);
      },
      this._animationCanPlay ? $i.duration : 0
    );
  }
  hide() {
    if (ue(this._element) || !this._isShown(this._menu))
      return;
    const t = {
      relatedTarget: this._element
    };
    this._completeHide(t);
  }
  dispose() {
    this._popper && this._popper.destroy(), super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar(), this._popper && this._popper.update();
  }
  // Private
  _init() {
    this._didInit || (u.on(
      document,
      Mo,
      Ii,
      wt.dataApiKeydownHandler
    ), u.on(
      document,
      Mo,
      Us,
      wt.dataApiKeydownHandler
    ), u.on(document, dd, wt.clearMenus), u.on(document, hd, wt.clearMenus), this._didInit = !0);
  }
  _completeHide(t) {
    this._fadeOutAnimate && this._fadeOutAnimate.playState === "running" || u.trigger(
      this._element,
      rd,
      t
    ).defaultPrevented || ("ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((i) => u.off(i, "mouseover", vs)), this._animationCanPlay && (this._fadeOutAnimate = this._menu.animate(
      wd,
      $i
    )), setTimeout(
      () => {
        this._popper && this._popper.destroy(), this._menu.removeAttribute(`data-te-dropdown-${Pt}`), this._element.removeAttribute(`data-te-dropdown-${Pt}`), this._element.setAttribute("aria-expanded", "false"), p.removeDataAttribute(this._menu, "popper"), u.trigger(this._element, ad, t);
      },
      this._animationCanPlay ? $i.duration : 0
    ));
  }
  _getConfig(t) {
    if (t = {
      ...this.constructor.Default,
      ...p.getDataAttributes(this._element),
      ...t
    }, N(Ks, t, this.constructor.DefaultType), typeof t.reference == "object" && !Ne(t.reference) && typeof t.reference.getBoundingClientRect != "function")
      throw new TypeError(
        `${Ks.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`
      );
    return t;
  }
  _createPopper(t) {
    if (typeof il > "u")
      throw new TypeError(
        "Bootstrap's dropdowns require Popper (https://popper.js.org)"
      );
    let e = this._element;
    this._config.reference === "parent" ? e = t : Ne(this._config.reference) ? e = Gt(this._config.reference) : typeof this._config.reference == "object" && (e = this._config.reference);
    const i = this._getPopperConfig(), n = i.modifiers.find(
      (o) => o.name === "applyStyles" && o.enabled === !1
    );
    this._popper = je(
      e,
      this._menu,
      i
    ), n && p.setDataAttribute(this._menu, "popper", "static");
  }
  _isShown(t = this._element) {
    return t.dataset[`teDropdown${Pt.charAt(0).toUpperCase() + Pt.slice(1)}`] === "";
  }
  _getMenuElement() {
    return h.next(this._element, Us)[0];
  }
  _getPlacement() {
    const t = this._element.parentNode;
    if (t.dataset.teDropdownPosition === pd)
      return Cd;
    if (t.dataset.teDropdownPosition === fd)
      return Ad;
    const e = getComputedStyle(this._menu).getPropertyValue("--te-position").trim() === "end";
    return t.dataset.teDropdownPosition === ud ? e ? vd : bd : e ? Td : Ed;
  }
  _detectNavbar() {
    return this._element.closest(_d) !== null;
  }
  _getOffset() {
    const { offset: t } = this._config;
    return typeof t == "string" ? t.split(",").map((e) => Number.parseInt(e, 10)) : typeof t == "function" ? (e) => t(e, this._element) : t;
  }
  _getPopperConfig() {
    const t = {
      placement: this._getPlacement(),
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        }
      ]
    };
    return this._config.display === "static" && (t.modifiers = [
      {
        name: "applyStyles",
        enabled: !1
      }
    ]), {
      ...t,
      ...typeof this._config.popperConfig == "function" ? this._config.popperConfig(t) : this._config.popperConfig
    };
  }
  _selectMenuItem({ key: t, target: e }) {
    const i = h.find(
      gd,
      this._menu
    ).filter(St);
    i.length && wa(
      i,
      e,
      t === os,
      !i.includes(e)
    ).focus();
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = wt.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
  static clearMenus(t) {
    if (t && (t.button === nd || t.type === "keyup" && t.key !== Lo))
      return;
    const e = h.find(Ii);
    for (let i = 0, n = e.length; i < n; i++) {
      const o = wt.getInstance(e[i]);
      if (!o || o._config.autoClose === !1 || !o._isShown())
        continue;
      const r = {
        relatedTarget: o._element
      };
      if (t) {
        const a = t.composedPath(), l = a.includes(o._menu);
        if (a.includes(o._element) || o._config.autoClose === "inside" && !l || o._config.autoClose === "outside" && l || o._menu.contains(t.target) && (t.type === "keyup" && t.key === Lo || /input|select|option|textarea|form/i.test(t.target.tagName)))
          continue;
        t.type === "click" && (r.clickEvent = t);
      }
      o._completeHide(r);
    }
  }
  static getParentFromElement(t) {
    return Xt(t) || t.parentNode;
  }
  static dataApiKeydownHandler(t) {
    if (/input|textarea/i.test(t.target.tagName) ? t.key === $o || t.key !== ns && (t.key !== os && t.key !== Nn || t.target.closest(Us)) : !od.test(t.key))
      return;
    const e = this.dataset[`teDropdown${Pt.charAt(0).toUpperCase() + Pt.slice(1)}`] === "";
    if (!e && t.key === ns || (t.preventDefault(), t.stopPropagation(), ue(this)))
      return;
    const i = this.matches(Ii) ? this : h.prev(this, Ii)[0], n = wt.getOrCreateInstance(i);
    if (t.key === ns) {
      n.hide();
      return;
    }
    if (t.key === Nn || t.key === os) {
      e || n.show(), n._selectMenuItem(t);
      return;
    }
    (!e || t.key === $o) && wt.clearMenus();
  }
}
const zs = "collapse", sl = "te.collapse", Os = `.${sl}`, No = {
  toggle: !0,
  parent: null
}, xd = {
  toggle: "boolean",
  parent: "(null|element)"
}, Sd = `show${Os}`, Dd = `shown${Os}`, Id = `hide${Os}`, $d = `hidden${Os}`, Xs = "data-te-collapse-show", Ro = "data-te-collapse-collapsed", Li = "data-te-collapse-collapsing", Ld = "data-te-collapse-horizontal", Oe = "data-te-collapse-item", Po = `:scope [${Oe}] [${Oe}]`, Md = "width", Nd = "height", Rd = "[data-te-collapse-item][data-te-collapse-show], [data-te-collapse-item][data-te-collapse-collapsing]", Ho = "[data-te-collapse-init]", Pd = {
  visible: "!visible",
  hidden: "hidden",
  baseTransition: "overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
  collapsing: "h-0 transition-[height] overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
  collapsingHorizontal: "w-0 h-auto transition-[width] overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
}, Hd = {
  visible: "string",
  hidden: "string",
  baseTransition: "string",
  collapsing: "string",
  collapsingHorizontal: "string"
};
class Ut extends vt {
  constructor(t, e, i) {
    super(t), this._isTransitioning = !1, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._triggerArray = [];
    const n = h.find(Ho);
    for (let o = 0, r = n.length; o < r; o++) {
      const a = n[o], l = Xn(a), c = h.find(l).filter(
        (d) => d === this._element
      );
      l !== null && c.length && (this._selector = l, this._triggerArray.push(a));
    }
    this._initializeChildren(), this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()), this._config.toggle && this.toggle();
  }
  // Getters
  static get Default() {
    return No;
  }
  static get NAME() {
    return zs;
  }
  // Public
  toggle() {
    this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (this._isTransitioning || this._isShown())
      return;
    let t = [], e;
    if (this._config.parent) {
      const d = h.find(
        Po,
        this._config.parent
      );
      t = h.find(
        Rd,
        this._config.parent
      ).filter((_) => !d.includes(_));
    }
    const i = h.findOne(this._selector);
    if (t.length) {
      const d = t.find((_) => i !== _);
      if (e = d ? Ut.getInstance(d) : null, e && e._isTransitioning)
        return;
    }
    if (u.trigger(this._element, Sd).defaultPrevented)
      return;
    t.forEach((d) => {
      i !== d && Ut.getOrCreateInstance(d, { toggle: !1 }).hide(), e || I.setData(d, sl, null);
    });
    const o = this._getDimension(), r = o === "height" ? this._classes.collapsing : this._classes.collapsingHorizontal;
    p.removeClass(this._element, this._classes.visible), p.removeClass(this._element, this._classes.hidden), p.addClass(this._element, r), this._element.removeAttribute(Oe), this._element.setAttribute(Li, ""), this._element.style[o] = 0, this._addAriaAndCollapsedClass(this._triggerArray, !0), this._isTransitioning = !0;
    const a = () => {
      this._isTransitioning = !1, p.removeClass(this._element, this._classes.hidden), p.removeClass(this._element, r), p.addClass(this._element, this._classes.visible), this._element.removeAttribute(Li), this._element.setAttribute(Oe, ""), this._element.setAttribute(Xs, ""), this._element.style[o] = "", u.trigger(this._element, Dd);
    }, c = `scroll${o[0].toUpperCase() + o.slice(1)}`;
    this._queueCallback(a, this._element, !0), this._element.style[o] = `${this._element[c]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown() || u.trigger(this._element, Id).defaultPrevented)
      return;
    const e = this._getDimension(), i = e === "height" ? this._classes.collapsing : this._classes.collapsingHorizontal;
    this._element.style[e] = `${this._element.getBoundingClientRect()[e]}px`, Fe(this._element), p.addClass(this._element, i), p.removeClass(this._element, this._classes.visible), p.removeClass(this._element, this._classes.hidden), this._element.setAttribute(Li, ""), this._element.removeAttribute(Oe), this._element.removeAttribute(Xs);
    const n = this._triggerArray.length;
    for (let r = 0; r < n; r++) {
      const a = this._triggerArray[r], l = Xt(a);
      l && !this._isShown(l) && this._addAriaAndCollapsedClass([a], !1);
    }
    this._isTransitioning = !0;
    const o = () => {
      this._isTransitioning = !1, p.removeClass(this._element, i), p.addClass(this._element, this._classes.visible), p.addClass(this._element, this._classes.hidden), this._element.removeAttribute(Li), this._element.setAttribute(Oe, ""), u.trigger(this._element, $d);
    };
    this._element.style[e] = "", this._queueCallback(o, this._element, !0);
  }
  _isShown(t = this._element) {
    return t.hasAttribute(Xs);
  }
  // Private
  _getConfig(t) {
    return t = {
      ...No,
      ...p.getDataAttributes(this._element),
      ...t
    }, t.toggle = !!t.toggle, t.parent = Gt(t.parent), N(zs, t, xd), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...Pd,
      ...e,
      ...t
    }, N(zs, t, Hd), t;
  }
  _getDimension() {
    return this._element.hasAttribute(Ld) ? Md : Nd;
  }
  _initializeChildren() {
    if (!this._config.parent)
      return;
    const t = h.find(
      Po,
      this._config.parent
    );
    h.find(Ho, this._config.parent).filter((e) => !t.includes(e)).forEach((e) => {
      const i = Xt(e);
      i && this._addAriaAndCollapsedClass([e], this._isShown(i));
    });
  }
  _addAriaAndCollapsedClass(t, e) {
    t.length && t.forEach((i) => {
      e ? i.removeAttribute(Ro) : i.setAttribute(`${Ro}`, ""), i.setAttribute("aria-expanded", e);
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = {};
      typeof t == "string" && /show|hide/.test(t) && (e.toggle = !1);
      const i = Ut.getOrCreateInstance(this, e);
      if (typeof t == "string") {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t]();
      }
    });
  }
}
const Bo = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", Vo = ".sticky-top";
class pi {
  constructor() {
    this._element = document.body;
  }
  getWidth() {
    const t = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - t);
  }
  hide() {
    const t = this.getWidth();
    this._disableOverFlow(), this._setElementAttributes(
      this._element,
      "paddingRight",
      (e) => e + t
    ), this._setElementAttributes(
      Bo,
      "paddingRight",
      (e) => e + t
    ), this._setElementAttributes(
      Vo,
      "marginRight",
      (e) => e - t
    );
  }
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow"), this._element.style.overflow = "hidden";
  }
  _setElementAttributes(t, e, i) {
    const n = this.getWidth(), o = (r) => {
      if (r !== this._element && window.innerWidth > r.clientWidth + n)
        return;
      this._saveInitialAttribute(r, e);
      const a = window.getComputedStyle(r)[e];
      r.style[e] = `${i(
        Number.parseFloat(a)
      )}px`;
    };
    this._applyManipulationCallback(t, o);
  }
  reset() {
    this._resetElementAttributes(this._element, "overflow"), this._resetElementAttributes(this._element, "paddingRight"), this._resetElementAttributes(Bo, "paddingRight"), this._resetElementAttributes(Vo, "marginRight");
  }
  _saveInitialAttribute(t, e) {
    const i = t.style[e];
    i && p.setDataAttribute(t, e, i);
  }
  _resetElementAttributes(t, e) {
    const i = (n) => {
      const o = p.getDataAttribute(n, e);
      typeof o > "u" ? n.style.removeProperty(e) : (p.removeDataAttribute(n, e), n.style[e] = o);
    };
    this._applyManipulationCallback(t, i);
  }
  _applyManipulationCallback(t, e) {
    Ne(t) ? e(t) : h.find(t, this._element).forEach(e);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }
}
const Bd = {
  isVisible: !0,
  // if false, we use the backdrop helper without adding any element to the dom
  isAnimated: !1,
  rootElement: "body",
  // give the choice to place backdrop under different elements
  clickCallback: null,
  backdropClasses: null
}, Vd = {
  isVisible: "boolean",
  isAnimated: "boolean",
  rootElement: "(element|string)",
  clickCallback: "(function|null)",
  backdropClasses: "(array|null)"
}, nl = "backdrop", Wo = `mousedown.te.${nl}`;
class lo {
  constructor(t) {
    this._config = this._getConfig(t), this._isAppended = !1, this._element = null;
  }
  show(t) {
    if (!this._config.isVisible) {
      he(t);
      return;
    }
    this._append(), this._config.isAnimated && Fe(this._getElement());
    const e = this._config.backdropClasses || [
      "opacity-50",
      "transition-all",
      "duration-300",
      "ease-in-out",
      "fixed",
      "top-0",
      "left-0",
      "z-[1040]",
      "bg-black",
      "w-screen",
      "h-screen"
    ];
    p.removeClass(this._getElement(), "opacity-0"), p.addClass(this._getElement(), e), this._element.setAttribute("data-te-backdrop-show", ""), this._emulateAnimation(() => {
      he(t);
    });
  }
  hide(t) {
    if (!this._config.isVisible) {
      he(t);
      return;
    }
    this._element.removeAttribute("data-te-backdrop-show"), this._getElement().classList.add("opacity-0"), this._getElement().classList.remove("opacity-50"), this._emulateAnimation(() => {
      this.dispose(), he(t);
    });
  }
  // Private
  _getElement() {
    if (!this._element) {
      const t = document.createElement("div");
      t.className = this._config.className, this._config.isAnimated && t.classList.add("opacity-50"), this._element = t;
    }
    return this._element;
  }
  _getConfig(t) {
    return t = {
      ...Bd,
      ...typeof t == "object" ? t : {}
    }, t.rootElement = Gt(t.rootElement), N(nl, t, Vd), t;
  }
  _append() {
    this._isAppended || (this._config.rootElement.append(this._getElement()), u.on(this._getElement(), Wo, () => {
      he(this._config.clickCallback);
    }), this._isAppended = !0);
  }
  dispose() {
    this._isAppended && (u.off(this._element, Wo), this._element.remove(), this._isAppended = !1);
  }
  _emulateAnimation(t) {
    ya(
      t,
      this._getElement(),
      this._config.isAnimated
    );
  }
}
class bi {
  constructor(t, e = {}, i) {
    this._element = t, this._toggler = i, this._event = e.event || "blur", this._condition = e.condition || (() => !0), this._selector = e.selector || 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])', this._onlyVisible = e.onlyVisible || !1, this._focusableElements = [], this._firstElement = null, this._lastElement = null, this.handler = (n) => {
      this._condition(n) && !n.shiftKey && n.target === this._lastElement ? (n.preventDefault(), this._firstElement.focus()) : this._condition(n) && n.shiftKey && n.target === this._firstElement && (n.preventDefault(), this._lastElement.focus());
    };
  }
  trap() {
    this._setElements(), this._init(), this._setFocusTrap();
  }
  disable() {
    this._focusableElements.forEach((t) => {
      t.removeEventListener(this._event, this.handler);
    }), this._toggler && this._toggler.focus();
  }
  update() {
    this._setElements(), this._setFocusTrap();
  }
  _init() {
    const t = (e) => {
      !this._firstElement || e.key !== "Tab" || this._focusableElements.includes(e.target) || (e.preventDefault(), this._firstElement.focus(), window.removeEventListener("keydown", t));
    };
    window.addEventListener("keydown", t);
  }
  _filterVisible(t) {
    return t.filter((e) => {
      if (!St(e))
        return !1;
      const i = h.parents(e, "*");
      for (let n = 0; n < i.length; n++) {
        const o = window.getComputedStyle(i[n]);
        if (o && (o.display === "none" || o.visibility === "hidden"))
          return !1;
      }
      return !0;
    });
  }
  _setElements() {
    this._focusableElements = h.focusableChildren(this._element), this._onlyVisible && (this._focusableElements = this._filterVisible(this._focusableElements)), this._firstElement = this._focusableElements[0], this._lastElement = this._focusableElements[this._focusableElements.length - 1];
  }
  _setFocusTrap() {
    this._focusableElements.forEach((t, e) => {
      e === this._focusableElements.length - 1 || e === 0 ? t.addEventListener(this._event, this.handler) : t.removeEventListener(this._event, this.handler);
    });
  }
}
const xs = (s, t = "hide") => {
  const e = `click.dismiss${s.EVENT_KEY}`, i = s.NAME;
  u.on(
    document,
    e,
    `[data-te-${i}-dismiss]`,
    function(n) {
      if (["A", "AREA"].includes(this.tagName) && n.preventDefault(), ue(this))
        return;
      const o = Xt(this) || this.closest(`.${i}`) || this.closest(`[data-te-${i}-init]`);
      if (!o)
        return;
      s.getOrCreateInstance(o)[t]();
    }
  );
}, Fo = "offcanvas", Wd = "te.offcanvas", Ke = `.${Wd}`, Fd = ".data-api", Yd = `load${Ke}${Fd}`, jd = "Escape", Yo = {
  backdrop: !0,
  keyboard: !0,
  scroll: !1
}, Kd = {
  backdrop: "boolean",
  keyboard: "boolean",
  scroll: "boolean"
}, jo = "show", Ud = "[data-te-offcanvas-init][data-te-offcanvas-show]", zd = `show${Ke}`, Xd = `shown${Ke}`, Gd = `hide${Ke}`, qd = `hidden${Ke}`, Qd = `keydown.dismiss${Ke}`;
class rs extends vt {
  constructor(t, e) {
    super(t), this._config = this._getConfig(e), this._isShown = !1, this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._addEventListeners(), this._didInit = !1, this._init();
  }
  // Getters
  static get NAME() {
    return Fo;
  }
  static get Default() {
    return Yo;
  }
  // Public
  toggle(t) {
    return this._isShown ? this.hide() : this.show(t);
  }
  show(t) {
    if (this._isShown || u.trigger(this._element, zd, {
      relatedTarget: t
    }).defaultPrevented)
      return;
    this._isShown = !0, this._element.style.visibility = "visible", this._backdrop.show(), this._config.scroll || new pi().hide(), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.setAttribute(`data-te-offcanvas-${jo}`, "");
    const i = () => {
      this._config.scroll || this._focustrap.trap(), u.trigger(this._element, Xd, { relatedTarget: t });
    };
    this._queueCallback(i, this._element, !0);
  }
  hide() {
    if (!this._isShown || u.trigger(this._element, Gd).defaultPrevented)
      return;
    this._focustrap.disable(), this._element.blur(), this._isShown = !1, this._element.removeAttribute(`data-te-offcanvas-${jo}`), this._backdrop.hide();
    const e = () => {
      this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._element.style.visibility = "hidden", this._config.scroll || new pi().reset(), u.trigger(this._element, qd);
    };
    this._queueCallback(e, this._element, !0);
  }
  dispose() {
    this._backdrop.dispose(), this._focustrap.disable(), super.dispose();
  }
  // Private
  _init() {
    this._didInit || (u.on(
      window,
      Yd,
      () => h.find(Ud).forEach(
        (t) => rs.getOrCreateInstance(t).show()
      )
    ), xs(rs), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...Yo,
      ...p.getDataAttributes(this._element),
      ...typeof t == "object" ? t : {}
    }, N(Fo, t, Kd), t;
  }
  _initializeBackDrop() {
    return new lo({
      isVisible: this._config.backdrop,
      isAnimated: !0,
      rootElement: this._element.parentNode,
      clickCallback: () => this.hide()
    });
  }
  _initializeFocusTrap() {
    return new bi(this._element, {
      event: "keydown",
      condition: (t) => t.key === "Tab"
    });
  }
  _addEventListeners() {
    u.on(this._element, Qd, (t) => {
      this._config.keyboard && t.key === jd && this.hide();
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = rs.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (e[t] === void 0 || t.startsWith("_") || t === "constructor")
          throw new TypeError(`No method named "${t}"`);
        e[t](this);
      }
    });
  }
}
const Gs = "alert", Zd = "te.alert", ol = `.${Zd}`, Jd = `close${ol}`, th = `closed${ol}`, Ge = "data-te-alert-show", eh = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
}, Ko = {
  animation: !0,
  autohide: !0,
  delay: 1e3
}, ih = {
  fadeIn: "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
  fadeOut: "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none"
}, sh = {
  fadeIn: "string",
  fadeOut: "string"
};
class Rn extends vt {
  constructor(t, e, i) {
    super(t), this._element = t, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._didInit = !1, this._init();
  }
  // Getters
  static get DefaultType() {
    return eh;
  }
  static get Default() {
    return Ko;
  }
  static get NAME() {
    return Gs;
  }
  // Public
  close() {
    if (u.trigger(this._element, Jd).defaultPrevented)
      return;
    let e = 0;
    this._config.animation && (e = 300, p.addClass(this._element, this._classes.fadeOut)), this._element.removeAttribute(Ge), setTimeout(() => {
      this._queueCallback(
        () => this._destroyElement(),
        this._element,
        this._config.animation
      );
    }, e);
  }
  show() {
    if (this._element) {
      if (this._config.autohide && this._setupAutohide(), !this._element.hasAttribute(Ge) && (p.removeClass(this._element, "hidden"), p.addClass(this._element, "block"), St(this._element))) {
        const t = (e) => {
          p.removeClass(this._element, "hidden"), p.addClass(this._element, "block"), u.off(e.target, "animationend", t);
        };
        this._element.setAttribute(Ge, ""), u.on(this._element, "animationend", t);
      }
      this._config.animation && (p.removeClass(this._element, this._classes.fadeOut), p.addClass(this._element, this._classes.fadeIn));
    }
  }
  hide() {
    if (this._element && this._element.hasAttribute(Ge)) {
      this._element.removeAttribute(Ge);
      const t = (e) => {
        p.addClass(this._element, "hidden"), p.removeClass(this._element, "block"), this._timeout !== null && (clearTimeout(this._timeout), this._timeout = null), u.off(e.target, "animationend", t);
      };
      u.on(this._element, "animationend", t), p.removeClass(this._element, this._classes.fadeIn), p.addClass(this._element, this._classes.fadeOut);
    }
  }
  // Private
  _init() {
    this._didInit || (xs(Rn, "close"), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...Ko,
      ...p.getDataAttributes(this._element),
      ...typeof t == "object" && t ? t : {}
    }, N(Gs, t, this.constructor.DefaultType), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...ih,
      ...e,
      ...t
    }, N(Gs, t, sh), t;
  }
  _setupAutohide() {
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _destroyElement() {
    this._element.remove(), u.trigger(this._element, th), this.dispose();
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Rn.getOrCreateInstance(this);
      if (typeof t == "string") {
        if (e[t] === void 0 || t.startsWith("_") || t === "constructor")
          throw new TypeError(`No method named "${t}"`);
        e[t](this);
      }
    });
  }
}
const qs = "carousel", nh = "te.carousel", pt = `.${nh}`, rl = ".data-api", oh = "ArrowLeft", rh = "ArrowRight", ah = 500, lh = 40, Uo = {
  interval: 5e3,
  keyboard: !0,
  slide: !1,
  pause: "hover",
  wrap: !0,
  touch: !0
}, ch = {
  interval: "(number|boolean)",
  keyboard: "boolean",
  slide: "(boolean|string)",
  pause: "(string|boolean)",
  wrap: "boolean",
  touch: "boolean"
}, dh = {
  pointer: "touch-pan-y",
  block: "!block",
  visible: "data-[te-carousel-fade]:opacity-100 data-[te-carousel-fade]:z-[1]",
  invisible: "data-[te-carousel-fade]:z-0 data-[te-carousel-fade]:opacity-0 data-[te-carousel-fade]:duration-0 data-[te-carousel-fade]:delay-600",
  slideRight: "translate-x-full",
  slideLeft: "-translate-x-full"
}, hh = {
  pointer: "string",
  block: "string",
  visible: "string",
  invisible: "string",
  slideRight: "string",
  slideLeft: "string"
}, se = "next", ne = "prev", ce = "left", si = "right", uh = {
  [oh]: si,
  [rh]: ce
}, ph = `slide${pt}`, zo = `slid${pt}`, fh = `keydown${pt}`, _h = `mouseenter${pt}`, mh = `mouseleave${pt}`, gh = `touchstart${pt}`, bh = `touchmove${pt}`, vh = `touchend${pt}`, Eh = `pointerdown${pt}`, Th = `pointerup${pt}`, Ch = `dragstart${pt}`, Ah = `load${pt}${rl}`, yh = `click${pt}${rl}`, wh = "data-te-carousel-init", oe = "data-te-carousel-active", kh = "data-te-carousel-slide", Oh = "data-te-carousel-item-end", Qs = "data-te-carousel-item-start", xh = "data-te-carousel-item-next", Sh = "data-te-carousel-item-prev", Dh = "data-te-carousel-pointer-event", Ih = "[data-te-carousel-init]", al = "[data-te-carousel-active]", co = "[data-te-carousel-item]", ve = `${al}${co}`, $h = `${co} img`, Lh = "[data-te-carousel-item-next], [data-te-carousel-item-prev]", Mh = "[data-te-carousel-indicators]", Nh = "[data-te-target]", Rh = "[data-te-slide], [data-te-slide-to]", Ph = "touch", Hh = "pen";
class Yt extends vt {
  constructor(t, e, i) {
    super(t), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._indicatorsElement = h.findOne(
      Mh,
      this._element
    ), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = !!window.PointerEvent, this._setActiveElementClass(), this._addEventListeners(), this._didInit = !1, this._init();
  }
  // Getters
  static get Default() {
    return Uo;
  }
  static get NAME() {
    return qs;
  }
  // Public
  next() {
    this._slide(se);
  }
  nextWhenVisible() {
    !document.hidden && St(this._element) && this.next();
  }
  prev() {
    this._slide(ne);
  }
  pause(t) {
    t || (this._isPaused = !0), h.findOne(Lh, this._element) && (Ea(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null;
  }
  cycle(t) {
    t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config && this._config.interval && !this._isPaused && (this._updateInterval(), this._interval = setInterval(
      (document.visibilityState ? this.nextWhenVisible : this.next).bind(
        this
      ),
      this._config.interval
    ));
  }
  to(t) {
    this._activeElement = h.findOne(
      ve,
      this._element
    );
    const e = this._getItemIndex(this._activeElement);
    if (t > this._items.length - 1 || t < 0)
      return;
    if (this._isSliding) {
      u.one(this._element, zo, () => this.to(t));
      return;
    }
    if (e === t) {
      this.pause(), this.cycle();
      return;
    }
    const i = t > e ? se : ne;
    this._slide(i, this._items[t]);
  }
  // Private
  _init() {
    this._didInit || (u.on(
      document,
      yh,
      Rh,
      Yt.dataApiClickHandler
    ), u.on(window, Ah, () => {
      const t = h.find(Ih);
      for (let e = 0, i = t.length; e < i; e++)
        Yt.carouselInterface(
          t[e],
          Yt.getInstance(t[e])
        );
    }), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...Uo,
      ...p.getDataAttributes(this._element),
      ...typeof t == "object" ? t : {}
    }, N(qs, t, ch), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...dh,
      ...e,
      ...t
    }, N(qs, t, hh), t;
  }
  _applyInitialClasses() {
    const t = h.findOne(
      ve,
      this._element
    );
    t.classList.add(
      this._classes.block,
      ...this._classes.visible.split(" ")
    ), this._setActiveIndicatorElement(t);
  }
  _handleSwipe() {
    const t = Math.abs(this.touchDeltaX);
    if (t <= lh)
      return;
    const e = t / this.touchDeltaX;
    this.touchDeltaX = 0, e && this._slide(e > 0 ? si : ce);
  }
  _setActiveElementClass() {
    this._activeElement = h.findOne(
      ve,
      this._element
    ), p.addClass(this._activeElement, "hidden");
  }
  _addEventListeners() {
    this._config.keyboard && u.on(
      this._element,
      fh,
      (t) => this._keydown(t)
    ), this._config.pause === "hover" && (u.on(
      this._element,
      _h,
      (t) => this.pause(t)
    ), u.on(
      this._element,
      mh,
      (t) => this.cycle(t)
    )), this._config.touch && this._touchSupported && this._addTouchEventListeners(), this._applyInitialClasses();
  }
  _addTouchEventListeners() {
    const t = (o) => this._pointerEvent && (o.pointerType === Hh || o.pointerType === Ph), e = (o) => {
      t(o) ? this.touchStartX = o.clientX : this._pointerEvent || (this.touchStartX = o.touches[0].clientX);
    }, i = (o) => {
      this.touchDeltaX = o.touches && o.touches.length > 1 ? 0 : o.touches[0].clientX - this.touchStartX;
    }, n = (o) => {
      t(o) && (this.touchDeltaX = o.clientX - this.touchStartX), this._handleSwipe(), this._config.pause === "hover" && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout(
        (r) => this.cycle(r),
        ah + this._config.interval
      ));
    };
    h.find($h, this._element).forEach(
      (o) => {
        u.on(
          o,
          Ch,
          (r) => r.preventDefault()
        );
      }
    ), this._pointerEvent ? (u.on(
      this._element,
      Eh,
      (o) => e(o)
    ), u.on(this._element, Th, (o) => n(o)), this._element.classList.add(this._classes.pointer), this._element.setAttribute(`${Dh}`, "")) : (u.on(this._element, gh, (o) => e(o)), u.on(this._element, bh, (o) => i(o)), u.on(this._element, vh, (o) => n(o)));
  }
  _keydown(t) {
    if (/input|textarea/i.test(t.target.tagName))
      return;
    const e = uh[t.key];
    e && (t.preventDefault(), this._slide(e));
  }
  _getItemIndex(t) {
    return this._items = t && t.parentNode ? h.find(co, t.parentNode) : [], this._items.indexOf(t);
  }
  _getItemByOrder(t, e) {
    const i = t === se;
    return wa(
      this._items,
      e,
      i,
      this._config.wrap
    );
  }
  _triggerSlideEvent(t, e) {
    const i = this._getItemIndex(t), n = this._getItemIndex(
      h.findOne(ve, this._element)
    );
    return u.trigger(this._element, ph, {
      relatedTarget: t,
      direction: e,
      from: n,
      to: i
    });
  }
  _setActiveIndicatorElement(t) {
    if (this._indicatorsElement) {
      const e = h.findOne(
        al,
        this._indicatorsElement
      );
      e.removeAttribute(oe), e.removeAttribute("aria-current"), e.classList.remove("!opacity-100");
      const i = h.find(
        Nh,
        this._indicatorsElement
      );
      for (let n = 0; n < i.length; n++)
        if (Number.parseInt(
          i[n].getAttribute("data-te-slide-to"),
          10
        ) === this._getItemIndex(t)) {
          i[n].setAttribute(`${oe}`, ""), i[n].setAttribute("aria-current", "true"), i[n].classList.add("!opacity-100");
          break;
        }
    }
  }
  _updateInterval() {
    const t = this._activeElement || h.findOne(ve, this._element);
    if (!t)
      return;
    const e = Number.parseInt(
      t.getAttribute("data-te-interval"),
      10
    );
    e ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = e) : this._config.interval = this._config.defaultInterval || this._config.interval;
  }
  _slide(t, e) {
    const i = this._directionToOrder(t), n = h.findOne(
      ve,
      this._element
    ), o = this._getItemIndex(n), r = e || this._getItemByOrder(i, n), a = this._getItemIndex(r), l = !!this._interval, c = i === se, d = c ? Qs : Oh, _ = c ? xh : Sh, f = this._orderToDirection(i), m = d === Qs ? this._classes.slideLeft : this._classes.slideRight, g = d !== Qs ? this._classes.slideLeft : this._classes.slideRight;
    if (r && r.hasAttribute(oe)) {
      this._isSliding = !1;
      return;
    }
    if (this._isSliding || this._triggerSlideEvent(r, f).defaultPrevented || !n || !r)
      return;
    this._isSliding = !0, l && this.pause(), this._setActiveIndicatorElement(r), this._activeElement = r;
    const T = () => {
      u.trigger(this._element, zo, {
        relatedTarget: r,
        direction: f,
        from: o,
        to: a
      });
    };
    if (this._element.hasAttribute(kh)) {
      r.setAttribute(`${_}`, ""), r.classList.add(this._classes.block, g), Fe(r), n.setAttribute(`${d}`, ""), n.classList.add(
        m,
        ...this._classes.invisible.split(" ")
      ), n.classList.remove(...this._classes.visible.split(" ")), r.setAttribute(`${d}`, ""), r.classList.add(...this._classes.visible.split(" ")), r.classList.remove(
        this._classes.slideRight,
        this._classes.slideLeft
      );
      const C = () => {
        r.removeAttribute(d), r.removeAttribute(_), r.setAttribute(`${oe}`, ""), n.removeAttribute(oe), n.classList.remove(
          m,
          ...this._classes.invisible.split(" "),
          this._classes.block
        ), n.removeAttribute(_), n.removeAttribute(d), this._isSliding = !1, setTimeout(T, 0);
      };
      this._queueCallback(C, n, !0);
    } else
      n.removeAttribute(oe), n.classList.remove(this._classes.block), r.setAttribute(`${oe}`, ""), r.classList.add(this._classes.block), this._isSliding = !1, T();
    l && this.cycle();
  }
  _directionToOrder(t) {
    return [si, ce].includes(t) ? F() ? t === ce ? ne : se : t === ce ? se : ne : t;
  }
  _orderToDirection(t) {
    return [se, ne].includes(t) ? F() ? t === ne ? ce : si : t === ne ? si : ce : t;
  }
  // Static
  static carouselInterface(t, e) {
    const i = Yt.getOrCreateInstance(t, e);
    let { _config: n } = i;
    typeof e == "object" && (n = {
      ...n,
      ...e
    });
    const o = typeof e == "string" ? e : n.slide;
    if (typeof e == "number")
      i.to(e);
    else if (typeof o == "string") {
      if (typeof i[o] > "u")
        throw new TypeError(`No method named "${o}"`);
      i[o]();
    } else
      n.interval && n.carouselInit === null && (i.pause(), i.cycle());
  }
  static jQueryInterface(t) {
    return this.each(function() {
      Yt.carouselInterface(this, t);
    });
  }
  static dataApiClickHandler(t) {
    const e = Xt(this);
    if (!e || !e.hasAttribute(wh))
      return;
    const i = {
      ...p.getDataAttributes(e),
      ...p.getDataAttributes(this)
    }, n = this.getAttribute("data-te-slide-to");
    n && (i.interval = !1), Yt.carouselInterface(e, i), n && Yt.getInstance(e).to(n), t.preventDefault();
  }
}
const Zs = "modal", Bh = "te.modal", Et = `.${Bh}`, Xo = "Escape", Go = {
  backdrop: !0,
  keyboard: !0,
  focus: !0
}, Vh = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  focus: "boolean"
}, Wh = {
  show: "transform-none",
  static: "scale-[1.02]",
  staticProperties: "transition-scale duration-300 ease-in-out"
}, Fh = {
  show: "string",
  static: "string",
  staticProperties: "string"
}, Yh = `hide${Et}`, jh = `hidePrevented${Et}`, Kh = `hidden${Et}`, Uh = `show${Et}`, zh = `shown${Et}`, qo = `resize${Et}`, Qo = `click.dismiss${Et}`, Zo = `keydown.dismiss${Et}`, Xh = `mouseup.dismiss${Et}`, Jo = `mousedown.dismiss${Et}`, tr = "data-te-modal-open", er = "data-te-open", qe = "[data-te-modal-dialog-ref]", Gh = "[data-te-modal-body-ref]";
class Pn extends vt {
  constructor(t, e, i) {
    super(t), this._config = this._getConfig(e), this._classes = this._getClasses(i), this._dialog = h.findOne(qe, this._element), this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._isShown = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollBar = new pi(), this._didInit = !1, this._init();
  }
  // Getters
  static get Default() {
    return Go;
  }
  static get NAME() {
    return Zs;
  }
  // Public
  toggle(t) {
    return this._isShown ? this.hide() : this.show(t);
  }
  show(t) {
    this._isShown || this._isTransitioning || u.trigger(this._element, Uh, {
      relatedTarget: t
    }).defaultPrevented || (this._isShown = !0, this._isAnimated() && (this._isTransitioning = !0), this._scrollBar.hide(), document.body.setAttribute(tr, "true"), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), u.on(this._dialog, Jo, () => {
      u.one(this._element, Xh, (i) => {
        i.target === this._element && (this._ignoreBackdropClick = !0);
      });
    }), this._showElement(t), this._showBackdrop());
  }
  hide() {
    if (!this._isShown || this._isTransitioning || u.trigger(this._element, Yh).defaultPrevented)
      return;
    this._isShown = !1;
    const e = this._isAnimated();
    e && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), this._focustrap.disable(), h.findOne(qe, this._element).classList.remove(this._classes.show), u.off(this._element, Qo), u.off(this._dialog, Jo), this._queueCallback(() => this._hideModal(), this._element, e), this._element.removeAttribute(er);
  }
  dispose() {
    [window, this._dialog].forEach(
      (t) => u.off(t, Et)
    ), this._backdrop.dispose(), this._focustrap.disable(), super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }
  // Private
  _init() {
    this._didInit || (xs(Pn), this._didInit = !0);
  }
  _initializeBackDrop() {
    return new lo({
      isVisible: !!this._config.backdrop,
      // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new bi(this._element, {
      event: "keydown",
      condition: (t) => t.key === "Tab"
    });
  }
  _getConfig(t) {
    return t = {
      ...Go,
      ...p.getDataAttributes(this._element),
      ...typeof t == "object" ? t : {}
    }, N(Zs, t, Vh), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...Wh,
      ...e,
      ...t
    }, N(Zs, t, Fh), t;
  }
  _showElement(t) {
    const e = this._isAnimated(), i = h.findOne(Gh, this._dialog);
    (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) && document.body.append(this._element), this._element.style.display = "block", this._element.classList.remove("hidden"), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.setAttribute(`${er}`, "true"), this._element.scrollTop = 0;
    const n = h.findOne(qe, this._element);
    n.classList.add(this._classes.show), n.classList.remove("opacity-0"), n.classList.add("opacity-100"), i && (i.scrollTop = 0), e && Fe(this._element);
    const o = () => {
      this._config.focus && this._focustrap.trap(), this._isTransitioning = !1, u.trigger(this._element, zh, {
        relatedTarget: t
      });
    };
    this._queueCallback(o, this._dialog, e);
  }
  _setEscapeEvent() {
    this._isShown ? u.on(document, Zo, (t) => {
      this._config.keyboard && t.key === Xo ? (t.preventDefault(), this.hide()) : !this._config.keyboard && t.key === Xo && this._triggerBackdropTransition();
    }) : u.off(this._element, Zo);
  }
  _setResizeEvent() {
    this._isShown ? u.on(window, qo, () => this._adjustDialog()) : u.off(window, qo);
  }
  _hideModal() {
    const t = h.findOne(qe, this._element);
    t.classList.remove(this._classes.show), t.classList.remove("opacity-100"), t.classList.add("opacity-0"), setTimeout(() => {
      this._element.style.display = "none";
    }, 300), this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = !1, this._backdrop.hide(() => {
      document.body.removeAttribute(tr), this._resetAdjustments(), this._scrollBar.reset(), u.trigger(this._element, Kh);
    });
  }
  _showBackdrop(t) {
    u.on(this._element, Qo, (e) => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = !1;
        return;
      }
      e.target === e.currentTarget && (this._config.backdrop === !0 ? this.hide() : this._config.backdrop === "static" && this._triggerBackdropTransition());
    }), this._backdrop.show(t);
  }
  _isAnimated() {
    return !!h.findOne(qe, this._element);
  }
  _triggerBackdropTransition() {
    if (u.trigger(this._element, jh).defaultPrevented)
      return;
    const { classList: e, scrollHeight: i, style: n } = this._element, o = i > document.documentElement.clientHeight;
    !o && n.overflowY === "hidden" || e.contains(this._classes.static) || (o || (n.overflowY = "hidden"), e.add(...this._classes.static.split(" ")), e.add(...this._classes.staticProperties.split(" ")), this._queueCallback(() => {
      e.remove(this._classes.static), setTimeout(() => {
        e.remove(...this._classes.staticProperties.split(" "));
      }, 300), o || this._queueCallback(() => {
        n.overflowY = "";
      }, this._dialog);
    }, this._dialog), this._element.focus());
  }
  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------
  _adjustDialog() {
    const t = this._element.scrollHeight > document.documentElement.clientHeight, e = this._scrollBar.getWidth(), i = e > 0;
    (!i && t && !F() || i && !t && F()) && (this._element.style.paddingLeft = `${e}px`), (i && !t && !F() || !i && t && F()) && (this._element.style.paddingRight = `${e}px`);
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
  }
  // Static
  static jQueryInterface(t, e) {
    return this.each(function() {
      const i = Pn.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
}
const qh = /* @__PURE__ */ new Set([
  "background",
  "cite",
  "href",
  "itemtype",
  "longdesc",
  "poster",
  "src",
  "xlink:href"
]), Qh = /^aria-[\w-]*$/i, Zh = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i, Jh = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i, tu = (s, t) => {
  const e = s.nodeName.toLowerCase();
  if (t.includes(e))
    return qh.has(e) ? !!(Zh.test(s.nodeValue) || Jh.test(s.nodeValue)) : !0;
  const i = t.filter(
    (n) => n instanceof RegExp
  );
  for (let n = 0, o = i.length; n < o; n++)
    if (i[n].test(e))
      return !0;
  return !1;
}, eu = {
  // Global attributes allowed on any supplied element below.
  "*": ["class", "dir", "id", "lang", "role", Qh],
  a: ["target", "href", "title", "rel"],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ["src", "srcset", "alt", "title", "width", "height"],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
function ir(s, t, e) {
  if (!s.length)
    return s;
  if (e && typeof e == "function")
    return e(s);
  const n = new window.DOMParser().parseFromString(s, "text/html"), o = [].concat(...n.body.querySelectorAll("*"));
  for (let r = 0, a = o.length; r < a; r++) {
    const l = o[r], c = l.nodeName.toLowerCase();
    if (!Object.keys(t).includes(c)) {
      l.remove();
      continue;
    }
    const d = [].concat(...l.attributes), _ = [].concat(
      t["*"] || [],
      t[c] || []
    );
    d.forEach((f) => {
      tu(f, _) || l.removeAttribute(f.nodeName);
    });
  }
  return n.body.innerHTML;
}
const sr = "tooltip", iu = "te.tooltip", Ct = `.${iu}`, su = "te-tooltip", nu = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]), ou = {
  animation: "boolean",
  template: "string",
  title: "(string|element|function)",
  trigger: "string",
  delay: "(number|object)",
  html: "boolean",
  selector: "(string|boolean)",
  placement: "(string|function)",
  offset: "(array|string|function)",
  container: "(string|element|boolean)",
  fallbackPlacements: "array",
  boundary: "(string|element)",
  customClass: "(string|function)",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  allowList: "object",
  popperConfig: "(null|object|function)"
}, ru = {
  AUTO: "auto",
  TOP: "top",
  RIGHT: F() ? "left" : "right",
  BOTTOM: "bottom",
  LEFT: F() ? "right" : "left"
}, au = {
  animation: !0,
  template: '<div class="opacity-0 transition-opacity duration-300 ease-in-out absolute z-[1080] block m-0 text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal" role="tooltip"><div data-te-tooltip-inner-ref class="tooltip-inner max-w-[200px] text-sm py-1.5 px-4 text-white text-center bg-[#6d6d6d] rounded"></div></div>',
  trigger: "hover focus",
  title: "",
  delay: 0,
  html: !1,
  selector: !1,
  placement: "top",
  offset: [0, 0],
  container: !1,
  fallbackPlacements: ["top", "right", "bottom", "left"],
  boundary: "clippingParents",
  customClass: "",
  sanitize: !0,
  sanitizeFn: null,
  allowList: eu,
  popperConfig: { hide: !0 }
}, lu = {
  HIDE: `hide${Ct}`,
  HIDDEN: `hidden${Ct}`,
  SHOW: `show${Ct}`,
  SHOWN: `shown${Ct}`,
  INSERTED: `inserted${Ct}`,
  CLICK: `click${Ct}`,
  FOCUSIN: `focusin${Ct}`,
  FOCUSOUT: `focusout${Ct}`,
  MOUSEENTER: `mouseenter${Ct}`,
  MOUSELEAVE: `mouseleave${Ct}`
}, cu = "fade", du = "modal", Js = "show", Qe = "show", tn = "out", nr = ".tooltip-inner", or = `.${du}`, rr = "hide.te.modal", Ze = "hover", en = "focus", hu = "click", uu = "manual";
class vi extends vt {
  constructor(t, e) {
    if (typeof il > "u")
      throw new TypeError(
        "Bootstrap's tooltips require Popper (https://popper.js.org)"
      );
    super(t), this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this._config = this._getConfig(e), this.tip = null, this._setListeners();
  }
  // Getters
  static get Default() {
    return au;
  }
  static get NAME() {
    return sr;
  }
  static get Event() {
    return lu;
  }
  static get DefaultType() {
    return ou;
  }
  // Public
  enable() {
    this._isEnabled = !0;
  }
  disable() {
    this._isEnabled = !1;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle(t) {
    if (this._isEnabled)
      if (t) {
        const e = this._initializeOnDelegatedTarget(t);
        e._activeTrigger.click = !e._activeTrigger.click, e._isWithActiveTrigger() ? e._enter(null, e) : e._leave(null, e);
      } else {
        if (this.getTipElement().classList.contains(Js)) {
          this._leave(null, this);
          return;
        }
        this._enter(null, this);
      }
  }
  dispose() {
    clearTimeout(this._timeout), u.off(
      this._element.closest(or),
      rr,
      this._hideModalHandler
    ), this.tip && this.tip.remove(), this._disposePopper(), super.dispose();
  }
  show() {
    if (this._element.style.display === "none")
      throw new Error("Please use show on visible elements");
    if (!(this.isWithContent() && this._isEnabled))
      return;
    const t = u.trigger(
      this._element,
      this.constructor.Event.SHOW
    ), e = Ta(this._element), i = e === null ? this._element.ownerDocument.documentElement.contains(this._element) : e.contains(this._element);
    if (t.defaultPrevented || !i)
      return;
    this.constructor.NAME === "tooltip" && this.tip && this.getTitle() !== this.tip.querySelector(nr).innerHTML && (this._disposePopper(), this.tip.remove(), this.tip = null);
    const n = this.getTipElement(), o = Ot(this.constructor.NAME);
    n.setAttribute("id", o), this._element.setAttribute("aria-describedby", o), this._config.animation && setTimeout(() => {
      this.tip.classList.add("opacity-100"), this.tip.classList.remove("opacity-0");
    }, 100);
    const r = typeof this._config.placement == "function" ? this._config.placement.call(this, n, this._element) : this._config.placement, a = this._getAttachment(r);
    this._addAttachmentClass(a);
    const { container: l } = this._config;
    if (I.setData(n, this.constructor.DATA_KEY, this), this._element.ownerDocument.documentElement.contains(this.tip) || (l.append(n), u.trigger(this._element, this.constructor.Event.INSERTED)), this._popper ? this._popper.update() : this._popper = je(
      this._element,
      n,
      this._getPopperConfig(a)
    ), n.getAttribute("id").includes("tooltip"))
      switch (r) {
        case "bottom":
          n.classList.add("py-[0.4rem]");
          break;
        case "left":
          n.classList.add("px-[0.4rem]");
          break;
        case "right":
          n.classList.add("px-[0.4rem]");
          break;
        default:
          n.classList.add("py-[0.4rem]");
          break;
      }
    const d = this._resolvePossibleFunction(this._config.customClass);
    d && n.classList.add(...d.split(" ")), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((m) => {
      u.on(m, "mouseover", vs);
    });
    const _ = () => {
      const m = this._hoverState;
      this._hoverState = null, u.trigger(this._element, this.constructor.Event.SHOWN), m === tn && this._leave(null, this);
    }, f = this.tip.classList.contains("transition-opacity");
    this._queueCallback(_, this.tip, f);
  }
  hide() {
    if (!this._popper)
      return;
    const t = this.getTipElement(), e = () => {
      this._isWithActiveTrigger() || (this._hoverState !== Qe && t.remove(), this._cleanTipClass(), this._element.removeAttribute("aria-describedby"), u.trigger(this._element, this.constructor.Event.HIDDEN), this._disposePopper());
    };
    if (u.trigger(
      this._element,
      this.constructor.Event.HIDE
    ).defaultPrevented)
      return;
    t.classList.add("opacity-0"), t.classList.remove("opacity-100"), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((o) => u.off(o, "mouseover", vs)), this._activeTrigger[hu] = !1, this._activeTrigger[en] = !1, this._activeTrigger[Ze] = !1;
    const n = this.tip.classList.contains("opacity-0");
    this._queueCallback(e, this.tip, n), this._hoverState = "";
  }
  update() {
    this._popper !== null && this._popper.update();
  }
  // Protected
  isWithContent() {
    return !!this.getTitle();
  }
  getTipElement() {
    if (this.tip)
      return this.tip;
    const t = document.createElement("div");
    t.innerHTML = this._config.template;
    const e = t.children[0];
    return this.setContent(e), e.classList.remove(cu, Js), this.tip = e, this.tip;
  }
  setContent(t) {
    this._sanitizeAndSetContent(t, this.getTitle(), nr);
  }
  _sanitizeAndSetContent(t, e, i) {
    const n = h.findOne(i, t);
    if (!e && n) {
      n.remove();
      return;
    }
    this.setElementContent(n, e);
  }
  setElementContent(t, e) {
    if (t !== null) {
      if (Ne(e)) {
        e = Gt(e), this._config.html ? e.parentNode !== t && (t.innerHTML = "", t.append(e)) : t.textContent = e.textContent;
        return;
      }
      this._config.html ? (this._config.sanitize && (e = ir(
        e,
        this._config.allowList,
        this._config.sanitizeFn
      )), t.innerHTML = e) : t.textContent = e;
    }
  }
  getTitle() {
    const t = this._element.getAttribute("data-te-original-title") || this._config.title;
    return this._resolvePossibleFunction(t);
  }
  updateAttachment(t) {
    return t === "right" ? "end" : t === "left" ? "start" : t;
  }
  // Private
  _initializeOnDelegatedTarget(t, e) {
    return e || this.constructor.getOrCreateInstance(
      t.delegateTarget,
      this._getDelegateConfig()
    );
  }
  _getOffset() {
    const { offset: t } = this._config;
    return typeof t == "string" ? t.split(",").map((e) => Number.parseInt(e, 10)) : typeof t == "function" ? (e) => t(e, this._element) : t;
  }
  _resolvePossibleFunction(t) {
    return typeof t == "function" ? t.call(this._element) : t;
  }
  _getPopperConfig(t) {
    const e = {
      placement: t,
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        },
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        },
        {
          name: "arrow",
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        },
        {
          name: "onChange",
          enabled: !0,
          phase: "afterWrite",
          fn: (i) => this._handlePopperPlacementChange(i)
        }
      ],
      onFirstUpdate: (i) => {
        i.options.placement !== i.placement && this._handlePopperPlacementChange(i);
      }
    };
    return {
      ...e,
      ...typeof this._config.popperConfig == "function" ? this._config.popperConfig(e) : this._config.popperConfig
    };
  }
  _addAttachmentClass(t) {
    this.getTipElement().classList.add(
      `${this._getBasicClassPrefix()}-${this.updateAttachment(t)}`
    );
  }
  _getAttachment(t) {
    return ru[t.toUpperCase()];
  }
  _setListeners() {
    this._config.trigger.split(" ").forEach((e) => {
      if (e === "click")
        u.on(
          this._element,
          this.constructor.Event.CLICK,
          this._config.selector,
          (i) => this.toggle(i)
        );
      else if (e !== uu) {
        const i = e === Ze ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN, n = e === Ze ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
        u.on(
          this._element,
          i,
          this._config.selector,
          (o) => this._enter(o)
        ), u.on(
          this._element,
          n,
          this._config.selector,
          (o) => this._leave(o)
        );
      }
    }), this._hideModalHandler = () => {
      this._element && this.hide();
    }, u.on(
      this._element.closest(or),
      rr,
      this._hideModalHandler
    ), this._config.selector ? this._config = {
      ...this._config,
      trigger: "manual",
      selector: ""
    } : this._fixTitle();
  }
  _fixTitle() {
    const t = this._element.getAttribute("title"), e = typeof this._element.getAttribute(
      "data-te-original-title"
    );
    (t || e !== "string") && (this._element.setAttribute("data-te-original-title", t || ""), t && !this._element.getAttribute("aria-label") && !this._element.textContent && this._element.setAttribute("aria-label", t), this._element.setAttribute("title", ""));
  }
  _enter(t, e) {
    if (e = this._initializeOnDelegatedTarget(t, e), t && (e._activeTrigger[t.type === "focusin" ? en : Ze] = !0), e.getTipElement().classList.contains(Js) || e._hoverState === Qe) {
      e._hoverState = Qe;
      return;
    }
    if (clearTimeout(e._timeout), e._hoverState = Qe, !e._config.delay || !e._config.delay.show) {
      e.show();
      return;
    }
    e._timeout = setTimeout(() => {
      e._hoverState === Qe && e.show();
    }, e._config.delay.show);
  }
  _leave(t, e) {
    if (e = this._initializeOnDelegatedTarget(t, e), t && (e._activeTrigger[t.type === "focusout" ? en : Ze] = e._element.contains(t.relatedTarget)), !e._isWithActiveTrigger()) {
      if (clearTimeout(e._timeout), e._hoverState = tn, !e._config.delay || !e._config.delay.hide) {
        e.hide();
        return;
      }
      e._timeout = setTimeout(() => {
        e._hoverState === tn && e.hide();
      }, e._config.delay.hide);
    }
  }
  _isWithActiveTrigger() {
    for (const t in this._activeTrigger)
      if (this._activeTrigger[t])
        return !0;
    return !1;
  }
  _getConfig(t) {
    const e = p.getDataAttributes(this._element);
    return Object.keys(e).forEach((i) => {
      nu.has(i) && delete e[i];
    }), t = {
      ...this.constructor.Default,
      ...e,
      ...typeof t == "object" && t ? t : {}
    }, t.container = t.container === !1 ? document.body : Gt(t.container), typeof t.delay == "number" && (t.delay = {
      show: t.delay,
      hide: t.delay
    }), typeof t.title == "number" && (t.title = t.title.toString()), typeof t.content == "number" && (t.content = t.content.toString()), N(sr, t, this.constructor.DefaultType), t.sanitize && (t.template = ir(
      t.template,
      t.allowList,
      t.sanitizeFn
    )), t;
  }
  _getDelegateConfig() {
    const t = {};
    for (const e in this._config)
      this.constructor.Default[e] !== this._config[e] && (t[e] = this._config[e]);
    return t;
  }
  _cleanTipClass() {
    const t = this.getTipElement(), e = new RegExp(
      `(^|\\s)${this._getBasicClassPrefix()}\\S+`,
      "g"
    ), i = t.getAttribute("class").match(e);
    i !== null && i.length > 0 && i.map((n) => n.trim()).forEach((n) => t.classList.remove(n));
  }
  _getBasicClassPrefix() {
    return su;
  }
  _handlePopperPlacementChange(t) {
    const { state: e } = t;
    e && (this.tip = e.elements.popper, this._cleanTipClass(), this._addAttachmentClass(this._getAttachment(e.placement)));
  }
  _disposePopper() {
    this._popper && (this._popper.destroy(), this._popper = null);
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = vi.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const pu = "popover", fu = "te.popover", At = `.${fu}`, _u = "te-popover", mu = {
  ...vi.Default,
  placement: "right",
  offset: [0, 8],
  trigger: "click",
  content: "",
  template: '<div class="opacity-0 transition-opacity duration-150 ease-in-out absolute top-0 left-0 z-[1070] block max-w-[267px] break-words bg-white bg-clip-padding border border-neutral-100 rounded-lg shadow-[0_0px_3px_0_rgba(0,0,0,0.07),0_2px_2px_0_rgba(0,0,0,0.04)] text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal dark:bg-neutral-700 dark:border-0 dark:text-white data-[popper-reference-hidden]:hidden" role="tooltip"><h3 class="popover-header py-2 px-4 mb-0 border-b-2 border-neutral-100 rounded-t-lg font-medium empty:hidden dark:border-neutral-500"></h3><div class="popover-body p-4 text-[#212529] dark:text-white"></div></div>'
}, gu = {
  ...vi.DefaultType,
  content: "(string|element|function)"
}, bu = {
  HIDE: `hide${At}`,
  HIDDEN: `hidden${At}`,
  SHOW: `show${At}`,
  SHOWN: `shown${At}`,
  INSERTED: `inserted${At}`,
  CLICK: `click${At}`,
  FOCUSIN: `focusin${At}`,
  FOCUSOUT: `focusout${At}`,
  MOUSEENTER: `mouseenter${At}`,
  MOUSELEAVE: `mouseleave${At}`
}, vu = ".popover-header", Eu = ".popover-body";
class ll extends vi {
  // Getters
  static get Default() {
    return mu;
  }
  static get NAME() {
    return pu;
  }
  static get Event() {
    return bu;
  }
  static get DefaultType() {
    return gu;
  }
  // Overrides
  isWithContent() {
    return this.getTitle() || this._getContent();
  }
  setContent(t) {
    this._sanitizeAndSetContent(t, this.getTitle(), vu), this._sanitizeAndSetContent(t, this._getContent(), Eu);
  }
  // Private
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }
  _getBasicClassPrefix() {
    return _u;
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = ll.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const sn = "scrollspy", Tu = "te.scrollspy", Ss = `.${Tu}`, Cu = ".data-api", ar = {
  offset: 10,
  method: "auto",
  target: ""
}, Au = {
  offset: "number",
  method: "string",
  target: "(string|element)"
}, yu = {
  active: "!text-primary dark:!text-primary-400 font-semibold border-l-[0.125rem] border-solid border-primary dark:border-primary-400"
}, wu = {
  active: "string"
}, ku = `activate${Ss}`, Ou = `scroll${Ss}`, xu = `load${Ss}${Cu}`, nn = "data-te-nav-link-active", cl = "[data-te-dropdown-item-ref]", Su = '[data-te-spy="scroll"]', Du = "[data-te-nav-list-ref]", Hn = "[data-te-nav-link-ref]", Iu = "[data-te-nav-item-ref]", dl = "[data-te-list-group-item-ref]", on = `${Hn}, ${dl}, ${cl}`, $u = "[data-te-dropdown-ref]", Lu = "[data-te-dropdown-toggle-ref]", Mu = "offset", lr = "position";
class Bn extends vt {
  constructor(t, e, i) {
    super(t), this._scrollElement = this._element.tagName === "BODY" ? window : this._element, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, u.on(this._scrollElement, Ou, () => this._process()), this.refresh(), this._process(), this._didInit = !1, this._init();
  }
  // Getters
  static get Default() {
    return ar;
  }
  static get NAME() {
    return sn;
  }
  // Public
  refresh() {
    const t = this._scrollElement === this._scrollElement.window ? Mu : lr, e = this._config.method === "auto" ? t : this._config.method, i = e === lr ? this._getScrollTop() : 0;
    this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), h.find(
      on,
      this._config.target
    ).map((o) => {
      const r = Xn(o), a = r ? h.findOne(r) : null;
      if (a) {
        const l = a.getBoundingClientRect();
        if (l.width || l.height)
          return [
            p[e](a).top + i,
            r
          ];
      }
      return null;
    }).filter((o) => o).sort((o, r) => o[0] - r[0]).forEach((o) => {
      this._offsets.push(o[0]), this._targets.push(o[1]);
    });
  }
  dispose() {
    u.off(this._scrollElement, Ss), super.dispose();
  }
  // Private
  _init() {
    this._didInit || (u.on(window, xu, () => {
      h.find(Su).forEach(
        (t) => new Bn(t)
      );
    }), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...ar,
      ...p.getDataAttributes(this._element),
      ...typeof t == "object" && t ? t : {}
    }, t.target = Gt(t.target) || document.documentElement, N(sn, t, Au), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...yu,
      ...e,
      ...t
    }, N(sn, t, wu), t;
  }
  _getScrollTop() {
    return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
  }
  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }
  _getOffsetHeight() {
    return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
  }
  _process() {
    const t = this._getScrollTop() + this._config.offset, e = this._getScrollHeight(), i = this._config.offset + e - this._getOffsetHeight();
    if (this._scrollHeight !== e && this.refresh(), t >= i) {
      const n = this._targets[this._targets.length - 1];
      this._activeTarget !== n && this._activate(n);
      return;
    }
    if (this._activeTarget && t < this._offsets[0] && this._offsets[0] > 0) {
      this._activeTarget = null, this._clear();
      return;
    }
    for (let n = this._offsets.length; n--; )
      this._activeTarget !== this._targets[n] && t >= this._offsets[n] && (typeof this._offsets[n + 1] > "u" || t < this._offsets[n + 1]) && this._activate(this._targets[n]);
  }
  _activate(t) {
    this._activeTarget = t, this._clear();
    const e = on.split(",").map(
      (n) => `${n}[data-te-target="${t}"],${n}[href="${t}"]`
    ), i = h.findOne(e.join(","), this._config.target);
    i.classList.add(...this._classes.active.split(" ")), i.setAttribute(nn, ""), i.getAttribute(cl) ? h.findOne(
      Lu,
      i.closest($u)
    ).classList.add(...this._classes.active.split(" ")) : h.parents(i, Du).forEach(
      (n) => {
        h.prev(
          n,
          `${Hn}, ${dl}`
        ).forEach((o) => {
          o.classList.add(...this._classes.active.split(" ")), o.setAttribute(nn, "");
        }), h.prev(n, Iu).forEach(
          (o) => {
            h.children(o, Hn).forEach(
              (r) => r.classList.add(...this._classes.active.split(" "))
            );
          }
        );
      }
    ), u.trigger(this._scrollElement, ku, {
      relatedTarget: t
    });
  }
  _clear() {
    h.find(on, this._config.target).filter(
      (t) => t.classList.contains(...this._classes.active.split(" "))
    ).forEach((t) => {
      t.classList.remove(...this._classes.active.split(" ")), t.removeAttribute(nn);
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Bn.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const cr = "tab", Nu = "te.tab", Ds = `.${Nu}`, Ru = `hide${Ds}`, Pu = `hidden${Ds}`, Hu = `show${Ds}`, Bu = `shown${Ds}`, Vu = "data-te-dropdown-menu-ref", we = "data-te-tab-active", as = "data-te-nav-active", Wu = "[data-te-dropdown-ref]", Fu = "[data-te-nav-ref]", dr = `[${we}]`, Yu = `[${as}]`, hr = ":scope > li > .active", ju = "[data-te-dropdown-toggle-ref]", Ku = ":scope > [data-te-dropdown-menu-ref] [data-te-dropdown-show]", Uu = {
  show: "opacity-100",
  hide: "opacity-0"
}, zu = {
  show: "string",
  hide: "string"
};
class hl extends vt {
  constructor(t, e) {
    super(t), this._classes = this._getClasses(e);
  }
  // Getters
  static get NAME() {
    return cr;
  }
  // Public
  show() {
    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.getAttribute(as) === "")
      return;
    let t;
    const e = Xt(this._element), i = this._element.closest(Fu), n = h.findOne(
      Yu,
      i
    );
    if (i) {
      const l = i.nodeName === "UL" || i.nodeName === "OL" ? hr : dr;
      t = h.find(l, i), t = t[t.length - 1];
    }
    const o = t ? u.trigger(t, Ru, {
      relatedTarget: this._element
    }) : null;
    if (u.trigger(this._element, Hu, {
      relatedTarget: t
    }).defaultPrevented || o !== null && o.defaultPrevented)
      return;
    this._activate(
      this._element,
      i,
      null,
      n,
      this._element
    );
    const a = () => {
      u.trigger(t, Pu, {
        relatedTarget: this._element
      }), u.trigger(this._element, Bu, {
        relatedTarget: t
      });
    };
    e ? this._activate(
      e,
      e.parentNode,
      a,
      n,
      this._element
    ) : a();
  }
  // Private
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...Uu,
      ...e,
      ...t
    }, N(cr, t, zu), t;
  }
  _activate(t, e, i, n, o) {
    const a = (e && (e.nodeName === "UL" || e.nodeName === "OL") ? h.find(hr, e) : h.children(e, dr))[0], l = i && a && a.hasAttribute(we), c = () => this._transitionComplete(
      t,
      a,
      i,
      n,
      o
    );
    a && l ? (p.removeClass(a, this._classes.show), p.addClass(a, this._classes.hide), this._queueCallback(c, t, !0)) : c();
  }
  _transitionComplete(t, e, i, n, o) {
    if (e && n) {
      e.removeAttribute(we), n.removeAttribute(as);
      const a = h.findOne(
        Ku,
        e.parentNode
      );
      a && a.removeAttribute(we), e.getAttribute("role") === "tab" && e.setAttribute("aria-selected", !1);
    }
    t.setAttribute(we, ""), o.setAttribute(as, ""), t.getAttribute("role") === "tab" && t.setAttribute("aria-selected", !0), Fe(t), t.classList.contains(this._classes.hide) && (p.removeClass(t, this._classes.hide), p.addClass(t, this._classes.show));
    let r = t.parentNode;
    if (r && r.nodeName === "LI" && (r = r.parentNode), r && r.hasAttribute(Vu)) {
      const a = t.closest(Wu);
      a && h.find(ju, a).forEach(
        (l) => l.setAttribute(we, "")
      ), t.setAttribute("aria-expanded", !0);
    }
    i && i();
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = hl.getOrCreateInstance(this);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const rn = "toast", Xu = "te.toast", Qt = `.${Xu}`, Gu = `mouseover${Qt}`, qu = `mouseout${Qt}`, Qu = `focusin${Qt}`, Zu = `focusout${Qt}`, Ju = `hide${Qt}`, tp = `hidden${Qt}`, ep = `show${Qt}`, ip = `shown${Qt}`, ur = "data-te-toast-hide", an = "data-te-toast-show", Mi = "data-te-toast-showing", sp = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
}, pr = {
  animation: !0,
  autohide: !0,
  delay: 5e3
}, np = {
  fadeIn: "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
  fadeOut: "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none"
}, op = {
  fadeIn: "string",
  fadeOut: "string"
};
class Vn extends vt {
  constructor(t, e, i) {
    super(t), this._config = this._getConfig(e), this._classes = this._getClasses(i), this._timeout = null, this._hasMouseInteraction = !1, this._hasKeyboardInteraction = !1, this._setListeners(), this._didInit = !1, this._init();
  }
  // Getters
  static get DefaultType() {
    return sp;
  }
  static get Default() {
    return pr;
  }
  static get NAME() {
    return rn;
  }
  // Public
  show() {
    if (u.trigger(this._element, ep).defaultPrevented)
      return;
    this._clearTimeout(), this._config.animation && (p.removeClass(this._element, this._classes.fadeOut), p.addClass(this._element, this._classes.fadeIn));
    const e = () => {
      this._element.removeAttribute(Mi), u.trigger(this._element, ip), this._maybeScheduleHide();
    };
    this._element.removeAttribute(ur), Fe(this._element), this._element.setAttribute(an, ""), this._element.setAttribute(Mi, ""), this._queueCallback(e, this._element, this._config.animation);
  }
  hide() {
    if (!this._element || this._element.dataset.teToastShow === void 0 || u.trigger(this._element, Ju).defaultPrevented)
      return;
    const e = () => {
      let i = 0;
      this._config.animation && (i = 300, p.removeClass(this._element, this._classes.fadeIn), p.addClass(this._element, this._classes.fadeOut)), setTimeout(() => {
        this._element.setAttribute(ur, ""), this._element.removeAttribute(Mi), this._element.removeAttribute(an), u.trigger(this._element, tp);
      }, i);
    };
    this._element.setAttribute(Mi, ""), this._queueCallback(e, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout(), this._element.dataset.teToastShow !== void 0 && this._element.removeAttribute(an), super.dispose();
  }
  // Private
  _init() {
    this._didInit || (xs(Vn), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...pr,
      ...p.getDataAttributes(this._element),
      ...typeof t == "object" && t ? t : {}
    }, N(rn, t, this.constructor.DefaultType), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...np,
      ...e,
      ...t
    }, N(rn, t, op), t;
  }
  _maybeScheduleHide() {
    this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay)));
  }
  _onInteraction(t, e) {
    switch (t.type) {
      case "mouseover":
      case "mouseout":
        this._hasMouseInteraction = e;
        break;
      case "focusin":
      case "focusout":
        this._hasKeyboardInteraction = e;
        break;
    }
    if (e) {
      this._clearTimeout();
      return;
    }
    const i = t.relatedTarget;
    this._element === i || this._element.contains(i) || this._maybeScheduleHide();
  }
  _setListeners() {
    u.on(
      this._element,
      Gu,
      (t) => this._onInteraction(t, !0)
    ), u.on(
      this._element,
      qu,
      (t) => this._onInteraction(t, !1)
    ), u.on(
      this._element,
      Qu,
      (t) => this._onInteraction(t, !0)
    ), u.on(
      this._element,
      Zu,
      (t) => this._onInteraction(t, !1)
    );
  }
  _clearTimeout() {
    clearTimeout(this._timeout), this._timeout = null;
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Vn.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t](this);
      }
    });
  }
}
(() => {
  var s = { 454: (i, n, o) => {
    o.d(n, { Z: () => l });
    var r = o(645), a = o.n(r)()(function(c) {
      return c[1];
    });
    a.push([i.id, "INPUT:-webkit-autofill,SELECT:-webkit-autofill,TEXTAREA:-webkit-autofill{animation-name:onautofillstart}INPUT:not(:-webkit-autofill),SELECT:not(:-webkit-autofill),TEXTAREA:not(:-webkit-autofill){animation-name:onautofillcancel}@keyframes onautofillstart{}@keyframes onautofillcancel{}", ""]);
    const l = a;
  }, 645: (i) => {
    i.exports = function(n) {
      var o = [];
      return o.toString = function() {
        return this.map(function(r) {
          var a = n(r);
          return r[2] ? "@media ".concat(r[2], " {").concat(a, "}") : a;
        }).join("");
      }, o.i = function(r, a, l) {
        typeof r == "string" && (r = [[null, r, ""]]);
        var c = {};
        if (l)
          for (var d = 0; d < this.length; d++) {
            var _ = this[d][0];
            _ != null && (c[_] = !0);
          }
        for (var f = 0; f < r.length; f++) {
          var m = [].concat(r[f]);
          l && c[m[0]] || (a && (m[2] ? m[2] = "".concat(a, " and ").concat(m[2]) : m[2] = a), o.push(m));
        }
      }, o;
    };
  }, 810: () => {
    (function() {
      if (typeof window < "u")
        try {
          var i = new window.CustomEvent("test", { cancelable: !0 });
          if (i.preventDefault(), i.defaultPrevented !== !0)
            throw new Error("Could not prevent default");
        } catch {
          var n = function(r, a) {
            var l, c;
            return (a = a || {}).bubbles = !!a.bubbles, a.cancelable = !!a.cancelable, (l = document.createEvent("CustomEvent")).initCustomEvent(r, a.bubbles, a.cancelable, a.detail), c = l.preventDefault, l.preventDefault = function() {
              c.call(this);
              try {
                Object.defineProperty(this, "defaultPrevented", { get: function() {
                  return !0;
                } });
              } catch {
                this.defaultPrevented = !0;
              }
            }, l;
          };
          n.prototype = window.Event.prototype, window.CustomEvent = n;
        }
    })();
  }, 379: (i, n, o) => {
    var r, a = function() {
      var v = {};
      return function(E) {
        if (v[E] === void 0) {
          var A = document.querySelector(E);
          if (window.HTMLIFrameElement && A instanceof window.HTMLIFrameElement)
            try {
              A = A.contentDocument.head;
            } catch {
              A = null;
            }
          v[E] = A;
        }
        return v[E];
      };
    }(), l = [];
    function c(v) {
      for (var E = -1, A = 0; A < l.length; A++)
        if (l[A].identifier === v) {
          E = A;
          break;
        }
      return E;
    }
    function d(v, E) {
      for (var A = {}, y = [], S = 0; S < v.length; S++) {
        var O = v[S], k = E.base ? O[0] + E.base : O[0], D = A[k] || 0, x = "".concat(k, " ").concat(D);
        A[k] = D + 1;
        var $ = c(x), P = { css: O[1], media: O[2], sourceMap: O[3] };
        $ !== -1 ? (l[$].references++, l[$].updater(P)) : l.push({ identifier: x, updater: w(P, E), references: 1 }), y.push(x);
      }
      return y;
    }
    function _(v) {
      var E = document.createElement("style"), A = v.attributes || {};
      if (A.nonce === void 0) {
        var y = o.nc;
        y && (A.nonce = y);
      }
      if (Object.keys(A).forEach(function(O) {
        E.setAttribute(O, A[O]);
      }), typeof v.insert == "function")
        v.insert(E);
      else {
        var S = a(v.insert || "head");
        if (!S)
          throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
        S.appendChild(E);
      }
      return E;
    }
    var f, m = (f = [], function(v, E) {
      return f[v] = E, f.filter(Boolean).join(`
`);
    });
    function g(v, E, A, y) {
      var S = A ? "" : y.media ? "@media ".concat(y.media, " {").concat(y.css, "}") : y.css;
      if (v.styleSheet)
        v.styleSheet.cssText = m(E, S);
      else {
        var O = document.createTextNode(S), k = v.childNodes;
        k[E] && v.removeChild(k[E]), k.length ? v.insertBefore(O, k[E]) : v.appendChild(O);
      }
    }
    function b(v, E, A) {
      var y = A.css, S = A.media, O = A.sourceMap;
      if (S ? v.setAttribute("media", S) : v.removeAttribute("media"), O && typeof btoa < "u" && (y += `
/*# sourceMappingURL=data:application/json;base64,`.concat(btoa(unescape(encodeURIComponent(JSON.stringify(O)))), " */")), v.styleSheet)
        v.styleSheet.cssText = y;
      else {
        for (; v.firstChild; )
          v.removeChild(v.firstChild);
        v.appendChild(document.createTextNode(y));
      }
    }
    var T = null, C = 0;
    function w(v, E) {
      var A, y, S;
      if (E.singleton) {
        var O = C++;
        A = T || (T = _(E)), y = g.bind(null, A, O, !1), S = g.bind(null, A, O, !0);
      } else
        A = _(E), y = b.bind(null, A, E), S = function() {
          (function(k) {
            if (k.parentNode === null)
              return !1;
            k.parentNode.removeChild(k);
          })(A);
        };
      return y(v), function(k) {
        if (k) {
          if (k.css === v.css && k.media === v.media && k.sourceMap === v.sourceMap)
            return;
          y(v = k);
        } else
          S();
      };
    }
    i.exports = function(v, E) {
      (E = E || {}).singleton || typeof E.singleton == "boolean" || (E.singleton = (r === void 0 && (r = !!(window && document && document.all && !window.atob)), r));
      var A = d(v = v || [], E);
      return function(y) {
        if (y = y || [], Object.prototype.toString.call(y) === "[object Array]") {
          for (var S = 0; S < A.length; S++) {
            var O = c(A[S]);
            l[O].references--;
          }
          for (var k = d(y, E), D = 0; D < A.length; D++) {
            var x = c(A[D]);
            l[x].references === 0 && (l[x].updater(), l.splice(x, 1));
          }
          A = k;
        }
      };
    };
  } }, t = {};
  function e(i) {
    var n = t[i];
    if (n !== void 0)
      return n.exports;
    var o = t[i] = { id: i, exports: {} };
    return s[i](o, o.exports, e), o.exports;
  }
  e.n = (i) => {
    var n = i && i.__esModule ? () => i.default : () => i;
    return e.d(n, { a: n }), n;
  }, e.d = (i, n) => {
    for (var o in n)
      e.o(n, o) && !e.o(i, o) && Object.defineProperty(i, o, { enumerable: !0, get: n[o] });
  }, e.o = (i, n) => Object.prototype.hasOwnProperty.call(i, n), (() => {
    var i = e(379), n = e.n(i), o = e(454);
    function r(l) {
      if (!l.hasAttribute("autocompleted")) {
        l.setAttribute("autocompleted", "");
        var c = new window.CustomEvent("onautocomplete", { bubbles: !0, cancelable: !0, detail: null });
        l.dispatchEvent(c) || (l.value = "");
      }
    }
    function a(l) {
      l.hasAttribute("autocompleted") && (l.removeAttribute("autocompleted"), l.dispatchEvent(new window.CustomEvent("onautocomplete", { bubbles: !0, cancelable: !1, detail: null })));
    }
    n()(o.Z, { insert: "head", singleton: !1 }), o.Z.locals, e(810), document.addEventListener("animationstart", function(l) {
      l.animationName === "onautofillstart" ? r(l.target) : a(l.target);
    }, !0), document.addEventListener("input", function(l) {
      l.inputType !== "insertReplacementText" && "data" in l ? a(l.target) : r(l.target);
    }, !0);
  })();
})();
const ln = "input", Ni = "te.input", ul = "data-te-input-wrapper-init", pl = "data-te-input-notch-ref", fl = "data-te-input-notch-leading-ref", _l = "data-te-input-notch-middle-ref", rp = "data-te-input-notch-trailing-ref", ap = "data-te-input-helper-ref", lp = "data-te-input-placeholder-active", Ht = "data-te-input-state-active", fr = "data-te-input-focused", _r = "data-te-input-form-counter", re = `[${ul}] input`, ae = `[${ul}] textarea`, Ee = `[${pl}]`, mr = `[${fl}]`, gr = `[${_l}]`, cp = `[${ap}]`, dp = {
  inputFormWhite: !1
}, hp = {
  inputFormWhite: "(boolean)"
}, up = {
  notch: "group flex absolute left-0 top-0 w-full max-w-full h-full text-left pointer-events-none",
  notchLeading: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none left-0 top-0 h-full w-2 border-r-0 rounded-l-[0.25rem] group-data-[te-input-focused]:border-r-0 group-data-[te-input-state-active]:border-r-0",
  notchLeadingNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  notchLeadingWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[-1px_0_0_#ffffff,_0_1px_0_0_#ffffff,_0_-1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
  notchMiddle: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow-0 shrink-0 basis-auto w-auto max-w-[calc(100%-1rem)] h-full border-r-0 border-l-0 group-data-[te-input-focused]:border-x-0 group-data-[te-input-state-active]:border-x-0 group-data-[te-input-focused]:border-t group-data-[te-input-state-active]:border-t group-data-[te-input-focused]:border-solid group-data-[te-input-state-active]:border-solid group-data-[te-input-focused]:border-t-transparent group-data-[te-input-state-active]:border-t-transparent",
  notchMiddleNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  notchMiddleWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
  notchTrailing: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow h-full border-l-0 rounded-r-[0.25rem] group-data-[te-input-focused]:border-l-0 group-data-[te-input-state-active]:border-l-0",
  notchTrailingNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  notchTrailingWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[1px_0_0_#ffffff,_0_-1px_0_0_#ffffff,_0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
  counter: "text-right leading-[1.6]"
}, pp = {
  notch: "string",
  notchLeading: "string",
  notchLeadingNormal: "string",
  notchLeadingWhite: "string",
  notchMiddle: "string",
  notchMiddleNormal: "string",
  notchMiddleWhite: "string",
  notchTrailing: "string",
  notchTrailingNormal: "string",
  notchTrailingWhite: "string",
  counter: "string"
};
class V {
  constructor(t, e, i) {
    this._config = this._getConfig(e, t), this._element = t, this._classes = this._getClasses(i), this._label = null, this._labelWidth = 0, this._labelMarginLeft = 0, this._notchLeading = null, this._notchMiddle = null, this._notchTrailing = null, this._initiated = !1, this._helper = null, this._counter = !1, this._counterElement = null, this._maxLength = 0, this._leadingIcon = null, this._element && (I.setData(t, Ni, this), this.init());
  }
  // Getters
  static get NAME() {
    return ln;
  }
  get input() {
    return h.findOne("input", this._element) || h.findOne("textarea", this._element);
  }
  // Public
  init() {
    this._initiated || (this._getLabelData(), this._applyDivs(), this._applyNotch(), this._activate(), this._getHelper(), this._getCounter(), this._getEvents(), this._initiated = !0);
  }
  update() {
    this._getLabelData(), this._getNotchData(), this._applyNotch(), this._activate(), this._getHelper(), this._getCounter();
  }
  forceActive() {
    this.input.setAttribute(Ht, ""), h.findOne(Ee, this.input.parentNode).setAttribute(
      Ht,
      ""
    );
  }
  forceInactive() {
    this.input.removeAttribute(Ht), h.findOne(
      Ee,
      this.input.parentNode
    ).removeAttribute(Ht);
  }
  dispose() {
    this._removeBorder(), I.removeData(this._element, Ni), this._element = null;
  }
  // Private
  _getConfig(t, e) {
    return t = {
      ...dp,
      ...p.getDataAttributes(e),
      ...typeof t == "object" ? t : {}
    }, N(ln, t, hp), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...up,
      ...e,
      ...t
    }, N(ln, t, pp), t;
  }
  _getLabelData() {
    this._label = h.findOne("label", this._element), this._label === null ? this._showPlaceholder() : (this._getLabelWidth(), this._getLabelPositionInInputGroup(), this._toggleDefaultDatePlaceholder());
  }
  _getHelper() {
    this._helper = h.findOne(cp, this._element);
  }
  _getCounter() {
    this._counter = p.getDataAttribute(
      this.input,
      "inputShowcounter"
    ), this._counter && (this._maxLength = this.input.maxLength, this._showCounter());
  }
  _getEvents() {
    u.on(
      document,
      "focus",
      re,
      V.activate(new V())
    ), u.on(
      document,
      "input",
      re,
      V.activate(new V())
    ), u.on(
      document,
      "blur",
      re,
      V.deactivate(new V())
    ), u.on(
      document,
      "focus",
      ae,
      V.activate(new V())
    ), u.on(
      document,
      "input",
      ae,
      V.activate(new V())
    ), u.on(
      document,
      "blur",
      ae,
      V.deactivate(new V())
    ), u.on(window, "shown.te.modal", (t) => {
      h.find(re, t.target).forEach(
        (e) => {
          const i = V.getInstance(e.parentNode);
          i && i.update();
        }
      ), h.find(ae, t.target).forEach(
        (e) => {
          const i = V.getInstance(e.parentNode);
          i && i.update();
        }
      );
    }), u.on(window, "shown.te.dropdown", (t) => {
      const e = t.target.parentNode.querySelector(
        "[data-te-dropdown-menu-ref]"
      );
      e && (h.find(re, e).forEach(
        (i) => {
          const n = V.getInstance(i.parentNode);
          n && n.update();
        }
      ), h.find(ae, e).forEach(
        (i) => {
          const n = V.getInstance(i.parentNode);
          n && n.update();
        }
      ));
    }), u.on(window, "shown.te.tab", (t) => {
      let e;
      t.target.href ? e = t.target.href.split("#")[1] : e = p.getDataAttribute(t.target, "target").split(
        "#"
      )[1];
      const i = h.findOne(`#${e}`);
      h.find(re, i).forEach((n) => {
        const o = V.getInstance(n.parentNode);
        o && o.update();
      }), h.find(ae, i).forEach(
        (n) => {
          const o = V.getInstance(n.parentNode);
          o && o.update();
        }
      );
    }), u.on(window, "reset", (t) => {
      h.find(re, t.target).forEach(
        (e) => {
          const i = V.getInstance(e.parentNode);
          i && i.forceInactive();
        }
      ), h.find(ae, t.target).forEach(
        (e) => {
          const i = V.getInstance(e.parentNode);
          i && i.forceInactive();
        }
      );
    }), u.on(window, "onautocomplete", (t) => {
      const e = V.getInstance(t.target.parentNode);
      !e || !t.cancelable || e.forceActive();
    });
  }
  _showCounter() {
    if (h.find(
      `[${_r}]`,
      this._element
    ).length > 0)
      return;
    this._counterElement = document.createElement("div"), p.addClass(this._counterElement, this._classes.counter), this._counterElement.setAttribute(_r, "");
    const e = this.input.value.length;
    this._counterElement.innerHTML = `${e} / ${this._maxLength}`, this._helper.appendChild(this._counterElement), this._bindCounter();
  }
  _bindCounter() {
    u.on(this.input, "input", () => {
      const t = this.input.value.length;
      this._counterElement.innerHTML = `${t} / ${this._maxLength}`;
    });
  }
  _toggleDefaultDatePlaceholder(t = this.input) {
    if (!(t.getAttribute("type") === "date"))
      return;
    !(document.activeElement === t) && !t.value ? t.style.opacity = 0 : t.style.opacity = 1;
  }
  _showPlaceholder() {
    this.input.setAttribute(lp, "");
  }
  _getNotchData() {
    this._notchMiddle = h.findOne(
      gr,
      this._element
    ), this._notchLeading = h.findOne(
      mr,
      this._element
    );
  }
  _getLabelWidth() {
    this._labelWidth = this._label.clientWidth * 0.8 + 8;
  }
  _getLabelPositionInInputGroup() {
    if (this._labelMarginLeft = 0, !this._element.hasAttribute("data-te-input-group-ref"))
      return;
    const t = this.input, e = h.prev(
      t,
      "[data-te-input-group-text-ref]"
    )[0];
    e === void 0 ? this._labelMarginLeft = 0 : this._labelMarginLeft = e.offsetWidth - 1;
  }
  _applyDivs() {
    const t = this._config.inputFormWhite ? this._classes.notchLeadingWhite : this._classes.notchLeadingNormal, e = this._config.inputFormWhite ? this._classes.notchMiddleWhite : this._classes.notchMiddleNormal, i = this._config.inputFormWhite ? this._classes.notchTrailingWhite : this._classes.notchTrailingNormal, n = h.find(Ee, this._element), o = M("div");
    p.addClass(o, this._classes.notch), o.setAttribute(pl, ""), this._notchLeading = M("div"), p.addClass(
      this._notchLeading,
      `${this._classes.notchLeading} ${t}`
    ), this._notchLeading.setAttribute(fl, ""), this._notchMiddle = M("div"), p.addClass(
      this._notchMiddle,
      `${this._classes.notchMiddle} ${e}`
    ), this._notchMiddle.setAttribute(_l, ""), this._notchTrailing = M("div"), p.addClass(
      this._notchTrailing,
      `${this._classes.notchTrailing} ${i}`
    ), this._notchTrailing.setAttribute(rp, ""), !(n.length >= 1) && (o.append(this._notchLeading), o.append(this._notchMiddle), o.append(this._notchTrailing), this._element.append(o));
  }
  _applyNotch() {
    this._notchMiddle.style.width = `${this._labelWidth}px`, this._notchLeading.style.width = `${this._labelMarginLeft + 9}px`, this._label !== null && (this._label.style.marginLeft = `${this._labelMarginLeft}px`);
  }
  _removeBorder() {
    const t = h.findOne(Ee, this._element);
    t && t.remove();
  }
  _activate(t) {
    Aa(() => {
      this._getElements(t);
      const e = t ? t.target : this.input, i = h.findOne(
        Ee,
        this._element
      );
      t && t.type === "focus" && i.setAttribute(fr, ""), e.value !== "" && (e.setAttribute(Ht, ""), i.setAttribute(Ht, "")), this._toggleDefaultDatePlaceholder(e);
    });
  }
  _getElements(t) {
    if (t && (this._element = t.target.parentNode, this._label = h.findOne("label", this._element)), t && this._label) {
      const e = this._labelWidth;
      this._getLabelData(), e !== this._labelWidth && (this._notchMiddle = h.findOne(
        gr,
        t.target.parentNode
      ), this._notchLeading = h.findOne(
        mr,
        t.target.parentNode
      ), this._applyNotch());
    }
  }
  _deactivate(t) {
    const e = t ? t.target : this.input, i = h.findOne(
      Ee,
      e.parentNode
    );
    i.removeAttribute(fr), e.value === "" && (e.removeAttribute(Ht), i.removeAttribute(Ht)), this._toggleDefaultDatePlaceholder(e);
  }
  static activate(t) {
    return function(e) {
      t._activate(e);
    };
  }
  static deactivate(t) {
    return function(e) {
      t._deactivate(e);
    };
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, Ni);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new V(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, Ni);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const br = "animation", cn = "te.animation", fp = {
  animation: "string",
  animationStart: "string",
  animationShowOnLoad: "boolean",
  onStart: "(null|function)",
  onEnd: "(null|function)",
  onHide: "(null|function)",
  onShow: "(null|function)",
  animationOnScroll: "(string)",
  animationWindowHeight: "number",
  animationOffset: "(number|string)",
  animationDelay: "(number|string)",
  animationReverse: "boolean",
  animationInterval: "(number|string)",
  animationRepeat: "(number|boolean)",
  animationReset: "boolean"
}, _p = {
  animation: "fade",
  animationStart: "onClick",
  animationShowOnLoad: !0,
  onStart: null,
  onEnd: null,
  onHide: null,
  onShow: null,
  animationOnScroll: "once",
  animationWindowHeight: 0,
  animationOffset: 0,
  animationDelay: 0,
  animationReverse: !1,
  animationInterval: 0,
  animationRepeat: !1,
  animationReset: !1
};
class ml {
  constructor(t, e) {
    this._element = t, this._animateElement = this._getAnimateElement(), this._isFirstScroll = !0, this._repeatAnimateOnScroll = !0, this._options = this._getConfig(e), this._element && (I.setData(t, cn, this), this._init());
  }
  // Getters
  static get NAME() {
    return br;
  }
  // Public
  init() {
    this._init();
  }
  startAnimation() {
    this._startAnimation();
  }
  stopAnimation() {
    this._clearAnimationClass();
  }
  changeAnimationType(t) {
    this._options.animation = t;
  }
  dispose() {
    u.off(this._element, "mousedown"), u.off(this._animateElement, "animationend"), u.off(window, "scroll"), u.off(this._element, "mouseover"), I.removeData(this._element, cn), this._element = null, this._animateElement = null, this._isFirstScroll = null, this._repeatAnimateOnScroll = null, this._options = null;
  }
  // Private
  _init() {
    switch (this._options.animationStart) {
      case "onHover":
        this._bindHoverEvents();
        break;
      case "onLoad":
        this._startAnimation();
        break;
      case "onScroll":
        this._bindScrollEvents();
        break;
      case "onClick":
        this._bindClickEvents();
        break;
    }
    this._bindTriggerOnEndCallback(), this._options.animationReset && this._bindResetAnimationAfterFinish();
  }
  _getAnimateElement() {
    const t = p.getDataAttribute(
      this._element,
      "animation-target"
    );
    return t ? h.find(t)[0] : this._element;
  }
  _getConfig(t) {
    const e = p.getDataAttributes(this._animateElement);
    return t = {
      ..._p,
      ...e,
      ...t
    }, N(br, t, fp), t;
  }
  _animateOnScroll() {
    const t = p.offset(this._animateElement).top, e = this._animateElement.offsetHeight, i = window.innerHeight, n = t + this._options.animationOffset <= i && t + this._options.animationOffset + e >= 0, o = this._animateElement.style.visibility === "visible";
    switch (!0) {
      case (n && this._isFirstScroll):
        this._isFirstScroll = !1, this._startAnimation();
        break;
      case (!n && this._isFirstScroll):
        this._isFirstScroll = !1, this._hideAnimateElement();
        break;
      case (n && !o && this._repeatAnimateOnScroll):
        this._options.animationOnScroll !== "repeat" && (this._repeatAnimateOnScroll = !1), this._callback(this._options.onShow), this._showAnimateElement(), this._startAnimation();
        break;
      case (!n && o && this._repeatAnimateOnScroll):
        this._hideAnimateElement(), this._clearAnimationClass(), this._callback(this._options.onHide);
        break;
    }
  }
  _addAnimatedClass() {
    p.addClass(
      this._animateElement,
      `animate-${this._options.animation}`
    );
  }
  _clearAnimationClass() {
    this._animateElement.classList.remove(`animate-${this._options.animation}`);
  }
  _startAnimation() {
    this._callback(this._options.onStart), this._addAnimatedClass(), this._options.animationRepeat && !this._options.animationInterval && this._setAnimationRepeat(), this._options.animationReverse && this._setAnimationReverse(), this._options.animationDelay && this._setAnimationDelay(), this._options.animationDuration && this._setAnimationDuration(), this._options.animationInterval && this._setAnimationInterval();
  }
  _setAnimationReverse() {
    p.style(this._animateElement, {
      animationIterationCount: this._options.animationRepeat === !0 ? "infinite" : "2",
      animationDirection: "alternate"
    });
  }
  _setAnimationDuration() {
    p.style(this._animateElement, {
      animationDuration: `${this._options.animationDuration}ms`
    });
  }
  _setAnimationDelay() {
    p.style(this._animateElement, {
      animationDelay: `${this._options.animationDelay}ms`
    });
  }
  _setAnimationRepeat() {
    p.style(this._animateElement, {
      animationIterationCount: this._options.animationRepeat === !0 ? "infinite" : this._options.animationRepeat
    });
  }
  _setAnimationInterval() {
    u.on(this._animateElement, "click", () => {
      this._clearAnimationClass(), setTimeout(() => {
        this._addAnimatedClass();
      }, this._options.animationInterval);
    });
  }
  _hideAnimateElement() {
    p.style(this._animateElement, { visibility: "hidden" });
  }
  _showAnimateElement() {
    p.style(this._animateElement, { visibility: "visible" });
  }
  _bindResetAnimationAfterFinish() {
    u.on(this._animateElement, "animationend", () => {
      this._clearAnimationClass();
    });
  }
  _bindTriggerOnEndCallback() {
    u.on(this._animateElement, "animationend", () => {
      this._callback(this._options.onEnd);
    });
  }
  _bindScrollEvents() {
    this._options.animationShowOnLoad || this._animateOnScroll(), u.on(window, "scroll", () => {
      this._animateOnScroll();
    });
  }
  _bindClickEvents() {
    u.on(this._element, "mousedown", () => {
      this._startAnimation();
    });
  }
  _bindHoverEvents() {
    u.one(this._element, "mouseover", () => {
      this._startAnimation();
    }), u.one(this._animateElement, "animationend", () => {
      setTimeout(() => {
        this._bindHoverEvents();
      }, 100);
    });
  }
  _callback(t) {
    t instanceof Function && t();
  }
  // Static
  static autoInit(t) {
    t._init();
  }
  static jQueryInterface(t) {
    new ml(this[0], t).init();
  }
  static getInstance(t) {
    return I.getData(t, cn);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const dn = "ripple", Ri = "te.ripple", mp = "rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%", gp = ["[data-te-ripple-init]"], Pi = [0, 0, 0], bp = [
  { name: "primary", gradientColor: "#3B71CA" },
  { name: "secondary", gradientColor: "#9FA6B2" },
  { name: "success", gradientColor: "#14A44D" },
  { name: "danger", gradientColor: "#DC4C64" },
  { name: "warning", gradientColor: "#E4A11B" },
  { name: "info", gradientColor: "#54B4D3" },
  { name: "light", gradientColor: "#fbfbfb" },
  { name: "dark", gradientColor: "#262626" }
], vr = 0.5, vp = {
  rippleCentered: !1,
  rippleColor: "",
  rippleColorDark: "",
  rippleDuration: "500ms",
  rippleRadius: 0,
  rippleUnbound: !1
}, Ep = {
  rippleCentered: "boolean",
  rippleColor: "string",
  rippleColorDark: "string",
  rippleDuration: "string",
  rippleRadius: "number",
  rippleUnbound: "boolean"
}, Tp = {
  ripple: "relative overflow-hidden inline-block align-bottom",
  rippleWave: "rounded-[50%] opacity-50 pointer-events-none absolute touch-none scale-0 transition-[transform,_opacity] ease-[cubic-bezier(0,0,0.15,1),_cubic-bezier(0,0,0.15,1)] z-[999]",
  unbound: "overflow-visible"
}, Cp = {
  ripple: "string",
  rippleWave: "string",
  unbound: "string"
};
class Cs {
  constructor(t, e, i) {
    this._element = t, this._options = this._getConfig(e), this._classes = this._getClasses(i), this._element && (I.setData(t, Ri, this), p.addClass(this._element, this._classes.ripple)), this._clickHandler = this._createRipple.bind(this), this._rippleTimer = null, this._isMinWidthSet = !1, this._initialClasses = null, this.init();
  }
  // Getters
  static get NAME() {
    return dn;
  }
  // Public
  init() {
    this._addClickEvent(this._element);
  }
  dispose() {
    I.removeData(this._element, Ri), u.off(this._element, "click", this._clickHandler), this._element = null, this._options = null;
  }
  // Private
  _autoInit(t) {
    gp.forEach((e) => {
      h.closest(t.target, e) && (this._element = h.closest(t.target, e));
    }), this._element.style.minWidth || (p.style(this._element, {
      "min-width": getComputedStyle(this._element).width
    }), this._isMinWidthSet = !0), this._initialClasses = [...this._element.classList], p.addClass(this._element, this._classes.ripple), this._options = this._getConfig(), this._createRipple(t);
  }
  _addClickEvent(t) {
    u.on(t, "mousedown", this._clickHandler);
  }
  _createRipple(t) {
    this._element.className.indexOf(this._classes.ripple) < 0 && p.addClass(this._element, this._classes.ripple);
    const { layerX: e, layerY: i } = t, n = e, o = i, r = this._element.offsetHeight, a = this._element.offsetWidth, l = this._durationToMsNumber(this._options.rippleDuration), c = {
      offsetX: this._options.rippleCentered ? r / 2 : n,
      offsetY: this._options.rippleCentered ? a / 2 : o,
      height: r,
      width: a
    }, d = this._getDiameter(c), _ = this._options.rippleRadius || d / 2, f = {
      delay: l * vr,
      duration: l - l * vr
    }, m = {
      left: this._options.rippleCentered ? `${a / 2 - _}px` : `${n - _}px`,
      top: this._options.rippleCentered ? `${r / 2 - _}px` : `${o - _}px`,
      height: `${this._options.rippleRadius * 2 || d}px`,
      width: `${this._options.rippleRadius * 2 || d}px`,
      transitionDelay: `0s, ${f.delay}ms`,
      transitionDuration: `${l}ms, ${f.duration}ms`
    }, g = M("div");
    this._createHTMLRipple({
      wrapper: this._element,
      ripple: g,
      styles: m
    }), this._removeHTMLRipple({ ripple: g, duration: l });
  }
  _createHTMLRipple({ wrapper: t, ripple: e, styles: i }) {
    Object.keys(i).forEach(
      (n) => e.style[n] = i[n]
    ), p.addClass(e, this._classes.rippleWave), e.setAttribute("data-te-ripple-ref", ""), this._addColor(e, t), this._toggleUnbound(t), this._appendRipple(e, t);
  }
  _removeHTMLRipple({ ripple: t, duration: e }) {
    this._rippleTimer && (clearTimeout(this._rippleTimer), this._rippleTimer = null), t && setTimeout(() => {
      t.classList.add("!opacity-0");
    }, 10), this._rippleTimer = setTimeout(() => {
      if (t && (t.remove(), this._element)) {
        h.find("[data-te-ripple-ref]", this._element).forEach(
          (n) => {
            n.remove();
          }
        ), this._isMinWidthSet && (p.style(this._element, { "min-width": "" }), this._isMinWidthSet = !1);
        const i = this._initialClasses ? this._addedNewRippleClasses(
          this._classes.ripple,
          this._initialClasses
        ) : this._classes.ripple.split(" ");
        p.removeClass(this._element, i);
      }
    }, e);
  }
  _addedNewRippleClasses(t, e) {
    return t.split(" ").filter(
      (i) => e.findIndex((n) => i === n) === -1
    );
  }
  _durationToMsNumber(t) {
    return Number(t.replace("ms", "").replace("s", "000"));
  }
  _getConfig(t = {}) {
    const e = p.getDataAttributes(this._element);
    return t = {
      ...vp,
      ...e,
      ...t
    }, N(dn, t, Ep), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...Tp,
      ...e,
      ...t
    }, N(dn, t, Cp), t;
  }
  _getDiameter({ offsetX: t, offsetY: e, height: i, width: n }) {
    const o = e <= i / 2, r = t <= n / 2, a = (f, m) => Math.sqrt(f ** 2 + m ** 2), l = e === i / 2 && t === n / 2, c = {
      first: o === !0 && r === !1,
      second: o === !0 && r === !0,
      third: o === !1 && r === !0,
      fourth: o === !1 && r === !1
    }, d = {
      topLeft: a(t, e),
      topRight: a(n - t, e),
      bottomLeft: a(t, i - e),
      bottomRight: a(n - t, i - e)
    };
    let _ = 0;
    return l || c.fourth ? _ = d.topLeft : c.third ? _ = d.topRight : c.second ? _ = d.bottomRight : c.first && (_ = d.bottomLeft), _ * 2;
  }
  _appendRipple(t, e) {
    e.appendChild(t), setTimeout(() => {
      p.addClass(t, "opacity-0 scale-100");
    }, 50);
  }
  _toggleUnbound(t) {
    this._options.rippleUnbound === !0 ? p.addClass(t, this._classes.unbound) : p.removeClass(t, this._classes.unbound);
  }
  _addColor(t) {
    let e = this._options.rippleColor || "rgb(0,0,0)";
    (localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) && (e = this._options.rippleColorDark || this._options.rippleColor);
    const i = bp.find(
      (r) => r.name === e.toLowerCase()
    ), n = i ? this._colorToRGB(i.gradientColor).join(",") : this._colorToRGB(e).join(","), o = mp.split("{{color}}").join(`${n}`);
    t.style.backgroundImage = `radial-gradient(circle, ${o})`;
  }
  _colorToRGB(t) {
    function e(o) {
      return o.length < 7 && (o = `#${o[1]}${o[1]}${o[2]}${o[2]}${o[3]}${o[3]}`), [
        parseInt(o.substr(1, 2), 16),
        parseInt(o.substr(3, 2), 16),
        parseInt(o.substr(5, 2), 16)
      ];
    }
    function i(o) {
      const r = document.body.appendChild(
        document.createElement("fictum")
      ), a = "rgb(1, 2, 3)";
      return r.style.color = a, r.style.color !== a || (r.style.color = o, r.style.color === a || r.style.color === "") ? Pi : (o = getComputedStyle(r).color, document.body.removeChild(r), o);
    }
    function n(o) {
      return o = o.match(/[.\d]+/g).map((r) => +Number(r)), o.length = 3, o;
    }
    return t.toLowerCase() === "transparent" ? Pi : t[0] === "#" ? e(t) : (t.indexOf("rgb") === -1 && (t = i(t)), t.indexOf("rgb") === 0 ? n(t) : Pi);
  }
  // Static
  static autoInitial(t) {
    return function(e) {
      t._autoInit(e);
    };
  }
  static jQueryInterface(t) {
    return this.each(function() {
      return I.getData(this, Ri) ? null : new Cs(this, t);
    });
  }
  static getInstance(t) {
    return I.getData(t, Ri);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
function Q(s) {
  return s.getDate();
}
function ls(s) {
  return s.getDay();
}
function Y(s) {
  return s.getMonth();
}
function H(s) {
  return s.getFullYear();
}
function Ap(s, t, e) {
  const i = e.startDay, n = i > 0 ? 7 - i : 0, r = new Date(s, t).getDay() + n;
  return r >= 7 ? r - 7 : r;
}
function Wn(s) {
  return yp(s).getDate();
}
function yp(s) {
  return Dt(s.getFullYear(), s.getMonth() + 1, 0);
}
function De() {
  return /* @__PURE__ */ new Date();
}
function it(s, t) {
  return nt(s, t * 12);
}
function nt(s, t) {
  const e = Dt(
    s.getFullYear(),
    s.getMonth() + t,
    s.getDate()
  ), i = Q(s), n = Q(e);
  return i !== n && e.setDate(0), e;
}
function Te(s, t) {
  return Dt(s.getFullYear(), s.getMonth(), s.getDate() + t);
}
function Dt(s, t, e) {
  const i = new Date(s, t, e);
  return s >= 0 && s < 100 && i.setFullYear(i.getFullYear() - 1900), i;
}
function Er(s) {
  const t = s.split("-"), e = t[0], i = t[1], n = t[2];
  return Dt(e, i, n);
}
function wp(s) {
  return !Number.isNaN(s.getTime());
}
function xe(s, t) {
  return H(s) - H(t) || Y(s) - Y(t) || Q(s) - Q(t);
}
function de(s, t) {
  return s.setHours(0, 0, 0, 0), t.setHours(0, 0, 0, 0), s.getTime() === t.getTime();
}
function cs(s, t) {
  const i = H(s) - Op();
  return kp(i, t);
}
function kp(s, t) {
  return (s % t + t) % t;
}
function Op(s, t, e) {
  let i = 0;
  return e ? i = H(e) - s + 1 : t && (i = H(t)), i;
}
function As(s, t, e, i, n, o) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const a = t && xe(s, t) <= -1, l = e && xe(s, e) >= 1, c = n && xe(s, r) <= -1, d = o && xe(s, r) >= 1, _ = i && i(s) === !1;
  return a || l || _ || c || d;
}
function gl(s, t, e, i, n, o) {
  const r = /* @__PURE__ */ new Date(), a = i && H(i), l = i && Y(i), c = e && H(e), d = e && Y(e), _ = H(r), f = Y(r), m = l && a && (t > a || t === a && s > l), g = d && c && (t < c || t === c && s < d), b = n && (t < _ || t === _ && s < f), T = o && (t > _ || t === _ && s > f);
  return m || g || b || T;
}
function Fn(s, t, e, i, n) {
  const o = t && H(t), r = e && H(e), a = H(/* @__PURE__ */ new Date()), l = r && s > r, c = o && s < o, d = i && s < a, _ = n && s > a;
  return l || c || d || _;
}
function xp(s, t, e, i, n, o, r, a) {
  const l = /* @__PURE__ */ new Date();
  return l.setHours(0, 0, 0, 0), (s && o && xe(o, l) < 0 || s) && (o = l), o && di(
    t,
    o,
    e,
    i,
    n,
    o,
    r,
    a
  );
}
function Sp(s, t, e, i, n, o, r, a) {
  const l = /* @__PURE__ */ new Date();
  return l.setHours(0, 0, 0, 0), (s && n && xe(n, l) < 0 || s) && (n = l), n && di(
    t,
    n,
    e,
    i,
    n,
    o,
    r,
    a
  );
}
function di(s, t, e, i, n, o, r, a) {
  return e === "days" ? H(s) === H(t) && Y(s) === Y(t) : e === "months" ? H(s) === H(t) : e === "years" ? H(t) >= a && H(t) <= r : !1;
}
const Dp = "data-te-datepicker-modal-container-ref", Ip = "data-te-datepicker-dropdown-container-ref", $p = "data-te-dropdown-backdrop-ref", Lp = "data-te-datepicker-date-text-ref", Tr = "data-te-datepicker-view-ref", Mp = "data-te-datepicker-previous-button-ref", Np = "data-te-datepicker-next-button-ref", Rp = "data-te-datepicker-ok-button-ref", Pp = "data-te-datepicker-cancel-button-ref", Hp = "data-te-datepicker-clear-button-ref", Bp = "data-te-datepicker-view-change-button-ref";
function Vp(s, t, e, i, n, o, r, a, l, c) {
  const d = Y(s), _ = H(s), f = Q(s), m = ls(s), g = M("div"), b = `
        ${Cr(
    s,
    d,
    _,
    t,
    e,
    i,
    n,
    o,
    r,
    a,
    c
  )}
    `, T = `
      ${Fp(f, m, d, n, c)}
      ${Cr(
    s,
    d,
    _,
    t,
    e,
    i,
    n,
    o,
    r,
    a,
    c
  )}
    `;
  return n.inline ? (p.addClass(g, c.datepickerDropdownContainer), g.setAttribute(Ip, l), g.innerHTML = b) : (p.addClass(g, c.modalContainer), g.setAttribute(Dp, l), g.innerHTML = T), g;
}
function Wp(s) {
  const t = M("div");
  return p.addClass(t, s), t.setAttribute($p, ""), t;
}
function Fp(s, t, e, i, n) {
  return `
      <div class="${n.datepickerHeader}">
        <div class="${n.datepickerTitle}">
          <span class="${n.datepickerTitleText}">${i.title}</span>
        </div>
        <div class="${n.datepickerDate}">
          <span class="${n.datepickerDateText}" ${Lp} >${i.weekdaysShort[t]}, ${i.monthsShort[e]} ${s}</span>
        </div>
      </div>
    `;
}
function Cr(s, t, e, i, n, o, r, a, l, c, d) {
  let _;
  return r.inline ? _ = `
    <div class="${d.datepickerMain}">
      ${yr(t, e, r, d)}
      <div class="${d.datepickerView}" ${Tr} tabindex="0">
        ${Ar(
    s,
    e,
    i,
    n,
    o,
    r,
    a,
    l,
    c,
    d
  )}
      </div>
    </div>
  ` : _ = `
    <div class="${d.datepickerMain}">
      ${yr(t, e, r, d)}
      <div class="${d.datepickerView}" ${Tr} tabindex="0">
        ${Ar(
    s,
    e,
    i,
    n,
    o,
    r,
    a,
    l,
    c,
    d
  )}
      </div>
      ${Yp(r, d)}
    </div>
  `, _;
}
function Ar(s, t, e, i, n, o, r, a, l, c) {
  let d;
  return o.view === "days" ? d = ds(s, e, o, c) : o.view === "months" ? d = hs(
    t,
    i,
    n,
    o,
    r,
    c
  ) : d = us(
    s,
    i,
    o,
    a,
    l,
    c
  ), d;
}
function yr(s, t, e, i) {
  return `
    <div class="${i.datepickerDateControls}">
      <button class="${i.datepickerViewChangeButton}" aria-label="${e.switchToMultiYearViewLabel}" ${Bp}>
        ${e.monthsFull[s]} ${t} ${kt(
    e,
    i
  )}
      </button>
      <div class="${i.datepickerArrowControls}">
        <button class="${i.datepickerPreviousButton}" aria-label="${e.prevMonthLabel}" ${Mp}>${e.changeMonthIconTemplate}</button>
        <button class="${i.datepickerNextButton}" aria-label="${e.nextMonthLabel}" ${Np}>${e.changeMonthIconTemplate}</button>
      </div>
    </div>
    `;
}
function kt(s, t) {
  return `
  <span class="${t.datepickerViewChangeIcon}">
  ${s.viewChangeIconTemplate}
  </span>
  `;
}
function Yp(s, t) {
  const e = `<button class="${t.datepickerFooterBtn}" aria-label="${s.okBtnLabel}" ${Rp}>${s.okBtnText}</button>`, i = `<button class="${t.datepickerFooterBtn}" aria-label="${s.cancelBtnLabel}" ${Pp}>${s.cancelBtnText}</button>`, n = `<button class="${t.datepickerFooterBtn} ${t.datepickerClearBtn}" aria-label="${s.clearBtnLabel}" ${Hp}>${s.clearBtnText}</button>`;
  return `
        <div class="${t.datepickerFooter}">
          
        ${s.removeClearBtn ? "" : n}
        ${s.removeCancelBtn ? "" : i}
        ${s.removeOkBtn ? "" : e}
        </div>
      `;
}
function ds(s, t, e, i) {
  const n = jp(s, t, e), r = `
      <tr>
        ${e.weekdaysNarrow.map((l, c) => `<th class="${i.datepickerDayHeading}" scope="col" aria-label="${e.weekdaysFull[c]}">${l}</th>`).join("")}
      </tr>
    `, a = n.map((l) => `
        <tr>
          ${l.map((c) => `
              <td
              class="${i.datepickerCell} ${i.datepickerCellSmall}"
              data-te-date="${H(c.date)}-${Y(
    c.date
  )}-${Q(c.date)}"
              aria-label="${c.date}"
              aria-selected="${c.isSelected}"
              ${c.isSelected ? "data-te-datepicker-cell-selected" : ""}
              ${!c.currentMonth || c.disabled ? "data-te-datepicker-cell-disabled" : ""}
              ${c.isToday ? "data-te-datepicker-cell-current" : ""}
              >
                <div
                  class="${i.datepickerCellContent} ${i.datepickerCellContentSmall}"
                  style="${c.currentMonth ? "display: block" : "display: none"}"
                  >
                  ${c.dayNumber}
                  </div>
              </td>
            `).join("")}
        </tr>
      `).join("");
  return `
      <table class="${i.datepickerTable}">
        <thead>
          ${r}
        </thead>
        <tbody>
         ${a}
        </tbody>
      </table>
    `;
}
function jp(s, t, e) {
  const i = [], n = Y(s), o = Y(nt(s, -1)), r = Y(nt(s, 1)), a = H(s), l = Ap(a, n, e), c = Wn(s), d = Wn(nt(s, -1)), _ = 7;
  let f = 1, m = !1;
  for (let g = 1; g < _; g++) {
    const b = [];
    if (g === 1) {
      const T = d - l + 1;
      for (let w = T; w <= d; w++) {
        const v = Dt(a, o, w);
        b.push({
          date: v,
          currentMonth: m,
          isSelected: t && de(v, t),
          isToday: de(v, De()),
          dayNumber: Q(v)
        });
      }
      m = !0;
      const C = _ - b.length;
      for (let w = 0; w < C; w++) {
        const v = Dt(a, n, f);
        b.push({
          date: v,
          currentMonth: m,
          isSelected: t && de(v, t),
          isToday: de(v, De()),
          dayNumber: Q(v),
          disabled: As(
            v,
            e.min,
            e.max,
            e.filter,
            e.disablePast,
            e.disableFuture
          )
        }), f++;
      }
    } else
      for (let T = 1; T < 8; T++) {
        f > c && (f = 1, m = !1);
        const C = Dt(
          a,
          m ? n : r,
          f
        );
        b.push({
          date: C,
          currentMonth: m,
          isSelected: t && de(C, t),
          isToday: de(C, De()),
          dayNumber: Q(C),
          disabled: As(
            C,
            e.min,
            e.max,
            e.filter,
            e.disablePast,
            e.disableFuture
          )
        }), f++;
      }
    i.push(b);
  }
  return i;
}
function hs(s, t, e, i, n, o) {
  const r = Kp(i, n), a = Y(De()), l = H(De()), c = `
      ${r.map((d) => `
          <tr>
            ${d.map((_) => {
    const f = i.monthsShort.indexOf(_);
    return `
                <td class="${o.datepickerCell} ${o.datepickerCellLarge}"
                ${gl(
      f,
      s,
      i.min,
      i.max,
      i.disablePast,
      i.disableFuture
    ) ? "data-te-datepicker-cell-disabled" : ""}
                
                data-te-month="${f}" data-te-year="${s}" aria-label="${_}, ${s}"
                ${f === e && s === t ? "data-te-datepicker-cell-selected" : ""}
                ${f === a && s === l ? "data-te-datepicker-cell-current" : ""}" data-te-month="${f}" data-te-year="${s}" aria-label="${_}, ${s}">
                  <div class="${o.datepickerCellContent} ${o.datepickerCellContentLarge}">${_}</div>
                </td>
              `;
  }).join("")}
          </tr>
        `).join("")}
    `;
  return `
      <table class="${o.datepickerTable}">
        <tbody>
         ${c}
        </tbody>
      </table>
    `;
}
function Kp(s, t) {
  const e = [];
  let i = [];
  for (let n = 0; n < s.monthsShort.length; n++)
    if (i.push(s.monthsShort[n]), i.length === t) {
      const o = i;
      e.push(o), i = [];
    }
  return e;
}
function us(s, t, e, i, n, o) {
  const r = Up(s, i, n), a = H(De()), l = `
    ${r.map((c) => `
        <tr>
          ${c.map((d) => `
              <td class="${o.datepickerCell} ${o.datepickerCellLarge}"  aria-label="${d}" data-te-year="${d}"
              ${Fn(
    d,
    e.min,
    e.max,
    e.disablePast,
    e.disableFuture
  ) ? "data-te-datepicker-cell-disabled" : ""}
              ${d === t ? "data-te-datepicker-cell-selected" : ""}
              ${d === a ? "data-te-datepicker-cell-current" : ""}
              >
                <div class="${o.datepickerCellContent} ${o.datepickerCellContentLarge}">${d}</div>
              </td>
            `).join("")}
        </tr>
      `).join("")}
  `;
  return `
      <table class="${o.datepickerTable}">
        <tbody>
        ${l}
        </tbody>
      </table>
    `;
}
function Up(s, t, e) {
  const i = [], n = H(s), o = cs(s, t), r = n - o;
  let a = [];
  for (let l = 0; l < t; l++)
    if (a.push(r + l), a.length === e) {
      const c = a;
      i.push(c), a = [];
    }
  return i;
}
function zp(s, t) {
  return `
    <button id="${s}" type="button" class="${t}" data-te-datepicker-toggle-button-ref data-te-datepicker-toggle-ref>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
      </svg>  
    </button>
  `;
}
const Ie = 37, rt = 38, $e = 39, U = 40, Le = 36, Me = 35, hn = 33, un = 34, lt = 13, ps = 32, Is = 27, fi = 9, Xp = 8, Gp = 46, mt = 24, Hi = 4, Bi = 4, pn = "datepicker", fs = "te.datepicker", $s = `.${fs}`, qp = ".data-api", Qp = `close${$s}`, Zp = `open${$s}`, Jp = `dateChange${$s}`, Vi = `click${$s}${qp}`, bl = "data-te-datepicker-modal-container-ref", vl = "data-te-datepicker-dropdown-container-ref", Wi = "[data-te-datepicker-toggle-ref]", tf = `[${bl}]`, ef = `[${vl}]`, sf = "[data-te-datepicker-view-change-button-ref]", nf = "[data-te-datepicker-previous-button-ref]", of = "[data-te-datepicker-next-button-ref]", rf = "[data-te-datepicker-ok-button-ref]", af = "[data-te-datepicker-cancel-button-ref]", lf = "[data-te-datepicker-clear-button-ref]", cf = "[data-te-datepicker-view-ref]", df = "[data-te-datepicker-toggle-button-ref]", hf = "[data-te-datepicker-date-text-ref]", uf = "[data-te-dropdown-backdrop-ref]", pf = "animate-[fade-in_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", ff = "animate-[fade-out_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", _f = "animate-[fade-in_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", mf = "animate-[fade-out_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", gf = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[328px] h-[512px] bg-white rounded-[0.6rem] shadow-lg z-[1066] xs:max-md:landscape:w-[475px] xs:max-md:landscape:h-[360px] xs:max-md:landscape:flex-row dark:bg-zinc-700", bf = "w-full h-full fixed top-0 right-0 left-0 bottom-0 bg-black/40 z-[1065]", vf = "relative h-full", Ef = "xs:max-md:landscape:h-full h-[120px] px-6 bg-primary flex flex-col rounded-t-lg dark:bg-zinc-800", Tf = "h-8 flex flex-col justify-end", Cf = "text-[10px] font-normal uppercase tracking-[1.7px] text-white", Af = "xs:max-md:landscape:mt-24 h-[72px] flex flex-col justify-end", yf = "text-[34px] font-normal text-white", wf = "outline-none px-3", kf = "px-3 pt-2.5 pb-0 flex justify-between text-black/[64]", Of = "flex items-center outline-none p-2.5 text-neutral-500 font-medium text-[0.9rem] rounded-xl shadow-none bg-transparent m-0 border-none hover:bg-neutral-200 focus:bg-neutral-200  dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10", xf = "mt-2.5", Sf = "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent mr-6 hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:mx-auto", Df = "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:rotate-180 [&>svg]:mx-auto", If = "h-14 flex absolute w-full bottom-0 justify-end items-center px-3", $f = "outline-none bg-white text-primary border-none cursor-pointer py-0 px-2.5 uppercase text-[0.8rem] leading-10 font-medium h-10 tracking-[.1rem] rounded-[10px] mb-2.5 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10", Lf = "mr-auto", Mf = "w-10 h-10 text-center text-[12px] font-normal dark:text-white", Nf = "text-center data-[te-datepicker-cell-disabled]:text-neutral-300 data-[te-datepicker-cell-disabled]:cursor-default data-[te-datepicker-cell-disabled]:pointer-events-none data-[te-datepicker-cell-disabled]:hover:cursor-default hover:cursor-pointer group", Rf = "w-10 h-10 xs:max-md:landscape:w-8 xs:max-md:landscape:h-8", Pf = "w-[76px] h-[42px]", Hf = "mx-auto group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-neutral-300 group-[[data-te-datepicker-cell-selected]]:bg-primary group-[[data-te-datepicker-cell-selected]]:text-white group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-neutral-100 group-[[data-te-datepicker-cell-focused]]:data-[te-datepicker-cell-selected]:bg-primary group-[[data-te-datepicker-cell-current]]:border-solid group-[[data-te-datepicker-cell-current]]:border-black group-[[data-te-datepicker-cell-current]]:border dark:group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-white/10 dark:group-[[data-te-datepicker-cell-current]]:border-white dark:text-white dark:group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-white/10 dark:group-[[data-te-datepicker-cell-disabled]]:text-neutral-500", Bf = "w-9 h-9 leading-9 rounded-[50%] text-[13px]", Vf = "w-[72px] h-10 leading-10 py-[1px] px-0.5 rounded-[999px]", Wf = "mx-auto w-[304px]", Ff = "flex items-center justify-content-center [&>svg]:w-5 [&>svg]:h-5 absolute outline-none border-none bg-transparent right-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-primary focus:text-primary dark:hover:text-primary-400 dark:focus:text-primary-400 dark:text-neutral-200", Yf = "inline-block pointer-events-none ml-[3px] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-neutral-500 dark:[&>svg]:fill-white", jf = "w-[328px] h-[380px] bg-white rounded-lg shadow-[0px_2px_15px_-3px_rgba(0,0,0,.07),_0px_10px_20px_-2px_rgba(0,0,0,.04)] z-[1066] dark:bg-zinc-700", Kf = {
  title: "Select date",
  container: "body",
  disablePast: !1,
  disableFuture: !1,
  monthsFull: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  weekdaysFull: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdaysNarrow: ["S", "M", "T", "W", "T", "F", "S"],
  okBtnText: "Ok",
  clearBtnText: "Clear",
  cancelBtnText: "Cancel",
  okBtnLabel: "Confirm selection",
  clearBtnLabel: "Clear selection",
  cancelBtnLabel: "Cancel selection",
  nextMonthLabel: "Next month",
  prevMonthLabel: "Previous month",
  nextYearLabel: "Next year",
  prevYearLabel: "Previous year",
  changeMonthIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  `,
  nextMultiYearLabel: "Next 24 years",
  prevMultiYearLabel: "Previous 24 years",
  switchToMultiYearViewLabel: "Choose year and month",
  switchToMonthViewLabel: "Choose date",
  switchToDayViewLabel: "Choose date",
  startDate: null,
  startDay: 0,
  format: "dd/mm/yyyy",
  view: "days",
  viewChangeIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `,
  min: null,
  max: null,
  filter: null,
  inline: !1,
  toggleButton: !0,
  disableToggleButton: !1,
  disableInput: !1,
  animations: !0,
  confirmDateOnSelect: !1,
  removeOkBtn: !1,
  removeCancelBtn: !1,
  removeClearBtn: !1
}, Uf = {
  title: "string",
  container: "string",
  disablePast: "boolean",
  disableFuture: "boolean",
  monthsFull: "array",
  monthsShort: "array",
  weekdaysFull: "array",
  weekdaysShort: "array",
  weekdaysNarrow: "array",
  okBtnText: "string",
  clearBtnText: "string",
  cancelBtnText: "string",
  okBtnLabel: "string",
  clearBtnLabel: "string",
  cancelBtnLabel: "string",
  nextMonthLabel: "string",
  prevMonthLabel: "string",
  nextYearLabel: "string",
  prevYearLabel: "string",
  nextMultiYearLabel: "string",
  prevMultiYearLabel: "string",
  changeMonthIconTemplate: "string",
  switchToMultiYearViewLabel: "string",
  switchToMonthViewLabel: "string",
  switchToDayViewLabel: "string",
  startDate: "(null|string|date)",
  startDay: "number",
  format: "string",
  view: "string",
  viewChangeIconTemplate: "string",
  min: "(null|string|date)",
  max: "(null|string|date)",
  filter: "(null|function)",
  inline: "boolean",
  toggleButton: "boolean",
  disableToggleButton: "boolean",
  disableInput: "boolean",
  animations: "boolean",
  confirmDateOnSelect: "boolean",
  removeOkBtn: "boolean",
  removeCancelBtn: "boolean",
  removeClearBtn: "boolean"
}, zf = {
  fadeIn: pf,
  fadeOut: ff,
  fadeInShort: _f,
  fadeOutShort: mf,
  modalContainer: gf,
  datepickerBackdrop: bf,
  datepickerMain: vf,
  datepickerHeader: Ef,
  datepickerTitle: Tf,
  datepickerTitleText: Cf,
  datepickerDate: Af,
  datepickerDateText: yf,
  datepickerView: wf,
  datepickerDateControls: kf,
  datepickerViewChangeButton: Of,
  datepickerViewChangeIcon: Yf,
  datepickerArrowControls: xf,
  datepickerPreviousButton: Sf,
  datepickerNextButton: Df,
  datepickerFooter: If,
  datepickerFooterBtn: $f,
  datepickerClearBtn: Lf,
  datepickerDayHeading: Mf,
  datepickerCell: Nf,
  datepickerCellSmall: Rf,
  datepickerCellLarge: Pf,
  datepickerCellContent: Hf,
  datepickerCellContentSmall: Bf,
  datepickerCellContentLarge: Vf,
  datepickerTable: Wf,
  datepickerToggleButton: Ff,
  datepickerDropdownContainer: jf
}, Xf = {
  fadeIn: "string",
  fadeOut: "string",
  fadeInShort: "string",
  fadeOutShort: "string",
  modalContainer: "string",
  datepickerBackdrop: "string",
  datepickerMain: "string",
  datepickerHeader: "string",
  datepickerTitle: "string",
  datepickerTitleText: "string",
  datepickerDate: "string",
  datepickerDateText: "string",
  datepickerView: "string",
  datepickerDateControls: "string",
  datepickerViewChangeButton: "string",
  datepickerArrowControls: "string",
  datepickerPreviousButton: "string",
  datepickerNextButton: "string",
  datepickerFooter: "string",
  datepickerFooterBtn: "string",
  datepickerClearBtn: "string",
  datepickerDayHeading: "string",
  datepickerCell: "string",
  datepickerCellSmall: "string",
  datepickerCellLarge: "string",
  datepickerCellContent: "string",
  datepickerCellContentSmall: "string",
  datepickerCellContentLarge: "string",
  datepickerTable: "string",
  datepickerToggleButton: "string",
  datepickerDropdownContainer: "string"
};
class Gg {
  constructor(t, e, i) {
    this._element = t, this._input = h.findOne("input", this._element), this._options = this._getConfig(e), this._classes = this._getClasses(i), this._activeDate = /* @__PURE__ */ new Date(), this._selectedDate = null, this._selectedYear = null, this._selectedMonth = null, this._headerDate = null, this._headerYear = null, this._headerMonth = null, this._view = this._options.view, this._popper = null, this._focusTrap = null, this._isOpen = !1, this._toggleButtonId = Ot("datepicker-toggle-"), this._animations = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && this._options.animations, this._scrollBar = new pi(), this._element && I.setData(t, fs, this), this._init(), this.toggleButton && this._options.disableToggle && (this.toggleButton.disabled = "true"), this._options.disableInput && (this._input.disabled = "true");
  }
  // Getters
  static get NAME() {
    return pn;
  }
  get container() {
    return h.findOne(
      `[${bl}='${this._toggleButtonId}']`
    ) || h.findOne(
      `[${vl}='${this._toggleButtonId}']`
    );
  }
  get options() {
    return this._options;
  }
  get activeCell() {
    let t;
    return this._view === "days" && (t = this._getActiveDayCell()), this._view === "months" && (t = this._getActiveMonthCell()), this._view === "years" && (t = this._getActiveYearCell()), t;
  }
  get activeDay() {
    return Q(this._activeDate);
  }
  get activeMonth() {
    return Y(this._activeDate);
  }
  get activeYear() {
    return H(this._activeDate);
  }
  get firstYearInView() {
    return this.activeYear - cs(this._activeDate, mt);
  }
  get lastYearInView() {
    return this.firstYearInView + mt - 1;
  }
  get viewChangeButton() {
    return h.findOne(sf, this.container);
  }
  get previousButton() {
    return h.findOne(nf, this.container);
  }
  get nextButton() {
    return h.findOne(of, this.container);
  }
  get okButton() {
    return h.findOne(rf, this.container);
  }
  get cancelButton() {
    return h.findOne(af, this.container);
  }
  get clearButton() {
    return h.findOne(lf, this.container);
  }
  get datesContainer() {
    return h.findOne(cf, this.container);
  }
  get toggleButton() {
    return h.findOne(df, this._element);
  }
  update(t = {}) {
    this._options = this._getConfig({ ...this._options, ...t });
  }
  _getConfig(t) {
    const e = p.getDataAttributes(this._element);
    if (t = {
      ...Kf,
      ...e,
      ...t
    }, N(pn, t, Uf), t.max && typeof t.max == "string" && (t.max = new Date(t.max)), t.min && typeof t.min == "string" && (t.min = new Date(t.min)), t.startDay && t.startDay !== 0) {
      const i = this._getNewDaysOrderArray(t);
      t.weekdaysNarrow = i;
    }
    return t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...zf,
      ...e,
      ...t
    }, N(pn, t, Xf), t;
  }
  _getContainer() {
    return h.findOne(this._options.container);
  }
  _getNewDaysOrderArray(t) {
    const e = t.startDay, i = t.weekdaysNarrow;
    return i.slice(e).concat(i.slice(0, e));
  }
  _init() {
    !this.toggleButton && this._options.toggleButton && (this._appendToggleButton(), (this._input.readOnly || this._input.disabled) && (this.toggleButton.style.pointerEvents = "none")), this._listenToUserInput(), this._listenToToggleClick(), this._listenToToggleKeydown();
  }
  _appendToggleButton() {
    const t = zp(
      this._toggleButtonId,
      this._classes.datepickerToggleButton
    );
    this._element.insertAdjacentHTML("beforeend", t);
  }
  open() {
    if (this._input.readOnly || this._input.disabled)
      return;
    const t = u.trigger(this._element, Zp);
    if (this._isOpen || t.defaultPrevented)
      return;
    this._setInitialDate();
    const e = Wp(this._classes.datepickerBackdrop), i = Vp(
      this._activeDate,
      this._selectedDate,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Bi,
      mt,
      Hi,
      this._toggleButtonId,
      this._classes
    );
    this._options.inline ? this._openDropdown(i) : (this._openModal(e, i), this._scrollBar.hide()), this._animations && (p.addClass(this.container, this._classes.fadeIn), p.addClass(e, this._classes.fadeInShort)), this._setFocusTrap(this.container), this._listenToDateSelection(), this._addControlsListeners(), this._updateControlsDisabledState(), this._listenToEscapeClick(), this._listenToKeyboardNavigation(), this._listenToDatesContainerFocus(), this._listenToDatesContainerBlur(), this._asyncFocusDatesContainer(), this._updateViewControlsAndAttributes(this._view), this._isOpen = !0, setTimeout(() => {
      this._listenToOutsideClick();
    }, 0);
  }
  _openDropdown(t) {
    this._popper = je(this._input, t, {
      placement: "bottom-start"
    }), this._getContainer().appendChild(t);
  }
  _openModal(t, e) {
    const i = this._getContainer();
    i.appendChild(t), i.appendChild(e);
  }
  _setFocusTrap(t) {
    this._focusTrap = new bi(t, {
      event: "keydown",
      condition: (e) => e.key === "Tab"
    }), this._focusTrap.trap();
  }
  _listenToUserInput() {
    u.on(this._input, "input", (t) => {
      this._handleUserInput(t.target.value);
    });
  }
  _listenToToggleClick() {
    u.on(
      this._element,
      Vi,
      Wi,
      (t) => {
        t.preventDefault(), this.open();
      }
    );
  }
  _listenToToggleKeydown() {
    u.on(
      this._element,
      "keydown",
      Wi,
      (t) => {
        t.keyCode === lt && !this._isOpen && this.open();
      }
    );
  }
  _listenToDateSelection() {
    u.on(this.datesContainer, "click", (t) => {
      this._handleDateSelection(t);
    });
  }
  _handleDateSelection(t) {
    const e = t.target.nodeName === "DIV" ? t.target.parentNode.dataset : t.target.dataset, i = t.target.nodeName === "DIV" ? t.target.parentNode : t.target;
    if (e.teDate && this._pickDay(e.teDate, i), e.teMonth && e.teYear) {
      const n = parseInt(e.teMonth, 10), o = parseInt(e.teYear, 10);
      this._pickMonth(n, o);
    }
    if (e.teYear && !e.teMonth) {
      const n = parseInt(e.teYear, 10);
      this._pickYear(n);
    }
    this._options.inline || this._updateHeaderDate(
      this._activeDate,
      this._options.monthsShort,
      this._options.weekdaysShort
    );
  }
  _updateHeaderDate(t, e, i) {
    const n = h.findOne(
      hf,
      this.container
    ), o = Y(t), r = Q(t), a = ls(t);
    n.innerHTML = `${i[a]}, ${e[o]} ${r}`;
  }
  _addControlsListeners() {
    u.on(this.nextButton, "click", () => {
      this._view === "days" ? this.nextMonth() : this._view === "years" ? this.nextYears() : this.nextYear(), this._updateControlsDisabledState();
    }), u.on(this.previousButton, "click", () => {
      this._view === "days" ? this.previousMonth() : this._view === "years" ? this.previousYears() : this.previousYear(), this._updateControlsDisabledState();
    }), u.on(this.viewChangeButton, "click", () => {
      this._view === "days" ? this._changeView("years") : (this._view === "years" || this._view === "months") && this._changeView("days");
    }), this._options.inline || this._listenToFooterButtonsClick();
  }
  _listenToFooterButtonsClick() {
    u.on(this.okButton, "click", () => this.handleOk()), u.on(this.cancelButton, "click", () => this.handleCancel()), u.on(this.clearButton, "click", () => this.handleClear());
  }
  _listenToOutsideClick() {
    u.on(document, Vi, (t) => {
      const e = t.target === this.container, i = this.container && this.container.contains(t.target);
      !e && !i && this.close();
    });
  }
  _listenToEscapeClick() {
    u.on(document, "keydown", (t) => {
      t.keyCode === Is && this._isOpen && this.close();
    });
  }
  _listenToKeyboardNavigation() {
    u.on(this.datesContainer, "keydown", (t) => {
      this._handleKeydown(t);
    });
  }
  _listenToDatesContainerFocus() {
    u.on(this.datesContainer, "focus", () => {
      this._focusActiveCell(this.activeCell);
    });
  }
  _listenToDatesContainerBlur() {
    u.on(this.datesContainer, "blur", () => {
      this._removeCurrentFocusStyles();
    });
  }
  _handleKeydown(t) {
    this._view === "days" && this._handleDaysViewKeydown(t), this._view === "months" && this._handleMonthsViewKeydown(t), this._view === "years" && this._handleYearsViewKeydown(t);
  }
  _handleDaysViewKeydown(t) {
    const e = this._activeDate, i = this.activeCell;
    switch (t.keyCode) {
      case Ie:
        this._activeDate = Te(this._activeDate, F() ? 1 : -1);
        break;
      case $e:
        this._activeDate = Te(this._activeDate, F() ? -1 : 1);
        break;
      case rt:
        this._activeDate = Te(this._activeDate, -7);
        break;
      case U:
        this._activeDate = Te(this._activeDate, 7);
        break;
      case Le:
        this._activeDate = Te(
          this._activeDate,
          1 - Q(this._activeDate)
        );
        break;
      case Me:
        this._activeDate = Te(
          this._activeDate,
          Wn(this._activeDate) - Q(this._activeDate)
        );
        break;
      case hn:
        this._activeDate = nt(this._activeDate, -1);
        break;
      case un:
        this._activeDate = nt(this._activeDate, 1);
        break;
      case lt:
      case ps:
        this._selectDate(this._activeDate), this._handleDateSelection(t), t.preventDefault();
        return;
      default:
        return;
    }
    di(
      e,
      this._activeDate,
      this._view,
      mt,
      this._options.min,
      this._options.max
    ) || this._changeView("days"), this._removeHighlightFromCell(i), this._focusActiveCell(this.activeCell), t.preventDefault();
  }
  _asyncFocusDatesContainer() {
    setTimeout(() => {
      this.datesContainer.focus();
    }, 0);
  }
  _focusActiveCell(t) {
    t && t.setAttribute("data-te-datepicker-cell-focused", "");
  }
  _removeHighlightFromCell(t) {
    t && t.removeAttribute("data-te-datepicker-cell-focused");
  }
  _getActiveDayCell() {
    const t = h.find("td", this.datesContainer);
    return Array.from(t).find((i) => {
      const n = Er(i.dataset.teDate);
      return de(n, this._activeDate);
    });
  }
  _handleMonthsViewKeydown(t) {
    const e = this._activeDate, i = this.activeCell;
    switch (t.keyCode) {
      case Ie:
        this._activeDate = nt(this._activeDate, F() ? 1 : -1);
        break;
      case $e:
        this._activeDate = nt(this._activeDate, F() ? -1 : 1);
        break;
      case rt:
        this._activeDate = nt(this._activeDate, -4);
        break;
      case U:
        this._activeDate = nt(this._activeDate, 4);
        break;
      case Le:
        this._activeDate = nt(this._activeDate, -this.activeMonth);
        break;
      case Me:
        this._activeDate = nt(this._activeDate, 11 - this.activeMonth);
        break;
      case hn:
        this._activeDate = it(this._activeDate, -1);
        break;
      case un:
        this._activeDate = it(this._activeDate, 1);
        break;
      case lt:
      case ps:
        this._selectMonth(this.activeMonth);
        return;
      default:
        return;
    }
    di(
      e,
      this._activeDate,
      this._view,
      mt,
      this._options.min,
      this._options.max
    ) || this._changeView("months"), this._removeHighlightFromCell(i), this._focusActiveCell(this.activeCell), t.preventDefault();
  }
  _getActiveMonthCell() {
    const t = h.find("td", this.datesContainer);
    return Array.from(t).find((i) => {
      const n = parseInt(i.dataset.teYear, 10), o = parseInt(i.dataset.teMonth, 10);
      return n === this.activeYear && o === this.activeMonth;
    });
  }
  _handleYearsViewKeydown(t) {
    const e = this._activeDate, i = this.activeCell, n = 4, o = 24;
    switch (t.keyCode) {
      case Ie:
        this._activeDate = it(this._activeDate, F() ? 1 : -1);
        break;
      case $e:
        this._activeDate = it(this._activeDate, F() ? -1 : 1);
        break;
      case rt:
        this._activeDate = it(this._activeDate, -n);
        break;
      case U:
        this._activeDate = it(this._activeDate, n);
        break;
      case Le:
        this._activeDate = it(
          this._activeDate,
          -cs(this._activeDate, o)
        );
        break;
      case Me:
        this._activeDate = it(
          this._activeDate,
          o - cs(this._activeDate, o) - 1
        );
        break;
      case hn:
        this._activeDate = it(this._activeDate, -o);
        break;
      case un:
        this._activeDate = it(this._activeDate, o);
        break;
      case lt:
      case ps:
        this._selectYear(this.activeYear);
        return;
      default:
        return;
    }
    di(
      e,
      this._activeDate,
      this._view,
      mt,
      this._options.min,
      this._options.max
    ) || this._changeView("years"), this._removeHighlightFromCell(i), this._focusActiveCell(this.activeCell), t.preventDefault();
  }
  _getActiveYearCell() {
    const t = h.find("td", this.datesContainer);
    return Array.from(t).find((i) => parseInt(i.dataset.teYear, 10) === this.activeYear);
  }
  _setInitialDate() {
    this._input.value ? this._handleUserInput(this._input.value) : this._options.startDate ? this._activeDate = new Date(this._options.startDate) : this._activeDate = /* @__PURE__ */ new Date();
  }
  close() {
    const t = u.trigger(this._element, Qp);
    !this._isOpen || t.defaultPrevented || (this._removeDatepickerListeners(), this._animations && p.addClass(this.container, this._classes.fadeOut), this._options.inline ? this._closeDropdown() : this._closeModal(), this._isOpen = !1, this._view = this._options.view, this.toggleButton ? this.toggleButton.focus() : this._input.focus());
  }
  _closeDropdown() {
    const t = h.findOne(ef);
    window.matchMedia("(prefers-reduced-motion: reduce)").matches && (t && document.body.removeChild(t), this._popper && this._popper.destroy()), t.addEventListener("animationend", () => {
      t && document.body.removeChild(t), this._popper && this._popper.destroy();
    }), this._removeFocusTrap();
  }
  _closeModal() {
    const t = h.findOne(uf), e = h.findOne(tf);
    !e || !t || (this._animations ? (p.addClass(t, this._classes.fadeOutShort), t.addEventListener("animationend", () => {
      this._removePicker(t, e), this._scrollBar.reset();
    })) : (this._removePicker(t, e), this._scrollBar.reset()));
  }
  _removePicker(t, e) {
    const i = this._getContainer();
    i.removeChild(t), i.removeChild(e);
  }
  _removeFocusTrap() {
    this._focusTrap && (this._focusTrap.disable(), this._focusTrap = null);
  }
  _removeDatepickerListeners() {
    u.off(this.nextButton, "click"), u.off(this.previousButton, "click"), u.off(this.viewChangeButton, "click"), u.off(this.okButton, "click"), u.off(this.cancelButton, "click"), u.off(this.clearButton, "click"), u.off(this.datesContainer, "click"), u.off(this.datesContainer, "keydown"), u.off(this.datesContainer, "focus"), u.off(this.datesContainer, "blur"), u.off(document, Vi);
  }
  dispose() {
    this._isOpen && this.close(), this._removeInputAndToggleListeners();
    const t = h.findOne(
      `#${this._toggleButtonId}`
    );
    t && this._element.removeChild(t), I.removeData(this._element, fs), this._element = null, this._input = null, this._options = null, this._activeDate = null, this._selectedDate = null, this._selectedYear = null, this._selectedMonth = null, this._headerDate = null, this._headerYear = null, this._headerMonth = null, this._view = null, this._popper = null, this._focusTrap = null;
  }
  _removeInputAndToggleListeners() {
    u.off(this._input, "input"), u.off(
      this._element,
      Vi,
      Wi
    ), u.off(this._element, "keydown", Wi);
  }
  handleOk() {
    this._confirmSelection(this._headerDate), this.close();
  }
  _selectDate(t, e = this.activeCell) {
    const { min: i, max: n, filter: o, disablePast: r, disableFuture: a } = this._options;
    As(t, i, n, o, r, a) || (this._removeCurrentSelectionStyles(), this._removeCurrentFocusStyles(), this._addSelectedStyles(e), this._selectedDate = t, this._selectedYear = H(t), this._selectedMonth = Y(t), this._headerDate = t, (this._options.inline || this.options.confirmDateOnSelect) && (this._confirmSelection(t), this.close()));
  }
  _selectYear(t, e = this.activeCell) {
    this._removeCurrentSelectionStyles(), this._removeCurrentFocusStyles(), this._addSelectedStyles(e), this._headerYear = t, this._asyncChangeView("months");
  }
  _selectMonth(t, e = this.activeCell) {
    this._removeCurrentSelectionStyles(), this._removeCurrentFocusStyles(), this._addSelectedStyles(e), this._headerMonth = t, this._asyncChangeView("days");
  }
  _removeSelectedStyles(t) {
    t && t.removeAttribute("data-te-datepicker-cell-selected");
  }
  _addSelectedStyles(t) {
    t && t.setAttribute("data-te-datepicker-cell-selected", "");
  }
  _confirmSelection(t) {
    if (t) {
      const e = this.formatDate(t);
      this._input.value = e, u.trigger(this._element, Jp, { date: t }), u.trigger(this._input, "input");
    }
  }
  handleCancel() {
    this._selectedDate = null, this._selectedYear = null, this._selectedMonth = null, this.close();
  }
  handleClear() {
    this._selectedDate = null, this._selectedMonth = null, this._selectedYear = null, this._headerDate = null, this._headerMonth = null, this._headerYear = null, this._removeCurrentSelectionStyles(), this._input.value = "", this._setInitialDate(), this._changeView("days"), this._updateHeaderDate(
      this._activeDate,
      this._options.monthsShort,
      this._options.weekdaysShort
    );
  }
  _removeCurrentSelectionStyles() {
    const t = h.findOne(
      "[data-te-datepicker-cell-selected]",
      this.container
    );
    t && t.removeAttribute("data-te-datepicker-cell-selected");
  }
  _removeCurrentFocusStyles() {
    const t = h.findOne(
      "[data-te-datepicker-cell-focused]",
      this.container
    );
    t && t.removeAttribute("data-te-datepicker-cell-focused");
  }
  formatDate(t) {
    const e = Q(t), i = this._addLeadingZero(Q(t)), n = this._options.weekdaysShort[ls(t)], o = this._options.weekdaysFull[ls(t)], r = Y(t) + 1, a = this._addLeadingZero(Y(t) + 1), l = this._options.monthsShort[Y(t)], c = this._options.monthsFull[Y(t)], d = H(t).toString().length === 2 ? H(t) : H(t).toString().slice(2, 4), _ = H(t), f = this._options.format.split(
      /(d{1,4}|m{1,4}|y{4}|yy|!.)/g
    );
    let m = "";
    return f.forEach((g) => {
      switch (g) {
        case "dddd":
          g = g.replace(g, o);
          break;
        case "ddd":
          g = g.replace(g, n);
          break;
        case "dd":
          g = g.replace(g, i);
          break;
        case "d":
          g = g.replace(g, e);
          break;
        case "mmmm":
          g = g.replace(g, c);
          break;
        case "mmm":
          g = g.replace(g, l);
          break;
        case "mm":
          g = g.replace(g, a);
          break;
        case "m":
          g = g.replace(g, r);
          break;
        case "yyyy":
          g = g.replace(g, _);
          break;
        case "yy":
          g = g.replace(g, d);
          break;
      }
      m += g;
    }), m;
  }
  _addLeadingZero(t) {
    return parseInt(t, 10) < 10 ? `0${t}` : t;
  }
  _pickDay(t, e) {
    const i = Er(t), { min: n, max: o, filter: r, disablePast: a, disableFuture: l } = this._options;
    As(i, n, o, r, a, l) || (this._activeDate = i, this._selectDate(i, e));
  }
  _pickYear(t) {
    const { min: e, max: i, disablePast: n, disableFuture: o } = this._options;
    if (Fn(t, e, i, n, o))
      return;
    const r = Dt(t, this.activeMonth, this.activeDay);
    this._activeDate = r, this._selectedDate = r, this._selectYear(t);
  }
  _pickMonth(t, e) {
    const { min: i, max: n, disablePast: o, disableFuture: r } = this._options;
    if (gl(t, e, i, n, o, r) || Fn(e, i, n, o, r))
      return;
    const a = Dt(e, t, this.activeDay);
    this._activeDate = a, this._selectMonth(t);
  }
  nextMonth() {
    const t = nt(this._activeDate, 1), e = ds(
      t,
      this._headerDate,
      this._options,
      this._classes
    );
    this._activeDate = t, this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  previousMonth() {
    const t = nt(this._activeDate, -1);
    this._activeDate = t;
    const e = ds(
      t,
      this._headerDate,
      this._options,
      this._classes
    );
    this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  nextYear() {
    const t = it(this._activeDate, 1);
    this._activeDate = t, this.viewChangeButton.textContent = `${this.activeYear}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    );
    const e = hs(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Bi,
      this._classes
    );
    this.datesContainer.innerHTML = e;
  }
  previousYear() {
    const t = it(this._activeDate, -1);
    this._activeDate = t, this.viewChangeButton.textContent = `${this.activeYear}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    );
    const e = hs(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Bi,
      this._classes
    );
    this.datesContainer.innerHTML = e;
  }
  nextYears() {
    const t = it(this._activeDate, 24);
    this._activeDate = t;
    const e = us(
      t,
      this._selectedYear,
      this._options,
      mt,
      Hi,
      this._classes
    );
    this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  previousYears() {
    const t = it(this._activeDate, -24);
    this._activeDate = t;
    const e = us(
      t,
      this._selectedYear,
      this._options,
      mt,
      Hi,
      this._classes
    );
    this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  _asyncChangeView(t) {
    setTimeout(() => {
      this._changeView(t);
    }, 0);
  }
  _changeView(t) {
    this._view = t, this.datesContainer.blur(), t === "days" && (this.datesContainer.innerHTML = ds(
      this._activeDate,
      this._headerDate,
      this._options,
      this._classes
    )), t === "months" && (this.datesContainer.innerHTML = hs(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Bi,
      this._classes
    )), t === "years" && (this.datesContainer.innerHTML = us(
      this._activeDate,
      this._selectedYear,
      this._options,
      mt,
      Hi,
      this._classes
    )), this.datesContainer.focus(), this._updateViewControlsAndAttributes(t), this._updateControlsDisabledState();
  }
  _updateViewControlsAndAttributes(t) {
    t === "days" && (this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.viewChangeButton.setAttribute(
      "aria-label",
      this._options.switchToMultiYearViewLabel
    ), this.previousButton.setAttribute(
      "aria-label",
      this._options.prevMonthLabel
    ), this.nextButton.setAttribute("aria-label", this._options.nextMonthLabel)), t === "months" && (this.viewChangeButton.textContent = `${this.activeYear}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.viewChangeButton.setAttribute(
      "aria-label",
      this._options.switchToDayViewLabel
    ), this.previousButton.setAttribute(
      "aria-label",
      this._options.prevYearLabel
    ), this.nextButton.setAttribute("aria-label", this._options.nextYearLabel)), t === "years" && (this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`, this.viewChangeButton.innerHTML += kt(
      this._options,
      this._classes
    ), this.viewChangeButton.setAttribute(
      "aria-label",
      this._options.switchToMonthViewLabel
    ), this.previousButton.setAttribute(
      "aria-label",
      this._options.prevMultiYearLabel
    ), this.nextButton.setAttribute(
      "aria-label",
      this._options.nextMultiYearLabel
    ));
  }
  _updateControlsDisabledState() {
    xp(
      this._options.disableFuture,
      this._activeDate,
      this._view,
      mt,
      this._options.min,
      this._options.max,
      this.lastYearInView,
      this.firstYearInView
    ) ? this.nextButton.disabled = !0 : this.nextButton.disabled = !1, Sp(
      this._options.disablePast,
      this._activeDate,
      this._view,
      mt,
      this._options.min,
      this._options.max,
      this.lastYearInView,
      this.firstYearInView
    ) ? this.previousButton.disabled = !0 : this.previousButton.disabled = !1;
  }
  _handleUserInput(t) {
    const e = this._getDelimeters(this._options.format), i = this._parseDate(t, this._options.format, e);
    wp(i) ? (this._activeDate = i, this._selectedDate = i, this._selectedYear = H(i), this._selectedMonth = Y(i), this._headerDate = i) : (this._activeDate = /* @__PURE__ */ new Date(), this._selectedDate = null, this._selectedMonth = null, this._selectedYear = null, this._headerDate = null, this._headerMonth = null, this._headerYear = null);
  }
  _getDelimeters(t) {
    return t.match(/[^(dmy)]{1,}/g);
  }
  _parseDate(t, e, i) {
    let n;
    i[0] !== i[1] ? n = i[0] + i[1] : n = i[0];
    const o = new RegExp(`[${n}]`), r = t.split(o), a = e.split(o), l = e.indexOf("mmm") !== -1, c = [];
    for (let b = 0; b < a.length; b++)
      a[b].indexOf("yy") !== -1 && (c[0] = { value: r[b], format: a[b] }), a[b].indexOf("m") !== -1 && (c[1] = { value: r[b], format: a[b] }), a[b].indexOf("d") !== -1 && a[b].length <= 2 && (c[2] = { value: r[b], format: a[b] });
    let d;
    e.indexOf("mmmm") !== -1 ? d = this._options.monthsFull : d = this._options.monthsShort;
    const _ = Number(c[0].value), f = l ? this.getMonthNumberByMonthName(c[1].value, d) : Number(c[1].value) - 1, m = Number(c[2].value);
    return Dt(_, f, m);
  }
  getMonthNumberByMonthName(t, e) {
    return e.findIndex((i) => i === t);
  }
  static getInstance(t) {
    return I.getData(t, fs);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Gf = ({
  format24: s,
  okLabel: t,
  cancelLabel: e,
  headID: i,
  footerID: n,
  bodyID: o,
  pickerID: r,
  clearLabel: a,
  inline: l,
  showClearBtn: c,
  amLabel: d,
  pmLabel: _
}, f) => {
  const m = `<div id='${r}' class='${f.timepickerWrapper}' data-te-timepicker-wrapper>
      <div class="${f.timepickerContainer}">
        <div class="${f.timepickerElements}">
        <div id='${i}' class='${f.timepickerHead}' style='padding-right:${s ? 50 : 10}px'>
        <div class='${f.timepickerHeadContent}'>
            <div class="${f.timepickerCurrentWrapper}">
              <span class="${f.timepickerCurrentButtonWrapper}">
                <button type='button' class='${f.timepickerCurrentButton}' tabindex="0" data-te-timepicker-active data-te-timepicker-current data-te-timepicker-hour data-te-ripple-init>21</button>
              </span>
              <button type='button' class='${f.timepickerDot}' disabled>:</button>
            <span class="${f.timepickerCurrentButtonWrapper}">
              <button type='button' class='${f.timepickerCurrentButton}' tabindex="0" data-te-timepicker-current data-te-timepicker-minute data-te-ripple-init>21</button>
            </span>
            </div>
            ${s ? "" : `<div class="${f.timepickerModeWrapper}">
                  <button type='button' class="${f.timepickerModeAm}" tabindex="0" data-te-timepicker-am data-te-timepicker-hour-mode data-te-ripple-init>${d}</button>
                  <button class="${f.timepickerModePm}" tabindex="0" data-te-timepicker-pm data-te-timepicker-hour-mode data-te-ripple-init>${_}</button>
                </div>`}
        </div>
      </div>
      ${l ? "" : `<div id='${o}' class='${f.timepickerClockWrapper}' data-te-timepicker-clock-wrapper>
            <div class='${f.timepickerClock}' data-te-timepicker-clock>
              <span class='${f.timepickerMiddleDot}' data-te-timepicker-middle-dot></span>
              <div class='${f.timepickerHandPointer}' data-te-timepicker-hand-pointer>
                <div class='${f.timepickerPointerCircle}' data-te-timepicker-circle></div>
              </div>
              ${s ? '<div class="' + f.timepickerClockInner + '" data-te-timepicker-clock-inner></div>' : ""}
            </div>
          </div>`}
    </div>
    <div id='${n}' class='${f.timepickerFooterWrapper}'>
      <div class="${f.timepickerFooter}">
        ${c ? `<button type='button' class='${f.timepickerFooterButton}' data-te-timepicker-clear tabindex="0" data-te-ripple-init>${a}</button>` : ""}
        <button type='button' class='${f.timepickerFooterButton}' data-te-timepicker-cancel tabindex="0" data-te-ripple-init>${e}</button>
        <button type='button' class='${f.timepickerFooterButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${t}</button>
      </div>
    </div>
  </div>
</div>`, g = `<div id='${r}' class='${f.timepickerInlineWrapper}' data-te-timepicker-wrapper>
        <div class="${f.timepickerInlineContainer}">
          <div class="${f.timepickerInlineElements}">
          <div id='${i}' class='${f.timepickerInlineHead}'
          style='padding-right:10px'>
          <div class='${f.timepickerInlineHeadContent}'>
              <div class="${f.timepickerCurrentWrapper}">
                <span class="${f.timepickerInlineHourWrapper}" data-te-timepicker-inline-hour-icons>
                  <span class="${f.timepickerInlineIconUp}" data-te-timepicker-icon-up data-te-timepicker-icon-inline-hour>
                    <span class="${f.timepickerInlineIconSvg}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>   
                    </span>
                  </span>
                  <button type='button' class='${f.timepickerInlineCurrentButton}' data-te-timepicker-hour data-te-timepicker-current data-te-timepicker-current-inline tabindex="0" data-te-ripple-init>21</button>
                  <span class="${f.timepickerInlineIconDown}" data-te-timepicker-icon-inline-hour data-te-timepicker-icon-down>
                    <span class="${f.timepickerInlineIconSvg}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>  
                    </span>
                  </span>
                </span>
                <button type='button' class='${f.timepickerInlineDot}' data-te-timepicker-current-inline disabled>:</button>
              <span class="${f.timepickerCurrentMinuteWrapper}">
                <span class="${f.timepickerInlineIconUp}" data-te-timepicker-icon-up data-te-timepicker-icon-inline-minute>
                  <span class="${f.timepickerInlineIconSvg}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </span>
                </span>
                <button type='button' class='${f.timepickerInlineCurrentButton}' data-te-timepicker-minute data-te-timepicker-current data-te-timepicker-current-inline tabindex="0" data-te-ripple-init>21</button>
                <span class="${f.timepickerInlineIconDown}" data-te-timepicker-icon-inline-minute data-te-timepicker-icon-down>
                  <span class="${f.timepickerInlineIconSvg}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg> 
                  </span>
                </span>
              </span>
              </div>
              ${s ? "" : `<div class="${f.timepickerInlineModeWrapper}">
                      <button type='button' class="${f.timepickerInlineModeAm}" data-te-timepicker-am data-te-timepicker-hour-mode tabindex="0" data-te-ripple-init>${d}</button>
                      <button class="${f.timepickerInlineModePm}" data-te-timepicker-hour-mode data-te-timepicker-pm tabindex="0" data-te-ripple-init>${_}</button>
                      <button type='button' class='${f.timepickerInlineSubmitButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${t}</button>
                    </div>`}
              ${s ? `<button class='${f.timepickerInlineSubmitButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${t}</button>` : ""}
          </div>
        </div>
      </div>
    </div>
</div>`;
  return l ? g : m;
}, qf = (s, t, e) => {
  const { iconSVG: i } = s;
  return `
  <button id="${t}" tabindex="0" type="button" class="${e.timepickerToggleButton}" data-te-toggle="timepicker" data-te-timepicker-toggle-button data-te-timepicker-icon>
    ${i}
  </button>
`;
}, Ls = "data-te-timepicker-disabled", Fi = "data-te-timepicker-active", fe = (s) => {
  if (s === "")
    return;
  let t, e, i, n;
  return El(s) ? (t = s.getHours(), n = t, e = s.getMinutes(), t %= 12, n === 0 && t === 0 && (i = "AM"), t = t || 12, i === void 0 && (i = Number(n) >= 12 ? "PM" : "AM"), e = e < 10 ? `0${e}` : e) : ([t, e, i] = R(s, !1), n = t, t %= 12, n === 0 && t === 0 && (i = "AM"), t = t || 12, i === void 0 && (i = Number(n) >= 12 ? "PM" : "AM")), {
    hours: t,
    minutes: e,
    amOrPm: i
  };
}, El = (s) => s && Object.prototype.toString.call(s) === "[object Date]" && !Number.isNaN(s), wr = (s) => {
  if (s === "")
    return;
  let t, e;
  return El(s) ? (t = s.getHours(), e = s.getMinutes()) : [t, e] = R(s, !1), e = Number(e) < 10 ? `0${Number(e)}` : e, {
    hours: t,
    minutes: e
  };
}, Qf = (s, t, e) => u.on(document, s, t, ({ target: i }) => {
  if (i.hasAttribute(Fi))
    return;
  document.querySelectorAll(t).forEach((o) => {
    o.hasAttribute(Fi) && (p.removeClass(o, e.opacity), o.removeAttribute(Fi));
  }), p.addClass(i, e.opacity), i.setAttribute(Fi, "");
}), kr = ({ clientX: s, clientY: t, touches: e }, i, n = !1) => {
  const { left: o, top: r } = i.getBoundingClientRect();
  let a = {};
  return !n || !e ? a = {
    x: s - o,
    y: t - r
  } : n && Object.keys(e).length > 0 && (a = {
    x: e[0].clientX - o,
    y: e[0].clientY - r
  }), a;
}, Yi = () => navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform) || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
), R = (s, t = !0) => t ? s.value.replace(/:/gi, " ").split(" ") : s.replace(/:/gi, " ").split(" "), Tl = (s, t) => {
  const [e, i, n] = R(s, !1), [o, r, a] = R(t, !1);
  return n === "PM" && a === "AM" || n === a && e > o || i > r;
}, Cl = () => {
  const s = /* @__PURE__ */ new Date(), t = s.getHours(), e = s.getMinutes();
  return `${t}:${e < 10 ? `0${e}` : e}`;
}, jt = (s, t, e) => {
  if (!t)
    return s;
  let i = Cl();
  return e && (i = `${fe(i).hours}:${fe(i).minutes} ${fe(i).amOrPm}`), (s !== "" && Tl(i, s) || s === "") && (s = i), s;
}, Kt = (s, t, e) => {
  if (!t)
    return s;
  let i = Cl();
  return e && (i = `${fe(i).hours}:${fe(i).minutes} ${fe(i).amOrPm}`), (s !== "" && !Tl(i, s) || s === "") && (s = i), s;
}, Zf = ({ format12: s, maxTime: t, minTime: e, disablePast: i, disableFuture: n }, o, r) => {
  const a = R(o)[1];
  e = jt(e, i, s), t = Kt(t, n, s);
  const [l, c, d] = R(t, !1), [_, f, m] = R(e, !1);
  if (d !== void 0 || m !== void 0)
    return [r, a];
  if (!(l !== "" && _ === "" && Number(r) > Number(l)) && !(l === "" && _ !== "" && c === void 0 && f !== "" && Number(r) < Number(_)))
    return [r, a];
}, Or = (s, t, e, i) => {
  s.forEach((n) => {
    t = t === "12" && i ? "0" : t, (n.textContent === "00" || Number(n.textContent === "12" && i ? "0" : n.textContent) > t) && (p.addClass(n, e.tipsDisabled), n.setAttribute(Ls, ""));
  });
}, xr = (s, t, e, i) => {
  s.forEach((n) => {
    t = t === "12" && i ? "0" : t, n.textContent !== "00" && Number(n.textContent === "12" && i ? "0" : n.textContent) < Number(t) && (p.addClass(n, e.tipsDisabled), n.setAttribute(Ls, ""));
  });
}, Al = (s, t, e, i) => {
  if (t === "12" || t === "24")
    return;
  const n = e ? 12 : 24;
  return i === "max" ? (Number(s) === n ? 0 : Number(s)) > Number(t) : (Number(s) === n ? 0 : Number(s)) < Number(t);
}, Jf = (s, t, e, i, n, o) => {
  s.forEach((r) => {
    (Al(i, e, o, "max") || Number(r.textContent) > t && Number(i) === Number(e)) && (p.addClass(r, n.tipsDisabled), r.setAttribute(Ls, ""));
  });
}, t_ = (s, t, e, i, n, o) => {
  s.forEach((r) => {
    (Al(i, e, o, "min") || Number(r.textContent) < t && Number(i) === Number(e)) && (p.addClass(r, n.tipsDisabled), r.setAttribute(Ls, ""));
  });
}, e_ = (s) => s.startsWith("0") ? Number(s.slice(1)) : Number(s), hi = "timepicker", L = `data-te-${hi}`, Sr = "[data-te-toggle]", _s = `te.${hi}`, $t = `.${_s}`, Lt = ".data-api", Dr = `click${$t}${Lt}`, ji = `keydown${$t}${Lt}`, Ir = `mousedown${$t}${Lt}`, $r = `mouseup${$t}${Lt}`, Lr = `mousemove${$t}${Lt}`, Mr = `mouseleave${$t}${Lt}`, Nr = `mouseover${$t}${Lt}`, Rr = `touchmove${$t}${Lt}`, Pr = `touchend${$t}${Lt}`, Hr = `touchstart${$t}${Lt}`, i_ = `[${L}-am]`, s_ = `[${L}-pm]`, n_ = `[${L}-format24]`, Ki = `[${L}-current]`, Ui = `[${L}-hour-mode]`, o_ = `[${L}-toggle-button]`, fn = `${L}-cancel`, Br = `${L}-clear`, _n = `${L}-submit`, r_ = `${L}-icon`, mn = `${L}-icon-up`, gn = `${L}-icon-down`, a_ = `${L}-icon-inline-hour`, l_ = `${L}-icon-inline-minute`, Vr = `${L}-inline-hour-icons`, c_ = `${L}-current-inline`, d_ = "readonly", Wr = `${L}-invalid-feedback`, bn = `${L}-is-invalid`, Bt = `${L}-disabled`, B = `${L}-active`, h_ = `${L}-input`, le = `${L}-clock`, Je = `${L}-clock-inner`, vn = `${L}-wrapper`, Fr = `${L}-clock-wrapper`, zi = `${L}-hour`, En = `${L}-minute`, Xi = `${L}-tips-element`, K = `${L}-tips-hours`, X = `${L}-tips-minutes`, at = `${L}-tips-inner`, Gi = `${L}-tips-inner-element`, Yr = `${L}-middle-dot`, Tn = `${L}-hand-pointer`, Cn = `${L}-circle`, jr = `${L}-modal`, u_ = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`, p_ = {
  appendValidationInfo: !0,
  bodyID: "",
  cancelLabel: "Cancel",
  clearLabel: "Clear",
  closeModalOnBackdropClick: !0,
  closeModalOnMinutesClick: !1,
  container: "body",
  defaultTime: "",
  disabled: !1,
  disablePast: !1,
  disableFuture: !1,
  enableValidation: !0,
  focusInputAfterApprove: !1,
  footerID: "",
  format12: !0,
  format24: !1,
  headID: "",
  increment: !1,
  inline: !1,
  invalidLabel: "Invalid Time Format",
  maxTime: "",
  minTime: "",
  modalID: "",
  okLabel: "Ok",
  overflowHidden: !0,
  pickerID: "",
  readOnly: !1,
  showClearBtn: !0,
  switchHoursToMinutesOnClick: !0,
  iconSVG: u_,
  withIcon: !0,
  pmLabel: "PM",
  amLabel: "AM",
  animations: !0
}, f_ = {
  appendValidationInfo: "boolean",
  bodyID: "string",
  cancelLabel: "string",
  clearLabel: "string",
  closeModalOnBackdropClick: "boolean",
  closeModalOnMinutesClick: "boolean",
  container: "string",
  disabled: "boolean",
  disablePast: "boolean",
  disableFuture: "boolean",
  enableValidation: "boolean",
  footerID: "string",
  format12: "boolean",
  format24: "boolean",
  headID: "string",
  increment: "boolean",
  inline: "boolean",
  invalidLabel: "string",
  modalID: "string",
  okLabel: "string",
  overflowHidden: "boolean",
  pickerID: "string",
  readOnly: "boolean",
  showClearBtn: "boolean",
  switchHoursToMinutesOnClick: "boolean",
  defaultTime: "(string|date|number)",
  iconSVG: "string",
  withIcon: "boolean",
  pmLabel: "string",
  amLabel: "string",
  animations: "boolean"
}, __ = {
  tips: "absolute rounded-[100%] w-[32px] h-[32px] text-center cursor-pointer text-[1.1rem] rounded-[100%] bg-transparent flex justify-center items-center font-light focus:outline-none selection:bg-transparent",
  tipsActive: "text-white bg-[#3b71ca] font-normal",
  tipsDisabled: "text-[#b3afaf] pointer-events-none bg-transparent",
  transform: "transition-[transform,height] ease-in-out duration-[400ms]",
  modal: "z-[1065]",
  clockAnimation: "animate-[show-up-clock_350ms_linear]",
  opacity: "!opacity-100",
  timepickerWrapper: "touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col fixed",
  timepickerContainer: "flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] min-[320px]:max-[825px]:landscape:rounded-lg",
  timepickerElements: "flex flex-col min-w-[310px] min-h-[325px] bg-white rounded-t-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape:min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around",
  timepickerHead: "bg-[#3b71ca] dark:bg-zinc-700 h-[100px] rounded-t-lg pr-[24px] pl-[50px] py-[10px] min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center",
  timepickerHeadContent: "min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly",
  timepickerCurrentWrapper: "[direction:ltr] rtl:[direction:rtl]",
  timepickerCurrentButtonWrapper: "relative h-full",
  timepickerCurrentButton: "text-[3.75rem] font-light leading-[1.2] tracking-[-0.00833em] text-white opacity-[.54] border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ",
  timepickerDot: "font-light leading-[1.2] tracking-[-0.00833em] text-[3.75rem] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal",
  timepickerModeWrapper: "flex flex-col justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row",
  timepickerModeAm: "p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none",
  timepickerModePm: "p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none",
  timepickerClockWrapper: "min-w-[310px] max-w-[325px] min-h-[305px] overflow-x-hidden h-full flex justify-center flex-col items-center dark:bg-zinc-500",
  timepickerClock: "relative rounded-[100%] w-[260px] h-[260px] cursor-default my-0 mx-auto bg-[#00000012] dark:bg-zinc-600/50",
  timepickerMiddleDot: "top-1/2 left-1/2 w-[6px] h-[6px] -translate-y-1/2 -translate-x-1/2 rounded-[50%] bg-[#3b71ca] absolute",
  timepickerHandPointer: "bg-[#3b71ca] bottom-1/2 h-2/5 left-[calc(50%-1px)] rtl:!left-auto origin-[center_bottom_0] rtl:!origin-[50%_50%_0] w-[2px] absolute",
  timepickerPointerCircle: "-top-[21px] -left-[15px] w-[4px] border-[14px] border-solid border-[#3b71ca] h-[4px] box-content rounded-[100%] absolute",
  timepickerClockInner: "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-[100%]",
  timepickerFooterWrapper: "rounded-b-lg flex justify-between items-center w-full h-[56px] px-[12px] bg-white dark:bg-zinc-500",
  timepickerFooter: "w-full flex justify-between",
  timepickerFooterButton: "text-[0.8rem] min-w-[64px] box-border font-medium leading-[40px] rounded-[10px] tracking-[0.1rem] uppercase text-[#3b71ca] dark:text-white border-none bg-transparent transition-[background-color,box-shadow,border] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] delay-[0ms] outline-none py-0 px-[10px] h-[40px] mb-[10px] hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none",
  timepickerInlineWrapper: "touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col rounded-lg",
  timepickerInlineContainer: "flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]",
  timepickerInlineElements: "flex flex-col min-h-[auto] min-w-[310px] bg-white rounded-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:rounded-bl-lg min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape::min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around",
  timepickerInlineHead: "bg-[#3b71ca] dark:bg-zinc-700 h-[100px] rounded-t-lg min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center p-0 rounded-b-lg",
  timepickerInlineHeadContent: "min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly items-center",
  timepickerInlineHourWrapper: "relative h-full !opacity-100",
  timepickerCurrentMinuteWrapper: "relative h-full",
  timepickerInlineIconUp: "absolute fill-white -top-[35px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center",
  timepickerInlineIconSvg: "h-4 w-4",
  timepickerInlineCurrentButton: "font-light leading-[1.2] tracking-[-0.00833em] text-white border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal !opacity-100 cursor-pointer focus:bg-[#00000026] hover:outline-none focus:outline-none text-[2.5rem] hover:bg-[unset]",
  timepickerInlineIconDown: "absolute fill-white -bottom-[47px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center",
  timepickerInlineDot: "font-light leading-[1.2] tracking-[-0.00833em] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal text-[2.5rem]",
  timepickerInlineModeWrapper: "flex justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row",
  timepickerInlineModeAm: "hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer mr-2 ml-6",
  timepickerInlineModePm: "hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer",
  timepickerInlineSubmitButton: "hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none text-[0.8rem] box-border font-medium leading-[40px] tracking-[.1rem] uppercase border-none bg-transparent [transition:background-color_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,box-shadow_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,border_250ms_cubic-bezier(0.4,0,0.2,1)_0ms] outline-none rounded-[100%] h-[48px] min-w-[48px] inline-block ml-[30px] text-white py-1 px-2 mb-0",
  timepickerToggleButton: "h-4 w-4 ml-auto absolute outline-none border-none bg-transparent right-1.5 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer hover:text-[#3b71ca] focus:text-[#3b71ca] dark:hover:text-[#3b71ca] dark:focus:text-[#3b71ca] dark:text-white"
}, m_ = {
  tips: "string",
  tipsActive: "string",
  tipsDisabled: "string",
  transform: "string",
  modal: "string",
  clockAnimation: "string",
  opacity: "string",
  timepickerWrapper: "string",
  timepickerContainer: "string",
  timepickerElements: "string",
  timepickerHead: "string",
  timepickerHeadContent: "string",
  timepickerCurrentWrapper: "string",
  timepickerCurrentButtonWrapper: "string",
  timepickerCurrentButton: "string",
  timepickerDot: "string",
  timepickerModeWrapper: "string",
  timepickerModeAm: "string",
  timepickerModePm: "string",
  timepickerClockWrapper: "string",
  timepickerClock: "string",
  timepickerMiddleDot: "string",
  timepickerHandPointer: "string",
  timepickerPointerCircle: "string",
  timepickerClockInner: "string",
  timepickerFooterWrapper: "string",
  timepickerFooterButton: "string",
  timepickerInlineWrapper: "string",
  timepickerInlineContainer: "string",
  timepickerInlineElements: "string",
  timepickerInlineHead: "string",
  timepickerInlineHeadContent: "string",
  timepickerInlineHourWrapper: "string",
  timepickerCurrentMinuteWrapper: "string",
  timepickerInlineIconUp: "string",
  timepickerInlineIconSvg: "string",
  timepickerInlineCurrentButton: "string",
  timepickerInlineIconDown: "string",
  timepickerInlineDot: "string",
  timepickerInlineModeWrapper: "string",
  timepickerInlineModeAm: "string",
  timepickerInlineModePm: "string",
  timepickerInlineSubmitButton: "string",
  timepickerToggleButton: "string"
};
class qg {
  constructor(t, e = {}, i) {
    Tt(this, "_toggleAmPm", (t) => {
      t === "PM" ? (this._isPmEnabled = !0, this._isAmEnabled = !1) : t === "AM" && (this._isPmEnabled = !1, this._isAmEnabled = !0);
    });
    Tt(this, "_toggleBackgroundColorCircle", (t) => {
      if (this._modal.querySelector(`${t}[${B}]`) !== null) {
        p.addStyle(this._circle, {
          backgroundColor: "#1976d2"
        });
        return;
      }
      p.addStyle(this._circle, {
        backgroundColor: "transparent"
      });
    });
    Tt(this, "_toggleClassActive", (t, { textContent: e }, i) => {
      const n = [...t].find(
        (o) => Number(o) === Number(e)
      );
      return i.forEach((o) => {
        if (!o.hasAttribute(Bt)) {
          if (o.textContent === n) {
            p.addClass(o, this._classes.tipsActive), o.setAttribute(B, "");
            return;
          }
          p.removeClass(o, this._classes.tipsActive), o.removeAttribute(B);
        }
      });
    });
    Tt(this, "_makeMinutesDegrees", (t, e) => {
      const { increment: i } = this._options;
      return t < 0 ? (e = Math.round(360 + t / 6) % 60, t = 360 + Math.round(t / 6) * 6) : (e = Math.round(t / 6) % 60, t = Math.round(t / 6) * 6), i && (t = Math.round(t / 30) * 30, e = Math.round(t / 6) * 6 / 6, e === 60 && (e = "00")), t >= 360 && (t = 0), {
        degrees: t,
        minute: e,
        addDegrees: i ? 30 : 6
      };
    });
    Tt(this, "_makeHourDegrees", (t, e, i) => {
      if (t)
        return this._hasTargetInnerClass(t) ? e < 0 ? (i = Math.round(360 + e / 30) % 24, e = 360 + e) : (i = Math.round(e / 30) + 12, i === 12 && (i = "00")) : e < 0 ? (i = Math.round(360 + e / 30) % 12, e = 360 + e) : (i = Math.round(e / 30) % 12, (i === 0 || i > 12) && (i = 12)), e >= 360 && (e = 0), {
          degrees: e,
          hour: i,
          addDegrees: 30
        };
    });
    Tt(this, "_makeInnerHoursDegrees", (t, e) => (t < 0 ? (e = Math.round(360 + t / 30) % 24, t = 360 + t) : (e = Math.round(t / 30) + 12, e === 12 && (e = "00")), {
      degrees: t,
      hour: e,
      addDegrees: 30
    }));
    Tt(this, "_getAppendClock", (t = [], e = `[${le}]`, i) => {
      let { minTime: n, maxTime: o } = this._options;
      const { inline: r, format12: a, disablePast: l, disableFuture: c } = this._options;
      n = jt(n, l, a), o = Kt(o, c, a);
      const [d, _, f] = R(
        o,
        !1
      ), [m, g, b] = R(
        n,
        !1
      );
      !r && a && this._isInvalidTimeFormat && !this._AM.hasAttribute(B) && (p.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(B, ""));
      const T = h.findOne(e), C = 360 / t.length;
      function w(y) {
        return y * (Math.PI / 180);
      }
      if (T === null)
        return;
      const v = (T.offsetWidth - 32) / 2, E = (T.offsetHeight - 32) / 2, A = v - 4;
      setTimeout(() => {
        let y;
        a && (y = h.findOne(
          `${Ui}[${B}]`
        ).textContent), this._handleDisablingTipsMinTime(
          y,
          b,
          g,
          m
        ), this._handleDisablingTipsMaxTime(
          y,
          f,
          _,
          d
        );
      }, 0), [...t].forEach((y, S) => {
        const O = w(S * C), k = M("span"), D = M("span");
        D.innerHTML = y, p.addClass(k, this._classes.tips), k.setAttribute(i, "");
        const x = k.offsetWidth, $ = k.offsetHeight;
        return p.addStyle(k, {
          left: `${v + Math.sin(O) * A - x}px`,
          bottom: `${E + Math.cos(O) * A - $}px`
        }), t.includes("05") && k.setAttribute(X, ""), t.includes("13") ? D.setAttribute(Gi, "") : D.setAttribute(Xi, ""), k.appendChild(D), T.appendChild(k);
      });
    });
    this._element = t, this._element && I.setData(t, _s, this), this._document = document, this._options = this._getConfig(e), this._classes = this._getClasses(i), this._currentTime = null, this._toggleButtonId = Ot("timepicker-toggle-"), this.hoursArray = [
      "12",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ], this.innerHours = [
      "00",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23"
    ], this.minutesArray = [
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55"
    ], this.input = h.findOne("input", this._element), this.dataWithIcon = t.dataset.withIcon, this.dataToggle = t.dataset.toggle, this.customIcon = h.findOne(
      o_,
      this._element
    ), this._checkToggleButton(), this.inputFormatShow = h.findOne(
      n_,
      this._element
    ), this.inputFormat = this.inputFormatShow === null ? "" : Object.values(this.inputFormatShow.dataset)[0], this.elementToggle = h.findOne(
      Sr,
      this._element
    ), this.toggleElement = Object.values(
      t.querySelector(Sr).dataset
    )[0], this._hour = null, this._minutes = null, this._AM = null, this._PM = null, this._wrapper = null, this._modal = null, this._hand = null, this._circle = null, this._focusTrap = null, this._popper = null, this._interval = null, this._inputValue = this._options.defaultTime !== "" ? this._options.defaultTime : this.input.value, this._options.format24 && (this._options.format12 = !1, this._currentTime = wr(this._inputValue)), this._options.format12 && (this._options.format24 = !1, this._currentTime = fe(this._inputValue)), this._options.readOnly && this.input.setAttribute(d_, !0), this.inputFormat === "true" && this.inputFormat !== "" && (this._options.format12 = !1, this._options.format24 = !0, this._currentTime = wr(this._inputValue)), this._animations = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && this._options.animations, this.init(), this._isHours = !0, this._isMinutes = !1, this._isInvalidTimeFormat = !1, this._isMouseMove = !1, this._isInner = !1, this._isAmEnabled = !1, this._isPmEnabled = !1, this._options.format12 && !this._options.defaultTime && (this._isPmEnabled = !0), this._objWithDataOnChange = { degrees: null }, this._scrollBar = new pi();
  }
  // Getters
  static get NAME() {
    return hi;
  }
  // Public
  init() {
    const { format12: t, format24: e, enableValidation: i } = this._options;
    let n, o, r;
    if (this.input.setAttribute(h_, ""), this._currentTime !== void 0) {
      const { hours: a, minutes: l, amOrPm: c } = this._currentTime;
      n = Number(a) < 10 ? 0 : "", o = `${n}${Number(a)}:${l}`, r = c, t ? this.input.value = `${o} ${r}` : e && (this.input.value = `${o}`);
    } else
      n = "", o = "", r = "", this.input.value = "";
    this.input.value.length > 0 && this.input.value !== "" && (this.input.setAttribute(B, ""), u.trigger(this.input, "input")), !(this._options === null && this._element === null) && (i && this._getValidate("keydown change blur focus"), this._handleOpen(), this._listenToToggleKeydown());
  }
  dispose() {
    this._removeModal(), this._element !== null && I.removeData(this._element, _s), setTimeout(() => {
      this._element = null, this._options = null, this.input = null, this._focusTrap = null;
    }, 350), u.off(
      this._document,
      "click",
      `[data-te-toggle='${this.toggleElement}']`
    ), u.off(
      this._element,
      "keydown",
      `[data-te-toggle='${this.toggleElement}']`
    );
  }
  update(t = {}) {
    this._options = this._getConfig({ ...this._options, ...t });
  }
  // private
  _checkToggleButton() {
    this.customIcon === null && (this.dataWithIcon !== void 0 && (this._options.withIcon = null, this.dataWithIcon === "true" && this._appendToggleButton(this._options)), this._options.withIcon && this._appendToggleButton(this._options));
  }
  _appendToggleButton() {
    const t = qf(
      this._options,
      this._toggleButtonId,
      this._classes
    );
    this.input.insertAdjacentHTML("afterend", t);
  }
  _getDomElements() {
    this._hour = h.findOne(`[${zi}]`), this._minutes = h.findOne(`[${En}]`), this._AM = h.findOne(i_), this._PM = h.findOne(s_), this._wrapper = h.findOne(`[${vn}]`), this._modal = h.findOne(`[${jr}]`), this._hand = h.findOne(`[${Tn}]`), this._circle = h.findOne(`[${Cn}]`), this._clock = h.findOne(`[${le}]`), this._clockInner = h.findOne(
      `[${Je}]`
    );
  }
  _handlerMaxMinHoursOptions(t, e, i, n, o, r) {
    if (!e && !i)
      return !0;
    const { format24: a, format12: l, disablePast: c, disableFuture: d } = this._options, { _isAmEnabled: _, _isPmEnabled: f } = this, m = r.keyCode, g = r.target.hasAttribute(Je) || r.target.hasAttribute(at) || r.target.hasAttribute(Gi);
    i = jt(i, c, l), e = Kt(e, d, l), typeof e != "number" && (e = R(e, !1)[0]);
    const b = e !== "" ? e * 30 : "", T = i !== "" ? i * 30 : "";
    t < 0 && (t = 360 + t), t = t === 360 ? 0 : t;
    const C = () => {
      const S = document.querySelectorAll(
        `[${Xi}]`
      ), O = document.querySelectorAll(
        `[${Gi}]`
      ), k = e_(this._hour.innerText);
      let D, x, $;
      return m === rt ? x = 1 : m === U && (x = -1), k === 12 && m === rt ? $ = 1 : k === 0 && m === rt ? $ = 13 : k === 0 && m === U ? $ = 23 : k === 13 && m === U ? $ = 0 : k === 1 && m === U ? $ = 12 : $ = k + x, S.forEach((P) => {
        Number(P.textContent) === $ && (D = P);
      }), O.forEach((P) => {
        Number(P.textContent) === $ && (D = P);
      }), !D.parentElement.hasAttribute(Bt);
    }, w = () => {
      const S = i !== "" && i > 12 ? (i - 12) * 30 : "", O = e !== "" && e > 12 ? (e - 12) * 30 : "";
      if (!(S && t < S || O && t > O || e && e < 12))
        return !0;
    };
    if (a && r.type !== "keydown" && g)
      return w();
    if (r.type === "keydown")
      return C();
    const v = !o || o === "PM" && f || i !== "" && o === "AM" && _, E = !n || n === "PM" && f || e !== "" && n === "AM" && _, A = () => {
      const S = T === 360 && l ? 0 : T;
      if (i) {
        if (o === "PM" && _ || v && t < S)
          return;
      } else
        return !0;
      return !0;
    }, y = () => {
      const S = b === 360 && l ? 0 : b;
      if (e) {
        if (n === "AM" && f || E && t > S)
          return;
      } else
        return !0;
      return !0;
    };
    return A() && y();
  }
  _handleKeyboard() {
    u.on(this._document, ji, "", (t) => {
      let e, i, n;
      const {
        increment: o,
        maxTime: r,
        minTime: a,
        format12: l,
        disablePast: c,
        disableFuture: d
      } = this._options;
      let _ = R(a, !1)[0], f = R(r, !1)[0];
      const m = R(a, !1)[2], g = R(r, !1)[2];
      _ = jt(_, c, l), f = Kt(f, d, l), typeof f != "number" && (f = R(f, !1)[0]);
      const b = h.findOne(`[${X}]`) === null, T = h.findOne(`[${at}]`) !== null, C = Number(this._hand.style.transform.replace(/[^\d-]/g, "")), w = h.find(
        `[${X}]`,
        this._modal
      ), v = h.find(
        `[${K}]`,
        this._modal
      ), E = h.find(
        `[${at}]`,
        this._modal
      );
      let A = this._makeHourDegrees(t.target, C, e).hour;
      const { degrees: y, addDegrees: S } = this._makeHourDegrees(
        t.target,
        C,
        e
      );
      let { minute: O, degrees: k } = this._makeMinutesDegrees(C, i);
      const D = this._makeMinutesDegrees(
        C,
        i
      ).addDegrees;
      let { hour: x } = this._makeInnerHoursDegrees(
        C,
        n
      );
      if (t.keyCode === Is) {
        const $ = h.findOne(
          `[${fn}]`,
          this._modal
        );
        u.trigger($, "click");
      } else if (b) {
        if (T && (t.keyCode === $e && (this._isInner = !1, p.addStyle(this._hand, {
          height: "calc(40% + 1px)"
        }), this._hour.textContent = this._setHourOrMinute(
          A > 12 ? 1 : A
        ), this._toggleClassActive(this.hoursArray, this._hour, v), this._toggleClassActive(this.innerHours, this._hour, E)), t.keyCode === Ie && (this._isInner = !0, p.addStyle(this._hand, {
          height: "21.5%"
        }), this._hour.textContent = this._setHourOrMinute(
          x >= 24 || x === "00" ? 0 : x
        ), this._toggleClassActive(this.innerHours, this._hour, E), this._toggleClassActive(
          this.hoursArray,
          this._hour - 1,
          v
        ))), t.keyCode === rt) {
          if (!this._handlerMaxMinHoursOptions(
            y + 30,
            f,
            _,
            g,
            m,
            t
          ))
            return;
          p.addStyle(this._hand, {
            transform: `rotateZ(${y + S}deg)`
          }), this._isInner ? (x += 1, x === 24 ? x = 0 : (x === 25 || x === "001") && (x = 13), this._hour.textContent = this._setHourOrMinute(x), this._toggleClassActive(this.innerHours, this._hour, E)) : (A += 1, this._hour.textContent = this._setHourOrMinute(
            A > 12 ? 1 : A
          ), this._toggleClassActive(this.hoursArray, this._hour, v));
        }
        if (t.keyCode === U) {
          if (!this._handlerMaxMinHoursOptions(
            y - 30,
            f,
            _,
            g,
            m,
            t
          ))
            return;
          p.addStyle(this._hand, {
            transform: `rotateZ(${y - S}deg)`
          }), this._isInner ? (x -= 1, x === 12 ? x = 0 : x === -1 && (x = 23), this._hour.textContent = this._setHourOrMinute(x), this._toggleClassActive(this.innerHours, this._hour, E)) : (A -= 1, this._hour.textContent = this._setHourOrMinute(
            A === 0 ? 12 : A
          ), this._toggleClassActive(this.hoursArray, this._hour, v));
        }
      } else
        t.keyCode === rt && (k += D, p.addStyle(this._hand, {
          transform: `rotateZ(${k}deg)`
        }), O += 1, o && (O += 4, O === "0014" && (O = 5)), this._minutes.textContent = this._setHourOrMinute(
          O > 59 ? 0 : O
        ), this._toggleClassActive(
          this.minutesArray,
          this._minutes,
          w
        ), this._toggleBackgroundColorCircle(
          `[${X}]`
        )), t.keyCode === U && (k -= D, p.addStyle(this._hand, {
          transform: `rotateZ(${k}deg)`
        }), o ? O -= 5 : O -= 1, O === -1 ? O = 59 : O === -5 && (O = 55), this._minutes.textContent = this._setHourOrMinute(O), this._toggleClassActive(
          this.minutesArray,
          this._minutes,
          w
        ), this._toggleBackgroundColorCircle(
          `[${X}]`
        ));
    });
  }
  _setActiveClassToTipsOnOpen(t, ...e) {
    if (!this._isInvalidTimeFormat)
      if (this._options.format24) {
        const i = h.find(
          `[${K}]`,
          this._modal
        ), n = h.find(
          `[${at}]`,
          this._modal
        );
        this._addActiveClassToTip(i, t), this._addActiveClassToTip(n, t);
      } else {
        [...e].filter((n) => (n === "PM" ? (p.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(B, "")) : n === "AM" ? (p.addClass(this._AM, this._classes.opacity), this._AM.setAttribute(B, "")) : (p.removeClass(this._AM, this._classes.opacity), p.removeClass(this._PM, this._classes.opacity), this._AM.removeAttribute(B), this._PM.removeAttribute(B)), n));
        const i = h.find(
          `[${K}]`,
          this._modal
        );
        this._addActiveClassToTip(i, t);
      }
  }
  _setTipsAndTimesDependOnInputValue(t, e) {
    const { inline: i, format12: n } = this._options;
    if (this._isInvalidTimeFormat)
      this._hour.textContent = "12", this._minutes.textContent = "00", i || p.addStyle(this._hand, {
        transform: "rotateZ(0deg)"
      }), n && (p.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(B, ""));
    else {
      const o = t > 12 ? t * 30 - 360 : t * 30;
      this._hour.textContent = t, this._minutes.textContent = e, i || (p.addStyle(this._hand, {
        transform: `rotateZ(${o}deg)`
      }), p.addStyle(this._circle, {
        backgroundColor: "#1976d2"
      }), (Number(t) > 12 || t === "00") && p.addStyle(this._hand, {
        height: "21.5%"
      }));
    }
  }
  _listenToToggleKeydown() {
    u.on(
      this._element,
      "keydown",
      `[data-te-toggle='${this.toggleElement}']`,
      (t) => {
        t.keyCode === lt && (t.preventDefault(), u.trigger(this.elementToggle, "click"));
      }
    );
  }
  _handleOpen() {
    const t = this._getContainer();
    ee.on(
      this._element,
      "click",
      `[data-te-toggle='${this.toggleElement}']`,
      (e) => {
        if (this._options === null)
          return;
        const i = p.getDataAttribute(this.input, "toggle") !== null ? 200 : 0;
        setTimeout(() => {
          p.addStyle(this.elementToggle, {
            pointerEvents: "none"
          }), this.elementToggle.blur();
          let n;
          R(this.input)[0] === "" ? n = ["12", "00", "PM"] : n = R(this.input);
          const { modalID: o, inline: r, format12: a } = this._options, [l, c, d] = n, _ = M("div");
          if ((Number(l) > 12 || l === "00") && (this._isInner = !0), this.input.blur(), e.target.blur(), _.innerHTML = Gf(this._options, this._classes), p.addClass(_, this._classes.modal), _.setAttribute(jr, ""), _.setAttribute("role", "dialog"), _.setAttribute("tabIndex", "-1"), _.setAttribute("id", o), r ? (this._popper = je(this.input, _, {
            placement: "bottom-start"
          }), t.appendChild(_)) : (t.appendChild(_), this._scrollBar.hide()), this._getDomElements(), this._animations ? this._toggleBackdropAnimation() : p.addClass(this._wrapper, this._classes.opacity), this._setActiveClassToTipsOnOpen(l, c, d), this._appendTimes(), this._setActiveClassToTipsOnOpen(l, c, d), this._setTipsAndTimesDependOnInputValue(l, c), this.input.value === "") {
            const f = h.find(
              `[${K}]`,
              this._modal
            );
            a && (p.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(B, "")), this._hour.textContent = "12", this._minutes.textContent = "00", this._addActiveClassToTip(
              f,
              Number(this._hour.textContent)
            );
          }
          if (this._handleSwitchTimeMode(), this._handleOkButton(), this._handleClose(), r)
            this._handleHoverInlineBtn(), this._handleDocumentClickInline(), this._handleInlineClicks();
          else {
            this._handleSwitchHourMinute(), this._handleClockClick(), this._handleKeyboard();
            const f = document.querySelector(
              `${Ki}[${B}]`
            );
            p.addClass(f, this._classes.opacity), p.addStyle(this._hour, {
              pointerEvents: "none"
            }), p.addStyle(this._minutes, {
              pointerEvents: ""
            });
          }
          this._focusTrap = new bi(this._wrapper, {
            event: "keydown",
            condition: ({ key: f }) => f === "Tab"
          }), this._focusTrap.trap();
        }, i);
      }
    );
  }
  _handleInlineClicks() {
    let t, e;
    const i = (f) => {
      let m = f;
      return m > 59 ? m = 0 : m < 0 && (m = 59), m;
    }, n = (f) => {
      let m = f;
      return this._options.format24 ? (m > 24 ? m = 1 : m < 0 && (m = 23), m > 23 && (m = 0)) : (m > 12 ? m = 1 : m < 1 && (m = 12), m > 12 && (m = 1)), m;
    }, o = (f) => {
      const m = n(f);
      this._hour.textContent = this._setHourOrMinute(m);
    }, r = (f) => {
      const m = i(f);
      this._minutes.textContent = this._setHourOrMinute(m);
    }, a = () => {
      t += 1, o(t);
    }, l = () => {
      e += 1, r(e);
    }, c = () => {
      t -= 1, o(t);
    }, d = () => {
      e -= 1, r(e);
    }, _ = (f) => {
      clearInterval(this._interval), this._interval = setInterval(f, 100);
    };
    ee.on(
      this._modal,
      "click mousedown mouseup touchstart touchend contextmenu",
      `[${mn}], [${gn}]`,
      (f) => {
        t = Number(this._hour.textContent), e = Number(this._minutes.textContent);
        const { target: m, type: g } = f, b = g === "mousedown" || g === "touchstart";
        m.closest(`[${mn}]`) ? m.closest(`[${mn}]`).parentNode.hasAttribute(Vr) ? b ? _(a) : g === "mouseup" || g === "touchend" || g === "contextmenu" ? clearInterval(this._interval) : a() : b ? _(l) : g === "mouseup" || g === "touchend" || g === "contextmenu" ? clearInterval(this._interval) : l() : m.closest(`[${gn}]`) && (m.closest(`[${gn}]`).parentNode.hasAttribute(Vr) ? b ? _(c) : g === "mouseup" || g === "touchend" ? clearInterval(this._interval) : c() : b ? _(d) : g === "mouseup" || g === "touchend" ? clearInterval(this._interval) : d());
      }
    ), u.on(window, ji, (f) => {
      const m = f.code, g = document.activeElement.hasAttribute(zi), b = document.activeElement.hasAttribute(
        En
      ), T = document.activeElement === document.body;
      switch (t = Number(this._hour.textContent), e = Number(this._minutes.textContent), m) {
        case "ArrowUp":
          f.preventDefault(), T || g ? (this._hour.focus(), a()) : b && l();
          break;
        case "ArrowDown":
          f.preventDefault(), T || g ? (this._hour.focus(), c()) : b && d();
          break;
      }
    });
  }
  _handleClose() {
    u.on(
      this._modal,
      "click",
      `[${vn}], [${fn}], [${Br}]`,
      ({ target: t }) => {
        const { closeModalOnBackdropClick: e } = this._options, i = () => {
          var n;
          p.addStyle(this.elementToggle, {
            pointerEvents: "auto"
          }), this._animations && this._toggleBackdropAnimation(!0), this._removeModal(), (n = this._focusTrap) == null || n.disable(), this._focusTrap = null, this.elementToggle ? this.elementToggle.focus() : this.input && this.input.focus();
        };
        if (t.hasAttribute(Br)) {
          this._toggleAmPm("PM"), this.input.value = "", this.input.removeAttribute(B);
          let n;
          R(this.input)[0] === "" ? n = ["12", "00", "PM"] : n = R(this.input);
          const [o, r, a] = n;
          this._setTipsAndTimesDependOnInputValue("12", "00"), this._setActiveClassToTipsOnOpen(o, r, a), this._hour.click();
        } else
          (t.hasAttribute(fn) || t.hasAttribute(_n) || t.hasAttribute(vn) && e) && i();
      }
    );
  }
  showValueInput() {
    return this.input.value;
  }
  _handleOkButton() {
    ee.on(
      this._modal,
      "click",
      `[${_n}]`,
      () => {
        let { maxTime: t, minTime: e } = this._options;
        const {
          format12: i,
          format24: n,
          readOnly: o,
          focusInputAfterApprove: r,
          disablePast: a,
          disableFuture: l
        } = this._options, c = this._document.querySelector(
          `${Ui}[${B}]`
        ), d = `${this._hour.textContent}:${this._minutes.textContent}`, _ = Number(this._hour.textContent), f = _ === 12 && i ? 0 : _, m = Number(this._minutes.textContent);
        e = jt(e, a, i), t = Kt(t, l, i);
        let [g, b, T] = R(
          t,
          !1
        ), [C, w, v] = R(
          e,
          !1
        );
        C = C === "12" && i ? "00" : C, g = g === "12" && i ? "00" : g;
        const E = f < Number(C), A = f > Number(g);
        let y = !0;
        c && (y = T === c.textContent);
        let S = !0;
        c && (S = v === c.textContent);
        const O = m > b && f === Number(g), k = m < w && f === Number(C);
        if (this.input.setAttribute(B, ""), p.addStyle(this.elementToggle, {
          pointerEvents: "auto"
        }), t !== "") {
          if (y && (A || O))
            return;
          if (T === "AM" && c.textContent === "PM")
            return;
        }
        e !== "" && (S && (E || k) || v === "PM" && c.textContent === "AM") || Zf(
          this._options,
          this.input,
          this._hour.textContent
        ) !== void 0 && (this._isInvalidTimeFormat && this.input.removeAttribute(bn), !o && r && this.input.focus(), p.addStyle(this.elementToggle, {
          pointerEvents: "auto"
        }), n ? this.input.value = d : c === null ? this.input.value = `${d} PM` : this.input.value = `${d} ${c.textContent}`, this._animations && this._toggleBackdropAnimation(!0), this._removeModal(), u.trigger(this.input, "input.te.timepicker"), u.trigger(this.input, "input"));
      }
    );
  }
  _handleHoverInlineBtn() {
    ee.on(
      this._modal,
      "mouseover mouseleave",
      `[${c_}]`,
      ({ type: t, target: e }) => {
        const i = h.find(
          `[${a_}]`,
          this._modal
        ), n = h.find(
          `[${l_}]`,
          this._modal
        ), o = (l, c) => l.forEach((d) => {
          if (c) {
            p.addClass(d, this._classes.opacity), d.setAttribute(B, "");
            return;
          }
          p.removeClass(d, this._classes.opacity), d.removeAttribute(B);
        }), a = e.hasAttribute(zi) ? i : n;
        o(a, t === "mouseover");
      }
    );
  }
  _handleDocumentClickInline() {
    u.on(document, Dr, ({ target: t }) => {
      if (this._modal && !this._modal.contains(t) && !t.hasAttribute(r_)) {
        if (clearInterval(this._interval), p.addStyle(this.elementToggle, {
          pointerEvents: "auto"
        }), this._removeModal(), !this._animations)
          return;
        this._toggleBackdropAnimation(!0);
      }
    });
  }
  _handleSwitchHourMinute() {
    Qf(
      "click",
      Ki,
      this._classes
    ), u.on(
      this._modal,
      "click",
      Ki,
      () => {
        const { format24: t } = this._options, e = h.find(
          Ki,
          this._modal
        ), i = h.find(
          `[${X}]`,
          this._modal
        ), n = h.find(
          `[${K}]`,
          this._modal
        ), o = h.find(
          `[${at}]`,
          this._modal
        ), r = Number(this._hour.textContent), a = Number(this._minutes.textContent), l = (c, d) => {
          n.forEach((f) => f.remove()), i.forEach((f) => f.remove()), p.addClass(this._hand, this._classes.transform), setTimeout(() => {
            p.removeClass(this._hand, this._classes.transform);
          }, 401), this._getAppendClock(c, `[${le}]`, d);
          const _ = () => {
            const f = h.find(
              `[${K}]`,
              this._modal
            ), m = h.find(
              `[${X}]`,
              this._modal
            );
            this._addActiveClassToTip(f, r), this._addActiveClassToTip(m, a);
          };
          if (!t)
            setTimeout(() => {
              _();
            }, 401);
          else {
            const f = h.find(
              `[${at}]`,
              this._modal
            );
            setTimeout(() => {
              this._addActiveClassToTip(f, r), _();
            }, 401);
          }
        };
        e.forEach((c) => {
          c.hasAttribute(B) && (c.hasAttribute(En) ? (p.addClass(this._hand, this._classes.transform), p.addStyle(this._hand, {
            transform: `rotateZ(${this._minutes.textContent * 6}deg)`,
            height: "calc(40% + 1px)"
          }), t && o.length > 0 && o.forEach((d) => d.remove()), l(
            this.minutesArray,
            X
          ), this._hour.style.pointerEvents = "", this._minutes.style.pointerEvents = "none") : c.hasAttribute(zi) && (p.addStyle(this._hand, {
            transform: `rotateZ(${this._hour.textContent * 30}deg)`
          }), Number(this._hour.textContent) > 12 ? (p.addStyle(this._hand, {
            transform: `rotateZ(${this._hour.textContent * 30 - 360}deg)`,
            height: "21.5%"
          }), Number(this._hour.textContent) > 12 && p.addStyle(this._hand, {
            height: "21.5%"
          })) : p.addStyle(this._hand, {
            height: "calc(40% + 1px)"
          }), t && this._getAppendClock(
            this.innerHours,
            `[${Je}]`,
            at
          ), o.length > 0 && o.forEach((d) => d.remove()), l(
            this.hoursArray,
            K
          ), p.addStyle(this._hour, {
            pointerEvents: "none"
          }), p.addStyle(this._minutes, {
            pointerEvents: ""
          })));
        });
      }
    );
  }
  _handleDisablingTipsMaxTime(t, e, i, n) {
    if (!this._options.maxTime && !this._options.disableFuture)
      return;
    const o = h.find(
      `[${K}]`
    ), r = h.find(
      `[${at}]`
    ), a = h.find(
      `[${X}]`
    );
    if (!e || e === t) {
      Or(
        r,
        n,
        this._classes,
        this._options.format12
      ), Or(
        o,
        n,
        this._classes,
        this._options.format12
      ), Jf(
        a,
        i,
        n,
        this._hour.textContent,
        this._classes,
        this._options.format12
      );
      return;
    }
    e === "AM" && t === "PM" && (o.forEach((l) => {
      p.addClass(l, this._classes.tipsDisabled), l.setAttribute(Bt, "");
    }), a.forEach((l) => {
      p.addClass(l, this._classes.tipsDisabled), l.setAttribute(Bt, "");
    }));
  }
  _handleDisablingTipsMinTime(t, e, i, n) {
    if (!this._options.minTime && !this._options.disablePast)
      return;
    const o = h.find(
      `[${K}]`
    ), r = h.find(
      `[${at}]`
    ), a = h.find(
      `[${X}]`
    );
    !e || e === t ? (xr(
      o,
      n,
      this._classes,
      this._options.format12
    ), xr(
      r,
      n,
      this._classes,
      this._options.format12
    ), t_(
      a,
      i,
      n,
      this._hour.textContent,
      this._classes,
      this._options.format12
    )) : e === "PM" && t === "AM" && (o.forEach((l) => {
      p.addClass(l, this._classes.tipsDisabled), l.setAttribute(Bt, "");
    }), a.forEach((l) => {
      p.addClass(l, this._classes.tipsDisabled), l.setAttribute(Bt, "");
    }));
  }
  _handleSwitchTimeMode() {
    u.on(
      document,
      "click",
      Ui,
      ({ target: t }) => {
        let { maxTime: e, minTime: i } = this._options;
        const { disablePast: n, disableFuture: o, format12: r } = this._options;
        i = jt(i, n, r), e = Kt(e, o, r);
        const [a, l, c] = R(
          e,
          !1
        ), [d, _, f] = R(
          i,
          !1
        ), m = h.find(
          `[${K}]`
        ), g = h.find(
          `[${X}]`
        );
        (() => {
          m.forEach((T) => {
            p.removeClass(T, this._classes.tipsDisabled), T.removeAttribute(Bt);
          }), g.forEach((T) => {
            p.removeClass(T, this._classes.tipsDisabled), T.removeAttribute(Bt);
          });
        })(), this._handleDisablingTipsMinTime(
          t.textContent,
          f,
          _,
          d
        ), this._handleDisablingTipsMaxTime(
          t.textContent,
          c,
          l,
          a
        ), this._toggleAmPm(t.textContent), t.hasAttribute(B) || (h.find(
          Ui
        ).forEach((C) => {
          C.hasAttribute(B) && (p.removeClass(C, this._classes.opacity), C.removeAttribute(B));
        }), p.addClass(t, this._classes.opacity), t.setAttribute(B, ""));
      }
    );
  }
  _handleClockClick() {
    let { maxTime: t, minTime: e } = this._options;
    const { disablePast: i, disableFuture: n, format12: o } = this._options;
    e = jt(e, i, o), t = Kt(t, n, o);
    const r = R(t, !1)[2], a = R(e, !1)[2], l = R(t, !1)[0], c = R(e, !1)[0], d = h.findOne(
      `[${Fr}]`
    );
    ee.on(
      document,
      `${Ir} ${$r} ${Lr} ${Mr} ${Nr} ${Hr} ${Rr} ${Pr}`,
      "",
      (_) => {
        Yi() || _.preventDefault();
        const { type: f, target: m } = _, { closeModalOnMinutesClick: g, switchHoursToMinutesOnClick: b } = this._options, T = h.findOne(
          `[${X}]`,
          this._modal
        ) !== null, C = h.findOne(
          `[${K}]`,
          this._modal
        ) !== null, w = h.findOne(
          `[${at}]`,
          this._modal
        ) !== null, v = h.find(
          `[${X}]`,
          this._modal
        ), E = kr(_, d), A = d.offsetWidth / 2;
        let y = Math.atan2(E.y - A, E.x - A);
        if (Yi()) {
          const D = kr(_, d, !0);
          y = Math.atan2(D.y - A, D.x - A);
        }
        let S = null, O = null, k = null;
        if (f === "mousedown" || f === "mousemove" || f === "touchmove" || f === "touchstart")
          (f === "mousedown" || f === "touchstart" || f === "touchmove") && (this._hasTargetInnerClass(m) || m.hasAttribute(Fr) || m.hasAttribute(le) || m.hasAttribute(X) || m.hasAttribute(K) || m.hasAttribute(Cn) || m.hasAttribute(Tn) || m.hasAttribute(Yr) || m.hasAttribute(Xi)) && (this._isMouseMove = !0, Yi() && _.touches && (S = _.touches[0].clientX, O = _.touches[0].clientY, k = document.elementFromPoint(S, O)));
        else if (f === "mouseup" || f === "touchend") {
          if (this._isMouseMove = !1, this._hasTargetInnerClass(m) || m.hasAttribute(le) || m.hasAttribute(K) || m.hasAttribute(Cn) || m.hasAttribute(Tn) || m.hasAttribute(Yr) || m.hasAttribute(Xi)) {
            if ((C || w) && b) {
              const D = Number(this._hour.textContent) > l || Number(this._hour.textContent) < c;
              if (this._options.format24 && l !== "" && c !== "" && D)
                return;
              if (this._options.format24 && c !== "" && Number(this._hour.textContent) < c)
                return;
            }
            u.trigger(this._minutes, "click");
          }
          if (T && g) {
            const D = h.findOne(
              `[${_n}]`,
              this._modal
            );
            u.trigger(D, "click");
          }
        }
        if (T) {
          let D;
          const x = Math.trunc(y * 180 / Math.PI) + 90, { degrees: $, minute: P } = this._makeMinutesDegrees(x, D);
          if (this._handlerMaxMinMinutesOptions($, P) === void 0)
            return;
          const { degrees: tt, minute: et } = this._handlerMaxMinMinutesOptions($, P);
          if (this._isMouseMove) {
            if (p.addStyle(this._hand, {
              transform: `rotateZ(${tt}deg)`
            }), et === void 0)
              return;
            const z = () => et >= 10 || et === "00" ? et : `0${et}`;
            this._minutes.textContent = z(), this._toggleClassActive(
              this.minutesArray,
              this._minutes,
              v
            ), this._toggleBackgroundColorCircle(
              `[${X}]`
            ), this._objWithDataOnChange.degreesMinutes = tt, this._objWithDataOnChange.minutes = et;
          }
        }
        if (C || w) {
          let D, x = Math.trunc(y * 180 / Math.PI) + 90;
          if (x = Math.round(x / 30) * 30, p.addStyle(this._circle, {
            backgroundColor: "#1976d2"
          }), this._makeHourDegrees(m, x, D) === void 0)
            return;
          const $ = () => {
            if (Yi() && x && k) {
              const { degrees: P, hour: tt } = this._makeHourDegrees(k, x, D);
              return this._handleMoveHand(
                k,
                tt,
                P
              );
            } else {
              const { degrees: P, hour: tt } = this._makeHourDegrees(m, x, D);
              return this._handleMoveHand(m, tt, P);
            }
          };
          this._objWithDataOnChange.degreesHours = x, this._handlerMaxMinHoursOptions(
            x,
            l,
            c,
            r,
            a,
            _
          ) && $();
        }
        _.stopPropagation();
      }
    );
  }
  _hasTargetInnerClass(t) {
    return t.hasAttribute(Je) || t.hasAttribute(at) || t.hasAttribute(Gi);
  }
  _handleMoveHand(t, e, i) {
    const n = h.find(
      `[${K}]`,
      this._modal
    ), o = h.find(
      `[${at}]`,
      this._modal
    );
    this._isMouseMove && (this._hasTargetInnerClass(t) ? p.addStyle(this._hand, {
      height: "21.5%"
    }) : p.addStyle(this._hand, {
      height: "calc(40% + 1px)"
    }), p.addStyle(this._hand, {
      transform: `rotateZ(${i}deg)`
    }), this._hour.textContent = e >= 10 || e === "00" ? e : `0${e}`, this._toggleClassActive(this.hoursArray, this._hour, n), this._toggleClassActive(this.innerHours, this._hour, o), this._objWithDataOnChange.hour = e >= 10 || e === "00" ? e : `0${e}`);
  }
  _handlerMaxMinMinutesOptions(t, e) {
    let { maxTime: i, minTime: n } = this._options;
    const { format12: o, increment: r, disablePast: a, disableFuture: l } = this._options;
    n = jt(n, a, o), i = Kt(i, l, o);
    const c = R(i, !1)[1], d = R(n, !1)[1], _ = R(i, !1)[0], f = R(n, !1)[0], m = f === "12" && o ? "0" : f, g = _ === "12" && o ? "0" : _, b = R(i, !1)[2], T = R(n, !1)[2], C = c !== "" ? c * 6 : "", w = d !== "" ? d * 6 : "", v = Number(this._hour.textContent), E = v === 12 && o ? 0 : v;
    if (!b && !T) {
      if (i !== "" && n !== "") {
        if (Number(g) === E && t > C || Number(m) === E && t < w)
          return t;
      } else if (n !== "" && E <= Number(m)) {
        if (t <= w - 6)
          return t;
      } else if (i !== "" && E >= Number(g) && t >= C + 6)
        return t;
    } else {
      if (n !== "") {
        if (T === "PM" && this._isAmEnabled)
          return;
        if (T === "PM" && this._isPmEnabled) {
          if (E < Number(m))
            return;
          if (E <= Number(m) && t <= w - 6)
            return t;
        } else if (T === "AM" && this._isAmEnabled) {
          if (E < Number(m))
            return;
          if (E <= Number(m) && t <= w - 6)
            return t;
        }
      }
      if (i !== "") {
        if (b === "AM" && this._isPmEnabled)
          return;
        if (b === "PM" && this._isPmEnabled) {
          if (E >= Number(g) && t >= C + 6)
            return t;
        } else if (b === "AM" && this._isAmEnabled && E >= Number(g) && t >= C + 6)
          return t;
      }
    }
    return r && (t = Math.round(t / 30) * 30), t < 0 ? t = 360 + t : t >= 360 && (t = 0), {
      degrees: t,
      minute: e
    };
  }
  _removeModal() {
    this._animations ? setTimeout(() => {
      this._removeModalElements(), this._scrollBar.reset();
    }, 300) : (this._removeModalElements(), this._scrollBar.reset()), ee.off(
      this._document,
      `${Dr} ${ji} ${Ir} ${$r} ${Lr} ${Mr} ${Nr} ${Hr} ${Rr} ${Pr}`
    ), u.off(window, ji);
  }
  _removeModalElements() {
    this._modal && this._modal.remove();
  }
  _toggleBackdropAnimation(t = !1) {
    t ? this._wrapper.classList.add("animate-[fade-out_350ms_ease-in-out]") : (this._wrapper.classList.add("animate-[fade-in_350ms_ease-in-out]"), this._options.inline || p.addClass(this._clock, this._classes.clockAnimation)), setTimeout(() => {
      this._wrapper.classList.remove(
        "animate-[fade-out_350ms_ease-in-out]",
        "animate-[fade-in_350ms_ease-in-out]"
      );
    }, 351);
  }
  _addActiveClassToTip(t, e) {
    t.forEach((i) => {
      Number(i.textContent) === Number(e) && (p.addClass(i, this._classes.tipsActive), i.setAttribute(B, ""));
    });
  }
  _setHourOrMinute(t) {
    return t < 10 ? `0${t}` : t;
  }
  _appendTimes() {
    const { format24: t } = this._options;
    if (t) {
      this._getAppendClock(
        this.hoursArray,
        `[${le}]`,
        K
      ), this._getAppendClock(
        this.innerHours,
        `[${Je}]`,
        at
      );
      return;
    }
    this._getAppendClock(
      this.hoursArray,
      `[${le}]`,
      K
    );
  }
  _getConfig(t) {
    const e = p.getDataAttributes(this._element);
    return t = {
      ...p_,
      ...e,
      ...t
    }, N(hi, t, f_), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...__,
      ...e,
      ...t
    }, N(hi, t, m_), t;
  }
  _getContainer() {
    return h.findOne(this._options.container);
  }
  _getValidate(t) {
    const { invalidLabel: e, format24: i, format12: n, appendValidationInfo: o } = this._options;
    let r;
    o && (r = M("div"), r.setAttribute(Wr, ""), r.innerHTML = e), ee.on(this.input, t, ({ target: a }) => {
      if (this._options === null || this.input.value === "")
        return;
      const l = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/, c = /^([01]\d|2[0-3])(:[0-5]\d)$/, d = l.test(a.value);
      if (c.test(a.value) !== !0 && i || d !== !0 && n) {
        o && (this.input.setAttribute(bn, ""), this.input.parentNode.insertBefore(
          r,
          this.input.nextSibling
        )), p.addStyle(a, { marginBottom: 0 }), p.addStyle(r, { bottom: "-23px" }), this._isInvalidTimeFormat = !0;
        return;
      }
      this.input.removeAttribute(bn), this._isInvalidTimeFormat = !1;
      const f = h.findOne(
        `[${Wr}]`
      );
      f !== null && f.remove();
    });
  }
  // Static
  static getInstance(t) {
    return I.getData(t, _s);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
/*!
 * perfect-scrollbar v1.5.3
 * Copyright 2021 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */
function xt(s) {
  return getComputedStyle(s);
}
function ot(s, t) {
  for (var e in t) {
    var i = t[e];
    typeof i == "number" && (i = i + "px"), s.style[e] = i;
  }
  return s;
}
function qi(s) {
  var t = document.createElement("div");
  return t.className = s, t;
}
var Kr = typeof Element < "u" && (Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);
function zt(s, t) {
  if (!Kr)
    throw new Error("No element matching method supported");
  return Kr.call(s, t);
}
function Se(s) {
  s.remove ? s.remove() : s.parentNode && s.parentNode.removeChild(s);
}
function Ur(s, t) {
  return Array.prototype.filter.call(
    s.children,
    function(e) {
      return zt(e, t);
    }
  );
}
var j = {
  main: "ps",
  rtl: "ps__rtl",
  element: {
    thumb: function(s) {
      return "ps__thumb-" + s;
    },
    rail: function(s) {
      return "ps__rail-" + s;
    },
    consuming: "ps__child--consume"
  },
  state: {
    focus: "ps--focus",
    clicking: "ps--clicking",
    active: function(s) {
      return "ps--active-" + s;
    },
    scrolling: function(s) {
      return "ps--scrolling-" + s;
    }
  }
}, yl = { x: null, y: null };
function wl(s, t) {
  var e = s.element.classList, i = j.state.scrolling(t);
  e.contains(i) ? clearTimeout(yl[t]) : e.add(i);
}
function kl(s, t) {
  yl[t] = setTimeout(
    function() {
      return s.isAlive && s.element.classList.remove(j.state.scrolling(t));
    },
    s.settings.scrollingThreshold
  );
}
function g_(s, t) {
  wl(s, t), kl(s, t);
}
var Ei = function(t) {
  this.element = t, this.handlers = {};
}, Ol = { isEmpty: { configurable: !0 } };
Ei.prototype.bind = function(t, e) {
  typeof this.handlers[t] > "u" && (this.handlers[t] = []), this.handlers[t].push(e), this.element.addEventListener(t, e, !1);
};
Ei.prototype.unbind = function(t, e) {
  var i = this;
  this.handlers[t] = this.handlers[t].filter(function(n) {
    return e && n !== e ? !0 : (i.element.removeEventListener(t, n, !1), !1);
  });
};
Ei.prototype.unbindAll = function() {
  for (var t in this.handlers)
    this.unbind(t);
};
Ol.isEmpty.get = function() {
  var s = this;
  return Object.keys(this.handlers).every(
    function(t) {
      return s.handlers[t].length === 0;
    }
  );
};
Object.defineProperties(Ei.prototype, Ol);
var Ue = function() {
  this.eventElements = [];
};
Ue.prototype.eventElement = function(t) {
  var e = this.eventElements.filter(function(i) {
    return i.element === t;
  })[0];
  return e || (e = new Ei(t), this.eventElements.push(e)), e;
};
Ue.prototype.bind = function(t, e, i) {
  this.eventElement(t).bind(e, i);
};
Ue.prototype.unbind = function(t, e, i) {
  var n = this.eventElement(t);
  n.unbind(e, i), n.isEmpty && this.eventElements.splice(this.eventElements.indexOf(n), 1);
};
Ue.prototype.unbindAll = function() {
  this.eventElements.forEach(function(t) {
    return t.unbindAll();
  }), this.eventElements = [];
};
Ue.prototype.once = function(t, e, i) {
  var n = this.eventElement(t), o = function(r) {
    n.unbind(e, o), i(r);
  };
  n.bind(e, o);
};
function Qi(s) {
  if (typeof window.CustomEvent == "function")
    return new CustomEvent(s);
  var t = document.createEvent("CustomEvent");
  return t.initCustomEvent(s, !1, !1, void 0), t;
}
function ys(s, t, e, i, n) {
  i === void 0 && (i = !0), n === void 0 && (n = !1);
  var o;
  if (t === "top")
    o = [
      "contentHeight",
      "containerHeight",
      "scrollTop",
      "y",
      "up",
      "down"
    ];
  else if (t === "left")
    o = [
      "contentWidth",
      "containerWidth",
      "scrollLeft",
      "x",
      "left",
      "right"
    ];
  else
    throw new Error("A proper axis should be provided");
  b_(s, e, o, i, n);
}
function b_(s, t, e, i, n) {
  var o = e[0], r = e[1], a = e[2], l = e[3], c = e[4], d = e[5];
  i === void 0 && (i = !0), n === void 0 && (n = !1);
  var _ = s.element;
  s.reach[l] = null, _[a] < 1 && (s.reach[l] = "start"), _[a] > s[o] - s[r] - 1 && (s.reach[l] = "end"), t && (_.dispatchEvent(Qi("ps-scroll-" + l)), t < 0 ? _.dispatchEvent(Qi("ps-scroll-" + c)) : t > 0 && _.dispatchEvent(Qi("ps-scroll-" + d)), i && g_(s, l)), s.reach[l] && (t || n) && _.dispatchEvent(Qi("ps-" + l + "-reach-" + s.reach[l]));
}
function W(s) {
  return parseInt(s, 10) || 0;
}
function v_(s) {
  return zt(s, "input,[contenteditable]") || zt(s, "select,[contenteditable]") || zt(s, "textarea,[contenteditable]") || zt(s, "button,[contenteditable]");
}
function E_(s) {
  var t = xt(s);
  return W(t.width) + W(t.paddingLeft) + W(t.paddingRight) + W(t.borderLeftWidth) + W(t.borderRightWidth);
}
var ke = {
  isWebKit: typeof document < "u" && "WebkitAppearance" in document.documentElement.style,
  supportsTouch: typeof window < "u" && ("ontouchstart" in window || "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints > 0 || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: typeof navigator < "u" && navigator.msMaxTouchPoints,
  isChrome: typeof navigator < "u" && /Chrome/i.test(navigator && navigator.userAgent)
};
function Mt(s) {
  var t = s.element, e = Math.floor(t.scrollTop), i = t.getBoundingClientRect();
  s.containerWidth = Math.round(i.width), s.containerHeight = Math.round(i.height), s.contentWidth = t.scrollWidth, s.contentHeight = t.scrollHeight, t.contains(s.scrollbarXRail) || (Ur(t, j.element.rail("x")).forEach(
    function(n) {
      return Se(n);
    }
  ), t.appendChild(s.scrollbarXRail)), t.contains(s.scrollbarYRail) || (Ur(t, j.element.rail("y")).forEach(
    function(n) {
      return Se(n);
    }
  ), t.appendChild(s.scrollbarYRail)), !s.settings.suppressScrollX && s.containerWidth + s.settings.scrollXMarginOffset < s.contentWidth ? (s.scrollbarXActive = !0, s.railXWidth = s.containerWidth - s.railXMarginWidth, s.railXRatio = s.containerWidth / s.railXWidth, s.scrollbarXWidth = zr(
    s,
    W(s.railXWidth * s.containerWidth / s.contentWidth)
  ), s.scrollbarXLeft = W(
    (s.negativeScrollAdjustment + t.scrollLeft) * (s.railXWidth - s.scrollbarXWidth) / (s.contentWidth - s.containerWidth)
  )) : s.scrollbarXActive = !1, !s.settings.suppressScrollY && s.containerHeight + s.settings.scrollYMarginOffset < s.contentHeight ? (s.scrollbarYActive = !0, s.railYHeight = s.containerHeight - s.railYMarginHeight, s.railYRatio = s.containerHeight / s.railYHeight, s.scrollbarYHeight = zr(
    s,
    W(s.railYHeight * s.containerHeight / s.contentHeight)
  ), s.scrollbarYTop = W(
    e * (s.railYHeight - s.scrollbarYHeight) / (s.contentHeight - s.containerHeight)
  )) : s.scrollbarYActive = !1, s.scrollbarXLeft >= s.railXWidth - s.scrollbarXWidth && (s.scrollbarXLeft = s.railXWidth - s.scrollbarXWidth), s.scrollbarYTop >= s.railYHeight - s.scrollbarYHeight && (s.scrollbarYTop = s.railYHeight - s.scrollbarYHeight), T_(t, s), s.scrollbarXActive ? t.classList.add(j.state.active("x")) : (t.classList.remove(j.state.active("x")), s.scrollbarXWidth = 0, s.scrollbarXLeft = 0, t.scrollLeft = s.isRtl === !0 ? s.contentWidth : 0), s.scrollbarYActive ? t.classList.add(j.state.active("y")) : (t.classList.remove(j.state.active("y")), s.scrollbarYHeight = 0, s.scrollbarYTop = 0, t.scrollTop = 0);
}
function zr(s, t) {
  return s.settings.minScrollbarLength && (t = Math.max(t, s.settings.minScrollbarLength)), s.settings.maxScrollbarLength && (t = Math.min(t, s.settings.maxScrollbarLength)), t;
}
function T_(s, t) {
  var e = { width: t.railXWidth }, i = Math.floor(s.scrollTop);
  t.isRtl ? e.left = t.negativeScrollAdjustment + s.scrollLeft + t.containerWidth - t.contentWidth : e.left = s.scrollLeft, t.isScrollbarXUsingBottom ? e.bottom = t.scrollbarXBottom - i : e.top = t.scrollbarXTop + i, ot(t.scrollbarXRail, e);
  var n = { top: i, height: t.railYHeight };
  t.isScrollbarYUsingRight ? t.isRtl ? n.right = t.contentWidth - (t.negativeScrollAdjustment + s.scrollLeft) - t.scrollbarYRight - t.scrollbarYOuterWidth - 9 : n.right = t.scrollbarYRight - s.scrollLeft : t.isRtl ? n.left = t.negativeScrollAdjustment + s.scrollLeft + t.containerWidth * 2 - t.contentWidth - t.scrollbarYLeft - t.scrollbarYOuterWidth : n.left = t.scrollbarYLeft + s.scrollLeft, ot(t.scrollbarYRail, n), ot(t.scrollbarX, {
    left: t.scrollbarXLeft,
    width: t.scrollbarXWidth - t.railBorderXWidth
  }), ot(t.scrollbarY, {
    top: t.scrollbarYTop,
    height: t.scrollbarYHeight - t.railBorderYWidth
  });
}
function C_(s) {
  s.element, s.event.bind(s.scrollbarY, "mousedown", function(t) {
    return t.stopPropagation();
  }), s.event.bind(s.scrollbarYRail, "mousedown", function(t) {
    var e = t.pageY - window.pageYOffset - s.scrollbarYRail.getBoundingClientRect().top, i = e > s.scrollbarYTop ? 1 : -1;
    s.element.scrollTop += i * s.containerHeight, Mt(s), t.stopPropagation();
  }), s.event.bind(s.scrollbarX, "mousedown", function(t) {
    return t.stopPropagation();
  }), s.event.bind(s.scrollbarXRail, "mousedown", function(t) {
    var e = t.pageX - window.pageXOffset - s.scrollbarXRail.getBoundingClientRect().left, i = e > s.scrollbarXLeft ? 1 : -1;
    s.element.scrollLeft += i * s.containerWidth, Mt(s), t.stopPropagation();
  });
}
function A_(s) {
  Xr(s, [
    "containerWidth",
    "contentWidth",
    "pageX",
    "railXWidth",
    "scrollbarX",
    "scrollbarXWidth",
    "scrollLeft",
    "x",
    "scrollbarXRail"
  ]), Xr(s, [
    "containerHeight",
    "contentHeight",
    "pageY",
    "railYHeight",
    "scrollbarY",
    "scrollbarYHeight",
    "scrollTop",
    "y",
    "scrollbarYRail"
  ]);
}
function Xr(s, t) {
  var e = t[0], i = t[1], n = t[2], o = t[3], r = t[4], a = t[5], l = t[6], c = t[7], d = t[8], _ = s.element, f = null, m = null, g = null;
  function b(w) {
    w.touches && w.touches[0] && (w[n] = w.touches[0].pageY), _[l] = f + g * (w[n] - m), wl(s, c), Mt(s), w.stopPropagation(), w.type.startsWith("touch") && w.changedTouches.length > 1 && w.preventDefault();
  }
  function T() {
    kl(s, c), s[d].classList.remove(j.state.clicking), s.event.unbind(s.ownerDocument, "mousemove", b);
  }
  function C(w, v) {
    f = _[l], v && w.touches && (w[n] = w.touches[0].pageY), m = w[n], g = (s[i] - s[e]) / (s[o] - s[a]), v ? s.event.bind(s.ownerDocument, "touchmove", b) : (s.event.bind(s.ownerDocument, "mousemove", b), s.event.once(s.ownerDocument, "mouseup", T), w.preventDefault()), s[d].classList.add(j.state.clicking), w.stopPropagation();
  }
  s.event.bind(s[r], "mousedown", function(w) {
    C(w);
  }), s.event.bind(s[r], "touchstart", function(w) {
    C(w, !0);
  });
}
function y_(s) {
  var t = s.element, e = function() {
    return zt(t, ":hover");
  }, i = function() {
    return zt(s.scrollbarX, ":focus") || zt(s.scrollbarY, ":focus");
  };
  function n(o, r) {
    var a = Math.floor(t.scrollTop);
    if (o === 0) {
      if (!s.scrollbarYActive)
        return !1;
      if (a === 0 && r > 0 || a >= s.contentHeight - s.containerHeight && r < 0)
        return !s.settings.wheelPropagation;
    }
    var l = t.scrollLeft;
    if (r === 0) {
      if (!s.scrollbarXActive)
        return !1;
      if (l === 0 && o < 0 || l >= s.contentWidth - s.containerWidth && o > 0)
        return !s.settings.wheelPropagation;
    }
    return !0;
  }
  s.event.bind(s.ownerDocument, "keydown", function(o) {
    if (!(o.isDefaultPrevented && o.isDefaultPrevented() || o.defaultPrevented) && !(!e() && !i())) {
      var r = document.activeElement ? document.activeElement : s.ownerDocument.activeElement;
      if (r) {
        if (r.tagName === "IFRAME")
          r = r.contentDocument.activeElement;
        else
          for (; r.shadowRoot; )
            r = r.shadowRoot.activeElement;
        if (v_(r))
          return;
      }
      var a = 0, l = 0;
      switch (o.which) {
        case 37:
          o.metaKey ? a = -s.contentWidth : o.altKey ? a = -s.containerWidth : a = -30;
          break;
        case 38:
          o.metaKey ? l = s.contentHeight : o.altKey ? l = s.containerHeight : l = 30;
          break;
        case 39:
          o.metaKey ? a = s.contentWidth : o.altKey ? a = s.containerWidth : a = 30;
          break;
        case 40:
          o.metaKey ? l = -s.contentHeight : o.altKey ? l = -s.containerHeight : l = -30;
          break;
        case 32:
          o.shiftKey ? l = s.containerHeight : l = -s.containerHeight;
          break;
        case 33:
          l = s.containerHeight;
          break;
        case 34:
          l = -s.containerHeight;
          break;
        case 36:
          l = s.contentHeight;
          break;
        case 35:
          l = -s.contentHeight;
          break;
        default:
          return;
      }
      s.settings.suppressScrollX && a !== 0 || s.settings.suppressScrollY && l !== 0 || (t.scrollTop -= l, t.scrollLeft += a, Mt(s), n(a, l) && o.preventDefault());
    }
  });
}
function w_(s) {
  var t = s.element;
  function e(r, a) {
    var l = Math.floor(t.scrollTop), c = t.scrollTop === 0, d = l + t.offsetHeight === t.scrollHeight, _ = t.scrollLeft === 0, f = t.scrollLeft + t.offsetWidth === t.scrollWidth, m;
    return Math.abs(a) > Math.abs(r) ? m = c || d : m = _ || f, m ? !s.settings.wheelPropagation : !0;
  }
  function i(r) {
    var a = r.deltaX, l = -1 * r.deltaY;
    return (typeof a > "u" || typeof l > "u") && (a = -1 * r.wheelDeltaX / 6, l = r.wheelDeltaY / 6), r.deltaMode && r.deltaMode === 1 && (a *= 10, l *= 10), a !== a && l !== l && (a = 0, l = r.wheelDelta), r.shiftKey ? [-l, -a] : [a, l];
  }
  function n(r, a, l) {
    if (!ke.isWebKit && t.querySelector("select:focus"))
      return !0;
    if (!t.contains(r))
      return !1;
    for (var c = r; c && c !== t; ) {
      if (c.classList.contains(j.element.consuming))
        return !0;
      var d = xt(c);
      if (l && d.overflowY.match(/(scroll|auto)/)) {
        var _ = c.scrollHeight - c.clientHeight;
        if (_ > 0 && (c.scrollTop > 0 && l < 0 || c.scrollTop < _ && l > 0))
          return !0;
      }
      if (a && d.overflowX.match(/(scroll|auto)/)) {
        var f = c.scrollWidth - c.clientWidth;
        if (f > 0 && (c.scrollLeft > 0 && a < 0 || c.scrollLeft < f && a > 0))
          return !0;
      }
      c = c.parentNode;
    }
    return !1;
  }
  function o(r) {
    var a = i(r), l = a[0], c = a[1];
    if (!n(r.target, l, c)) {
      var d = !1;
      s.settings.useBothWheelAxes ? s.scrollbarYActive && !s.scrollbarXActive ? (c ? t.scrollTop -= c * s.settings.wheelSpeed : t.scrollTop += l * s.settings.wheelSpeed, d = !0) : s.scrollbarXActive && !s.scrollbarYActive && (l ? t.scrollLeft += l * s.settings.wheelSpeed : t.scrollLeft -= c * s.settings.wheelSpeed, d = !0) : (t.scrollTop -= c * s.settings.wheelSpeed, t.scrollLeft += l * s.settings.wheelSpeed), Mt(s), d = d || e(l, c), d && !r.ctrlKey && (r.stopPropagation(), r.preventDefault());
    }
  }
  typeof window.onwheel < "u" ? s.event.bind(t, "wheel", o) : typeof window.onmousewheel < "u" && s.event.bind(t, "mousewheel", o);
}
function k_(s) {
  if (!ke.supportsTouch && !ke.supportsIePointer)
    return;
  var t = s.element;
  function e(g, b) {
    var T = Math.floor(t.scrollTop), C = t.scrollLeft, w = Math.abs(g), v = Math.abs(b);
    if (v > w) {
      if (b < 0 && T === s.contentHeight - s.containerHeight || b > 0 && T === 0)
        return window.scrollY === 0 && b > 0 && ke.isChrome;
    } else if (w > v && (g < 0 && C === s.contentWidth - s.containerWidth || g > 0 && C === 0))
      return !0;
    return !0;
  }
  function i(g, b) {
    t.scrollTop -= b, t.scrollLeft -= g, Mt(s);
  }
  var n = {}, o = 0, r = {}, a = null;
  function l(g) {
    return g.targetTouches ? g.targetTouches[0] : g;
  }
  function c(g) {
    return g.pointerType && g.pointerType === "pen" && g.buttons === 0 ? !1 : !!(g.targetTouches && g.targetTouches.length === 1 || g.pointerType && g.pointerType !== "mouse" && g.pointerType !== g.MSPOINTER_TYPE_MOUSE);
  }
  function d(g) {
    if (c(g)) {
      var b = l(g);
      n.pageX = b.pageX, n.pageY = b.pageY, o = (/* @__PURE__ */ new Date()).getTime(), a !== null && clearInterval(a);
    }
  }
  function _(g, b, T) {
    if (!t.contains(g))
      return !1;
    for (var C = g; C && C !== t; ) {
      if (C.classList.contains(j.element.consuming))
        return !0;
      var w = xt(C);
      if (T && w.overflowY.match(/(scroll|auto)/)) {
        var v = C.scrollHeight - C.clientHeight;
        if (v > 0 && (C.scrollTop > 0 && T < 0 || C.scrollTop < v && T > 0))
          return !0;
      }
      if (b && w.overflowX.match(/(scroll|auto)/)) {
        var E = C.scrollWidth - C.clientWidth;
        if (E > 0 && (C.scrollLeft > 0 && b < 0 || C.scrollLeft < E && b > 0))
          return !0;
      }
      C = C.parentNode;
    }
    return !1;
  }
  function f(g) {
    if (c(g)) {
      var b = l(g), T = { pageX: b.pageX, pageY: b.pageY }, C = T.pageX - n.pageX, w = T.pageY - n.pageY;
      if (_(g.target, C, w))
        return;
      i(C, w), n = T;
      var v = (/* @__PURE__ */ new Date()).getTime(), E = v - o;
      E > 0 && (r.x = C / E, r.y = w / E, o = v), e(C, w) && g.preventDefault();
    }
  }
  function m() {
    s.settings.swipeEasing && (clearInterval(a), a = setInterval(function() {
      if (s.isInitialized) {
        clearInterval(a);
        return;
      }
      if (!r.x && !r.y) {
        clearInterval(a);
        return;
      }
      if (Math.abs(r.x) < 0.01 && Math.abs(r.y) < 0.01) {
        clearInterval(a);
        return;
      }
      if (!s.element) {
        clearInterval(a);
        return;
      }
      i(r.x * 30, r.y * 30), r.x *= 0.8, r.y *= 0.8;
    }, 10));
  }
  ke.supportsTouch ? (s.event.bind(t, "touchstart", d), s.event.bind(t, "touchmove", f), s.event.bind(t, "touchend", m)) : ke.supportsIePointer && (window.PointerEvent ? (s.event.bind(t, "pointerdown", d), s.event.bind(t, "pointermove", f), s.event.bind(t, "pointerup", m)) : window.MSPointerEvent && (s.event.bind(t, "MSPointerDown", d), s.event.bind(t, "MSPointerMove", f), s.event.bind(t, "MSPointerUp", m)));
}
var O_ = function() {
  return {
    handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1e3,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: !1,
    suppressScrollY: !1,
    swipeEasing: !0,
    useBothWheelAxes: !1,
    wheelPropagation: !0,
    wheelSpeed: 1
  };
}, x_ = {
  "click-rail": C_,
  "drag-thumb": A_,
  keyboard: y_,
  wheel: w_,
  touch: k_
}, Ti = function(t, e) {
  var i = this;
  if (e === void 0 && (e = {}), typeof t == "string" && (t = document.querySelector(t)), !t || !t.nodeName)
    throw new Error("no element is specified to initialize PerfectScrollbar");
  this.element = t, t.classList.add(j.main), this.settings = O_();
  for (var n in e)
    this.settings[n] = e[n];
  this.containerWidth = null, this.containerHeight = null, this.contentWidth = null, this.contentHeight = null;
  var o = function() {
    return t.classList.add(j.state.focus);
  }, r = function() {
    return t.classList.remove(j.state.focus);
  };
  this.isRtl = xt(t).direction === "rtl", this.isRtl === !0 && t.classList.add(j.rtl), this.isNegativeScroll = function() {
    var c = t.scrollLeft, d = null;
    return t.scrollLeft = -1, d = t.scrollLeft < 0, t.scrollLeft = c, d;
  }(), this.negativeScrollAdjustment = this.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, this.event = new Ue(), this.ownerDocument = t.ownerDocument || document, this.scrollbarXRail = qi(j.element.rail("x")), t.appendChild(this.scrollbarXRail), this.scrollbarX = qi(j.element.thumb("x")), this.scrollbarXRail.appendChild(this.scrollbarX), this.scrollbarX.setAttribute("tabindex", 0), this.event.bind(this.scrollbarX, "focus", o), this.event.bind(this.scrollbarX, "blur", r), this.scrollbarXActive = null, this.scrollbarXWidth = null, this.scrollbarXLeft = null;
  var a = xt(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(a.bottom, 10), isNaN(this.scrollbarXBottom) ? (this.isScrollbarXUsingBottom = !1, this.scrollbarXTop = W(a.top)) : this.isScrollbarXUsingBottom = !0, this.railBorderXWidth = W(a.borderLeftWidth) + W(a.borderRightWidth), ot(this.scrollbarXRail, { display: "block" }), this.railXMarginWidth = W(a.marginLeft) + W(a.marginRight), ot(this.scrollbarXRail, { display: "" }), this.railXWidth = null, this.railXRatio = null, this.scrollbarYRail = qi(j.element.rail("y")), t.appendChild(this.scrollbarYRail), this.scrollbarY = qi(j.element.thumb("y")), this.scrollbarYRail.appendChild(this.scrollbarY), this.scrollbarY.setAttribute("tabindex", 0), this.event.bind(this.scrollbarY, "focus", o), this.event.bind(this.scrollbarY, "blur", r), this.scrollbarYActive = null, this.scrollbarYHeight = null, this.scrollbarYTop = null;
  var l = xt(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(l.right, 10), isNaN(this.scrollbarYRight) ? (this.isScrollbarYUsingRight = !1, this.scrollbarYLeft = W(l.left)) : this.isScrollbarYUsingRight = !0, this.scrollbarYOuterWidth = this.isRtl ? E_(this.scrollbarY) : null, this.railBorderYWidth = W(l.borderTopWidth) + W(l.borderBottomWidth), ot(this.scrollbarYRail, { display: "block" }), this.railYMarginHeight = W(l.marginTop) + W(l.marginBottom), ot(this.scrollbarYRail, { display: "" }), this.railYHeight = null, this.railYRatio = null, this.reach = {
    x: t.scrollLeft <= 0 ? "start" : t.scrollLeft >= this.contentWidth - this.containerWidth ? "end" : null,
    y: t.scrollTop <= 0 ? "start" : t.scrollTop >= this.contentHeight - this.containerHeight ? "end" : null
  }, this.isAlive = !0, this.settings.handlers.forEach(function(c) {
    return x_[c](i);
  }), this.lastScrollTop = Math.floor(t.scrollTop), this.lastScrollLeft = t.scrollLeft, this.event.bind(this.element, "scroll", function(c) {
    return i.onScroll(c);
  }), Mt(this);
};
Ti.prototype.update = function() {
  this.isAlive && (this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0, ot(this.scrollbarXRail, { display: "block" }), ot(this.scrollbarYRail, { display: "block" }), this.railXMarginWidth = W(xt(this.scrollbarXRail).marginLeft) + W(xt(this.scrollbarXRail).marginRight), this.railYMarginHeight = W(xt(this.scrollbarYRail).marginTop) + W(xt(this.scrollbarYRail).marginBottom), ot(this.scrollbarXRail, { display: "none" }), ot(this.scrollbarYRail, { display: "none" }), Mt(this), ys(this, "top", 0, !1, !0), ys(this, "left", 0, !1, !0), ot(this.scrollbarXRail, { display: "" }), ot(this.scrollbarYRail, { display: "" }));
};
Ti.prototype.onScroll = function(t) {
  this.isAlive && (Mt(this), ys(this, "top", this.element.scrollTop - this.lastScrollTop), ys(
    this,
    "left",
    this.element.scrollLeft - this.lastScrollLeft
  ), this.lastScrollTop = Math.floor(this.element.scrollTop), this.lastScrollLeft = this.element.scrollLeft);
};
Ti.prototype.destroy = function() {
  this.isAlive && (this.event.unbindAll(), Se(this.scrollbarX), Se(this.scrollbarY), Se(this.scrollbarXRail), Se(this.scrollbarYRail), this.removePsClasses(), this.element = null, this.scrollbarX = null, this.scrollbarY = null, this.scrollbarXRail = null, this.scrollbarYRail = null, this.isAlive = !1);
};
Ti.prototype.removePsClasses = function() {
  this.element.className = this.element.className.split(" ").filter(function(t) {
    return !t.match(/^ps([-_].+|)$/);
  }).join(" ");
};
const S_ = {
  threshold: 10,
  direction: "all"
};
class D_ {
  constructor(t, e) {
    this._element = t, this._startPosition = null, this._options = {
      ...S_,
      ...e
    };
  }
  handleTouchStart(t) {
    this._startPosition = this._getCoordinates(t);
  }
  handleTouchMove(t) {
    if (!this._startPosition)
      return;
    const e = this._getCoordinates(t), i = {
      x: e.x - this._startPosition.x,
      y: e.y - this._startPosition.y
    }, n = this._getDirection(i);
    if (this._options.direction === "all") {
      if (n.y.value < this._options.threshold && n.x.value < this._options.threshold)
        return;
      const r = n.y.value > n.x.value ? n.y.direction : n.x.direction;
      u.trigger(this._element, `swipe${r}`), u.trigger(this._element, "swipe", { direction: r }), this._startPosition = null;
      return;
    }
    const o = this._options.direction === "left" || this._options === "right" ? "x" : "y";
    n[o].direction === this._options.direction && n[o].value > this._options.threshold && (u.trigger(this._element, `swipe${n[o].direction}`), this._startPosition = null);
  }
  handleTouchEnd() {
    this._startPosition = null;
  }
  _getCoordinates(t) {
    const [e] = t.touches;
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
  _getDirection(t) {
    return {
      x: {
        direction: t.x < 0 ? "left" : "right",
        value: Math.abs(t.x)
      },
      y: {
        direction: t.y < 0 ? "up" : "down",
        value: Math.abs(t.y)
      }
    };
  }
}
class I_ {
  constructor(t, e = "swipe", i = {}) {
    this._element = t, this._event = e, this.swipe = new D_(t, i), this._touchStartHandler = this._handleTouchStart.bind(this), this._touchMoveHandler = this._handleTouchMove.bind(this), this._touchEndHandler = this._handleTouchEnd.bind(this);
  }
  dispose() {
    this._element.removeEventListener("touchstart", this._touchStartHandler), this._element.removeEventListener("touchmove", this._touchMoveHandler), window.removeEventListener("touchend", this._touchEndHandler);
  }
  init() {
    this._element.addEventListener(
      "touchstart",
      (t) => this._handleTouchStart(t)
    ), this._element.addEventListener(
      "touchmove",
      (t) => this._handleTouchMove(t)
    ), window.addEventListener("touchend", (t) => this._handleTouchEnd(t));
  }
  _handleTouchStart(t) {
    this[this._event].handleTouchStart(t);
  }
  _handleTouchMove(t) {
    this[this._event].handleTouchMove(t);
  }
  _handleTouchEnd(t) {
    this[this._event].handleTouchEnd(t);
  }
}
const $_ = "group/ps overflow-hidden [overflow-anchor:none] [overflow-style:none] touch-none", L_ = "group/x absolute bottom-0 !top-auto h-[15px] hidden opacity-0 [transition:background-color_.2s_linear,_opacity_.2s_linear] motion-reduce:transition-none group-[&.ps--active-x]/ps:block group-[&.ps--active-x]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-x]/ps:opacity-60 hover:!opacity-90 hover:bg-[#eee] focus:!opacity-90 focus:bg-[#eee] [&.ps--clicking]:!opacity-90 [&.ps--clicking]:bg-[#eee] outline-none", M_ = "absolute bottom-[2px] rounded-md h-1.5 opacity-0 group-hover/ps:opacity-100 group-focus/ps:opacity-100 group-active/ps:opacity-100 bg-[#aaa] [transition:background-color_.2s_linear,_height_.2s_ease-in-out] group-hover/x:bg-[#999] group-hover/x:h-[11px] group-focus/x:bg-[#999] group-focus/x:h-[11px] group-[&.ps--clicking]/x:bg-[#999] group-[&.ps--clicking]/x:h-[11px] outline-none", N_ = "group/y absolute right-0 !left-auto w-[15px] hidden opacity-0 [transition:background-color_.2s_linear,_opacity_.2s_linear] motion-reduce:transition-none group-[&.ps--active-y]/ps:block group-[&.ps--active-y]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-y]/ps:opacity-60 hover:!opacity-90 hover:bg-[#eee] focus:!opacity-90 focus:bg-[#eee] [&.ps--clicking]:!opacity-90 [&.ps--clicking]:bg-[#eee] outline-none", R_ = "absolute right-[2px] rounded-md w-1.5 opacity-0 group-hover/ps:opacity-100 group-focus/ps:opacity-100 group-active/ps:opacity-100 bg-[#aaa] [transition:background-color_.2s_linear,_width_.2s_ease-in-out] group-hover/y:bg-[#999] group-hover/y:w-[11px] group-focus/y:bg-[#999] group-focus/y:w-[11px] group-[&.ps--clicking]/y:bg-[#999] group-[&.ps--clicking]/y:w-[11px] outline-none", P_ = (s = document) => {
  [
    { ps: "ps__rail-x", te: L_ },
    { ps: "ps__rail-y", te: N_ },
    { ps: "ps__thumb-x", te: M_ },
    { ps: "ps__thumb-y", te: R_ }
  ].forEach((e) => {
    p.addClass(
      h.findOne(`.${e.ps}`, s),
      e.te
    ), p.removeClass(
      h.findOne(`.${e.ps}`, s),
      e.ps
    );
  }), p.addClass(s, $_), p.removeClass(s, "ps");
}, Gr = "sidenav", Zi = "te.sidenav", H_ = "data-te-sidenav-rotate-icon-ref", An = "[data-te-sidenav-toggle-ref]", B_ = "[data-te-collapse-init]", V_ = '[data-te-sidenav-slim="true"]', W_ = '[data-te-sidenav-slim="false"]', F_ = "[data-te-sidenav-menu-ref]", Ce = "[data-te-sidenav-collapse-ref]", ti = "[data-te-sidenav-link-ref]", Y_ = F() ? 100 : -100, j_ = F() ? -100 : 100, K_ = {
  sidenavAccordion: "(boolean)",
  sidenavBackdrop: "(boolean)",
  sidenavBackdropClass: "(null|string)",
  sidenavCloseOnEsc: "(boolean)",
  sidenavColor: "(string)",
  sidenavContent: "(null|string)",
  sidenavExpandable: "(boolean)",
  sidenavExpandOnHover: "(boolean)",
  sidenavFocusTrap: "(boolean)",
  sidenavHidden: "(boolean)",
  sidenavMode: "(string)",
  sidenavModeBreakpointOver: "(null|string|number)",
  sidenavModeBreakpointSide: "(null|string|number)",
  sidenavModeBreakpointPush: "(null|string|number)",
  sidenavBreakpointSm: "(number)",
  sidenavBreakpointMd: "(number)",
  sidenavBreakpointLg: "(number)",
  sidenavBreakpointXl: "(number)",
  sidenavBreakpoint2xl: "(number)",
  sidenavScrollContainer: "(null|string)",
  sidenavSlim: "(boolean)",
  sidenavSlimCollapsed: "(boolean)",
  sidenavSlimWidth: "(number)",
  sidenavPosition: "(string)",
  sidenavRight: "(boolean)",
  sidenavTransitionDuration: "(number)",
  sidenavWidth: "(number)"
}, U_ = {
  sidenavAccordion: !1,
  sidenavBackdrop: !0,
  sidenavBackdropClass: null,
  sidenavCloseOnEsc: !0,
  sidenavColor: "primary",
  sidenavContent: null,
  sidenavExpandable: !0,
  sidenavExpandOnHover: !1,
  sidenavFocusTrap: !0,
  sidenavHidden: !0,
  sidenavMode: "over",
  sidenavModeBreakpointOver: null,
  sidenavModeBreakpointSide: null,
  sidenavModeBreakpointPush: null,
  sidenavBreakpointSm: 640,
  sidenavBreakpointMd: 768,
  sidenavBreakpointLg: 1024,
  sidenavBreakpointXl: 1280,
  sidenavBreakpoint2xl: 1536,
  sidenavScrollContainer: null,
  sidenavSlim: !1,
  sidenavSlimCollapsed: !1,
  sidenavSlimWidth: 77,
  sidenavPosition: "fixed",
  sidenavRight: !1,
  sidenavTransitionDuration: 300,
  sidenavWidth: 240
};
class ni {
  constructor(t, e = {}) {
    Tt(this, "_addBackdropOnInit", () => {
      this._options.sidenavHidden || (this._backdrop.show(), u.off(this._element, "transitionend", this._addBackdropOnInit));
    });
    this._element = t, this._options = e, this._ID = Ot(""), this._content = null, this._initialContentStyle = null, this._slimCollapsed = !1, this._activeNode = null, this._tempSlim = !1, this._backdrop = this._initializeBackDrop(), this._focusTrap = null, this._perfectScrollbar = null, this._touch = null, this._setModeFromBreakpoints(), this.escHandler = (i) => {
      i.keyCode === Is && this.toggler && St(this.toggler) && (this._update(!1), u.off(window, "keydown", this.escHandler));
    }, this.hashHandler = () => {
      this._setActiveElements();
    }, t && (I.setData(t, Zi, this), this._setup()), this.options.sidenavBackdrop && !this.options.sidenavHidden && this.options.sidenavMode === "over" && u.on(this._element, "transitionend", this._addBackdropOnInit), this._didInit = !1, this._init();
  }
  // Getters
  static get NAME() {
    return Gr;
  }
  get container() {
    if (this.options.sidenavPosition === "fixed")
      return h.findOne("body");
    const t = (e) => !e.parentNode || e.parentNode === document ? e : e.parentNode.style.position === "relative" || e.parentNode.classList.contains("relative") ? e.parentNode : t(e.parentNode);
    return t(this._element);
  }
  get isVisible() {
    let t = 0, e = window.innerWidth;
    if (this.options.sidenavPosition !== "fixed") {
      const n = this.container.getBoundingClientRect();
      t = n.x, e = n.x + n.width;
    }
    const { x: i } = this._element.getBoundingClientRect();
    return this.options.sidenavRight ? Math.abs(i - e) > 10 : Math.abs(i - t) < 10;
  }
  get links() {
    return h.find(ti, this._element);
  }
  get navigation() {
    return h.find(F_, this._element);
  }
  get options() {
    const t = {
      ...U_,
      ...p.getDataAttributes(this._element),
      ...this._options
    };
    return N(Gr, t, K_), t;
  }
  get sidenavStyle() {
    return {
      width: `${this.width}px`,
      height: this.options.sidenavPosition === "fixed" ? "100vh" : "100%",
      position: this.options.sidenavPosition,
      transition: `all ${this.transitionDuration} linear`
    };
  }
  get toggler() {
    return h.find(An).find(
      (e) => {
        const i = p.getDataAttribute(e, "target");
        return h.findOne(i) === this._element;
      }
    );
  }
  get transitionDuration() {
    return `${this.options.sidenavTransitionDuration / 1e3}s`;
  }
  get translation() {
    return this.options.sidenavRight ? j_ : Y_;
  }
  get width() {
    return this._slimCollapsed ? this.options.sidenavSlimWidth : this.options.sidenavWidth;
  }
  get isBackdropVisible() {
    return !!this._backdrop._element;
  }
  // Public
  changeMode(t) {
    this._setMode(t);
  }
  dispose() {
    u.off(window, "keydown", this.escHandler), this.options.sidenavBackdrop && this._backdrop.dispose(), u.off(window, "hashchange", this.hashHandler), this._touch.dispose(), I.removeData(this._element, Zi), this._element = null;
  }
  hide() {
    this._emitEvents(!1), this._update(!1), this._options.sidenavBackdrop && this.isBackdropVisible && this._backdrop.hide();
  }
  show() {
    this._emitEvents(!0), this._update(!0), this._options.sidenavBackdrop && this._options.sidenavMode === "over" && this._backdrop.show();
  }
  toggle() {
    this._emitEvents(!this.isVisible), this._update(!this.isVisible);
  }
  toggleSlim() {
    this._setSlim(!this._slimCollapsed);
  }
  update(t) {
    this._options = t, this._setup();
  }
  getBreakpoint(t) {
    return this._transformBreakpointValuesToObject()[t];
  }
  // Private
  _init() {
    this._didInit || (u.on(
      document,
      "click",
      An,
      ni.toggleSidenav()
    ), this._didInit = !0);
  }
  _transformBreakpointValuesToObject() {
    return {
      sm: this.options.sidenavBreakpointSm,
      md: this.options.sidenavBreakpointMd,
      lg: this.options.sidenavBreakpointLg,
      xl: this.options.sidenavBreakpointXl,
      "2xl": this.options.sidenavBreakpoint2xl
    };
  }
  _setModeFromBreakpoints() {
    const t = window.innerWidth, e = this._transformBreakpointValuesToObject();
    if (t === void 0 || !e)
      return;
    const i = typeof this.options.sidenavModeBreakpointOver == "number" ? t - this.options.sidenavModeBreakpointOver : t - e[this.options.sidenavModeBreakpointOver], n = typeof this.options.sidenavModeBreakpointSide == "number" ? t - this.options.sidenavModeBreakpointSide : t - e[this.options.sidenavModeBreakpointSide], o = typeof this.options.sidenavModeBreakpointPush == "number" ? t - this.options.sidenavModeBreakpointPush : t - e[this.options.sidenavModeBreakpointPush], r = (l, c) => l - c < 0 ? -1 : c - l < 0 ? 1 : 0, a = [i, n, o].filter((l) => l != null && l >= 0).sort(r)[0];
    i > 0 && i === a ? (this._options.sidenavMode = "over", this._options.sidenavHidden = !0) : n > 0 && n === a ? this._options.sidenavMode = "side" : o > 0 && o === a && (this._options.sidenavMode = "push");
  }
  _collapseItems() {
    this.navigation.forEach((t) => {
      h.find(Ce, t).forEach((i) => {
        Ut.getInstance(i).hide();
      });
    });
  }
  _getOffsetValue(t, { index: e, property: i, offsets: n }) {
    const o = this._getPxValue(
      this._initialContentStyle[e][n[i].property]
    ), r = t ? n[i].value : 0;
    return o + r;
  }
  _getProperty(...t) {
    return t.map((e, i) => i === 0 ? e : e[0].toUpperCase().concat(e.slice(1))).join("");
  }
  _getPxValue(t) {
    return t ? parseFloat(t) : 0;
  }
  _handleSwipe(t, e) {
    e && this._slimCollapsed && this.options.sidenavSlim && this.options.sidenavExpandable ? this.toggleSlim() : e || (this._slimCollapsed || !this.options.sidenavSlim || !this.options.sidenavExpandable ? this.toggler && St(this.toggler) && this.toggle() : this.toggleSlim());
  }
  _isActive(t, e) {
    return e ? e === t : t.attributes.href ? new URL(t, window.location.href).href === window.location.href : !1;
  }
  _isAllToBeCollapsed() {
    return h.find(
      B_,
      this._element
    ).filter(
      (i) => i.getAttribute("aria-expanded") === "true"
    ).length === 0;
  }
  _isAllCollapsed() {
    return h.find(Ce, this._element).filter(
      (t) => St(t)
    ).length === 0;
  }
  _initializeBackDrop() {
    if (!this.options.sidenavBackdrop)
      return;
    const t = this.options.sidenavBackdropClass ? this.options.sidenavBackdropClass.split(" ") : this.options.sidenavPosition ? [
      "opacity-50",
      "transition-all",
      "duration-300",
      "ease-in-out",
      this.options.sidenavPosition,
      "top-0",
      "left-0",
      "z-50",
      "bg-black/10",
      "dark:bg-black-60",
      "w-full",
      "h-full",
      this._element.id
    ] : null;
    return new lo({
      isVisible: this.options.sidenavBackdrop,
      isAnimated: !0,
      rootElement: this._element.parentNode,
      backdropClasses: t,
      clickCallback: () => this.hide()
    });
  }
  _updateBackdrop(t) {
    if (this.options.sidenavMode === "over") {
      t ? this._backdrop.show() : this.isBackdropVisible && this._backdrop.hide();
      return;
    }
    this.isBackdropVisible && this._backdrop.hide();
  }
  _setup() {
    this._setupTouch(), this.options.sidenavFocusTrap && this._setupFocusTrap(), this._setupCollapse(), this.options.sidenavSlim && this._setupSlim(), this._setupInitialStyling(), this._setupScrolling(), this.options.sidenavContent && this._setupContent(), this._setupActiveState(), this._setupRippleEffect(), this.options.sidenavHidden || this._updateOffsets(!0, !0), this.options.sidenavMode === "over" && this._setTabindex(!0);
  }
  _setupActiveState() {
    this._setActiveElements(), this.links.forEach((t) => {
      u.on(t, "click", () => this._setActiveElements(t)), u.on(t, "keydown", (e) => {
        e.keyCode === lt && this._setActiveElements(t);
      });
    }), u.on(window, "hashchange", this.hashHandler);
  }
  _setupCollapse() {
    this.navigation.forEach((t, e) => {
      h.find(Ce, t).forEach(
        (n, o) => this._setupCollapseList({ list: n, index: o, menu: t, menuIndex: e })
      );
    });
  }
  _generateCollpaseID(t, e) {
    return `sidenav-collapse-${this._ID}-${e}-${t}`;
  }
  _setupCollapseList({ list: t, index: e, menu: i, menuIndex: n }) {
    const o = this._generateCollpaseID(e, n);
    t.setAttribute("id", o), t.setAttribute("data-te-collapse-item", "");
    const [r] = h.prev(t, ti);
    p.setDataAttribute(r, "collapse-init", ""), r.setAttribute("href", `#${o}`), r.setAttribute("role", "button");
    const a = Ut.getInstance(t) || new Ut(t, {
      toggle: !1,
      parent: this.options.sidenavAccordion ? i : t
    });
    (t.dataset.teSidenavStateShow === "" || t.dataset.teCollapseShow === "") && this._rotateArrow(r, !1), u.on(r, "click", (l) => {
      this._toggleCategory(l, a, t), this._tempSlim && this._isAllToBeCollapsed() && (this._setSlim(!0), this._tempSlim = !1), this.options.sidenavMode === "over" && this._focusTrap && this._focusTrap.update();
    }), u.on(
      t,
      "show.te.collapse",
      () => this._rotateArrow(r, !1)
    ), u.on(
      t,
      "hide.te.collapse",
      () => this._rotateArrow(r, !0)
    ), u.on(t, "shown.te.collapse", () => {
      this.options.sidenavMode === "over" && this._focusTrap && this._focusTrap.update();
    }), u.on(t, "hidden.te.collapse", () => {
      this._tempSlim && this._isAllCollapsed() && (this._setSlim(!0), this._tempSlim = !1), this.options.sidenavMode === "over" && this._focusTrap && this._focusTrap.update();
    });
  }
  _setupContent() {
    this._content = h.find(this.options.sidenavContent), this._content.forEach((t) => {
      const e = [
        "!p",
        "!m",
        "!px",
        "!pl",
        "!pr",
        "!mx",
        "!ml",
        "!mr",
        "!-p",
        "!-m",
        "!-px",
        "!-pl",
        "!-pr",
        "!-mx",
        "!-ml",
        "!-mr"
      ];
      [...t.classList].filter(
        (n) => e.findIndex((o) => n.includes(o)) >= 0
      ).forEach((n) => t.classList.remove(n));
    }), this._initialContentStyle = this._content.map((t) => {
      const { paddingLeft: e, paddingRight: i, marginLeft: n, marginRight: o, transition: r } = window.getComputedStyle(t);
      return { paddingLeft: e, paddingRight: i, marginLeft: n, marginRight: o, transition: r };
    });
  }
  _setupFocusTrap() {
    this._focusTrap = new bi(
      this._element,
      {
        event: "keydown",
        condition: (t) => t.keyCode === fi,
        onlyVisible: !0
      },
      this.toggler
    );
  }
  _setupInitialStyling() {
    this._setColor(), p.style(this._element, this.sidenavStyle);
  }
  _setupScrolling() {
    let t = this._element;
    if (this.options.sidenavScrollContainer) {
      t = h.findOne(
        this.options.sidenavScrollContainer,
        this._element
      );
      const i = tc(t.parentNode.children).filter(
        (n) => n !== t
      ).reduce((n, o) => n + o.clientHeight, 0);
      p.style(t, {
        maxHeight: `calc(100% - ${i}px)`,
        position: "relative"
      });
    }
    this._perfectScrollbar = new Ti(t, {
      suppressScrollX: !0,
      handlers: ["click-rail", "drag-thumb", "wheel", "touch"]
    }), P_(t);
  }
  _setupSlim() {
    this._slimCollapsed = this.options.sidenavSlimCollapsed, this._toggleSlimDisplay(this._slimCollapsed), this.options.sidenavExpandOnHover && (this._element.addEventListener("mouseenter", () => {
      this._slimCollapsed && this._setSlim(!1);
    }), this._element.addEventListener("mouseleave", () => {
      this._slimCollapsed || this._setSlim(!0);
    }));
  }
  _setupRippleEffect() {
    this.links.forEach((t) => {
      let e = Cs.getInstance(t), i = this.options.sidenavColor;
      if (e && e._options.sidenavColor !== this.options.sidenavColor)
        e.dispose();
      else if (e)
        return;
      (localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) && (i = "white"), e = new Cs(t, { rippleColor: i });
    });
  }
  _setupTouch() {
    this._touch = new I_(this._element, "swipe", { threshold: 20 }), this._touch.init(), u.on(
      this._element,
      "swipeleft",
      (t) => this._handleSwipe(t, this.options.sidenavRight)
    ), u.on(
      this._element,
      "swiperight",
      (t) => this._handleSwipe(t, !this.options.sidenavRight)
    );
  }
  _setActive(t, e) {
    t.setAttribute("data-te-sidebar-state-active", ""), this._activeNode && t.removeAttribute("data-te-sidebar-state-active"), this._activeNode = t;
    const [i] = h.parents(
      this._activeNode,
      Ce
    );
    if (!i) {
      this._setActiveCategory();
      return;
    }
    const [n] = h.prev(i, ti);
    this._setActiveCategory(n), !e && !this._slimCollapsed && Ut.getInstance(i).show();
  }
  _setActiveCategory(t) {
    this.navigation.forEach((e) => {
      h.find(Ce, e).forEach((n) => {
        const [o] = h.prev(n, ti);
        o !== t ? o.removeAttribute("data-te-sidenav-state-active") : o.setAttribute("data-te-sidenav-state-active", "");
      });
    });
  }
  _setActiveElements(t) {
    this.navigation.forEach((e) => {
      h.find(ti, e).filter((n) => h.next(n, Ce).length === 0).forEach((n) => {
        this._isActive(n, t) && n !== this._activeNode && this._setActive(n, t);
      });
    }), t && this._updateFocus(this.isVisible);
  }
  _setColor() {
    const t = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "light",
      "dark"
    ], { sidenavColor: e } = this.options, i = t.includes(e) ? e : "primary";
    t.forEach((n) => {
      this._element.classList.remove(`sidenav-${n}`);
    }), p.addClass(this._element, `sidenav-${i}`);
  }
  _setContentOffsets(t, e, i) {
    this._content.forEach((n, o) => {
      const r = this._getOffsetValue(t, {
        index: o,
        property: "padding",
        offsets: e
      }), a = this._getOffsetValue(t, {
        index: o,
        property: "margin",
        offsets: e
      }), l = {};
      if (i || (l.transition = `all ${this.transitionDuration} linear`), l[e.padding.property] = `${r}px`, l[e.margin.property] = `${a}px`, p.style(n, l), !!t) {
        if (i) {
          p.style(n, {
            transition: this._initialContentStyle[o].transition
          });
          return;
        }
        u.on(n, "transitionend", () => {
          p.style(n, {
            transition: this._initialContentStyle[o].transition
          });
        });
      }
    });
  }
  _setMode(t) {
    this.options.sidenavMode !== t && (this._options.sidenavMode = t, this._update(this.isVisible));
  }
  _setSlim(t) {
    const e = t ? ["collapse", "collapsed"] : ["expand", "expanded"];
    this._triggerEvents(...e), t && this._collapseItems(), this._slimCollapsed = t, this._toggleSlimDisplay(t), p.style(this._element, { width: `${this.width}px` }), this._updateOffsets(this.isVisible);
  }
  _setTabindex(t) {
    this.links.forEach((e) => {
      e.tabIndex = t ? 0 : -1;
    });
  }
  _emitEvents(t) {
    const e = t ? ["show", "shown"] : ["hide", "hidden"];
    this._triggerEvents(...e);
  }
  _rotateArrow(t, e) {
    const [i] = h.children(t, `[${H_}]`);
    i && (e ? p.removeClass(i, "rotate-180") : p.addClass(i, "rotate-180"));
  }
  _toggleCategory(t, e) {
    t.preventDefault(), e.toggle(), this._slimCollapsed && this.options.sidenavExpandable && (this._tempSlim = !0, this._setSlim(!1));
  }
  _toggleSlimDisplay(t) {
    const e = h.find(
      V_,
      this._element
    ), i = h.find(
      W_,
      this._element
    ), n = () => {
      e.forEach((o) => {
        p.style(o, {
          display: this._slimCollapsed ? "unset" : "none"
        });
      }), i.forEach((o) => {
        p.style(o, {
          display: this._slimCollapsed ? "none" : "unset"
        });
      });
    };
    t ? setTimeout(
      () => n(),
      this.options.sidenavTransitionDuration
    ) : n();
  }
  async _triggerEvents(t, e) {
    u.trigger(this._element, `${t}.te.sidenav`), e && await setTimeout(() => {
      u.trigger(this._element, `${e}.te.sidenav`);
    }, this.options.sidenavTransitionDuration + 5);
  }
  _update(t) {
    this.toggler && this._updateTogglerAria(t), this._updateDisplay(t), this.options.sidenavBackdrop && this._updateBackdrop(t), this._updateOffsets(t), t && this.options.sidenavCloseOnEsc && this.options.sidenavMode !== "side" && u.on(window, "keydown", this.escHandler), this.options.sidenavFocusTrap && this._updateFocus(t);
  }
  _updateDisplay(t) {
    const e = t ? 0 : this.translation;
    p.style(this._element, {
      transform: `translateX(${e}%)`
    });
  }
  _updateFocus(t) {
    if (this._setTabindex(t), this.options.sidenavMode === "over" && this.options.sidenavFocusTrap) {
      if (t) {
        this._focusTrap.trap();
        return;
      }
      this._focusTrap.disable();
    }
    this._focusTrap.disable();
  }
  _updateOffsets(t, e = !1) {
    const [i, n] = this.options.sidenavRight ? ["right", "left"] : ["left", "right"], o = {
      property: this._getProperty("padding", i),
      value: this.options.sidenavMode === "over" ? 0 : this.width
    }, r = {
      property: this._getProperty("margin", n),
      value: this.options.sidenavMode === "push" ? -1 * this.width : 0
    };
    u.trigger(this._element, "update.te.sidenav", {
      margin: r,
      padding: o
    }), this._content && (this._content.className = "", this._setContentOffsets(t, { padding: o, margin: r }, e));
  }
  _updateTogglerAria(t) {
    this.toggler.setAttribute("aria-expanded", t);
  }
  // Static
  static toggleSidenav() {
    return function(t) {
      const e = h.closest(t.target, An), i = p.getDataAttributes(e).target;
      h.find(i).forEach((n) => {
        (ni.getInstance(n) || new ni(n)).toggle();
      });
    };
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, Zi);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new ni(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, Zi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Yn = "stepper", ms = "te.stepper", Ms = `.${ms}`, Ci = `data-te-${Yn}`, oi = "horizontal", yt = "vertical", z_ = {
  stepperType: "string",
  stepperLinear: "boolean",
  stepperNoEditable: "boolean",
  stepperActive: "string",
  stepperCompleted: "string",
  stepperInvalid: "string",
  stepperDisabled: "string",
  stepperVerticalBreakpoint: "number",
  stepperMobileBreakpoint: "number",
  stepperMobileBarBreakpoint: "number"
}, X_ = {
  stepperType: oi,
  stepperLinear: !1,
  stepperNoEditable: !1,
  stepperActive: "",
  stepperCompleted: "",
  stepperInvalid: "",
  stepperDisabled: "",
  stepperVerticalBreakpoint: 0,
  stepperMobileBreakpoint: 0,
  stepperMobileBarBreakpoint: 4
}, qr = `mousedown${Ms}`, Qr = `keydown${Ms}`, G_ = `keyup${Ms}`, Zr = `resize${Ms}`, Vt = `[${Ci}-step-ref]`, G = `[${Ci}-head-ref]`, Jr = `[${Ci}-head-text-ref]`, Ji = `[${Ci}-head-icon-ref]`, st = `[${Ci}-content-ref]`;
class Qg {
  constructor(t, e) {
    this._element = t, this._options = this._getConfig(e), this._elementHeight = 0, this._steps = h.find(`${Vt}`, this._element), this._currentView = "", this._activeStepIndex = 0, this._verticalStepperStyles = [], this._element && (I.setData(t, ms, this), this._init());
  }
  // Getters
  static get NAME() {
    return Yn;
  }
  get activeStep() {
    return this._steps[this._activeStepIndex];
  }
  get activeStepIndex() {
    return this._activeStepIndex;
  }
  // Public
  dispose() {
    this._steps.forEach((t) => {
      u.off(t, qr), u.off(t, Qr);
    }), u.off(window, Zr), I.removeData(this._element, ms), this._element = null;
  }
  changeStep(t) {
    this._toggleStep(t);
  }
  nextStep() {
    this._toggleStep(this._activeStepIndex + 1);
  }
  previousStep() {
    this._toggleStep(this._activeStepIndex - 1);
  }
  // Private
  _init() {
    const t = h.find(`${Vt}`, this._element)[this._activeStepIndex].setAttribute("data-te", "active-step"), e = h.find(
      `${Jr}`,
      this._element
    ), i = h.find(
      `${Ji}`,
      this._element
    );
    switch (t ? (this._activeStepIndex = this._steps.indexOf(t), this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperActive
    ), e[this._activeStepIndex].classList.add("font-medium"), i[this._activeStepIndex].classList.add("!bg-primary-100"), i[this._activeStepIndex].classList.add("!text-primary-700")) : (e[this._activeStepIndex].classList.add("font-medium"), i[this._activeStepIndex].classList.add("!bg-primary-100"), i[this._activeStepIndex].classList.add("!text-primary-700"), this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperActive
    )), this._bindMouseDown(), this._bindKeysNavigation(), this._options.stepperType) {
      case yt:
        this._toggleVertical();
        break;
      default:
        this._toggleHorizontal();
        break;
    }
    (this._options.stepperVerticalBreakpoint || this._options.stepperMobileBreakpoint) && this._toggleStepperView(), this._bindResize();
  }
  _getConfig(t) {
    const e = p.getDataAttributes(this._element);
    return t = {
      ...X_,
      ...e,
      ...t
    }, N(Yn, t, z_), t;
  }
  _bindMouseDown() {
    this._steps.forEach((t) => {
      const e = h.findOne(`${G}`, t);
      u.on(e, qr, (i) => {
        const n = h.parents(i.target, `${Vt}`)[0], o = this._steps.indexOf(n);
        i.preventDefault(), this._toggleStep(o);
      });
    });
  }
  _bindResize() {
    u.on(window, Zr, () => {
      this._currentView === yt && this._setSingleStepHeight(this.activeStep), this._currentView === oi && this._setHeight(this.activeStep), (this._options.stepperVerticalBreakpoint || this._options.stepperMobileBreakpoint) && this._toggleStepperView();
    });
  }
  _toggleStepperView() {
    const t = this._options.stepperVerticalBreakpoint < window.innerWidth, e = this._options.stepperVerticalBreakpoint > window.innerWidth, i = this._options.stepperMobileBreakpoint > window.innerWidth;
    t && this._currentView !== oi && this._toggleHorizontal(), e && !i && this._currentView !== yt && (this._steps.forEach((n) => {
      const o = h.findOne(`${st}`, n);
      this._resetStepperHeight(), this._showElement(o);
    }), this._toggleVertical());
  }
  _toggleStep(t) {
    this._activeStepIndex !== t && (this._options.stepperNoEditable && this._toggleDisabled(), this._showElement(
      h.findOne(`${st}`, this._steps[t])
    ), this._toggleActive(t), t > this._activeStepIndex && this._toggleCompleted(this._activeStepIndex), this._currentView === oi ? this._animateHorizontalStep(t) : (this._animateVerticalStep(t), this._setSingleStepHeight(this._steps[t])), this._toggleStepTabIndex(
      h.findOne(`${G}`, this.activeStep),
      h.findOne(`${G}`, this._steps[t])
    ), this._activeStepIndex = t, this._steps[this._activeStepIndex].setAttribute("data-te", "active-step"), this._steps.forEach((e, i) => {
      e[this._activeStepIndex] !== i && e.removeAttribute("data-te");
    }));
  }
  _resetStepperHeight() {
    this._element.style.height = "";
  }
  _setStepsHeight() {
    this._steps.forEach((t) => {
      const e = h.findOne(`${st}`, t), i = window.getComputedStyle(e);
      this._verticalStepperStyles.push({
        paddingTop: parseFloat(i.paddingTop),
        paddingBottom: parseFloat(i.paddingBottom)
      });
      const n = e.scrollHeight;
      e.style.height = `${n}px`;
    });
  }
  _setSingleStepHeight(t) {
    const e = h.findOne(`${st}`, t), i = this.activeStep === t, n = this._steps.indexOf(t);
    let o;
    i ? (e.style.height = "", o = e.scrollHeight) : o = e.scrollHeight + this._verticalStepperStyles[n].paddingTop + this._verticalStepperStyles[n].paddingBottom, e.style.height = `${o}px`;
  }
  _toggleVertical() {
    this._currentView = yt, this._setStepsHeight(), this._hideInactiveSteps();
  }
  _toggleHorizontal() {
    this._currentView = oi, this._setHeight(this.activeStep), this._hideInactiveSteps();
  }
  _toggleStepperClass() {
    h.findOne(
      "[data-te-stepper-type]",
      this._element
    ) !== null && this._steps.forEach((e) => {
      h.findOne(`${st}`, e).classList.remove("!my-0"), h.findOne(`${st}`, e).classList.remove("!py-0"), h.findOne(`${st}`, e).classList.remove("!h-0");
    });
  }
  _toggleStepClass(t, e, i) {
    i && this._steps[t].classList[e](i);
  }
  _bindKeysNavigation() {
    this._toggleStepTabIndex(
      !1,
      h.findOne(`${G}`, this.activeStep)
    ), this._steps.forEach((t) => {
      const e = h.findOne(`${G}`, t);
      u.on(e, Qr, (i) => {
        const n = h.parents(
          i.currentTarget,
          `${Vt}`
        )[0], o = h.next(n, `${Vt}`)[0], r = h.prev(n, `${Vt}`)[0], a = h.findOne(
          `${G}`,
          n
        ), l = h.findOne(
          `${G}`,
          this.activeStep
        );
        let c = null, d = null;
        if (o && (c = h.findOne(`${G}`, o)), r && (d = h.findOne(`${G}`, r)), i.keyCode === Ie && this._currentView !== yt && (d ? (this._toggleStepTabIndex(a, d), this._toggleOutlineStyles(a, d), d.focus()) : c && (this._toggleStepTabIndex(a, c), this._toggleOutlineStyles(a, c), c.focus())), i.keyCode === $e && this._currentView !== yt && (c ? (this._toggleStepTabIndex(a, c), this._toggleOutlineStyles(a, c), c.focus()) : d && (this._toggleStepTabIndex(a, d), this._toggleOutlineStyles(a, d), d.focus())), i.keyCode === U && this._currentView === yt && (i.preventDefault(), c && (this._toggleStepTabIndex(a, c), this._toggleOutlineStyles(a, c), c.focus())), i.keyCode === rt && this._currentView === yt && (i.preventDefault(), d && (this._toggleStepTabIndex(a, d), this._toggleOutlineStyles(a, d), d.focus())), i.keyCode === Le) {
          const _ = h.findOne(
            `${G}`,
            this._steps[0]
          );
          this._toggleStepTabIndex(a, _), this._toggleOutlineStyles(a, _), _.focus();
        }
        if (i.keyCode === Me) {
          const _ = this._steps[this._steps.length - 1], f = h.findOne(`${G}`, _);
          this._toggleStepTabIndex(a, f), this._toggleOutlineStyles(a, f), f.focus();
        }
        (i.keyCode === lt || i.keyCode === ps) && (i.preventDefault(), this.changeStep(this._steps.indexOf(n))), i.keyCode === fi && (this._toggleStepTabIndex(a, l), this._toggleOutlineStyles(a, !1), l.focus());
      }), u.on(e, G_, (i) => {
        const n = h.parents(
          i.currentTarget,
          `${Vt}`
        )[0], o = h.findOne(
          `${G}`,
          n
        ), r = h.findOne(
          `${G}`,
          this.activeStep
        );
        i.keyCode === fi && (this._toggleStepTabIndex(o, r), this._toggleOutlineStyles(!1, r), r.focus());
      });
    });
  }
  _toggleStepTabIndex(t, e) {
    t && t.setAttribute("tabIndex", -1), e && e.setAttribute("tabIndex", 0);
  }
  _toggleOutlineStyles(t, e) {
    t && (t.style.outline = ""), e && (e.style.outline = "revert");
  }
  _toggleDisabled() {
    const t = h.find(`${G}`, this._element), e = h.find(
      `${Ji}`,
      this._element
    );
    t[this._activeStepIndex].classList.add("color-[#858585]"), t[this._activeStepIndex].classList.add("cursor-default"), e[this._activeStepIndex].classList.add("!bg-[#858585]"), this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperDisabled
    );
  }
  _toggleActive(t) {
    const e = h.find(
      `${Jr}`,
      this._element
    ), i = h.find(
      `${Ji}`,
      this._element
    );
    e[t].classList.add("font-medium"), i[t].classList.add("!bg-primary-100"), i[t].classList.add("!text-primary-700"), i[t].classList.remove("!bg-success-100"), i[t].classList.remove("!text-success-700"), e[this._activeStepIndex].classList.remove("font-medium"), i[this._activeStepIndex].classList.remove("!bg-primary-100"), i[this._activeStepIndex].classList.remove(
      "!text-primary-700"
    ), this._toggleStepClass(t, "add", this._options.stepperActive), this._toggleStepClass(
      this._activeStepIndex,
      "remove",
      this._options.stepperActive
    );
  }
  _toggleCompleted(t) {
    const e = h.find(
      `${Ji}`,
      this._element
    );
    e[t].classList.add("!bg-success-100"), e[t].classList.add("!text-success-700"), e[t].classList.remove("!bg-danger-100"), e[t].classList.remove("!text-danger-700"), this._toggleStepClass(t, "add", this._options.stepperCompleted), this._toggleStepClass(t, "remove", this._options.stepperInvalid);
  }
  _hideInactiveSteps() {
    this._steps.forEach((t) => {
      t.getAttribute("data-te") || this._hideElement(h.findOne(`${st}`, t));
    });
  }
  _setHeight(t) {
    const e = h.findOne(`${st}`, t), i = getComputedStyle(e), n = h.findOne(`${G}`, t), o = getComputedStyle(n), r = e.offsetHeight + parseFloat(i.marginTop) + parseFloat(i.marginBottom), a = n.offsetHeight + parseFloat(o.marginTop) + parseFloat(o.marginBottom);
    this._element.style.height = `${a + r}px`;
  }
  _hideElement(t) {
    !h.parents(
      t,
      `${Vt}`
    )[0].getAttribute("data-te") && this._currentView !== yt || (t.classList.add("!my-0"), t.classList.add("!py-0"), t.classList.add("!h-0"));
  }
  _showElement(t) {
    this._currentView === yt ? (t.classList.remove("!my-0"), t.classList.remove("!py-0"), t.classList.remove("!h-0")) : t.style.display = "block";
  }
  _animateHorizontalStep(t) {
    const e = t > this._activeStepIndex, i = h.findOne(
      `${st}`,
      this._steps[t]
    ), n = h.findOne(
      `${st}`,
      this.activeStep
    );
    let o, r;
    this._steps.forEach((d, _) => {
      const f = h.findOne(`${st}`, d);
      _ !== t && _ !== this._activeStepIndex && this._hideElement(f);
    });
    const a = "translate-x-[150%]", l = "-translate-x-[150%]", c = "translate-0";
    e ? (r = l, o = c, i.classList.remove("translate-x-[150%]"), i.classList.remove("-translate-x-[150%]")) : (r = a, o = c, i.classList.remove("-translate-x-[150%]"), i.classList.remove("translate-x-[150%]")), n.classList.add(r), i.classList.add(o), this._setHeight(this._steps[t]);
  }
  _animateVerticalStep(t) {
    const e = h.findOne(
      `${st}`,
      this._steps[t]
    ), i = h.findOne(
      `${st}`,
      this.activeStep
    );
    this._hideElement(i), this._showElement(e);
  }
  static getInstance(t) {
    return I.getData(t, ms);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const ta = "data-te-input-state-active", ts = "data-te-input-selected", ea = "data-te-input-multiple-active", ia = "[data-te-form-check-input]";
class sa {
  constructor(t, e, i, n, o, r, a, l, c, d, _) {
    this.id = t, this.nativeOption = e, this.multiple = i, this.value = n, this.label = o, this.selected = r, this.disabled = a, this.hidden = l, this.secondaryText = c, this.groupId = d, this.icon = _, this.node = null, this.active = !1;
  }
  select() {
    this.multiple ? this._selectMultiple() : this._selectSingle();
  }
  _selectSingle() {
    this.selected || (this.node.setAttribute(ts, ""), this.node.setAttribute("aria-selected", !0), this.selected = !0, this.nativeOption && (this.nativeOption.selected = !0));
  }
  _selectMultiple() {
    if (!this.selected) {
      const t = h.findOne(
        ia,
        this.node
      );
      t.checked = !0, this.node.setAttribute(ts, ""), this.node.setAttribute("aria-selected", !0), this.selected = !0, this.nativeOption && (this.nativeOption.selected = !0);
    }
  }
  deselect() {
    this.multiple ? this._deselectMultiple() : this._deselectSingle();
  }
  _deselectSingle() {
    this.selected && (this.node.removeAttribute(ts), this.node.setAttribute("aria-selected", !1), this.selected = !1, this.nativeOption && (this.nativeOption.selected = !1));
  }
  _deselectMultiple() {
    if (this.selected) {
      const t = h.findOne(
        ia,
        this.node
      );
      t.checked = !1, this.node.removeAttribute(ts), this.node.setAttribute("aria-selected", !1), this.selected = !1, this.nativeOption && (this.nativeOption.selected = !1);
    }
  }
  setNode(t) {
    this.node = t;
  }
  setActiveStyles() {
    if (!this.active) {
      if (this.multiple) {
        this.node.setAttribute(ea, "");
        return;
      }
      this.active = !0, this.node.setAttribute(ta, "");
    }
  }
  removeActiveStyles() {
    this.active && (this.active = !1, this.node.removeAttribute(ta)), this.multiple && this.node.removeAttribute(ea);
  }
}
class q_ {
  constructor(t = !1) {
    this._multiple = t, this._selections = [];
  }
  select(t) {
    this._multiple ? this._selections.push(t) : this._selections = [t];
  }
  deselect(t) {
    if (this._multiple) {
      const e = this._selections.findIndex(
        (i) => t === i
      );
      this._selections.splice(e, 1);
    } else
      this._selections = [];
  }
  clear() {
    this._selections = [];
  }
  get selection() {
    return this._selections[0];
  }
  get selections() {
    return this._selections;
  }
  get label() {
    return this._selections[0] && this.selection.label;
  }
  get labels() {
    return this._selections.map((t) => t.label).join(", ");
  }
  get value() {
    return this.selections[0] && this.selection.value;
  }
  get values() {
    return this._selections.map((t) => t.value);
  }
}
function jn(s) {
  return s.filter((t) => !t.disabled).every((t) => t.selected);
}
const Q_ = "data-te-select-form-outline-ref", Z_ = "data-te-select-wrapper-ref", J_ = "data-te-select-input-ref", tm = "data-te-select-clear-btn-ref", em = "data-te-select-dropdown-container-ref", im = "data-te-select-dropdown-ref", sm = "data-te-select-options-wrapper-ref", nm = "data-te-select-options-list-ref", om = "data-te-select-input-filter-ref", xl = "data-te-select-option-ref", rm = "data-te-select-option-all-ref", am = "data-te-select-option-text-ref", lm = "data-te-form-check-input", cm = "data-te-select-option-group-ref", dm = "data-te-select-option-group-label-ref", Sl = "data-te-select-selected", hm = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
`, um = (s) => {
  s.code === "Tab" || s.code === "Esc" || s.preventDefault();
};
function es(s, t, e, i, n) {
  t.selectSize === "default" && p.addClass(s, e), t.selectSize === "sm" && p.addClass(s, i), t.selectSize === "lg" && p.addClass(s, n);
}
function pm(s, t, e, i) {
  const n = document.createElement("div");
  n.setAttribute("id", s), n.setAttribute(Z_, "");
  const o = M("div");
  o.setAttribute(Q_, ""), p.addClass(o, i.formOutline);
  const r = M("input"), a = t.selectFilter ? "combobox" : "listbox", l = t.multiple ? "true" : "false", c = t.disabled ? "true" : "false";
  r.setAttribute(J_, ""), p.addClass(r, i.selectInput), es(
    r,
    t,
    i.selectInputSizeDefault,
    i.selectInputSizeSm,
    i.selectInputSizeLg
  ), t.selectFormWhite && p.addClass(r, i.selectInputWhite), r.setAttribute("type", "text"), r.setAttribute("role", a), r.setAttribute("aria-multiselectable", l), r.setAttribute("aria-disabled", c), r.setAttribute("aria-haspopup", "true"), r.setAttribute("aria-expanded", !1), t.tabIndex && r.setAttribute("tabIndex", t.tabIndex), t.disabled && r.setAttribute("disabled", ""), t.selectPlaceholder !== "" && r.setAttribute("placeholder", t.selectPlaceholder), t.selectValidation ? (p.addStyle(r, {
    "pointer-events": "none",
    "caret-color": "transparent"
  }), p.addStyle(o, { cursor: "pointer" })) : r.setAttribute("readonly", "true"), t.selectValidation && (r.setAttribute("required", "true"), r.setAttribute("aria-required", "true"), r.addEventListener("keydown", um));
  const d = M("div");
  p.addClass(d, i.selectValidationValid);
  const _ = document.createTextNode(
    `${t.selectValidFeedback}`
  );
  d.appendChild(_);
  const f = M("div");
  p.addClass(f, i.selectValidationInvalid);
  const m = document.createTextNode(
    `${t.selectInvalidFeedback}`
  );
  f.appendChild(m);
  const g = M("span");
  g.setAttribute(tm, ""), p.addClass(g, i.selectClearBtn), es(
    g,
    t,
    i.selectClearBtnDefault,
    i.selectClearBtnSm,
    i.selectClearBtnLg
  ), t.selectFormWhite && p.addClass(g, i.selectClearBtnWhite);
  const b = document.createTextNode("✕");
  g.appendChild(b), g.setAttribute("tabindex", "0");
  const T = M("span");
  return p.addClass(T, i.selectArrow), es(
    T,
    t,
    i.selectArrowDefault,
    i.selectArrowSm,
    i.selectArrowLg
  ), t.selectFormWhite && p.addClass(T, i.selectArrowWhite), T.innerHTML = hm, o.appendChild(r), e && (p.addClass(e, i.selectLabel), es(
    e,
    t,
    i.selectLabelSizeDefault,
    i.selectLabelSizeSm,
    i.selectLabelSizeLg
  ), t.selectFormWhite && p.addClass(e, i.selectLabelWhite), o.appendChild(e)), t.selectValidation && (o.appendChild(d), o.appendChild(f)), t.selectClearButton && o.appendChild(g), o.appendChild(T), n.appendChild(o), n;
}
function na(s, t, e, i, n, o, r, a) {
  const l = document.createElement("div");
  l.setAttribute(em, ""), p.addClass(l, a.selectDropdownContainer), l.setAttribute("id", `${s}`), l.style.width = `${e}px`;
  const c = document.createElement("div");
  c.setAttribute("tabindex", 0), c.setAttribute(im, ""), p.addClass(c, a.dropdown);
  const d = M("div");
  d.setAttribute(sm, ""), p.addClass(d, a.optionsWrapper), p.addClass(d, a.optionsWrapperScrollbar), d.style.maxHeight = `${i}px`;
  const _ = Dl(
    o,
    n,
    t,
    a
  );
  return d.appendChild(_), t.selectFilter && c.appendChild(
    fm(t.selectSearchPlaceholder, a)
  ), c.appendChild(d), r && c.appendChild(r), l.appendChild(c), l;
}
function Dl(s, t, e, i) {
  const n = M("div");
  n.setAttribute(nm, ""), p.addClass(n, i.optionsList);
  let o;
  return e.multiple ? o = mm(
    s,
    t,
    e,
    i
  ) : o = _m(s, e, i), o.forEach((r) => {
    n.appendChild(r);
  }), n;
}
function fm(s, t) {
  const e = M("div");
  p.addClass(e, t.inputGroup);
  const i = M("input");
  return i.setAttribute(om, ""), p.addClass(i, t.selectFilterInput), i.placeholder = s, i.setAttribute("role", "searchbox"), i.setAttribute("type", "text"), e.appendChild(i), e;
}
function _m(s, t, e) {
  return Il(s, t, e);
}
function mm(s, t, e, i) {
  let n = null;
  e.selectAll && (n = gm(
    t,
    s,
    e,
    i
  ));
  const o = Il(s, e, i);
  return n ? [n, ...o] : o;
}
function Il(s, t, e) {
  const i = [];
  return s.forEach((n) => {
    if (Object.prototype.hasOwnProperty.call(
      n,
      "options"
    )) {
      const r = Tm(n, t, e);
      i.push(r);
    } else
      i.push($l(n, t, e));
  }), i;
}
function gm(s, t, e, i) {
  const n = jn(t), o = M("div");
  return o.setAttribute(xl, ""), p.addClass(o, i.selectOption), o.setAttribute(rm, ""), p.addStyle(o, {
    height: `${e.selectOptionHeight}px`
  }), o.setAttribute("role", "option"), o.setAttribute("aria-selected", n), n && o.setAttribute(Sl, ""), o.appendChild(Ll(s, e, i)), s.setNode(o), o;
}
function $l(s, t, e) {
  if (s.node)
    return s.node;
  const i = M("div");
  return i.setAttribute(xl, ""), p.addClass(i, e.selectOption), p.addStyle(i, {
    height: `${t.selectOptionHeight}px`
  }), p.setDataAttribute(i, "id", s.id), i.setAttribute("role", "option"), i.setAttribute("aria-selected", s.selected), i.setAttribute("aria-disabled", s.disabled), s.selected && i.setAttribute(Sl, ""), s.disabled && i.setAttribute("data-te-select-option-disabled", !0), s.hidden && p.addClass(i, "hidden"), i.appendChild(Ll(s, t, e)), s.icon && i.appendChild(Em(s, e)), s.setNode(i), i;
}
function Ll(s, t, e) {
  const i = M("span");
  i.setAttribute(am, ""), p.addClass(i, e.selectOptionText);
  const n = document.createTextNode(s.label);
  return t.multiple && i.appendChild(vm(s, e)), i.appendChild(n), (s.secondaryText || typeof s.secondaryText == "number") && i.appendChild(
    bm(s.secondaryText, e)
  ), i;
}
function bm(s, t) {
  const e = M("span");
  p.addClass(e, t.selectOptionSecondaryText);
  const i = document.createTextNode(s);
  return e.appendChild(i), e;
}
function vm(s, t) {
  const e = M("input");
  e.setAttribute("type", "checkbox"), p.addClass(e, t.formCheckInput), e.setAttribute(lm, "");
  const i = M("label");
  return s.selected && e.setAttribute("checked", !0), s.disabled && e.setAttribute("disabled", !0), e.appendChild(i), e;
}
function Em(s, t) {
  const e = M("span"), i = M("img");
  return p.addClass(i, t.selectOptionIcon), i.src = s.icon, e.appendChild(i), e;
}
function Tm(s, t, e) {
  const i = M("div");
  i.setAttribute(cm, ""), p.addClass(i, e.selectOptionGroup), i.setAttribute("role", "group"), i.setAttribute("id", s.id), s.hidden && p.addClass(i, "hidden");
  const n = M("label");
  return n.setAttribute(dm, ""), p.addClass(n, e.selectOptionGroupLabel), p.addStyle(n, { height: `${t.selectOptionHeight}px` }), n.setAttribute("for", s.id), n.textContent = s.label, i.appendChild(n), s.options.forEach((o) => {
    i.appendChild($l(o, t, e));
  }), i;
}
function Cm(s, t) {
  const e = M("div");
  return e.innerHTML = s, p.addClass(e, t.selectLabel), p.addClass(e, t.selectFakeValue), e;
}
const yn = "select", ri = "te.select", Ai = `.${ri}`, Am = `close${Ai}`, ym = `open${Ai}`, oa = `optionSelect${Ai}`, ra = `optionDeselect${Ai}`, wm = `valueChange${Ai}`, km = "change", aa = "data-te-select-init", Ml = "data-te-select-no-results-ref", la = "data-te-select-open", q = "data-te-input-state-active", Wt = "data-te-input-focused", wn = "data-te-input-disabled", Om = "data-te-select-option-group-label-ref", xm = "data-te-select-option-all-ref", ei = "data-te-select-selected", Sm = "[data-te-select-label-ref]", ca = "[data-te-select-input-ref]", Dm = "[data-te-select-input-filter-ref]", Im = "[data-te-select-dropdown-ref]", $m = "[data-te-select-options-wrapper-ref]", da = "[data-te-select-options-list-ref]", Lm = "[data-te-select-option-ref]", Mm = "[data-te-select-clear-btn-ref]", Nm = "[data-te-select-custom-content-ref]", Rm = `[${Ml}]`, ha = "[data-te-select-form-outline-ref]", Pm = "[data-te-select-toggle]", kn = "[data-te-input-notch-ref]", Hm = 200, Bm = {
  selectAutoSelect: !1,
  selectContainer: "body",
  selectClearButton: !1,
  disabled: !1,
  selectDisplayedLabels: 5,
  selectFormWhite: !1,
  multiple: !1,
  selectOptionsSelectedLabel: "options selected",
  selectOptionHeight: 38,
  selectAll: !0,
  selectAllLabel: "Select all",
  selectSearchPlaceholder: "Search...",
  selectSize: "default",
  selectVisibleOptions: 5,
  selectFilter: !1,
  selectFilterDebounce: 300,
  selectNoResultText: "No results",
  selectValidation: !1,
  selectValidFeedback: "Valid",
  selectInvalidFeedback: "Invalid",
  selectPlaceholder: ""
}, Vm = {
  selectAutoSelect: "boolean",
  selectContainer: "string",
  selectClearButton: "boolean",
  disabled: "boolean",
  selectDisplayedLabels: "number",
  selectFormWhite: "boolean",
  multiple: "boolean",
  selectOptionsSelectedLabel: "string",
  selectOptionHeight: "number",
  selectAll: "boolean",
  selectAllLabel: "string",
  selectSearchPlaceholder: "string",
  selectSize: "string",
  selectVisibleOptions: "number",
  selectFilter: "boolean",
  selectFilterDebounce: "number",
  selectNoResultText: "string",
  selectValidation: "boolean",
  selectValidFeedback: "string",
  selectInvalidFeedback: "string",
  selectPlaceholder: "string"
}, Wm = {
  dropdown: "relative outline-none min-w-[100px] m-0 scale-[0.8] opacity-0 bg-white shadow-[0_2px_5px_0_rgba(0,0,0,0.16),_0_2px_10px_0_rgba(0,0,0,0.12)] transition duration-200 motion-reduce:transition-none data-[te-select-open]:scale-100 data-[te-select-open]:opacity-100 dark:bg-zinc-700",
  formCheckInput: "relative float-left mt-[0.15rem] mr-[8px] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary dark:checked:border-primary checked:bg-primary dark:checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent",
  formOutline: "relative",
  initialized: "hidden",
  inputGroup: "flex items-center whitespace-nowrap p-2.5 text-center text-base font-normal leading-[1.6] text-gray-700 dark:bg-zinc-800 dark:text-gray-200 dark:placeholder:text-gray-200",
  noResult: "flex items-center px-4",
  optionsList: "list-none m-0 p-0",
  optionsWrapper: "overflow-y-auto",
  optionsWrapperScrollbar: "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:bg-transparent [&::-webkit-scrollbar-track-piece]:bg-transparent [&::-webkit-scrollbar-track-piece]:rounded-none [&::-webkit-scrollbar-track-piece]: [&::-webkit-scrollbar-track-piece]:rounded-l [&::-webkit-scrollbar-thumb]:h-[50px] [&::-webkit-scrollbar-thumb]:bg-[#999] [&::-webkit-scrollbar-thumb]:rounded",
  selectArrow: "absolute right-3 text-[0.8rem] cursor-pointer peer-focus:text-primary peer-data-[te-input-focused]:text-primary group-data-[te-was-validated]/validation:peer-valid:text-green-600 group-data-[te-was-validated]/validation:peer-invalid:text-[rgb(220,76,100)] w-5 h-5",
  selectArrowWhite: "text-gray-50 peer-focus:!text-white peer-data-[te-input-focused]:!text-white",
  selectArrowDefault: "top-2",
  selectArrowLg: "top-[13px]",
  selectArrowSm: "top-1",
  selectClearBtn: "absolute top-2 right-9 text-black cursor-pointer focus:text-primary outline-none dark:text-gray-200",
  selectClearBtnWhite: "!text-gray-50",
  selectClearBtnDefault: "top-2 text-base",
  selectClearBtnLg: "top-[11px] text-base",
  selectClearBtnSm: "top-1 text-[0.8rem]",
  selectDropdownContainer: "z-[1070]",
  selectFakeValue: "transform-none hidden data-[te-input-state-active]:block",
  selectFilterInput: "relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition duration-300 ease-in-out motion-reduce:transition-none focus:border-primary focus:text-gray-700 focus:shadow-te-primary focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-200",
  selectInput: "peer block min-h-[auto] w-full rounded border-0 bg-transparent outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-gray-200 dark:placeholder:text-gray-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 cursor-pointer data-[te-input-disabled]:bg-[#e9ecef] data-[te-input-disabled]:cursor-default group-data-[te-was-validated]/validation:mb-4 dark:data-[te-input-disabled]:bg-zinc-600",
  selectInputWhite: "!text-gray-50",
  selectInputSizeDefault: "py-[0.32rem] px-3 leading-[1.6]",
  selectInputSizeLg: "py-[0.32rem] px-3 leading-[2.15]",
  selectInputSizeSm: "py-[0.33rem] px-3 text-xs leading-[1.5]",
  selectLabel: "pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate text-gray-500 transition-all duration-200 ease-out peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-200 dark:peer-focus:text-gray-200 data-[te-input-state-active]:scale-[0.8] dark:peer-focus:text-primary",
  selectLabelWhite: "!text-gray-50",
  selectLabelSizeDefault: "pt-[0.37rem] leading-[1.6] peer-focus:-translate-y-[0.9rem] peer-data-[te-input-state-active]:-translate-y-[0.9rem] data-[te-input-state-active]:-translate-y-[0.9rem]",
  selectLabelSizeLg: "pt-[0.37rem] leading-[2.15] peer-focus:-translate-y-[1.15rem] peer-data-[te-input-state-active]:-translate-y-[1.15rem] data-[te-input-state-active]:-translate-y-[1.15rem]",
  selectLabelSizeSm: "pt-[0.37rem] text-xs leading-[1.5] peer-focus:-translate-y-[0.75rem] peer-data-[te-input-state-active]:-translate-y-[0.75rem] data-[te-input-state-active]:-translate-y-[0.75rem]",
  selectOption: "flex flex-row items-center justify-between w-full px-4 truncate text-gray-700 bg-transparent select-none cursor-pointer data-[te-input-multiple-active]:bg-black/5 hover:[&:not([data-te-select-option-disabled])]:bg-black/5 data-[te-input-state-active]:bg-black/5 data-[te-select-option-selected]:data-[te-input-state-active]:bg-black/5 data-[te-select-selected]:data-[te-select-option-disabled]:cursor-default data-[te-select-selected]:data-[te-select-option-disabled]:text-gray-400 data-[te-select-selected]:data-[te-select-option-disabled]:bg-transparent data-[te-select-option-selected]:bg-black/[0.02] data-[te-select-option-disabled]:text-gray-400 data-[te-select-option-disabled]:cursor-default group-data-[te-select-option-group-ref]/opt:pl-7 dark:text-gray-200 dark:hover:[&:not([data-te-select-option-disabled])]:bg-white/30 dark:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-selected]:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-disabled]:text-gray-400 dark:data-[te-input-multiple-active]:bg-white/30",
  selectOptionGroup: "group/opt",
  selectOptionGroupLabel: "flex flex-row items-center w-full px-4 truncate bg-transparent text-black/50 select-none dark:text-gray-300",
  selectOptionIcon: "w-7 h-7 rounded-full",
  selectOptionSecondaryText: "block text-[0.8rem] text-gray-500 dark:text-gray-300",
  selectOptionText: "group",
  selectValidationValid: "hidden absolute -mt-3 w-auto text-sm text-green-600 cursor-pointer group-data-[te-was-validated]/validation:peer-valid:block",
  selectValidationInvalid: "hidden absolute -mt-3 w-auto text-sm text-[rgb(220,76,100)] cursor-pointer group-data-[te-was-validated]/validation:peer-invalid:block"
}, Fm = {
  dropdown: "string",
  formCheckInput: "string",
  formOutline: "string",
  initialized: "string",
  inputGroup: "string",
  noResult: "string",
  optionsList: "string",
  optionsWrapper: "string",
  optionsWrapperScrollbar: "string",
  selectArrow: "string",
  selectArrowDefault: "string",
  selectArrowLg: "string",
  selectArrowSm: "string",
  selectClearBtn: "string",
  selectClearBtnDefault: "string",
  selectClearBtnLg: "string",
  selectClearBtnSm: "string",
  selectDropdownContainer: "string",
  selectFakeValue: "string",
  selectFilterInput: "string",
  selectInput: "string",
  selectInputSizeDefault: "string",
  selectInputSizeLg: "string",
  selectInputSizeSm: "string",
  selectLabel: "string",
  selectLabelSizeDefault: "string",
  selectLabelSizeLg: "string",
  selectLabelSizeSm: "string",
  selectOption: "string",
  selectOptionGroup: "string",
  selectOptionGroupLabel: "string",
  selectOptionIcon: "string",
  selectOptionSecondaryText: "string",
  selectOptionText: "string"
};
class Nl {
  constructor(t, e, i) {
    this._element = t, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._optionsToRender = this._getOptionsToRender(t), this._plainOptions = this._getPlainOptions(this._optionsToRender), this._filteredOptionsList = null, this._selectionModel = new q_(this.multiple), this._activeOptionIndex = -1, this._activeOption = null, this._wrapperId = Ot("select-wrapper-"), this._dropdownContainerId = Ot("select-dropdown-container-"), this._selectAllId = Ot("select-all-"), this._debounceTimeoutId = null, this._dropdownHeight = this._config.selectOptionHeight * this._config.selectVisibleOptions, this._popper = null, this._input = null, this._label = h.next(this._element, Sm)[0], this._notch = null, this._fakeValue = null, this._isFakeValueActive = !1, this._customContent = h.next(
      t,
      Nm
    )[0], this._toggleButton = null, this._elementToggle = null, this._wrapper = null, this._inputEl = null, this._dropdownContainer = null, this._container = null, this._selectAllOption = null, this._init(), this._mutationObserver = null, this._isOpen = !1, this._addMutationObserver(), this._element && I.setData(t, ri, this);
  }
  static get NAME() {
    return yn;
  }
  get filterInput() {
    return h.findOne(
      Dm,
      this._dropdownContainer
    );
  }
  get dropdown() {
    return h.findOne(Im, this._dropdownContainer);
  }
  get optionsList() {
    return h.findOne(
      da,
      this._dropdownContainer
    );
  }
  get optionsWrapper() {
    return h.findOne(
      $m,
      this._dropdownContainer
    );
  }
  get clearButton() {
    return h.findOne(Mm, this._wrapper);
  }
  get options() {
    return this._filteredOptionsList ? this._filteredOptionsList : this._plainOptions;
  }
  get value() {
    return this.multiple ? this._selectionModel.values : this._selectionModel.value;
  }
  get multiple() {
    return this._config.multiple;
  }
  get hasSelectAll() {
    return this.multiple && this._config.selectAll;
  }
  get hasSelection() {
    return this._selectionModel.selection || this._selectionModel.selections.length > 0;
  }
  _getConfig(t) {
    const e = p.getDataAttributes(this._element);
    return t = {
      ...Bm,
      ...e,
      ...t
    }, this._element.hasAttribute("multiple") && (t.multiple = !0), this._element.hasAttribute("disabled") && (t.disabled = !0), this._element.tabIndex && (t.tabIndex = this._element.getAttribute("tabIndex")), N(yn, t, Vm), t;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...Wm,
      ...e,
      ...t
    }, N(yn, t, Fm), t;
  }
  _getOptionsToRender(t) {
    const e = [];
    return t.childNodes.forEach((n) => {
      if (n.nodeName === "OPTGROUP") {
        const o = {
          id: Ot("group-"),
          label: n.label,
          disabled: n.hasAttribute("disabled"),
          hidden: n.hasAttribute("hidden"),
          options: []
        };
        n.childNodes.forEach((a) => {
          a.nodeName === "OPTION" && o.options.push(
            this._createOptionObject(a, o)
          );
        }), e.push(o);
      } else
        n.nodeName === "OPTION" && e.push(this._createOptionObject(n));
    }), e;
  }
  _getPlainOptions(t) {
    if (!h.findOne("optgroup", this._element))
      return t;
    const i = [];
    return t.forEach((n) => {
      Object.prototype.hasOwnProperty.call(
        n,
        "options"
      ) ? n.options.forEach((r) => {
        i.push(r);
      }) : i.push(n);
    }), i;
  }
  _createOptionObject(t, e = {}) {
    const i = Ot("option-"), n = e.id ? e.id : null, o = e.disabled ? e.disabled : !1, r = t.selected || t.hasAttribute(ei), a = t.hasAttribute("disabled") || o, l = t.hasAttribute("hidden") || e && e.hidden, c = this.multiple, d = t.value, _ = t.label, f = p.getDataAttribute(
      t,
      "selectSecondaryText"
    ), m = p.getDataAttribute(t, "select-icon");
    return new sa(
      i,
      t,
      c,
      d,
      _,
      r,
      a,
      l,
      f,
      n,
      m
    );
  }
  _getNavigationOptions() {
    const t = this.options.filter((e) => !e.hidden);
    return this.hasSelectAll ? [this._selectAllOption, ...t] : t;
  }
  _init() {
    this._renderMaterialWrapper(), this._wrapper = h.findOne(`#${this._wrapperId}`), this._input = h.findOne(ca, this._wrapper), this._config.disabled && this._input.setAttribute(wn, "");
    const t = this._config.selectContainer;
    t === "body" ? this._container = document.body : this._container = h.findOne(t), this._initOutlineInput(), this._setDefaultSelections(), this._updateInputValue(), this._appendFakeValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this._bindComponentEvents(), this.hasSelectAll && (this._selectAllOption = this._createSelectAllOption()), this._dropdownContainer = na(
      this._dropdownContainerId,
      this._config,
      this._input.offsetWidth,
      this._dropdownHeight,
      this._selectAllOption,
      this._optionsToRender,
      this._customContent,
      this._classes
    ), this._setFirstActiveOption(), this._listenToFocusChange();
  }
  _renderMaterialWrapper() {
    const t = pm(
      this._wrapperId,
      this._config,
      this._label,
      this._classes
    );
    this._element.parentNode.insertBefore(t, this._element), p.addClass(this._element, this._classes.initialized), t.appendChild(this._element);
  }
  _initOutlineInput() {
    const t = h.findOne(
      ha,
      this._wrapper
    );
    new V(t, {
      inputFormWhite: this._config.selectFormWhite
    }).init(), this._notch = h.findOne(kn, this._wrapper);
  }
  _bindComponentEvents() {
    this._listenToComponentKeydown(), this._listenToWrapperClick(), this._listenToClearBtnClick(), this._listenToClearBtnKeydown();
  }
  _setDefaultSelections() {
    this.options.forEach((t) => {
      t.selected && this._selectionModel.select(t);
    });
  }
  _listenToComponentKeydown() {
    u.on(this._wrapper, "keydown", this._handleKeydown.bind(this));
  }
  _handleKeydown(t) {
    this._isOpen && !this._config.selectFilter ? this._handleOpenKeydown(t) : this._handleClosedKeydown(t);
  }
  _handleOpenKeydown(t) {
    const e = t.keyCode, i = e === Is || e === rt && t.altKey || e === fi;
    if (e === fi && this._config.selectAutoSelect && !this.multiple && this._handleAutoSelection(this._activeOption), i) {
      this.close(), this._input.focus();
      return;
    }
    switch (e) {
      case U:
        this._setNextOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case rt:
        this._setPreviousOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case Le:
        this._setFirstOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case Me:
        this._setLastOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case lt:
        t.preventDefault(), this._activeOption && (this.hasSelectAll && this._activeOptionIndex === 0 ? this._handleSelectAll() : this._handleSelection(this._activeOption));
        return;
      default:
        return;
    }
    t.preventDefault();
  }
  _handleClosedKeydown(t) {
    const e = t.keyCode;
    if (e === lt && t.preventDefault(), (e === lt || e === U && t.altKey || e === U && this.multiple) && this.open(), this.multiple)
      switch (e) {
        case U:
          this.open();
          break;
        case rt:
          this.open();
          break;
        default:
          return;
      }
    else
      switch (e) {
        case U:
          this._setNextOptionActive(), this._handleSelection(this._activeOption);
          break;
        case rt:
          this._setPreviousOptionActive(), this._handleSelection(this._activeOption);
          break;
        case Le:
          this._setFirstOptionActive(), this._handleSelection(this._activeOption);
          break;
        case Me:
          this._setLastOptionActive(), this._handleSelection(this._activeOption);
          break;
        default:
          return;
      }
    t.preventDefault();
  }
  _scrollToOption(t) {
    if (!t)
      return;
    let e;
    const i = this.options.filter((d) => !d.hidden);
    this.hasSelectAll ? e = i.indexOf(t) + 1 : e = i.indexOf(t);
    const n = this._getNumberOfGroupsBeforeOption(e), o = e + n, r = this.optionsWrapper, a = r.offsetHeight, l = this._config.selectOptionHeight, c = r.scrollTop;
    if (e > -1) {
      const d = o * l, _ = d + l > c + a;
      d < c ? r.scrollTop = d : _ ? r.scrollTop = d - a + l : r.scrollTop = c;
    }
  }
  _getNumberOfGroupsBeforeOption(t) {
    const e = this.options.filter((r) => !r.hidden), i = this._optionsToRender.filter((r) => !r.hidden), n = this.hasSelectAll ? t - 1 : t;
    let o = 0;
    for (let r = 0; r <= n; r++)
      e[r].groupId && i[o] && i[o].id && e[r].groupId === i[o].id && o++;
    return o;
  }
  _setNextOptionActive() {
    let t = this._activeOptionIndex + 1;
    const e = this._getNavigationOptions();
    if (e[t]) {
      for (; e[t].disabled; )
        if (t += 1, !e[t])
          return;
      this._updateActiveOption(e[t], t);
    }
  }
  _setPreviousOptionActive() {
    let t = this._activeOptionIndex - 1;
    const e = this._getNavigationOptions();
    if (e[t]) {
      for (; e[t].disabled; )
        if (t -= 1, !e[t])
          return;
      this._updateActiveOption(e[t], t);
    }
  }
  _setFirstOptionActive() {
    const e = this._getNavigationOptions();
    this._updateActiveOption(e[0], 0);
  }
  _setLastOptionActive() {
    const t = this._getNavigationOptions(), e = t.length - 1;
    this._updateActiveOption(t[e], e);
  }
  _updateActiveOption(t, e) {
    const i = this._activeOption;
    i && i.removeActiveStyles(), t.setActiveStyles(), this._activeOptionIndex = e, this._activeOption = t;
  }
  _listenToWrapperClick() {
    u.on(this._wrapper, "click", () => {
      this.toggle();
    });
  }
  _listenToClearBtnClick() {
    u.on(this.clearButton, "click", (t) => {
      t.preventDefault(), t.stopPropagation(), this._handleClear();
    });
  }
  _listenToClearBtnKeydown() {
    u.on(this.clearButton, "keydown", (t) => {
      t.keyCode === lt && (this._handleClear(), t.preventDefault(), t.stopPropagation());
    });
  }
  _handleClear() {
    if (this.multiple)
      this._selectionModel.clear(), this._deselectAllOptions(this.options), this.hasSelectAll && this._updateSelectAllState();
    else {
      const t = this._selectionModel.selection;
      this._selectionModel.clear(), t.deselect();
    }
    this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this._emitValueChangeEvent(null), this._emitNativeChangeEvent();
  }
  _listenToOptionsClick() {
    u.on(this.optionsWrapper, "click", (t) => {
      if (t.target.hasAttribute(
        Om
      ))
        return;
      const i = t.target.nodeName === "DIV" ? t.target : h.closest(t.target, Lm);
      if (i.hasAttribute(xm)) {
        this._handleSelectAll();
        return;
      }
      const o = i.dataset.teId, r = this.options.find((a) => a.id === o);
      r && !r.disabled && this._handleSelection(r);
    });
  }
  _handleSelectAll() {
    this._selectAllOption.selected ? (this._deselectAllOptions(this.options), this._selectAllOption.deselect()) : (this._selectAllOptions(this.options), this._selectAllOption.select()), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this._emitValueChangeEvent(this.value), this._emitNativeChangeEvent();
  }
  _selectAllOptions(t) {
    t.forEach((e) => {
      !e.selected && !e.disabled && (this._selectionModel.select(e), e.select());
    });
  }
  _deselectAllOptions(t) {
    t.forEach((e) => {
      e.selected && !e.disabled && (this._selectionModel.deselect(e), e.deselect());
    });
  }
  _handleSelection(t) {
    this.multiple ? (this._handleMultiSelection(t), this.hasSelectAll && this._updateSelectAllState()) : this._handleSingleSelection(t), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility();
  }
  _handleAutoSelection(t) {
    this._singleOptionSelect(t), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility();
  }
  _handleSingleSelection(t) {
    this._singleOptionSelect(t), this.close(), this._input.focus();
  }
  _singleOptionSelect(t) {
    const e = this._selectionModel.selections[0];
    e && e !== t && (this._selectionModel.deselect(e), e.deselect(), e.node.setAttribute(ei, !1), u.trigger(this._element, ra, {
      value: e.value
    })), (!e || e && t !== e) && (this._selectionModel.select(t), t.select(), t.node.setAttribute(ei, !0), u.trigger(this._element, oa, {
      value: t.value
    }), this._emitValueChangeEvent(this.value), this._emitNativeChangeEvent());
  }
  _handleMultiSelection(t) {
    t.selected ? (this._selectionModel.deselect(t), t.deselect(), t.node.setAttribute(ei, !1), u.trigger(this._element, ra, {
      value: t.value
    })) : (this._selectionModel.select(t), t.select(), t.node.setAttribute(ei, !0), u.trigger(this._element, oa, {
      value: t.value
    })), this._emitValueChangeEvent(this.value), this._emitNativeChangeEvent();
  }
  _emitValueChangeEvent(t) {
    u.trigger(this._element, wm, { value: t });
  }
  _emitNativeChangeEvent() {
    u.trigger(this._element, km);
  }
  _updateInputValue() {
    const t = this.multiple ? this._selectionModel.labels : this._selectionModel.label;
    let e;
    this.multiple && this._config.selectDisplayedLabels !== -1 && this._selectionModel.selections.length > this._config.selectDisplayedLabels ? e = `${this._selectionModel.selections.length} ${this._config.selectOptionsSelectedLabel}` : e = t, !this.multiple && !this._isSelectionValid(this._selectionModel.selection) ? this._input.value = "" : this._isLabelEmpty(this._selectionModel.selection) ? this._input.value = " " : e ? this._input.value = e : this.multiple || !this._optionsToRender[0] ? this._input.value = "" : this._input.value = this._optionsToRender[0].label;
  }
  _isSelectionValid(t) {
    return !(t && (t.disabled || t.value === ""));
  }
  _isLabelEmpty(t) {
    return !!(t && t.label === "");
  }
  _appendFakeValue() {
    if (!this._selectionModel.selection || this._selectionModel._multiple)
      return;
    const t = this._selectionModel.selection.label;
    this._fakeValue = Cm(t, this._classes), h.findOne(
      ha,
      this._wrapper
    ).appendChild(this._fakeValue);
  }
  _updateLabelPosition() {
    const t = this._element.hasAttribute(aa), e = this._input.value !== "";
    this._label && (t && (e || this._isOpen || this._isFakeValueActive) ? (this._label.setAttribute(q, ""), this._notch.setAttribute(q, "")) : (this._label.removeAttribute(q), this._notch.removeAttribute(q, "")));
  }
  _updateLabelPositionWhileClosing() {
    this._label && (this._input.value !== "" || this._isFakeValueActive ? (this._label.setAttribute(q, ""), this._notch.setAttribute(q, "")) : (this._label.removeAttribute(q), this._notch.removeAttribute(q)));
  }
  _updateFakeLabelPosition() {
    this._fakeValue && (this._input.value === "" && this._fakeValue.innerHTML !== "" ? (this._isFakeValueActive = !0, this._fakeValue.setAttribute(q, "")) : (this._isFakeValueActive = !1, this._fakeValue.removeAttribute(q)));
  }
  _updateClearButtonVisibility() {
    if (!this.clearButton)
      return;
    this._selectionModel.selection || this._selectionModel.selections.length > 0 ? p.addStyle(this.clearButton, { display: "block" }) : p.addStyle(this.clearButton, { display: "none" });
  }
  _updateSelectAllState() {
    const t = this._selectAllOption.selected, e = jn(this.options);
    !e && t ? this._selectAllOption.deselect() : e && !t && this._selectAllOption.select();
  }
  toggle() {
    this._isOpen ? this.close() : this.open();
  }
  open() {
    const t = this._config.disabled, e = u.trigger(this._element, ym);
    this._isOpen || t || e.defaultPrevented || (this._openDropdown(), this._updateDropdownWidth(), this._setFirstActiveOption(), this._scrollToOption(this._activeOption), this._config.selectFilter && (setTimeout(() => {
      this.filterInput.focus();
    }, 0), this._listenToSelectSearch(), this._listenToDropdownKeydown()), this._listenToOptionsClick(), this._listenToOutsideClick(), this._listenToWindowResize(), this._isOpen = !0, this._updateLabelPosition(), this._setInputActiveStyles());
  }
  _openDropdown() {
    this._popper = je(this._input, this._dropdownContainer, {
      placement: "bottom-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 1]
          }
        }
      ]
    }), this._container.appendChild(this._dropdownContainer), setTimeout(() => {
      this.dropdown.setAttribute(la, "");
    }, 0);
  }
  _updateDropdownWidth() {
    const t = this._input.offsetWidth;
    p.addStyle(this._dropdownContainer, { width: `${t}px` });
  }
  _setFirstActiveOption() {
    const t = this._getNavigationOptions(), e = this._activeOption;
    e && e.removeActiveStyles();
    const i = this.multiple ? this._selectionModel.selections[0] : this._selectionModel.selection;
    i ? (this._activeOption = i, i.setActiveStyles(), this._activeOptionIndex = t.findIndex(
      (n) => n === i
    )) : (this._activeOption = null, this._activeOptionIndex = -1);
  }
  _setInputActiveStyles() {
    this._input.setAttribute(Wt, ""), h.findOne(kn, this._wrapper).setAttribute(
      Wt,
      ""
    );
  }
  _listenToWindowResize() {
    u.on(window, "resize", this._handleWindowResize.bind(this));
  }
  _handleWindowResize() {
    this._dropdownContainer && this._updateDropdownWidth();
  }
  _listenToSelectSearch() {
    this.filterInput.addEventListener("input", (t) => {
      const e = t.target.value, i = this._config.selectFilterDebounce;
      this._debounceFilter(e, i);
    });
  }
  _debounceFilter(t, e) {
    this._debounceTimeoutId && clearTimeout(this._debounceTimeoutId), this._debounceTimeoutId = setTimeout(() => {
      this._filterOptions(t);
    }, e);
  }
  _filterOptions(t) {
    const e = [];
    this._optionsToRender.forEach((o) => {
      const r = Object.prototype.hasOwnProperty.call(
        o,
        "options"
      ), a = !r && o.label.toLowerCase().includes(t.toLowerCase()), l = {};
      r && (l.label = o.label, l.options = this._filter(t, o.options), l.options.length > 0 && e.push(l)), a && e.push(o);
    });
    const i = this._config.selectNoResultText !== "", n = e.length !== 0;
    if (n)
      this._updateOptionsListTemplate(e), this._popper.forceUpdate(), this._filteredOptionsList = this._getPlainOptions(e), this.hasSelectAll && this._updateSelectAllState(), this._setFirstActiveOption();
    else if (!n && i) {
      const o = this._getNoResultTemplate();
      this.optionsWrapper.innerHTML = o;
    }
  }
  _updateOptionsListTemplate(t) {
    const e = h.findOne(da, this._dropdownContainer) || h.findOne(Rm, this._dropdownContainer), i = Dl(
      t,
      this._selectAllOption,
      this._config,
      this._classes
    );
    this.optionsWrapper.removeChild(e), this.optionsWrapper.appendChild(i);
  }
  _getNoResultTemplate() {
    return `<div class="${this._classes.noResult}" ${Ml} style="height: ${this._config.selectOptionHeight}px">${this._config.selectNoResultText}</div>`;
  }
  _filter(t, e) {
    const i = t.toLowerCase();
    return e.filter(
      (n) => n.label.toLowerCase().includes(i)
    );
  }
  _listenToDropdownKeydown() {
    u.on(
      this.dropdown,
      "keydown",
      this._handleOpenKeydown.bind(this)
    );
  }
  _listenToOutsideClick() {
    this._outsideClick = this._handleOutSideClick.bind(this), u.on(document, "click", this._outsideClick);
  }
  _listenToFocusChange(t = !0) {
    if (t === !1) {
      u.remove(
        this._input,
        "focus",
        () => this._notch.setAttribute(Wt, "")
      ), u.remove(
        this._input,
        "blur",
        () => this._notch.removeAttribute(Wt)
      );
      return;
    }
    u.on(
      this._input,
      "focus",
      () => this._notch.setAttribute(Wt, "")
    ), u.on(
      this._input,
      "blur",
      () => this._notch.removeAttribute(Wt)
    );
  }
  _handleOutSideClick(t) {
    const e = this._wrapper && this._wrapper.contains(t.target), i = t.target === this._dropdownContainer, n = this._dropdownContainer && this._dropdownContainer.contains(t.target);
    let o;
    this._toggleButton || (this._elementToggle = h.find(Pm)), this._elementToggle && this._elementToggle.forEach((r) => {
      const a = p.getDataAttribute(
        r,
        "select-toggle"
      );
      (a === this._element.id || this._element.classList.contains(a)) && (this._toggleButton = r, o = this._toggleButton.contains(t.target));
    }), !e && !i && !n && !o && this.close();
  }
  close() {
    const t = u.trigger(this._element, Am);
    !this._isOpen || t.defaultPrevented || (this._config.selectFilter && this.hasSelectAll && (this._resetFilterState(), this._updateOptionsListTemplate(this._optionsToRender), this._config.multiple && this._updateSelectAllState()), this._removeDropdownEvents(), this.dropdown.removeAttribute(la), setTimeout(() => {
      this._input.removeAttribute(Wt), this._input.blur(), h.findOne(kn, this._wrapper).removeAttribute(
        Wt
      ), this._label && !this.hasSelection && (this._label.removeAttribute(q), this._notch.setAttribute(q, ""), this._input.removeAttribute(q), this._notch.removeAttribute(q)), this._updateLabelPositionWhileClosing();
    }, 0), setTimeout(() => {
      this._container && this._dropdownContainer.parentNode === this._container && this._container.removeChild(this._dropdownContainer), this._popper.destroy(), this._isOpen = !1, u.off(this.dropdown, "transitionend");
    }, Hm));
  }
  _resetFilterState() {
    this.filterInput.value = "", this._filteredOptionsList = null;
  }
  _removeDropdownEvents() {
    u.off(document, "click", this._outsideClick), this._config.selectFilter && u.off(this.dropdown, "keydown"), u.off(this.optionsWrapper, "click");
  }
  _addMutationObserver() {
    this._mutationObserver = new MutationObserver(() => {
      this._wrapper && (this._updateSelections(), this._updateDisabledState());
    }), this._observeMutationObserver();
  }
  _updateSelections() {
    this._optionsToRender = this._getOptionsToRender(this._element), this._plainOptions = this._getPlainOptions(this._optionsToRender), this._selectionModel.clear(), this._setDefaultSelections(), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this.hasSelectAll && this._updateSelectAllState();
    const t = this._config.filter && this.filterInput && this.filterInput.value;
    this._isOpen && !t ? (this._updateOptionsListTemplate(this._optionsToRender), this._setFirstActiveOption()) : this._isOpen && t ? (this._filterOptions(this.filterInput.value), this._setFirstActiveOption()) : this._dropdownContainer = na(
      this._dropdownContainerId,
      this._config,
      this._input.offsetWidth,
      this._dropdownHeight,
      this._selectAllOption,
      this._optionsToRender,
      this._customContent,
      this._classes
    );
  }
  _updateDisabledState() {
    const t = h.findOne(ca, this._wrapper);
    this._element.hasAttribute("disabled") ? (this._config.disabled = !0, t.setAttribute("disabled", ""), t.setAttribute(wn, "")) : (this._config.disabled = !1, t.removeAttribute("disabled"), t.removeAttribute(wn));
  }
  _observeMutationObserver() {
    this._mutationObserver && this._mutationObserver.observe(this._element, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    });
  }
  _disconnectMutationObserver() {
    this.mutationObserver && (this._mutationObserver.disconnect(), this._mutationObserver = null);
  }
  _createSelectAllOption() {
    const t = this._selectAllId, e = null, i = !0, n = "select-all", o = this._config.selectAllLabel, r = jn(this.options), a = !1, l = !1, c = null, d = null, _ = null;
    return new sa(
      t,
      e,
      i,
      n,
      o,
      r,
      a,
      l,
      c,
      d,
      _
    );
  }
  dispose() {
    this._removeComponentEvents(), this._destroyMaterialSelect(), this._listenToFocusChange(!1), I.removeData(this._element, ri);
  }
  _removeComponentEvents() {
    u.off(this.input, "click"), u.off(this.wrapper, this._handleKeydown.bind(this)), u.off(this.clearButton, "click"), u.off(this.clearButton, "keydown"), u.off(window, "resize", this._handleWindowResize.bind(this));
  }
  _destroyMaterialSelect() {
    this._isOpen && this.close(), this._destroyMaterialTemplate();
  }
  _destroyMaterialTemplate() {
    const t = this._wrapper.parentNode, e = h.find("label", this._wrapper);
    t.appendChild(this._element), e.forEach((i) => {
      t.appendChild(i);
    }), e.forEach((i) => {
      i.removeAttribute(q);
    }), p.removeClass(this._element, this._classes.initialized), this._element.removeActiveStyles(aa), t.removeChild(this._wrapper);
  }
  setValue(t) {
    this.options.filter((i) => i.selected).forEach((i) => i.nativeOption.selected = !1), Array.isArray(t) ? t.forEach((i) => {
      this._selectByValue(i);
    }) : this._selectByValue(t), this._updateSelections();
  }
  _selectByValue(t) {
    const e = this.options.find(
      (i) => i.value === t
    );
    return e ? (e.nativeOption.selected = !0, !0) : !1;
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, ri);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new Nl(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, ri);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Ym = (s) => {
  Aa(() => {
    const t = Ca();
    if (t) {
      const e = s.NAME, i = t.fn[e];
      t.fn[e] = s.jQueryInterface, t.fn[e].Constructor = s, t.fn[e].noConflict = () => (t.fn[e] = i, s.jQueryInterface);
    }
  });
}, jm = (s, t) => {
  u.on(
    document,
    `click.te.${s.NAME}`,
    t,
    function(e) {
      e.preventDefault(), s.getOrCreateInstance(this).toggle();
    }
  );
}, Km = (s, t) => {
  u.on(
    document,
    `click.te.${s.NAME}.data-api`,
    t,
    function(e) {
      if (["A", "AREA"].includes(this.tagName) && e.preventDefault(), ue(this))
        return;
      s.getOrCreateInstance(this).show();
    }
  );
}, Um = (s, t) => {
  u.on(
    document,
    `click.te.${s.NAME}.data-api`,
    t,
    function(e) {
      const i = Xt(this);
      if (["A", "AREA"].includes(this.tagName) && e.preventDefault(), ue(this))
        return;
      u.one(i, s.EVENT_HIDDEN, () => {
        St(this) && this.focus();
      });
      const n = h.findOne(s.OPEN_SELECTOR);
      n && n !== i && s.getInstance(n).hide(), s.getOrCreateInstance(i).toggle(this);
    }
  );
}, zm = (s, t) => {
  u.on(
    document,
    `click.te.${s.NAME}`,
    t,
    (e) => {
      e.preventDefault();
      const i = e.target.closest(t);
      s.getOrCreateInstance(i).toggle();
    }
  );
}, Xm = (s, t) => {
  u.on(
    document,
    `click.te.${s.NAME}`,
    t,
    function(e) {
      const i = Xt(this);
      ["A", "AREA"].includes(this.tagName) && e.preventDefault(), u.one(i, s.EVENT_SHOW, (r) => {
        r.defaultPrevented || u.one(i, s.EVENT_HIDDEN, () => {
          St(this) && this.focus();
        });
      });
      const n = h.findOne(
        `[${s.OPEN_SELECTOR}="true"]`
      );
      n && s.getInstance(n).hide(), s.getOrCreateInstance(i).toggle(this);
    }
  );
}, Gm = (s, t) => {
  u.one(
    document,
    "mousedown",
    t,
    s.autoInitial(new s())
  );
}, qm = (s, t) => {
  u.on(
    document,
    `click.te.${s.NAME}.data-api`,
    t,
    function(e) {
      (e.target.tagName === "A" || e.delegateTarget && e.delegateTarget.tagName === "A") && e.preventDefault();
      const i = Xn(this);
      h.find(i).forEach((o) => {
        s.getOrCreateInstance(o, { toggle: !1 }).toggle();
      });
    }
  );
}, Ft = {
  plugins: {
    legend: {
      labels: {
        color: "rgb(102,102,102)"
      }
    }
  }
}, gs = {
  line: {
    options: {
      ...Ft,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.0)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
          tension: 0
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgb(59, 112, 202)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      },
      tooltips: {
        intersect: !1,
        mode: "index"
      },
      datasets: {
        borderColor: "red"
      },
      scales: {
        x: {
          stacked: !0,
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          stacked: !1,
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  },
  bar: {
    options: {
      ...Ft,
      backgroundColor: "rgb(59, 112, 202)",
      borderWidth: 0,
      responsive: !0,
      legend: {
        display: !0
      },
      tooltips: {
        intersect: !1,
        mode: "index"
      },
      scales: {
        x: {
          stacked: !0,
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          stacked: !0,
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  },
  pie: {
    options: {
      ...Ft,
      elements: {
        arc: { backgroundColor: "rgb(59, 112, 202)" }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  doughnut: {
    options: {
      ...Ft,
      elements: {
        arc: { backgroundColor: "rgb(59, 112, 202)" }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  polarArea: {
    options: {
      ...Ft,
      elements: {
        arc: { backgroundColor: "rgba(59, 112, 202, 0.5)" }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  radar: {
    options: {
      ...Ft,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.5)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgb(59, 112, 202)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  scatter: {
    options: {
      ...Ft,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.5)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
          tension: 0
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgba(59, 112, 202, 0.5)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      },
      tooltips: {
        intersect: !1,
        mode: "index"
      },
      datasets: {
        borderColor: "red"
      },
      scales: {
        x: {
          stacked: !0,
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          stacked: !1,
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  },
  bubble: {
    options: {
      ...Ft,
      elements: {
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgba(59, 112, 202, 0.5)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      },
      scales: {
        x: {
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  }
}, Qm = (s, t) => {
  const e = (o) => o[0] === "{" && o[o.length - 1] === "}" || o[0] === "[" && o[o.length - 1] === "]", i = (o) => typeof o != "string" ? o : e(o) ? JSON.parse(o.replace(/'/g, '"')) : o, n = (o) => {
    const r = {};
    return Object.keys(o).forEach((a) => {
      if (a.match(/dataset.*/)) {
        const l = a.slice(7, 8).toLowerCase().concat(a.slice(8));
        r[l] = i(o[a]);
      }
    }), r;
  };
  h.find(t).forEach((o) => {
    if (p.getDataAttribute(o, "chart") !== "bubble" && p.getDataAttribute(o, "chart") !== "scatter") {
      const r = p.getDataAttributes(o), a = {
        data: {
          datasets: [n(r)]
        }
      };
      return r.chart && (a.type = r.chart), r.labels && (a.data.labels = JSON.parse(r.labels.replace(/'/g, '"'))), new s(o, {
        ...a,
        ...gs[a.type]
      });
    }
    return null;
  });
}, ai = {
  alert: {
    name: "Alert",
    selector: "[data-te-alert-init]",
    isToggler: !1
  },
  animation: {
    name: "Animate",
    selector: "[data-te-animation-init]",
    isToggler: !1
  },
  carousel: {
    name: "Carousel",
    selector: "[data-te-carousel-init]",
    isToggler: !1
  },
  chips: {
    name: "ChipsInput",
    selector: "[data-te-chips-init]",
    isToggler: !1
  },
  chip: {
    name: "Chip",
    selector: "[data-te-chip-init]",
    isToggler: !1
  },
  datepicker: {
    name: "Datepicker",
    selector: "[data-te-datepicker-init]",
    isToggler: !1
  },
  input: {
    name: "Input",
    selector: "[data-te-input-wrapper-init]",
    isToggler: !1
  },
  scrollspy: {
    name: "ScrollSpy",
    selector: "[data-te-spy='scroll']",
    isToggler: !1
  },
  select: {
    name: "Select",
    selector: "[data-te-select-init]",
    isToggler: !1
  },
  sidenav: {
    name: "Sidenav",
    selector: "[data-te-sidenav-init]",
    isToggler: !1
  },
  stepper: {
    name: "Stepper",
    selector: "[data-te-stepper-init]",
    isToggler: !1
  },
  timepicker: {
    name: "Timepicker",
    selector: "[data-te-timepicker-init]",
    isToggler: !1
  },
  toast: {
    name: "Toast",
    selector: "[data-te-toast-init]",
    isToggler: !1
  },
  // advancedInits
  chart: {
    name: "Chart",
    selector: "[data-te-chart]",
    isToggler: !1,
    advanced: Qm
  },
  // togglers
  button: {
    name: "Button",
    selector: "[data-te-toggle='button']",
    isToggler: !0,
    callback: zm
  },
  collapse: {
    name: "Collapse",
    selector: "[data-te-collapse-init]",
    isToggler: !0,
    callback: qm
  },
  dropdown: {
    name: "Dropdown",
    selector: "[data-te-dropdown-toggle-ref]",
    isToggler: !0,
    callback: jm
  },
  modal: {
    name: "Modal",
    selector: "[data-te-toggle='modal']",
    isToggler: !0,
    callback: Xm
  },
  ripple: {
    name: "Ripple",
    selector: "[data-te-ripple-init]",
    isToggler: !0,
    callback: Gm
  },
  offcanvas: {
    name: "Offcanvas",
    selector: "[data-te-offcanvas-toggle]",
    isToggler: !0,
    callback: Um
  },
  tab: {
    name: "Tab",
    selector: "[data-te-toggle='tab'], [data-te-toggle='pill'], [data-te-toggle='list']",
    isToggler: !0,
    callback: Km
  }
}, Zm = (s) => ai[s.NAME] || null, Jm = (s) => {
  if (!s || [].includes(s.NAME))
    return;
  [].push(s.NAME);
  const t = Zm(s), e = (t == null ? void 0 : t.isToggler) || !1;
  if (Ym(s), t != null && t.advanced) {
    t == null || t.advanced(s, t == null ? void 0 : t.selector);
    return;
  }
  if (e) {
    t == null || t.callback(s, t == null ? void 0 : t.selector);
    return;
  }
  h.find(t == null ? void 0 : t.selector).forEach((i) => {
    let n = s.getInstance(i);
    n || (n = new s(i));
  });
}, tg = (s) => {
  s.forEach((t) => Jm(t));
}, eg = (s, t = !1) => {
  const e = Object.keys(ai).map((i) => {
    if (!!document.body.querySelector(ai[i].selector)) {
      const o = s[ai[i].name];
      return !o && ![].includes(i) && t && console.warn(
        `Please import ${ai[i].name} from "tw-elements" package and add it to a object parameter inside "initTE" function`
      ), o;
    }
  });
  tg(e);
}, ig = ({ inputID: s, labelText: t }, e) => (eg({ Input: V }, !1), `<div data-te-chips-input-wrapper data-te-input-wrapper-init class="${e.chipsInputWrapper}">
      <input
          type="text"
          class="${e.chipsInput}"
          id="${s}"
          placeholder="Example label" />
        <label
          for="${s}"
          class="${e.chipsLabel}"
          >${t}
        </label>

        <div data-te-input-notch-ref class="${e.chipsNotchesWrapper}">
        <div class="${e.chipsNotchesLeading}" data-te-input-notch-leading-ref style="width: 9px;"></div>
        <div class="${e.chipsNotchesMiddle}" data-te-input-notch-middle-ref style="width: 87.2px;"></div>
        <div class="${e.chipsNotchesTrailing}" data-te-input-notch-trailing-ref></div>
      </div>
    </div>`), sg = ({ text: s, iconSVG: t }, e) => `<div data-te-chip-init data-te-ripple-init class="${e.chipElement}">
    <span data-te-chip-text>${s}</span> 
      <span data-te-chip-close class="${e.chipCloseIcon}">
        ${t}
      </span>
  </div>`, bs = "chip", ng = `te.${bs}`, Rl = "data-te-chip-close", On = `[${Rl}]`, og = "delete.te.chips", rg = "select.te.chip", ag = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>', lg = {
  text: "string",
  closeIcon: "boolean",
  img: "object",
  iconSVG: "string"
}, cg = {
  text: "",
  closeIcon: !1,
  img: { path: "", alt: "" },
  iconSVG: ag
}, dg = {
  icon: "float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:text-[#8b8b8b] transition-all duration-200 ease-in-out",
  chipElement: "flex justify-between items-center h-[32px] leading-loose py-[5px] px-[12px] mr-4 my-[5px] text-[13px] font-normal text-[#4f4f4f] cursor-pointer bg-[#eceff1] dark:text-white dark:bg-neutral-600 rounded-[16px] transition-[opacity] duration-300 ease-linear [word-wrap: break-word] shadow-none normal-case hover:!shadow-none active:bg-[#cacfd1] inline-block font-medium leading-normal text-[#4f4f4f] text-center no-underline align-middle cursor-pointer select-none border-[.125rem] border-solid border-transparent py-1.5 px-3 text-xs rounded",
  chipCloseIcon: "w-4 float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:fill-[#8b8b8b] dark:fill-gray-400 dark:hover:fill-gray-100 transition-all duration-200 ease-in-out"
}, hg = {
  icon: "string",
  chipElement: "string",
  chipCloseIcon: "string"
};
class ii {
  constructor(t, e = {}, i) {
    this._element = t, this._options = this._getConfig(e), this._classes = this._getClasses(i);
  }
  // Getters
  static get NAME() {
    return bs;
  }
  // Public
  init() {
    this._appendCloseIcon(), this._handleDelete(), this._handleTextChip(), this._handleClickOnChip();
  }
  dispose() {
    this._element = null, this._options = null, u.off(this._element, "click");
  }
  appendChip() {
    const { text: t, closeIcon: e, iconSVG: i } = this._options;
    return sg({ text: t, closeIcon: e, iconSVG: i }, this._classes);
  }
  // Private
  _appendCloseIcon(t = this._element) {
    if (!(h.find(On, this._element).length > 0) && this._options.closeIcon) {
      const e = M("span");
      e.classList = this._classes.icon, e.setAttribute(Rl), e.innerHTML = this._options.iconSVG, t.insertAdjacentElement("beforeend", e);
    }
  }
  _handleClickOnChip() {
    u.on(this._element, "click", (t) => {
      const { textContent: e } = t.target, i = {};
      i.tag = e.trim(), u.trigger(rg, { event: t, obj: i });
    });
  }
  _handleDelete() {
    h.find(
      On,
      this._element
    ).length !== 0 && u.on(this._element, "click", On, () => {
      u.trigger(this._element, og), this._element.remove();
    });
  }
  _handleTextChip() {
    this._element.innerText === "" && (this._element.innerText = this._options.text);
  }
  _getConfig(t) {
    const e = {
      ...cg,
      ...p.getDataAttributes(this._element),
      ...t
    };
    return N(bs, e, lg), e;
  }
  _getClasses(t) {
    const e = p.getDataClassAttributes(this._element);
    return t = {
      ...dg,
      ...e,
      ...t
    }, N(bs, t, hg), t;
  }
  static getInstance(t) {
    return I.getData(t, ng);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const ui = "chips", yi = `data-te-${ui}`, ua = `te.${ui}`, ug = `${yi}-init`, ft = `${yi}-active`, pa = `${yi}-initial`, Pl = `${yi}-placeholder`, pg = `${yi}-input-wrapper`, Kn = "data-te-chip-init", Hl = "data-te-chip-close", Bl = "data-te-chip-text", fg = `[${ft}]`, Un = `[${Kn}]`, _g = `${Un}${fg}`, xn = `[${Hl}]`, mg = `[${pg}]`, gg = `[${Bl}]`, bg = `[${Pl}]`, vg = "data-te-input-notch-leading-ref", Eg = "data-te-input-notch-middle-ref", Tg = `[${vg}]`, Cg = `[${Eg}]`, Ae = "data-te-input-state-active", Sn = "[data-te-input-notch-ref]", Ag = "add.te.chips", yg = "arrowDown.te.chips", wg = "arrowLeft.te.chips", kg = "arrowRight.te.chips", Og = "arrowUp.te.chips", fa = "delete.te.chips", _a = "select.te.chips", xg = {
  inputID: "string",
  parentSelector: "string",
  initialValues: "array",
  editable: "boolean",
  labelText: "string"
}, Sg = {
  inputID: Ot("chips-input-"),
  parentSelector: "",
  initialValues: [{ tag: "init1" }, { tag: "init2" }],
  editable: !1,
  labelText: "Example label"
}, Dg = {
  opacity: "opacity-0",
  inputWrapperPadding: "p-[5px]",
  transition: "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
  contentEditable: "outline-none !border-[3px] !border-solid !border-[#b2b3b4]",
  chipsInputWrapper: "relative flex items-center flex-wrap transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
  chipsInput: "peer block min-h-[auto] w-[150px] rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-gray-200 dark:placeholder:text-gray-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0",
  chipsLabel: "pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-gray-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-200 dark:peer-focus:text-gray-200",
  chipsNotchesWrapper: "group flex absolute left-0 top-0 w-full max-w-full h-full text-left pointer-events-none",
  chipsNotchesLeading: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none left-0 top-0 h-full w-2 border-r-0 rounded-l-[0.25rem] group-data-[te-input-focused]:border-r-0 group-data-[te-input-state-active]:border-r-0 border-gray-300 dark:border-gray-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  chipsNotchesMiddle: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow-0 shrink-0 basis-auto w-auto max-w-[calc(100%-1rem)] h-full border-r-0 border-l-0 group-data-[te-input-focused]:border-x-0 group-data-[te-input-state-active]:border-x-0 group-data-[te-input-focused]:border-t group-data-[te-input-state-active]:border-t group-data-[te-input-focused]:border-solid group-data-[te-input-state-active]:border-solid group-data-[te-input-focused]:border-t-transparent group-data-[te-input-state-active]:border-t-transparent border-gray-300 dark:border-gray-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  chipsNotchesTrailing: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow h-full border-l-0 rounded-r-[0.25rem] group-data-[te-input-focused]:border-l-0 group-data-[te-input-state-active]:border-l-0 border-gray-300 dark:border-gray-600 group-data-[te-input-focused]:shadow-[1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary"
}, Ig = {
  opacity: "string",
  inputWrapperPadding: "string",
  transition: "string",
  contentEditable: "string",
  chipsInputWrapper: "string",
  chipsInput: "string",
  chipsLabel: "string",
  chipsNotchesWrapper: "string",
  chipsNotchesLeading: "string",
  chipsNotchesMiddle: "string",
  chipsNotchesTrailing: "string"
};
class Zg extends ii {
  constructor(e, i = {}, n) {
    super(e, i);
    Tt(this, "_handleBlurInput", ({ target: e }) => {
      e.value.length > 0 && this._handleCreateChip(e, e.value), this.allChips.length > 0 ? (e.setAttribute(ft, ""), this.input.setAttribute(Ae, ""), h.findOne(
        Sn,
        this.input.parentNode
      ).setAttribute(Ae, ""), this.chipsInputWrapper.classList.add(
        ...this._classes.inputWrapperPadding.split(" ")
      )) : (e.removeAttribute(ft), this.input.removeAttribute(Ae), h.findOne(
        Sn,
        this.input.parentNode
      ).removeAttribute(Ae), this.chipsInputWrapper.classList.remove(
        ...this._classes.inputWrapperPadding.split(" ")
      )), this.allChips.forEach((i) => i.removeAttribute(ft));
    });
    this._element = e, this._label = null, this._labelWidth = 0, this._labelMarginLeft = 0, this._notchLeading = null, this._notchMiddle = null, this._element && I.setData(e, ua, this), this._options = this._getConfig(i), this._classes = this._getClasses(n), this.numberClicks = 0, this.init();
  }
  // Getters
  static get NAME() {
    return ui;
  }
  get activeChip() {
    return h.findOne(_g, this._element);
  }
  get input() {
    return h.findOne("input", this._element);
  }
  get allChips() {
    return h.find(Un, this._element);
  }
  get chipsInputWrapper() {
    return h.findOne(mg, this._element);
  }
  // Public
  init() {
    this._setChipsClass(), this._appendInputToElement(Pl), this._handleInitialValue(), this._handleInputText(), this._handleKeyboard(), this._handleChipsOnSelect(), this._handleEditable(), this._handleChipsFocus(), this._handleClicksOnChips(), this._getLabelData(), this._getLabelWidth(), this._getNotchData(), this._applyNotch();
  }
  dispose() {
    this._element = null, this._options = null;
  }
  // Private
  _getNotchData() {
    this._notchMiddle = h.findOne(
      Cg,
      this._element
    ), this._notchLeading = h.findOne(
      Tg,
      this._element
    );
  }
  _getLabelData() {
    this._label = h.findOne("label", this._element);
  }
  _getLabelWidth() {
    this._labelWidth = this._label.clientWidth * 0.8 + 8;
  }
  _applyNotch() {
    this._notchMiddle.style.width = `${this._labelWidth}px`, this._notchLeading.style.width = `${this._labelMarginLeft + 9}px`, this._label !== null && (this._label.style.marginLeft = `${this._labelMarginLeft}px`);
  }
  _setChipsClass() {
    this._element.setAttribute(ug, "");
  }
  _handleDeleteEvents(e) {
    const [i] = this.allChips.slice(-1);
    if (this.activeChip === null)
      i.remove(), this._handleEvents(e, fa);
    else {
      const n = this.allChips.findIndex((a) => a === this.activeChip), o = this._handleActiveChipAfterRemove(n), r = [];
      if (this.activeChip === null)
        return;
      this.activeChip.remove(), this._handleEvents(e, fa), this.numberClicks = n, o.setAttribute(ft, ""), this.allChips.forEach((a) => {
        a.hasAttribute(ft) && (r.push(a), r.length > 1 && this.allChips.forEach((l) => l.remove()));
      });
    }
  }
  _handleUpEvents(e) {
    this.numberClicks += 1, this.numberClicks === this.allChips.length + 1 && (this.numberClicks = 0), this._handleRightKeyboardArrow(this.numberClicks), this._handleEvents(e, kg), this._handleEvents(e, Og);
  }
  _handleDownEvents(e) {
    this.numberClicks -= 1, this.numberClicks <= 0 && (this.numberClicks = this.allChips.length), this._handleLeftKeyboardArrow(this.numberClicks), this._handleEvents(e, wg), this._handleEvents(e, yg);
  }
  _keyboardEvents(e) {
    const { target: i, keyCode: n, ctrlKey: o } = e;
    i.value.length > 0 || this.allChips.length === 0 || (n === Xp || n === Gp ? this._handleDeleteEvents(e) : n === $e || n === rt ? this._handleUpEvents(e) : n === Ie || n === U ? this._handleDownEvents(e) : n === 65 && o && this._handleAddActiveClass());
  }
  _handleKeyboard() {
    u.on(
      this.input,
      "keydown",
      (e) => this._keyboardEvents(e)
    );
  }
  _handleEditable() {
    const { editable: e } = this._options;
    e && this.allChips.forEach((i) => {
      u.on(i, "dblclick", (n) => {
        const o = h.findOne(xn, i);
        i.classList.add(...this._classes.contentEditable.split(" ")), i.contentEditable = !0, i.focus(), setTimeout(() => {
          p.addStyle(o, { display: "none" });
        }, 200), o.classList.add(...this._classes.opacity.split(" ")), n.target.textContent, u.trigger(i, _a, {
          event: n,
          allChips: this.allChips
        });
      }), u.on(document, "click", ({ target: n }) => {
        const o = h.findOne(xn, i), r = h.findOne(gg, i), a = n === i, l = i && i.contains(n);
        !a && !l && (i.contentEditable = !1, i.classList.remove(...this._classes.contentEditable.split(" ")), r.textContent !== "" && setTimeout(() => {
          p.addStyle(o, { display: "block" }), o.classList.remove(...this._classes.opacity.split(" "));
        }, 160)), r.textContent === "" && (setTimeout(() => {
          i.classList.add(...this._classes.opacity.split(" "));
        }, 200), setTimeout(() => {
          i.remove();
        }, 300));
      });
    });
  }
  _handleRemoveActiveClass() {
    this.allChips.forEach((e) => e.removeAttribute(ft));
  }
  _handleAddActiveClass() {
    this.allChips.forEach((e) => e.setAttribute(ft, ""));
  }
  _handleRightKeyboardArrow(e) {
    this._handleRemoveActiveClass(), e === 0 && (e = 1), this._handleAddActiveClassWithKebyboard(e);
  }
  _handleLeftKeyboardArrow(e) {
    this._handleRemoveActiveClass(), this._handleAddActiveClassWithKebyboard(e);
  }
  _handleActiveChipAfterRemove(e) {
    const i = e === 0 ? 1 : e - 1;
    return this.allChips[i];
  }
  _handleClicksOnChips() {
    u.on(this._element, "click", () => {
      this.allChips.length === 0 && (this.chipsInputWrapper.classList.remove(
        ...this._classes.inputWrapperPadding.split(" ")
      ), this.input.removeAttribute(ft));
    });
  }
  _handleTextContent() {
    const e = [];
    return this.allChips.forEach((i) => e.push({ tag: i.textContent.trim() })), e;
  }
  _handleEvents(e, i) {
    const n = this._handleTextContent(), o = this.allChips.filter(
      (r) => r.hasAttribute(ft) && r
    );
    u.trigger(this._element, i, {
      event: e,
      allChips: this.allChips,
      arrOfObjects: n,
      active: o,
      activeObj: {
        tag: o.length <= 0 ? "" : o[0].textContent.trim()
      }
    });
  }
  _handleChipsFocus() {
    u.on(this._element, "click", ({ target: { attributes: e } }) => {
      const i = [...e];
      i.includes(Kn) || i.includes(Hl) || i.includes(Bl) || this.input.focus();
    });
  }
  _handleInitialValue() {
    if (this._appendInputToElement(pa), this._element.hasAttribute(pa)) {
      const { initialValues: e } = this._options;
      e.forEach(
        ({ tag: i }) => this._handleCreateChip(this.input, i)
      ), h.findOne(
        Sn,
        this.input.parentNode
      ).setAttribute(Ae, ""), this.input.setAttribute(ft, ""), this.input.setAttribute(Ae, "");
    }
    this.allChips.length > 0 && (this.chipsInputWrapper.classList.add(
      ...this._classes.inputWrapperPadding.split(" ")
    ), this.chipsInputWrapper.classList.add(
      ...this._classes.transition.split(" ")
    ));
  }
  _handleKeysInputToElement(e) {
    const { keyCode: i, target: n } = e;
    if (n.hasAttribute(Kn)) {
      const o = h.findOne(xn, n);
      i === lt && (n.contentEditable = !1, n.classList.remove(...this._classes.contentEditable.split(" ")), n.textContent !== "" ? setTimeout(() => {
        p.addStyle(o, { display: "block" }), o.classList.remove(...this._classes.opacity.split(" "));
      }, 160) : n.textContent === "" && (setTimeout(() => {
        n.classList.add(...this._classes.opacity.split(" "));
      }, 200), setTimeout(() => {
        n.remove();
      }, 300)));
      return;
    }
    if (i === lt) {
      if (n.value === "")
        return;
      this._handleCreateChip(n, n.value), this._handleRemoveActiveClass(), this.numberClicks = this.allChips.length + 1, this._handleEvents(e, Ag);
    }
    this.allChips.length > 0 ? (this.chipsInputWrapper.classList.add(
      ...this._classes.inputWrapperPadding.split(" ")
    ), this.chipsInputWrapper.classList.add(
      ...this._classes.transition.split(" ")
    )) : this.chipsInputWrapper.classList.remove(
      ...this._classes.inputWrapperPadding.split(" ")
    );
  }
  _handleInputText() {
    const e = h.findOne(
      bg,
      this._element
    );
    u.on(
      this._element,
      "keyup",
      e,
      (i) => this._handleKeysInputToElement(i)
    ), u.on(this.input, "blur", (i) => this._handleBlurInput(i));
  }
  _appendInputToElement(e) {
    if (!this._element.hasAttribute(e))
      return;
    const i = ig(this._options, this._classes);
    this._element.insertAdjacentHTML("beforeend", i);
  }
  _handleCreateChip(e, i) {
    const n = M("div"), o = ii.getInstance(n), r = new ii(o, { text: i }, this._classes);
    this._options.parentSelector !== "" ? document.querySelector(this._options.parentSelector).insertAdjacentHTML("beforeend", r.appendChip()) : e.insertAdjacentHTML("beforebegin", r.appendChip()), e.value = "", h.find(Un).forEach((a) => {
      let l = ii.getInstance(a);
      return l || (l = new ii(a, {}, this._classes)), l.init();
    }), this._handleEditable();
  }
  _handleChipsOnSelect() {
    this.allChips.forEach((e) => {
      u.on(this._element, "click", (i) => {
        u.trigger(e, _a, {
          event: i,
          allChips: this.allChips
        });
      });
    });
  }
  _handleAddActiveClassWithKebyboard(e) {
    let i;
    this.allChips[e - 1] === void 0 ? i = this.allChips[e - 2] : i = this.allChips[e - 1], i.setAttribute(ft);
  }
  _getConfig(e) {
    const i = {
      ...Sg,
      ...p.getDataAttributes(this._element),
      ...e
    };
    return N(ui, i, xg), i;
  }
  _getClasses(e) {
    const i = p.getDataClassAttributes(this._element);
    return e = {
      ...Dg,
      ...i,
      ...e
    }, N(ui, e, Ig), e;
  }
  static getInstance(e) {
    return I.getData(e, ua);
  }
  static getOrCreateInstance(e, i = {}) {
    return this.getInstance(e) || new this(e, typeof i == "object" ? i : null);
  }
}
var $g = function(t) {
  return Lg(t) && !Mg(t);
};
function Lg(s) {
  return !!s && typeof s == "object";
}
function Mg(s) {
  var t = Object.prototype.toString.call(s);
  return t === "[object RegExp]" || t === "[object Date]" || Pg(s);
}
var Ng = typeof Symbol == "function" && Symbol.for, Rg = Ng ? Symbol.for("react.element") : 60103;
function Pg(s) {
  return s.$$typeof === Rg;
}
function Hg(s) {
  return Array.isArray(s) ? [] : {};
}
function _i(s, t) {
  return t.clone !== !1 && t.isMergeableObject(s) ? We(Hg(s), s, t) : s;
}
function Bg(s, t, e) {
  return s.concat(t).map(function(i) {
    return _i(i, e);
  });
}
function Vg(s, t) {
  if (!t.customMerge)
    return We;
  var e = t.customMerge(s);
  return typeof e == "function" ? e : We;
}
function Wg(s) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(s).filter(function(t) {
    return Object.propertyIsEnumerable.call(s, t);
  }) : [];
}
function ma(s) {
  return Object.keys(s).concat(Wg(s));
}
function Vl(s, t) {
  try {
    return t in s;
  } catch {
    return !1;
  }
}
function Fg(s, t) {
  return Vl(s, t) && !(Object.hasOwnProperty.call(s, t) && Object.propertyIsEnumerable.call(s, t));
}
function Yg(s, t, e) {
  var i = {};
  return e.isMergeableObject(s) && ma(s).forEach(function(n) {
    i[n] = _i(s[n], e);
  }), ma(t).forEach(function(n) {
    Fg(s, n) || (Vl(s, n) && e.isMergeableObject(t[n]) ? i[n] = Vg(n, e)(s[n], t[n], e) : i[n] = _i(t[n], e));
  }), i;
}
function We(s, t, e) {
  e = e || {}, e.arrayMerge = e.arrayMerge || Bg, e.isMergeableObject = e.isMergeableObject || $g, e.cloneUnlessOtherwiseSpecified = _i;
  var i = Array.isArray(t), n = Array.isArray(s), o = i === n;
  return o ? i ? e.arrayMerge(s, t, e) : Yg(s, t, e) : _i(t, e);
}
We.all = function(t, e) {
  if (!Array.isArray(t))
    throw new Error("first argument should be an array");
  return t.reduce(function(i, n) {
    return We(i, n, e);
  }, {});
};
var jg = We, zn = jg;
const ga = "chart", is = "te.chart", Kg = "chart", ba = (s, t, e) => {
  const i = (n, o, r) => {
    const a = n.slice();
    return o.forEach((l, c) => {
      typeof a[c] > "u" ? a[c] = r.cloneUnlessOtherwiseSpecified(
        l,
        r
      ) : r.isMergeableObject(l) ? a[c] = zn(n[c], l, r) : n.indexOf(l) === -1 && a.push(l);
    }), a;
  };
  return zn(e[t], s, {
    arrayMerge: i
  });
}, Ug = {
  darkTicksColor: "#fff",
  darkLabelColor: "#fff",
  darkGridLinesColor: "#555",
  darkmodeOff: "undefined",
  darkBgColor: "#262626",
  options: null
}, zg = {
  darkTicksColor: "string",
  darkLabelColor: "string",
  darkGridLinesColor: "string",
  darkmodeOff: "(string|null)",
  darkBgColor: "string",
  options: "(object|null)"
};
class Wl {
  constructor(t, e, i = {}, n = {}) {
    this._waitForCharts(t, e, i, n);
  }
  async _getChartjs() {
    const {
      Chart: t,
      ArcElement: e,
      LineElement: i,
      BarElement: n,
      PointElement: o,
      BarController: r,
      BubbleController: a,
      DoughnutController: l,
      LineController: c,
      PieController: d,
      PolarAreaController: _,
      RadarController: f,
      ScatterController: m,
      CategoryScale: g,
      LinearScale: b,
      LogarithmicScale: T,
      RadialLinearScale: C,
      TimeScale: w,
      TimeSeriesScale: v,
      Decimation: E,
      Filler: A,
      Legend: y,
      Title: S,
      Tooltip: O,
      SubTitle: k
    } = await __webpack_require__.e(/*! import() */ "node_modules_tw-elements_dist_js_chart_es_js").then(__webpack_require__.bind(__webpack_require__, /*! ./chart.es.js */ "./node_modules/tw-elements/dist/js/chart.es.js")).then((D) => D.f);
    return t.register(
      e,
      i,
      n,
      o,
      r,
      a,
      l,
      c,
      d,
      _,
      f,
      m,
      g,
      b,
      T,
      C,
      w,
      v,
      E,
      A,
      y,
      S,
      O,
      k
    ), t;
  }
  async _getChartDataLabels() {
    const { ChartDataLabels: t } = await __webpack_require__.e(/*! import() */ "node_modules_tw-elements_dist_js_chartjs-plugin-datalabels_es_js").then(__webpack_require__.bind(__webpack_require__, /*! ./chartjs-plugin-datalabels.es.js */ "./node_modules/tw-elements/dist/js/chartjs-plugin-datalabels.es.js"));
    return t;
  }
  async _waitForCharts(t, e, i = {}, n = {}) {
    this._Chartjs = await this._getChartjs(), this._ChartDataLabels = await this._getChartDataLabels(), this._element = t, this._data = e, this._options = i, this._type = e.type, this._canvas = null, this._chart = null, this._darkOptions = this._getDarkConfig(n), this._darkModeClassContainer = document.querySelector("html"), this._prevConfig = null, this._observer = null, this._element && (I.setData(t, is, this), p.addClass(this._element, Kg), this._chartConstructor()), this._darkOptions.darkmodeOff !== null && (this._handleMode(this.systemColorMode), this._observer = new MutationObserver(this._observerCallback.bind(this)), this._observer.observe(this._darkModeClassContainer, {
      attributes: !0
    }));
  }
  // Getters
  static get NAME() {
    return ga;
  }
  get systemColorMode() {
    return localStorage.theme || (this._darkModeClassContainer.classList.contains("dark") ? "dark" : "light");
  }
  // Public
  dispose() {
    this._observer.disconnect(), I.removeData(this._element, is), this._element = null;
  }
  update(t, e) {
    t && (this._data = { ...this._data, ...t }, this._chart.data = this._data), this._prevConfig = this._chart.options, this._options = { ...this._options, ...e }, this._chart.options = zn(this._chart.options, this._options), this._chart.update();
  }
  // Private
  _getDarkConfig(t) {
    let e = {};
    const i = p.getDataAttributes(this._element);
    Object.keys(i).forEach(
      (c) => c.startsWith("dark") && (e[c] = i[c])
    ), e = {
      ...Ug,
      ...e
    };
    const n = {
      y: {
        ticks: {
          color: e.darkTicksColor
        },
        grid: {
          color: e.darkGridLinesColor
        }
      },
      x: {
        ticks: {
          color: e.darkTicksColor
        },
        grid: {
          color: e.darkGridLinesColor
        }
      }
    }, o = {
      r: {
        ticks: {
          color: e.darkTicksColor,
          backdropColor: e.darkBgColor
        },
        grid: {
          color: e.darkGridLinesColor
        },
        pointLabels: {
          color: e.darkTicksColor
        }
      }
    }, l = {
      scales: ["pie", "doughnut", "polarArea", "radar"].includes(this._type) ? ["polarArea", "radar"].includes(this._type) ? o : {} : n,
      plugins: {
        legend: {
          labels: {
            color: e.darkLabelColor
          }
        }
      }
    };
    return t = {
      ...e,
      options: {
        ...l
      },
      ...t
    }, N(ga, t, zg), t;
  }
  _chartConstructor() {
    if (this._data) {
      this._createCanvas();
      const t = ba(this._options, this._type, gs), e = [];
      t.dataLabelsPlugin && e.push(this._ChartDataLabels), this._chart = new this._Chartjs(this._canvas, {
        ...this._data,
        ...t,
        plugins: e
      });
    }
  }
  _createCanvas() {
    this._canvas || (this._element.nodeName === "CANVAS" ? this._canvas = this._element : (this._canvas = M("canvas"), this._element.appendChild(this._canvas)));
  }
  _handleMode(t) {
    t === "dark" ? (this._changeDatasetBorderColor(), this.update(null, this._darkOptions.options)) : (this._changeDatasetBorderColor(!1), this._prevConfig && this.update(null, this._prevConfig));
  }
  _observerCallback(t) {
    for (const e of t)
      e.type === "attributes" && this._handleMode(this.systemColorMode);
  }
  _changeDatasetBorderColor(t = !0) {
    [...this._data.data.datasets].forEach(
      (e) => ["pie", "doughnut", "polarArea"].includes(this._type) && (e.borderColor = t ? this._darkOptions.darkBgColor : "#fff")
    );
  }
  static jQueryInterface(t, e, i) {
    return this.each(function() {
      let n = I.getData(this, is);
      if (!(!n && /dispose/.test(t))) {
        if (!n) {
          const o = e ? ba(e, i, gs) : gs[i];
          n = new Wl(this, {
            ...t,
            ...o
          });
        }
        if (typeof t == "string") {
          if (typeof n[t] > "u")
            throw new TypeError(`No method named "${t}"`);
          n[t](e, i);
        }
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, is);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}

//# sourceMappingURL=tw-elements.es.min.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames not based on template
/******/ 			if ({"node_modules_tw-elements_dist_js_chart_es_js":1,"node_modules_tw-elements_dist_js_chartjs-plugin-datalabels_es_js":1}[chunkId]) return "js/" + chunkId + ".js";
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("css/app" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;