/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.7.2
 *       Author: Tom Jurman (tomasjurman@kibo.cz)
 *       Licence: GNUv3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["astrology"] = factory();
	else
		root["astrology"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/charts/Chart.js":
/*!*****************************!*\
  !*** ./src/charts/Chart.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chart)
/* harmony export */ });
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");


/**
 * @class
 * @classdesc An abstract class for all type of Chart
 * @public
 * @hideconstructor
 * @abstract
 */
class Chart {

  //#settings

  /**
   * @constructs
   * @param {Object} settings
   */
  constructor(settings) {
    //this.#settings = settings
  }

  /**
   * Check if the data is valid
   * @throws {Error} - if the data is undefined.
   * @param {Object} data
   * @return {Object} - {isValid:boolean, message:String}
   */
  validateData(data) {
    if (!data) {
      throw new Error("Mising param data.")
    }

    if (!Array.isArray(data.points)) {
      return {
        isValid: false,
        message: "points is not Array."
      }
    }

    if (!Array.isArray(data.cusps)) {
      return {
        isValid: false,
        message: "cups is not Array."
      }
    }

    if (data.cusps.length !== 12) {
      return {
        isValid: false,
        message: "cusps.length !== 12"
      }
    }

    for (let point of data.points) {
      if (typeof point.name !== 'string') {
        return {
          isValid: false,
          message: "point.name !== 'string'"
        }
      }
      if (point.name.length === 0) {
        return {
          isValid: false,
          message: "point.name.length == 0"
        }
      }
      if (typeof point.angle !== 'number') {
        return {
          isValid: false,
          message: "point.angle !== 'number'"
        }
      }
    }

    for (let cusp of data.cusps) {
      if (typeof cusp.angle !== 'number') {
        return {
          isValid: false,
          message: "cusp.angle !== 'number'"
        }
      }
    }

    return {
      isValid: true,
      message: ""
    }
  }
  
  /**
   * @abstract
   */
  setData(data) {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getPoints() {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getPoint(name) {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  animateTo(data) {
    throw new Error("Must be implemented by subclass.");
  }

  // ## PROTECTED ##############################

}




/***/ }),

/***/ "./src/charts/RadixChart.js":
/*!**********************************!*\
  !*** ./src/charts/RadixChart.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RadixChart)
/* harmony export */ });
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../universe/Universe.js */ "./src/universe/Universe.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/AspectUtils.js */ "./src/utils/AspectUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");








/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_4__["default"] {

  /*
   * Levels determine the width of individual parts of the chart.
   * It can be changed dynamically by public setter.
   */
  #numberOfLevels = 24

  #universe
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /*
   * @see Utils.cleanUp()
   */
  #beforeCleanUpHook

  /**
   * @constructs
   * @param {Universe} Universe
   */
  constructor(universe) {

    if (!universe instanceof _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      throw new Error('Bad param universe.')
    }

    super(universe.getSettings())

    this.#universe = universe
    this.#settings = this.#universe.getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
    this.#universe.getSVGDocument().appendChild(this.#root);

    return this
  }

  /**
   * Set chart data
   * @throws {Error} - if the data is not valid.
   * @param {Object} data
   * @return {RadixChart}
   */
  setData(data) {
    let status = this.validateData(data)
    if (!status.isValid) {
      throw new Error(status.message)
    }

    this.#data = data
    this.#draw(data)

    return this
  }

  /**
   * Get data
   * @return {Object}
   */
  getData(){
    return {
      "points":[...this.#data.points],
      "cusps":[...this.#data.cusps]
    }
  }

  /**
   * Set number of Levels.
   * Levels determine the width of individual parts of the chart.
   *
   * @param {Number}
   */
  setNumberOfLevels(levels) {
    this.#numberOfLevels = Math.max(24, levels)
    if (this.#data) {
      this.#draw(this.#data)
    }

    return this
  }

  /**
   * Get radius
   * @return {Number}
   */
  getRadius() {
    return this.#radius
  }

  /**
   * Get radius
   * @return {Number}
   */
  getOuterCircleRadius() {
    return 24 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getInnerCircleRadius() {
    return 21 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getRullerCircleRadius() {
    return 20 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getPointCircleRadius() {
    return 18 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getCenterCircleRadius() {
    return 12 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get Universe
   *
   * @return {Universe}
   */
  getUniverse() {
    return this.#universe
  }

  /**
   * Get Ascendat shift
   *
   * @return {Number}
   */
  getAscendantShift() {
    return (this.#data?.cusps[0]?.angle ?? 0) + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_180
  }

  /**
   * Get aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  getAspects(fromPoints, toPoints, aspects){
    if(!this.#data){
      return
    }

    fromPoints = fromPoints ?? this.#data.points.filter(x => "aspect" in x ? x.aspect : true)
    toPoints = toPoints ?? [...this.#data.points.filter(x => "aspect" in x ? x.aspect : true), ...this.#data.cusps.filter(x => x.aspect)]
    aspects = aspects ?? this.#settings.DEFAULT_ASPECTS ?? _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"].DEFAULT_ASPECTS

    return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAspects(fromPoints, toPoints, aspects).filter( aspect => aspect.from.name != aspect.to.name)
  }

  /**
   * Draw aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  drawAspects( fromPoints, toPoints, aspects ){
    const aspectsWrapper = this.#universe.getAspectsElement()
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

    const aspectsList = this.getAspects(fromPoints, toPoints, aspects)
      .reduce( (arr, aspect) => {

        let isTheSame = arr.some( elm => {
          return elm.from.name == aspect.to.name && elm.to.name == aspect.from.name
        })

        if( !isTheSame ){
          arr.push(aspect)
        }

        return arr
      }, [])
      .filter( aspect =>  aspect.aspect.name != 'Conjunction')

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
    circle.setAttribute('fill', this.#settings.ASPECTS_BACKGROUND_COLOR)
    aspectsWrapper.appendChild(circle)

    aspectsWrapper.appendChild( _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].drawAspects(this.getCenterCircleRadius(), this.getAscendantShift(), this.#settings, aspectsList))

    return this
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
    this.#drawBackground()
    this.#drawAstrologicalSigns()
    this.#drawRuler()
    this.#drawPoints(data)
    this.#drawCusps(data)
    this.#settings.CHART_DRAW_MAIN_AXIS && this.#drawMainAxisDescription(data)
    this.#drawBorders()
    this.#settings.DRAW_ASPECTS && this.drawAspects()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const mask = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGMask(MASK_ID)
    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
    innerCircle.setAttribute('fill', "black")
    mask.appendChild(innerCircle)
    wrapper.appendChild(mask)

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.PLANETS_BACKGROUND_COLOR);
    circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
    wrapper.appendChild(circle)

    this.#root.appendChild(wrapper)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
    const SYMBOL_SIGNS = [_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_ARIES, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_TAURUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_GEMINI, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CANCER, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LEO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_VIRGO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LIBRA, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SCORPIO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SAGITTARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CAPRICORN, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AQUARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_PISCES]

    const makeSymbol = (symbolIndex, angleInDegree) => {
      let position = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius() - ((this.getOuterCircleRadius() - this.getInnerCircleRadius()) / 2), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleInDegree + STEP / 2, this.getAscendantShift()))

      let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_SIGNS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.SIGN_COLORS[symbolIndex] ?? this.#settings.CHART_SIGNS_COLOR);
      return symbol
    }

    const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
      let a1 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleFromInDegree, this.getAscendantShift())
      let a2 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleToInDegree, this.getAscendantShift())
      let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSegment(this.#centerX, this.#centerY, this.getOuterCircleRadius(), a1, a2, this.getInnerCircleRadius());
      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[symbolIndex]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.CHART_STROKE : 0);
      return segment
    }

    let startAngle = 0
    let endAngle = startAngle + STEP

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    for (let i = 0; i < NUMBER_OF_ASTROLOGICAL_SIGNS; i++) {

      let segment = makeSegment(i, startAngle, endAngle)
      wrapper.appendChild(segment);

      let symbol = makeSymbol(i, startAngle)
      wrapper.appendChild(symbol);

      startAngle += STEP;
      endAngle = startAngle + STEP
    }

    this.#root.appendChild(wrapper)
  }

  #drawRuler() {
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    let startAngle = this.getAscendantShift()
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getInnerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 2) : this.getInnerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius());
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawPoints(data) {
    const points = data.points
    const cusps = data.cusps

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.getPointCircleRadius())
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE)
      symbol.setAttribute("fill", this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_POINTS_COLOR)
      wrapper.appendChild(symbol);

      // pointer
      //if (positions[point.getName()] != pointData.position) {
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))
      const pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
      pointerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      pointerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE / 2);
      wrapper.appendChild(pointerLine);
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawCusps(data) {
    const points = data.points
    const cusps = data.cusps

    const mainAxisIndexes = [0, 3, 6, 9] //As, Ic, Ds, Mc

    const pointsPositions = points.map(point => {
      return point.angle
    })

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const textRadius = this.getCenterCircleRadius() + ((this.getInnerCircleRadius() - this.getCenterCircleRadius()) / 10)

    for (let i = 0; i < cusps.length; i++) {

      const isLineInCollisionWithPoint = !this.#settings.CHART_ALLOW_HOUSE_OVERLAP && _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.getCenterCircleRadius() + ((this.getRullerCircleRadius() - this.getCenterCircleRadius()) / 6) : this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))

      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_AXIS_COLOR : this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_STROKE : this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(textAngle, this.getAscendantShift()))
      const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
      text.setAttribute("fill", this.#settings.CHART_HOUSE_NUMBER_COLOR)
      wrapper.appendChild(text)

      if(this.#settings.DRAW_HOUSE_DEGREE) {
        const degreePos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius() - (this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 1.2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startCusp - 2.4, this.getAscendantShift()))
        const degree = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(degreePos.x, degreePos.y, Math.floor(cusps[i].angle % 30) + "º")
        degree.setAttribute("text-anchor", "middle") // start, middle, end
        degree.setAttribute("dominant-baseline", "middle")
        degree.setAttribute("font-size", this.#settings.POINT_PROPERTIES_ANGLE_SIZE / 2)
        degree.setAttribute("fill", this.#settings.CHART_HOUSE_NUMBER_COLOR)
        wrapper.appendChild(degree)
      }
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw main axis descrition
   * @param {Array} axisList
   */
  #drawMainAxisDescription(data) {
    const AXIS_LENGTH = 10
    const cusps = data.cusps

    const axisList = [{
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS,
        angle: cusps[0].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC,
        angle: cusps[3].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS,
        angle: cusps[6].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC,
        angle: cusps[9].angle
      },
    ]

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const rad1 = this.#numberOfLevels === 24 ? this.getRadius() : this.getInnerCircleRadius();
    const rad2 = this.#numberOfLevels === 24 ? this.getRadius() + AXIS_LENGTH : this.getInnerCircleRadius() + AXIS_LENGTH / 2;

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad1, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let symbol;
      let SHIFT_X = 0;
      let SHIFT_Y = 0;
      const STEP = 2
      switch (axis.name) {
        case "As":
          SHIFT_X -= STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "end")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ds":
          SHIFT_X += STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "start")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Mc":
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "text-top")
          break;
        case "Ic":
          SHIFT_Y += STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "hanging")
          break;
        default:
          console.error(axis.name)
          throw new Error("Unknown axis name.")
      }
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("font-size", this.#settings.RADIX_AXIS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_MAIN_AXIS_COLOR);

      wrapper.appendChild(symbol);
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getInnerCircleRadius())
    innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(innerCircle)

    const centerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
    centerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    centerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(centerCircle)

    this.#root.appendChild(wrapper)
  }
}




/***/ }),

/***/ "./src/charts/TransitChart.js":
/*!************************************!*\
  !*** ./src/charts/TransitChart.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TransitChart)
/* harmony export */ });
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/AspectUtils.js */ "./src/utils/AspectUtils.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");








/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_2__["default"] {

  /*
   * Levels determine the width of individual parts of the chart.
   * It can be changed dynamically by public setter.
   */
  #numberOfLevels = 32

  #radix
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /*
   * @see Utils.cleanUp()
   */
  #beforeCleanUpHook

  /**
   * @constructs
   * @param {RadixChart} radix
   */
  constructor(radix) {
    if (!(radix instanceof _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__["default"])) {
      throw new Error('Bad param radix.')
    }

    super(radix.getUniverse().getSettings())

    this.#radix = radix
    this.#settings = this.#radix.getUniverse().getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING

    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
    this.#radix.getUniverse().getSVGDocument().appendChild(this.#root);

    return this
  }

  /**
   * Set chart data
   * @throws {Error} - if the data is not valid.
   * @param {Object} data
   * @return {RadixChart}
   */
  setData(data) {
    let status = this.validateData(data)
    if (!status.isValid) {
      throw new Error(status.message)
    }

    this.#data = data
    this.#draw(data)

    return this
  }

  /**
   * Get data
   * @return {Object}
   */
  getData(){
    return {
      "points":[...this.#data.points],
      "cusps":[...this.#data.cusps]
    }
  }

  /**
   * Get radius
   *
   * @param {Number}
   */
  getRadius() {
    return this.#radius
  }

  /**
   * Get aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  getAspects(fromPoints, toPoints, aspects){
    if(!this.#data){
      return
    }

    fromPoints = fromPoints ?? [...this.#data.points.filter(x => "aspect" in x ? x.aspect : true), ...this.#data.cusps.filter(x => x.aspect)]
    toPoints = toPoints ?? [...this.#radix.getData().points.filter(x => "aspect" in x ? x.aspect : true), ...this.#radix.getData().cusps.filter(x => x.aspect)]
    aspects = aspects ?? this.#settings.DEFAULT_ASPECTS ?? _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"].DEFAULT_ASPECTS

    return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAspects(fromPoints, toPoints, aspects)
  }

  /**
   * Draw aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  drawAspects( fromPoints, toPoints, aspects ){
    const aspectsWrapper = this.#radix.getUniverse().getAspectsElement()
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

    const aspectsList = this.getAspects(fromPoints, toPoints, aspects)
      .filter( aspect =>  aspect.aspect.name != 'Conjunction')

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radix.getCenterCircleRadius())
    circle.setAttribute('fill', this.#settings.ASPECTS_BACKGROUND_COLOR)
    aspectsWrapper.appendChild(circle)
    
    aspectsWrapper.appendChild( _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].drawAspects(this.#radix.getCenterCircleRadius(), this.#radix.getAscendantShift(), this.#settings, aspectsList))

    return this
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {

    // radix reDraw
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
    this.#radix.setNumberOfLevels(this.#numberOfLevels)

    this.#drawRuler()
    this.#drawCusps(data)
    this.#settings.CHART_DRAW_MAIN_AXIS && this.#drawMainAxisDescription(data)
    this.#drawPoints(data)
    this.#drawBorders()
    this.#settings.DRAW_ASPECTS && this.drawAspects()
  }

  #drawRuler() {
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    let startAngle = this.#radix.getAscendantShift()
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 2) : this.getRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startAngle))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius());
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawPoints(data) {
    const points = data.points
    const cusps = data.cusps

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.#getPointCircleRadius())
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.TRANSIT_POINTS_FONT_SIZE)
      symbol.setAttribute("fill", this.#settings.TRANSIT_PLANET_COLORS[pointData.name] ?? this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_POINTS_COLOR)
      wrapper.appendChild(symbol);

      // pointer
      //if (positions[point.getName()] != pointData.position) {
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))
      const pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
      pointerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      pointerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE / 2);
      wrapper.appendChild(pointerLine);
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawCusps(data) {
    const points = data.points
    const cusps = data.cusps

    const pointsPositions = points.map(point => {
      return point.angle
    })

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const textRadius = this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6)

    for (let i = 0; i < cusps.length; i++) {
      const isLineInCollisionWithPoint = !this.#settings.CHART_ALLOW_HOUSE_OVERLAP && _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6) : this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))

      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(textAngle, this.#radix.getAscendantShift()))
      const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
      text.setAttribute("fill", this.#settings.TRANSIT_HOUSE_NUMBER_COLOR || this.#settings.CHART_HOUSE_NUMBER_COLOR)
      wrapper.appendChild(text)

      if(this.#settings.DRAW_HOUSE_DEGREE) {
        const degreePos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius() - (this.getRadius() - this.#getRullerCircleRadius()), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startCusp - 1.75, this.#radix.getAscendantShift()))
        const degree = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(degreePos.x, degreePos.y, Math.floor(cusps[i].angle % 30) + "º")
        degree.setAttribute("text-anchor", "middle") // start, middle, end
        degree.setAttribute("dominant-baseline", "middle")
        degree.setAttribute("font-size", this.#settings.POINT_PROPERTIES_ANGLE_SIZE / 2)
        degree.setAttribute("fill", this.#settings.TRANSIT_HOUSE_NUMBER_COLOR || this.#settings.CHART_HOUSE_NUMBER_COLOR)
        wrapper.appendChild(degree)
      }
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw main axis descrition
   * @param {Array} axisList
   */
  #drawMainAxisDescription(data) {
    const AXIS_LENGTH = 10
    const cusps = data.cusps

    const axisList = [{
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS,
        angle: cusps[0].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC,
        angle: cusps[3].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS,
        angle: cusps[6].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC,
        angle: cusps[9].angle
      },
    ]

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const rad1 = this.getRadius();
    const rad2 = this.getRadius() + AXIS_LENGTH;

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad1, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, rad2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(axis.angle, this.#radix.getAscendantShift()))
      let symbol;
      let SHIFT_X = 0;
      let SHIFT_Y = 0;
      const STEP = 2
      switch (axis.name) {
        case "As":
          SHIFT_X -= STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "end")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ds":
          SHIFT_X += STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "start")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Mc":
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "text-top")
          break;
        case "Ic":
          SHIFT_Y += STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "hanging")
          break;
        default:
          console.error(axis.name)
          throw new Error("Unknown axis name.")
      }
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("font-size", this.#settings.RADIX_AXIS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_MAIN_AXIS_COLOR);

      wrapper.appendChild(symbol);
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    this.#root.appendChild(wrapper)
  }

  #getPointCircleRadius() {
    return 29 * (this.getRadius() / this.#numberOfLevels)
  }

  #getRullerCircleRadius() {
    return 31 * (this.getRadius() / this.#numberOfLevels)
  }

  #getCenterCircleRadius() {
    return 24 * (this.getRadius() / this.#numberOfLevels)
  }

}




/***/ }),

/***/ "./src/points/Point.js":
/*!*****************************!*\
  !*** ./src/points/Point.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Point)
/* harmony export */ });
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");



/**
 * @class
 * @classdesc Represents a planet or point of interest in the chart
 * @public
 */
class Point {

  #name
  #angle
  #isRetrograde
  #cusps
  #settings

  /**
   * @constructs
   * @param {Object} pointData - {name:String, angle:Number, isRetrograde:false}
   * @param {Object} cusps - [{angle:Number}, {angle:Number}, {angle:Number}, ...]
   * @param {Object} settings
   */
  constructor(pointData, cusps, settings) {
    this.#name = pointData.name ?? "Unknown"
    this.#angle = pointData.angle ?? 0
    this.#isRetrograde = pointData.isRetrograde ?? false

    if (!Array.isArray(cusps) || cusps.length != 12) {
      throw new Error("Bad param cusps. ")
    }

    this.#cusps = cusps

    if (!settings) {
      throw new Error('Bad param settings.')
    }

    this.#settings = settings
  }

  /**
   * Get name
   *
   * @return {String}
   */
  getName() {
    return this.#name
  }

  /**
   * Is retrograde
   *
   * @return {Boolean}
   */
  isRetrograde() {
    return this.#isRetrograde
  }

  /**
   * Get angle
   *
   * @return {Number}
   */
  getAngle() {
    return this.#angle
  }

  /**
   * Get symbol
   *
   * @param {Number} xPos
   * @param {Number} yPos
   * @param {Number} [angleShift]
   * @param {Boolean} [isProperties] - angleInSign, dignities, retrograde
   *
   * @return {SVGElement}
   */
  getSymbol(xPos, yPos, angleShift = 0, isProperties = true) {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#name, xPos, yPos)
    wrapper.appendChild(symbol)

    if (isProperties == false) {
      return wrapper //======>
    }

    const chartCenterX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    const chartCenterY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    const angleFromSymbolToCenter = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionToAngle(xPos, yPos, chartCenterX, chartCenterY)

    this.#settings.POINT_PROPERTIES_SHOW_ANGLE && angleInSign.call(this)
    this.#settings.POINT_PROPERTIES_SHOW_RETROGRADE && this.#isRetrograde && retrograde.call(this)
    this.#settings.POINT_PROPERTIES_SHOW_DIGNITY && this.getDignity() && dignities.call(this)

    return wrapper //======>

    /*
     *  Angle in sign
     */
    function angleInSign() {
      const angleInSignPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_ANGLE_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))
      // It is possible to rotate the text, when uncomment a line bellow.
      //textWrapper.setAttribute("transform", `rotate(${angleFromSymbolToCenter},${textPosition.x},${textPosition.y})`)

      const angleInSignText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(angleInSignPosition.x, angleInSignPosition.y, this.getAngleInSign())
      angleInSignText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      angleInSignText.setAttribute("text-anchor", "middle") // start, middle, end
      angleInSignText.setAttribute("dominant-baseline", "middle")
      angleInSignText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_ANGLE_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
      angleInSignText.setAttribute("fill", this.#settings.POINT_PROPERTIES_ANGLE_COLOR || this.#settings.POINT_PROPERTIES_COLOR);
      wrapper.appendChild(angleInSignText)
    }

    /*
     *  Retrograde
     */
    function retrograde() {
      const retrogradePosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_RETROGRADE_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))

      const retrogradeText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(retrogradePosition.x, retrogradePosition.y, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_RETROGRADE_CODE)
      retrogradeText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      retrogradeText.setAttribute("text-anchor", "middle") // start, middle, end
      retrogradeText.setAttribute("dominant-baseline", "middle")
      retrogradeText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_RETROGRADE_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
      retrogradeText.setAttribute("fill", this.#settings.POINT_PROPERTIES_RETROGRADE_COLOR || this.#settings.POINT_PROPERTIES_COLOR);
      wrapper.appendChild(retrogradeText)
    }

    /*
     *  Dignities
     */
    function dignities() {
      const dignitiesPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, this.#settings.POINT_PROPERTIES_DIGNITY_OFFSET * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))
      const dignitiesText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(dignitiesPosition.x, dignitiesPosition.y, this.getDignity())
      dignitiesText.setAttribute("font-family", "sans-serif");
      dignitiesText.setAttribute("text-anchor", "middle") // start, middle, end
      dignitiesText.setAttribute("dominant-baseline", "middle")
      dignitiesText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_DIGNITY_SIZE || this.#settings.POINT_PROPERTIES_FONT_SIZE);
      dignitiesText.setAttribute("fill", this.#settings.POINT_PROPERTIES_DIGNITY_COLOR || this.#settings.POINT_PROPERTIES_COLOR);
      wrapper.appendChild(dignitiesText)
    }
  }

  /**
   * Get house number
   *
   * @return {Number}
   */
  getHouseNumber() {
    throw new Error("Not implemented yet.")
  }

  /**
   * Get sign number
   * Arise = 1, Taurus = 2, ...Pisces = 12
   *
   * @return {Number}
   */
  getSignNumber() {
    let angle = this.#angle % _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_360
    return Math.floor((angle / 30) + 1);
  }

  /**
   * Returns the angle (Integer) in the sign in which it stands.
   *
   * @return {Number}
   */
  getAngleInSign() {
    return Math.floor(this.#angle % 30)
  }

  /**
   * Get dignity symbol (r - rulership, d - detriment, f - fall, e - exaltation)
   *
   * @return {String} - dignity symbol (r,d,f,e)
   */
  getDignity() {
    const ARIES = 1
    const TAURUS = 2
    const GEMINI = 3
    const CANCER = 4
    const LEO = 5
    const VIRGO = 6
    const LIBRA = 7
    const SCORPIO = 8
    const SAGITTARIUS = 9
    const CAPRICORN = 10
    const AQUARIUS = 11
    const PISCES = 12

    const RULERSHIP_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[0];
    const DETRIMENT_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[1];
    const EXALTATION_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[2];
    const FALL_SYMBOL = this.#settings.POINT_PROPERTIES_DIGNITY_SYMBOLS[3];

    switch (this.#name) {
      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SUN:
        if (this.getSignNumber() == LEO) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == AQUARIUS) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES) {
          return EXALTATION_SYMBOL //======>
        }

        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MOON:
        if (this.getSignNumber() == CANCER) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == CAPRICORN) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == SCORPIO) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MERCURY:
        if (this.getSignNumber() == GEMINI) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == SAGITTARIUS) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == PISCES) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_VENUS:
        if (this.getSignNumber() == TAURUS || this.getSignNumber() == LIBRA) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES || this.getSignNumber() == SCORPIO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == PISCES) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MARS:
        if (this.getSignNumber() == ARIES || this.getSignNumber() == SCORPIO) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS || this.getSignNumber() == LIBRA) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == CANCER) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == CAPRICORN) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_JUPITER:
        if (this.getSignNumber() == SAGITTARIUS || this.getSignNumber() == PISCES) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == GEMINI || this.getSignNumber() == VIRGO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == CAPRICORN) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == CANCER) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SATURN:
        if (this.getSignNumber() == CAPRICORN || this.getSignNumber() == AQUARIUS) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == CANCER || this.getSignNumber() == LEO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == LIBRA) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_URANUS:
        if (this.getSignNumber() == AQUARIUS) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == LEO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == SCORPIO) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_NEPTUNE:
        if (this.getSignNumber() == PISCES) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == GEMINI || this.getSignNumber() == AQUARIUS) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == SAGITTARIUS || this.getSignNumber() == LEO) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_PLUTO:
        if (this.getSignNumber() == SCORPIO) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == LIBRA) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      default:
        return ""
    }
  }
}




/***/ }),

/***/ "./src/settings/DefaultSettings.js":
/*!*****************************************!*\
  !*** ./src/settings/DefaultSettings.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SETTINGS)
/* harmony export */ });
/* harmony import */ var _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/Universe.js */ "./src/settings/constants/Universe.js");
/* harmony import */ var _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/Radix.js */ "./src/settings/constants/Radix.js");
/* harmony import */ var _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/Transit.js */ "./src/settings/constants/Transit.js");
/* harmony import */ var _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/Point.js */ "./src/settings/constants/Point.js");
/* harmony import */ var _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/Colors.js */ "./src/settings/constants/Colors.js");
/* harmony import */ var _constants_Aspects_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/Aspects.js */ "./src/settings/constants/Aspects.js");







const SETTINGS = Object.assign({}, _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__, _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__, _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__, _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__, _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__, _constants_Aspects_js__WEBPACK_IMPORTED_MODULE_5__);




/***/ }),

/***/ "./src/settings/constants/Aspects.js":
/*!*******************************************!*\
  !*** ./src/settings/constants/Aspects.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASPECTS_FONT_SIZE: () => (/* binding */ ASPECTS_FONT_SIZE),
/* harmony export */   ASPECTS_ID: () => (/* binding */ ASPECTS_ID),
/* harmony export */   DEFAULT_ASPECTS: () => (/* binding */ DEFAULT_ASPECTS),
/* harmony export */   DRAW_ASPECTS: () => (/* binding */ DRAW_ASPECTS)
/* harmony export */ });
/*
* Aspects wrapper element ID
* @constant
* @type {String}
* @default aspects
*/
const ASPECTS_ID = "aspects"

/*
* Draw aspects into chart during render
* @constant
* @type {Boolean}
* @default true
*/
const DRAW_ASPECTS = true

/*
* Font size - aspects
* @constant
* @type {Number}
* @default 27
*/
const ASPECTS_FONT_SIZE = 18

/**
* Default aspects
* @constant
* @type {Array}
*/
const DEFAULT_ASPECTS = [
  {name:"Conjunction", angle:0, orb:2},
  {name:"Opposition", angle:180, orb:2},
  {name:"Trine", angle:120, orb:2},
  {name:"Square", angle:90, orb:2}
]


/***/ }),

/***/ "./src/settings/constants/Colors.js":
/*!******************************************!*\
  !*** ./src/settings/constants/Colors.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASPECTS_BACKGROUND_COLOR: () => (/* binding */ ASPECTS_BACKGROUND_COLOR),
/* harmony export */   ASPECT_COLORS: () => (/* binding */ ASPECT_COLORS),
/* harmony export */   CHART_BACKGROUND_COLOR: () => (/* binding */ CHART_BACKGROUND_COLOR),
/* harmony export */   CHART_CIRCLE_COLOR: () => (/* binding */ CHART_CIRCLE_COLOR),
/* harmony export */   CHART_HOUSE_NUMBER_COLOR: () => (/* binding */ CHART_HOUSE_NUMBER_COLOR),
/* harmony export */   CHART_LINE_COLOR: () => (/* binding */ CHART_LINE_COLOR),
/* harmony export */   CHART_MAIN_AXIS_COLOR: () => (/* binding */ CHART_MAIN_AXIS_COLOR),
/* harmony export */   CHART_POINTS_COLOR: () => (/* binding */ CHART_POINTS_COLOR),
/* harmony export */   CHART_SIGNS_COLOR: () => (/* binding */ CHART_SIGNS_COLOR),
/* harmony export */   CHART_TEXT_COLOR: () => (/* binding */ CHART_TEXT_COLOR),
/* harmony export */   CIRCLE_COLOR: () => (/* binding */ CIRCLE_COLOR),
/* harmony export */   COLOR_AQUARIUS: () => (/* binding */ COLOR_AQUARIUS),
/* harmony export */   COLOR_ARIES: () => (/* binding */ COLOR_ARIES),
/* harmony export */   COLOR_CANCER: () => (/* binding */ COLOR_CANCER),
/* harmony export */   COLOR_CAPRICORN: () => (/* binding */ COLOR_CAPRICORN),
/* harmony export */   COLOR_GEMINI: () => (/* binding */ COLOR_GEMINI),
/* harmony export */   COLOR_LEO: () => (/* binding */ COLOR_LEO),
/* harmony export */   COLOR_LIBRA: () => (/* binding */ COLOR_LIBRA),
/* harmony export */   COLOR_PISCES: () => (/* binding */ COLOR_PISCES),
/* harmony export */   COLOR_SAGITTARIUS: () => (/* binding */ COLOR_SAGITTARIUS),
/* harmony export */   COLOR_SCORPIO: () => (/* binding */ COLOR_SCORPIO),
/* harmony export */   COLOR_TAURUS: () => (/* binding */ COLOR_TAURUS),
/* harmony export */   COLOR_VIRGO: () => (/* binding */ COLOR_VIRGO),
/* harmony export */   PLANETS_BACKGROUND_COLOR: () => (/* binding */ PLANETS_BACKGROUND_COLOR),
/* harmony export */   PLANET_COLORS: () => (/* binding */ PLANET_COLORS),
/* harmony export */   POINT_PROPERTIES_COLOR: () => (/* binding */ POINT_PROPERTIES_COLOR),
/* harmony export */   SIGN_COLORS: () => (/* binding */ SIGN_COLORS),
/* harmony export */   TRANSIT_PLANET_COLORS: () => (/* binding */ TRANSIT_PLANET_COLORS)
/* harmony export */ });
/**
* Chart background color
* @constant
* @type {String}
* @default #fff
*/
const CHART_BACKGROUND_COLOR = "none";

/**
* Planets background color
* @constant
* @type {String}
* @default #fff
*/
const PLANETS_BACKGROUND_COLOR = "#fff";

/**
* Aspects background color
* @constant
* @type {String}
* @default #fff
*/
const ASPECTS_BACKGROUND_COLOR = "#eee";

/*
* Default color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_CIRCLE_COLOR = "#333";

/*
* Default color of lines in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_LINE_COLOR = "#666";

/*
* Default color of text in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_TEXT_COLOR = "#bbb";

/*
* Default color of cusps number
* @constant
* @type {String}
* @default #333
*/
const CHART_HOUSE_NUMBER_COLOR = "#333";

/*
* Default color of mqin axis - As, Ds, Mc, Ic
* @constant
* @type {String}
* @default #000
*/
const CHART_MAIN_AXIS_COLOR = "#000";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_SIGNS_COLOR = "#333";

/*
* Default color of planets on the chart (Sun symbol, Moon symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_POINTS_COLOR = "#000";

/*
* Default color for point properties - angle in sign, dignities, retrograde
* @constant
* @type {String}
* @default #333
*/
const POINT_PROPERTIES_COLOR = "#333"

/*
* Aries color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_ARIES = "#FF4500";

/*
* Taurus color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_TAURUS = "#8B4513";

/*
* Geminy color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_GEMINI= "#87CEEB";

/*
* Cancer color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_CANCER = "#27AE60";

/*
* Leo color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_LEO = "#FF4500";

/*
* Virgo color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_VIRGO = "#8B4513";

/*
* Libra color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_LIBRA = "#87CEEB";

/*
* Scorpio color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_SCORPIO = "#27AE60";

/*
* Sagittarius color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_SAGITTARIUS = "#FF4500";

/*
* Capricorn color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_CAPRICORN = "#8B4513";

/*
* Aquarius color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_AQUARIUS = "#87CEEB";

/*
* Pisces color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_PISCES = "#27AE60";

/*
* Color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CIRCLE_COLOR = "#333";

/*
* Color of aspects
* @constant
* @type {Object}
*/
const ASPECT_COLORS = {
  Conjunction:"#333",
  Opposition:"#1B4F72",
  Square:"#641E16",
  Trine:"#0B5345",
  Sextile:"#333",
  Quincunx:"#333",
  Semisextile:"#333",
  Quintile:"#333",
  Trioctile:"#333"
}

/**
 * Override individual planet symbol colors by planet name
 */
const PLANET_COLORS = {
  //Sun: "#000",
  //Moon: "#aaa",
}

/**
 * override individual sign symbol colors by zodiac index
 */
const SIGN_COLORS = {
  //0: "#333"
}

/**
 * Override individual planet symbol colors by planet name on transit charts
 */
const TRANSIT_PLANET_COLORS = {
  //Sun: "#000",
  //Moon: "#aaa",
}


/***/ }),

/***/ "./src/settings/constants/Point.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Point.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   POINT_COLLISION_RADIUS: () => (/* binding */ POINT_COLLISION_RADIUS),
/* harmony export */   POINT_PROPERTIES_ANGLE_OFFSET: () => (/* binding */ POINT_PROPERTIES_ANGLE_OFFSET),
/* harmony export */   POINT_PROPERTIES_ANGLE_SIZE: () => (/* binding */ POINT_PROPERTIES_ANGLE_SIZE),
/* harmony export */   POINT_PROPERTIES_DIGNITY_OFFSET: () => (/* binding */ POINT_PROPERTIES_DIGNITY_OFFSET),
/* harmony export */   POINT_PROPERTIES_DIGNITY_SIZE: () => (/* binding */ POINT_PROPERTIES_DIGNITY_SIZE),
/* harmony export */   POINT_PROPERTIES_DIGNITY_SYMBOLS: () => (/* binding */ POINT_PROPERTIES_DIGNITY_SYMBOLS),
/* harmony export */   POINT_PROPERTIES_FONT_SIZE: () => (/* binding */ POINT_PROPERTIES_FONT_SIZE),
/* harmony export */   POINT_PROPERTIES_RETROGRADE_OFFSET: () => (/* binding */ POINT_PROPERTIES_RETROGRADE_OFFSET),
/* harmony export */   POINT_PROPERTIES_RETROGRADE_SIZE: () => (/* binding */ POINT_PROPERTIES_RETROGRADE_SIZE),
/* harmony export */   POINT_PROPERTIES_SHOW: () => (/* binding */ POINT_PROPERTIES_SHOW),
/* harmony export */   POINT_PROPERTIES_SHOW_ANGLE: () => (/* binding */ POINT_PROPERTIES_SHOW_ANGLE),
/* harmony export */   POINT_PROPERTIES_SHOW_DIGNITY: () => (/* binding */ POINT_PROPERTIES_SHOW_DIGNITY),
/* harmony export */   POINT_PROPERTIES_SHOW_RETROGRADE: () => (/* binding */ POINT_PROPERTIES_SHOW_RETROGRADE)
/* harmony export */ });
/*
* Point properties - angle in sign, dignities, retrograde
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW = true

/*
* Point angle in sign
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW_ANGLE = true

/*
* Point dignity symbol
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW_DIGNITY = true

/*
* Point retrograde symbol
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW_RETROGRADE = true

/*
* Point dignity symbols - [domicile, detriment, exaltation, fall]
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_DIGNITY_SYMBOLS = ["r", "d", "e", "f"];

/*
* Text size of Point description - angle in sign, dignities, retrograde
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_FONT_SIZE = 16

/*
* Text size of angle number
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_ANGLE_SIZE = 25

/*
* Text size of retrograde symbol
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_RETROGRADE_SIZE = 25

/*
* Text size of dignity symbol
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_DIGNITY_SIZE = 12

/*
* Angle offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_ANGLE_OFFSET = 2

/*
* Retrograde symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_RETROGRADE_OFFSET = 3.5

/*
* Dignity symbol offset multiplier
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_DIGNITY_OFFSET = 5

/**
* A point collision radius
* @constant
* @type {Number}
* @default 2
*/
const POINT_COLLISION_RADIUS = 12


/***/ }),

/***/ "./src/settings/constants/Radix.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Radix.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RADIX_AXIS_FONT_SIZE: () => (/* binding */ RADIX_AXIS_FONT_SIZE),
/* harmony export */   RADIX_HOUSE_FONT_SIZE: () => (/* binding */ RADIX_HOUSE_FONT_SIZE),
/* harmony export */   RADIX_ID: () => (/* binding */ RADIX_ID),
/* harmony export */   RADIX_POINTS_FONT_SIZE: () => (/* binding */ RADIX_POINTS_FONT_SIZE),
/* harmony export */   RADIX_SIGNS_FONT_SIZE: () => (/* binding */ RADIX_SIGNS_FONT_SIZE)
/* harmony export */ });
/*
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
const RADIX_ID = "radix"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 27
*/
const RADIX_POINTS_FONT_SIZE = 27

/*
* Font size - house cusp number
* @constant
* @type {Number}
* @default 27
*/
const RADIX_HOUSE_FONT_SIZE = 20

/*
* Font size - signs
* @constant
* @type {Number}
* @default 27
*/
const RADIX_SIGNS_FONT_SIZE = 27

/*
* Font size - axis (As, Ds, Mc, Ic)
* @constant
* @type {Number}
* @default 24
*/
const RADIX_AXIS_FONT_SIZE = 32


/***/ }),

/***/ "./src/settings/constants/Transit.js":
/*!*******************************************!*\
  !*** ./src/settings/constants/Transit.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TRANSIT_ID: () => (/* binding */ TRANSIT_ID),
/* harmony export */   TRANSIT_POINTS_FONT_SIZE: () => (/* binding */ TRANSIT_POINTS_FONT_SIZE)
/* harmony export */ });
/*
* Transit chart element ID
* @constant
* @type {String}
* @default transit
*/
const TRANSIT_ID = "transit"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 32
*/
const TRANSIT_POINTS_FONT_SIZE = 27


/***/ }),

/***/ "./src/settings/constants/Universe.js":
/*!********************************************!*\
  !*** ./src/settings/constants/Universe.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHART_ALLOW_HOUSE_OVERLAP: () => (/* binding */ CHART_ALLOW_HOUSE_OVERLAP),
/* harmony export */   CHART_DRAW_MAIN_AXIS: () => (/* binding */ CHART_DRAW_MAIN_AXIS),
/* harmony export */   CHART_FONT_FAMILY: () => (/* binding */ CHART_FONT_FAMILY),
/* harmony export */   CHART_MAIN_STROKE: () => (/* binding */ CHART_MAIN_STROKE),
/* harmony export */   CHART_PADDING: () => (/* binding */ CHART_PADDING),
/* harmony export */   CHART_STROKE: () => (/* binding */ CHART_STROKE),
/* harmony export */   CHART_STROKE_ONLY: () => (/* binding */ CHART_STROKE_ONLY),
/* harmony export */   CHART_VIEWBOX_HEIGHT: () => (/* binding */ CHART_VIEWBOX_HEIGHT),
/* harmony export */   CHART_VIEWBOX_WIDTH: () => (/* binding */ CHART_VIEWBOX_WIDTH)
/* harmony export */ });
/**
* Chart padding
* @constant
* @type {Number}
* @default 10px
*/
const CHART_PADDING = 40

/**
* SVG viewBox width
* @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
* @constant
* @type {Number}
* @default 800
*/
const CHART_VIEWBOX_WIDTH = 800

/**
* SVG viewBox height
* @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
* @constant
* @type {Number}
* @default 800
*/
const CHART_VIEWBOX_HEIGHT = 800

/*
* Line strength
* @constant
* @type {Number}
* @default 1
*/
const CHART_STROKE = 1

/*
* Line strength of the main lines. For instance points, main axis, main circles
* @constant
* @type {Number}
* @default 1
*/
const CHART_MAIN_STROKE = 2

/**
* No fill, only stroke
* @constant
* @type {boolean}
* @default false
*/
const CHART_STROKE_ONLY = false;

/**
* Font family
* @constant
* @type {String}
* @default
*/
const CHART_FONT_FAMILY = "Astronomicon";

/**
* Always draw the full house lines, even if it overlaps with planets
* @constant
* @type {boolean}
* @default false
*/
const CHART_ALLOW_HOUSE_OVERLAP = false;

/**
* Draw mains axis symbols outside the chart: Ac, Mc, Ic, Dc
* @constant
* @type {boolean}
* @default false
*/
const CHART_DRAW_MAIN_AXIS = true;


/***/ }),

/***/ "./src/universe/Universe.js":
/*!**********************************!*\
  !*** ./src/universe/Universe.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Universe)
/* harmony export */ });
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../charts/TransitChart.js */ "./src/charts/TransitChart.js");







/**
 * @class
 * @classdesc An wrapper for all parts of graph.
 * @public
 */
class Universe {

  #SVGDocument
  #settings
  #radix
  #transit
  #aspectsWrapper

  /**
   * @constructs
   * @param {String} htmlElementID - ID of the root element without the # sign
   * @param {Object} [options] - An object that overrides the default settings values
   */
  constructor(htmlElementID, options = {}) {

    if (typeof htmlElementID !== 'string') {
      throw new Error('A required parameter is missing.')
    }

    if (!document.getElementById(htmlElementID)) {
      throw new Error('Canot find a HTML element with ID ' + htmlElementID)
    }

    this.#settings = Object.assign({}, _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__["default"], options, {
      HTML_ELEMENT_ID: htmlElementID
    });
    this.#SVGDocument = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGDocument(this.#settings.CHART_VIEWBOX_WIDTH, this.#settings.CHART_VIEWBOX_HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

    // chart background
    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#settings.CHART_VIEWBOX_WIDTH / 2, this.#settings.CHART_VIEWBOX_HEIGHT / 2, this.#settings.CHART_VIEWBOX_WIDTH / 2)
    circle.setAttribute('fill', this.#settings.CHART_BACKGROUND_COLOR)
    this.#SVGDocument.appendChild(circle)

    // create wrapper for aspects
    this.#aspectsWrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#aspectsWrapper.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.ASPECTS_ID}`)
    this.#SVGDocument.appendChild(this.#aspectsWrapper)

    this.#radix = new _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"](this)
    this.#transit = new _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.#radix)

    this.#loadFont("Astronomicon", '../assets/fonts/ttf/AstronomiconFonts_1.1/Astronomicon.ttf')

    return this
  }

  // ## PUBLIC ##############################

  /**
   * Get Radix chart
   * @return {RadixChart}
   */
  radix() {
    return this.#radix
  }

  /**
   * Get Transit chart
   * @return {TransitChart}
   */
  transit() {
    return this.#transit
  }

  /**
   * Get current settings
   * @return {Object}
   */
  getSettings() {
    return this.#settings
  }

  /**
   * Get root SVG document
   * @return {SVGDocument}
   */
  getSVGDocument() {
    return this.#SVGDocument
  }

  /**
   * Get empty aspects wrapper element
   * @return {SVGGroupElement}
   */
  getAspectsElement() {
    return this.#aspectsWrapper
  }

  // ## PRIVATE ##############################

  /*
  * Load fond to DOM
  *
  * @param {String} family
  * @param {String} source
  * @param {Object}
  *
  * @see https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
  */
  async #loadFont( family, source, descriptors ){

    if (!('FontFace' in window)) {
      console.error("Ooops, FontFace is not a function.")
      console.error("@see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API")
      return
    }

    const font = new FontFace(family, `url(${source})`, descriptors)

    try{
      await font.load();
      document.fonts.add(font)
    }catch(e){
      throw new Error(e)
    }
  }
}




/***/ }),

/***/ "./src/utils/AspectUtils.js":
/*!**********************************!*\
  !*** ./src/utils/AspectUtils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AspectUtils)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SVGUtils.js */ "./src/utils/SVGUtils.js");



/**
 * @class
 * @classdesc Utility class
 * @public
 * @static
 * @hideconstructor
 */
class AspectUtils {

  constructor() {
    if (this instanceof AspectUtils) {
      throw Error('This is a static class and cannot be instantiated.');
    }
  }

  /**
   * Calculates the orbit of two angles on a circle
   *
   * @param {Number} fromAngle - angle in degree, point on the circle
   * @param {Number} toAngle - angle in degree, point on the circle
   * @param {Number} aspectAngle - 60,90,120, ...
   *
   * @return {Number} orb
   */
  static orb(fromAngle, toAngle, aspectAngle) {
    let orb
    let sign = fromAngle > toAngle ? 1 : -1
    let difference = Math.abs(fromAngle - toAngle)

    if (difference > _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].DEG_180) {
      difference = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].DEG_360 - difference;
      orb = (difference - aspectAngle) * -1

    } else {
      orb = (difference - aspectAngle) * sign
    }

    return Number(Number(orb).toFixed(2))
  }

  /**
   * Get aspects
   *
   * @param {Array<Object>} fromPoints - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} toPoints - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} aspects - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  static getAspects(fromPoints, toPoints, aspects){
    const aspectList = []
    for (const fromP of fromPoints){
      for (const toP of toPoints){
        for (const aspect of aspects){
          const orb = AspectUtils.orb(fromP.angle, toP.angle, aspect.angle)
          if( Math.abs( orb ) <=  aspect.orb ){
            aspectList.push( { aspect:aspect, from:fromP, to:toP, precision:orb } )
          }
        }
      }
    }

    return aspectList
  }

  /**
   * Draw aspects
   *
   * @param {Number} radius
   * @param {Number} ascendantShift
   * @param {Object} settings
   * @param {Array<Object>} aspectsList
   *
   * @return {SVGGroupElement}
   */
  static drawAspects(radius, ascendantShift, settings, aspectsList){
    const centerX = settings.CHART_VIEWBOX_WIDTH / 2
    const centerY = settings.CHART_VIEWBOX_HEIGHT / 2

    const wrapper = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    for(const asp of aspectsList){

        // aspect as solid line
        const fromPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.from.angle, ascendantShift))
        const toPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.to.angle, ascendantShift))

        // draw symbol in center of aspect
        const lineCenterX = (fromPoint.x +  toPoint.x) / 2
        const lineCenterY = (fromPoint.y +  toPoint.y) / 2
        const symbol = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(asp.aspect.name, lineCenterX, lineCenterY)
        symbol.setAttribute("font-family", settings.CHART_FONT_FAMILY);
        symbol.setAttribute("text-anchor", "middle") // start, middle, end
        symbol.setAttribute("dominant-baseline", "middle")
        symbol.setAttribute("font-size", settings.ASPECTS_FONT_SIZE);
        symbol.setAttribute("fill", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

        // space for symbol (fromPoint - center)
        const fromPointSpaceX = fromPoint.x + ( toPoint.x - fromPoint.x ) / 2.2
        const fromPointSpaceY = fromPoint.y + ( toPoint.y - fromPoint.y ) / 2.2

        // space for symbol (center - toPoint)
        const toPointSpaceX = toPoint.x + ( fromPoint.x - toPoint.x ) / 2.2
        const toPointSpaceY = toPoint.y + ( fromPoint.y - toPoint.y ) / 2.2

        // line: fromPoint - center
        const line1 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(fromPoint.x, fromPoint.y, fromPointSpaceX, fromPointSpaceY)
        line1.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");
        line1.setAttribute("stroke-width", settings.CHART_STROKE);

        // line: center - toPoint
        const line2 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(toPointSpaceX, toPointSpaceY, toPoint.x, toPoint.y)
        line2.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");
        line2.setAttribute("stroke-width", settings.CHART_STROKE);

        wrapper.appendChild(line1);
        wrapper.appendChild(line2);
        wrapper.appendChild(symbol);
    }

    return wrapper
  }

}




/***/ }),

/***/ "./src/utils/SVGUtils.js":
/*!*******************************!*\
  !*** ./src/utils/SVGUtils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SVGUtils)
/* harmony export */ });
/**
 * @class
 * @classdesc SVG utility class
 * @public
 * @static
 * @hideconstructor
 */
class SVGUtils {

  static SVG_NAMESPACE = "http://www.w3.org/2000/svg"

  static SYMBOL_ARIES = "Aries";
  static SYMBOL_TAURUS = "Taurus";
  static SYMBOL_GEMINI = "Gemini";
  static SYMBOL_CANCER = "Cancer";
  static SYMBOL_LEO = "Leo";
  static SYMBOL_VIRGO = "Virgo";
  static SYMBOL_LIBRA = "Libra";
  static SYMBOL_SCORPIO = "Scorpio";
  static SYMBOL_SAGITTARIUS = "Sagittarius";
  static SYMBOL_CAPRICORN = "Capricorn";
  static SYMBOL_AQUARIUS = "Aquarius";
  static SYMBOL_PISCES = "Pisces";

  static SYMBOL_SUN = "Sun";
  static SYMBOL_MOON = "Moon";
  static SYMBOL_MERCURY = "Mercury";
  static SYMBOL_VENUS = "Venus";
  static SYMBOL_EARTH = "Earth";
  static SYMBOL_MARS = "Mars";
  static SYMBOL_JUPITER = "Jupiter";
  static SYMBOL_SATURN = "Saturn";
  static SYMBOL_URANUS = "Uranus";
  static SYMBOL_NEPTUNE = "Neptune";
  static SYMBOL_PLUTO = "Pluto";
  static SYMBOL_CHIRON = "Chiron";
  static SYMBOL_LILITH = "Lilith";
  static SYMBOL_NNODE = "NNode";
  static SYMBOL_SNODE = "SNode";

  static SYMBOL_AS = "As";
  static SYMBOL_DS = "Ds";
  static SYMBOL_MC = "Mc";
  static SYMBOL_IC = "Ic";

  static SYMBOL_RETROGRADE = "Retrograde"

  static SYMBOL_CONJUNCTION = "Conjunction";
  static SYMBOL_OPPOSITION = "Opposition";
  static SYMBOL_SQUARE = "Square";
  static SYMBOL_TRINE = "Trine";
  static SYMBOL_SEXTILE = "Sextile";
  static SYMBOL_QUINCUNX = "Quincunx";
  static SYMBOL_SEMISEXTILE = "Semisextile";
  static SYMBOL_OCTILE = "Octile";
  static SYMBOL_TRIOCTILE = "Trioctile";

  // Astronomicon font codes
  static SYMBOL_ARIES_CODE = "A";
  static SYMBOL_TAURUS_CODE = "B";
  static SYMBOL_GEMINI_CODE = "C";
  static SYMBOL_CANCER_CODE = "D";
  static SYMBOL_LEO_CODE = "E";
  static SYMBOL_VIRGO_CODE = "F";
  static SYMBOL_LIBRA_CODE = "G";
  static SYMBOL_SCORPIO_CODE = "H";
  static SYMBOL_SAGITTARIUS_CODE = "I";
  static SYMBOL_CAPRICORN_CODE = "J";
  static SYMBOL_AQUARIUS_CODE = "K";
  static SYMBOL_PISCES_CODE = "L";

  static SYMBOL_SUN_CODE = "Q";
  static SYMBOL_MOON_CODE = "R";
  static SYMBOL_MERCURY_CODE = "S";
  static SYMBOL_VENUS_CODE = "T";
  static SYMBOL_EARTH_CODE = ">";
  static SYMBOL_MARS_CODE = "U";
  static SYMBOL_JUPITER_CODE = "V";
  static SYMBOL_SATURN_CODE = "W";
  static SYMBOL_URANUS_CODE = "X";
  static SYMBOL_NEPTUNE_CODE = "Y";
  static SYMBOL_PLUTO_CODE = "Z";
  static SYMBOL_CHIRON_CODE = "q";
  static SYMBOL_LILITH_CODE = "z";
  static SYMBOL_NNODE_CODE = "g";
  static SYMBOL_SNODE_CODE = "i";

  static SYMBOL_AS_CODE = "c";
  static SYMBOL_DS_CODE = "f";
  static SYMBOL_MC_CODE = "d";
  static SYMBOL_IC_CODE = "e";

  static SYMBOL_RETROGRADE_CODE = "M"

  static SYMBOL_CONJUNCTION_CODE = "!";
  static SYMBOL_OPPOSITION_CODE = '"';
  static SYMBOL_SQUARE_CODE = "#";
  static SYMBOL_TRINE_CODE = "$";
  static SYMBOL_SEXTILE_CODE = "%";
  static SYMBOL_QUINCUNX_CODE = "&";
  static SYMBOL_SEMISEXTILE_CODE = "''";
  static SYMBOL_OCTILE_CODE = "(";
  static SYMBOL_TRIOCTILE_CODE = ")";

  constructor() {
    if (this instanceof SVGUtils) {
      throw Error('This is a static class and cannot be instantiated.');
    }
  }

  /**
   * Create a SVG document
   *
   * @static
   * @param {Number} width
   * @param {Number} height
   *
   * @return {SVGDocument}
   */
  static SVGDocument(width, height) {
    const svg = document.createElementNS(SVGUtils.SVG_NAMESPACE, "svg");
    svg.setAttribute('xmlns', SVGUtils.SVG_NAMESPACE);
    svg.setAttribute('version', "1.1");
    svg.setAttribute('viewBox', "0 0 " + width + " " + height);
    return svg
  }

  /**
   * Create a SVG group element
   *
   * @static
   * @return {SVGGroupElement}
   */
  static SVGGroup() {
    const g = document.createElementNS(SVGUtils.SVG_NAMESPACE, "g");
    return g
  }

  /**
   * Create a SVG path element
   *
   * @static
   * @return {SVGGroupElement}
   */
  static SVGPath() {
    const path = document.createElementNS(SVGUtils.SVG_NAMESPACE, "path");
    return path
  }

  /**
   * Create a SVG mask element
   *
   * @static
   * @param {String} elementID
   *
   * @return {SVGMaskElement}
   */
  static SVGMask(elementID) {
    const mask = document.createElementNS(SVGUtils.SVG_NAMESPACE, "mask");
    mask.setAttribute("id", elementID)
    return mask
  }

  /**
   * SVG circular sector
   *
   * @static
   * @param {int} x - circle x center position
   * @param {int} y - circle y center position
   * @param {int} radius - circle radius in px
   * @param {int} a1 - angleFrom in radians
   * @param {int} a2 - angleTo in radians
   * @param {int} thickness - from outside to center in px
   *
   * @return {SVGElement} segment
   */
  static SVGSegment(x, y, radius, a1, a2, thickness, lFlag, sFlag) {
    // @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
    const LARGE_ARC_FLAG = lFlag || 0;
    const SWEET_FLAG = sFlag || 0;

    const segment = document.createElementNS(SVGUtils.SVG_NAMESPACE, "path");
    segment.setAttribute("d", "M " + (x + thickness * Math.cos(a1)) + ", " + (y + thickness * Math.sin(a1)) + " l " + ((radius - thickness) * Math.cos(a1)) + ", " + ((radius - thickness) * Math.sin(a1)) + " A " + radius + ", " + radius + ",0 ," + LARGE_ARC_FLAG + ", " + SWEET_FLAG + ", " + (x + radius * Math.cos(a2)) + ", " + (y + radius * Math.sin(a2)) + " l " + ((radius - thickness) * -Math.cos(a2)) + ", " + ((radius - thickness) * -Math.sin(a2)) + " A " + thickness + ", " + thickness + ",0 ," + LARGE_ARC_FLAG + ", " + 1 + ", " + (x + thickness * Math.cos(a1)) + ", " + (y + thickness * Math.sin(a1)));
    segment.setAttribute("fill", "none");
    return segment;
  }

  /**
   * SVG circle
   *
   * @static
   * @param {int} cx
   * @param {int} cy
   * @param {int} radius
   *
   * @return {SVGElement} circle
   */
  static SVGCircle(cx, cy, radius) {
    const circle = document.createElementNS(SVGUtils.SVG_NAMESPACE, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    return circle;
  }

  /**
   * SVG line
   *
   * @param {Number} x1
   * @param {Number} y2
   * @param {Number} x2
   * @param {Number} y2
   *
   * @return {SVGElement} line
   */
  static SVGLine(x1, y1, x2, y2) {
    const line = document.createElementNS(SVGUtils.SVG_NAMESPACE, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    return line;
  }

  /**
   * SVG text
   *
   * @param {Number} x
   * @param {Number} y
   * @param {String} txt
   * @param {Number} [scale]
   *
   * @return {SVGElement} line
   */
  static SVGText(x, y, txt) {
    const text = document.createElementNS(SVGUtils.SVG_NAMESPACE, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("stroke", "none");
    text.appendChild(document.createTextNode(txt));

    return text;
  }

  /**
   * SVG symbol
   *
   * @param {String} name
   * @param {Number} xPos
   * @param {Number} yPos
   *
   * @return {SVGElement}
   */
  static SVGSymbol(name, xPos, yPos) {
    switch (name) {
      case SVGUtils.SYMBOL_AS:
        return asSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_DS:
        return dsSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MC:
        return mcSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_IC:
        return icSymbol(xPos, yPos)
        break;

      case SVGUtils.SYMBOL_ARIES:
        return ariesSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_TAURUS:
        return taurusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_GEMINI:
        return geminiSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_CANCER:
        return cancerSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_LEO:
        return leoSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_VIRGO:
        return virgoSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_LIBRA:
        return libraSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SCORPIO:
        return scorpioSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SAGITTARIUS:
        return sagittariusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_CAPRICORN:
        return capricornSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_AQUARIUS:
        return aquariusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_PISCES:
        return piscesSymbol(xPos, yPos)
        break;

      case SVGUtils.SYMBOL_SUN:
        return sunSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MOON:
        return moonSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MERCURY:
        return mercurySymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_VENUS:
        return venusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_EARTH:
        return earthSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MARS:
        return marsSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_JUPITER:
        return jupiterSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SATURN:
        return saturnSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_URANUS:
        return uranusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_NEPTUNE:
        return neptuneSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_PLUTO:
        return plutoSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_CHIRON:
        return chironSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_LILITH:
        return lilithSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_NNODE:
        return nnodeSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SNODE:
        return snodeSymbol(xPos, yPos)
        break;

      case SVGUtils.SYMBOL_RETROGRADE:
        return retrogradeSymbol(xPos, yPos)
        break;

      case SVGUtils.SYMBOL_CONJUNCTION:
        return conjunctionSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_OPPOSITION:
        return oppositionSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SQUARE:
        return squareSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_TRINE:
        return trineSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SEXTILE:
        return sextileSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_QUINCUNX:
        return quincunxSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SEMISEXTILE:
        return semisextileSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_OCTILE:
        return quintileSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_TRIOCTILE:
        return trioctileSymbol(xPos, yPos)
        break;

      default:
        const unknownSymbol = SVGUtils.SVGCircle(xPos, yPos, 8)
        unknownSymbol.setAttribute("stroke", "#333")
        return unknownSymbol
    }

    /*
     * Ascendant symbol
     */
    function asSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AS_CODE)
    }

    /*
     * Descendant symbol
     */
    function dsSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_DS_CODE)
    }

    /*
     * Medium coeli symbol
     */
    function mcSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MC_CODE)
    }

    /*
     * Immum coeli symbol
     */
    function icSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_IC_CODE)
    }

    /*
     * Aries symbol
     */
    function ariesSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_ARIES_CODE)
    }

    /*
     * Taurus symbol
     */
    function taurusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TAURUS_CODE)
    }

    /*
     * Gemini symbol
     */
    function geminiSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_GEMINI_CODE)
    }

    /*
     * Cancer symbol
     */
    function cancerSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CANCER_CODE)
    }

    /*
     * Leo symbol
     */
    function leoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LEO_CODE)
    }

    /*
     * Virgo symbol
     */
    function virgoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_VIRGO_CODE)
    }

    /*
     * Libra symbol
     */
    function libraSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LIBRA_CODE)
    }

    /*
     * Scorpio symbol
     */
    function scorpioSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SCORPIO_CODE)
    }

    /*
     * Sagittarius symbol
     */
    function sagittariusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SAGITTARIUS_CODE)
    }

    /*
     * Capricorn symbol
     */
    function capricornSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CAPRICORN_CODE)
    }

    /*
     * Aquarius symbol
     */
    function aquariusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AQUARIUS_CODE)
    }

    /*
     * Pisces symbol
     */
    function piscesSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_PISCES_CODE)
    }

    /*
     * Sun symbol
     */
    function sunSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SUN_CODE)
    }

    /*
     * Moon symbol
     */
    function moonSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MOON_CODE)
    }

    /*
     * Mercury symbol
     */
    function mercurySymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MERCURY_CODE)
    }

    /*
     * Venus symbol
     */
    function venusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_VENUS_CODE)
    }

    /*
     * Earth symbol
     */
    function earthSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_EARTH_CODE)
    }

    /*
     * Mars symbol
     */
    function marsSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MARS_CODE)
    }

    /*
     * Jupiter symbol
     */
    function jupiterSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_JUPITER_CODE)
    }

    /*
     * Saturn symbol
     */
    function saturnSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SATURN_CODE)
    }

    /*
     * Uranus symbol
     */
    function uranusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_URANUS_CODE)
    }

    /*
     * Neptune symbol
     */
    function neptuneSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_NEPTUNE_CODE)
    }

    /*
     * Pluto symbol
     */
    function plutoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_PLUTO_CODE)
    }

    /*
     * Chiron symbol
     */
    function chironSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CHIRON_CODE)
    }

    /*
     * Lilith symbol
     */
    function lilithSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LILITH_CODE)
    }

    /*
     * NNode symbol
     */
    function nnodeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_NNODE_CODE)
    }

    /*
     * SNode symbol
     */
    function snodeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SNODE_CODE)
    }

    /*
     * Retrograde symbol
     */
    function retrogradeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_RETROGRADE_CODE)
    }

    /*
     * Conjunction symbol
     */
    function conjunctionSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CONJUNCTION_CODE)
    }

    /*
     * Opposition symbol
     */
    function oppositionSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_OPPOSITION_CODE)
    }

    /*
     * Squaresymbol
     */
    function squareSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SQUARE_CODE)
    }

    /*
     * Trine symbol
     */
    function trineSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TRINE_CODE)
    }

    /*
     * Sextile symbol
     */
    function sextileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEXTILE_CODE)
    }

    /*
     * Quincunx symbol
     */
    function quincunxSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_QUINCUNX_CODE)
    }

    /*
     * Semisextile symbol
     */
    function semisextileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEMISEXTILE_CODE)
    }

    /*
     * Quintile symbol
     */
    function quintileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_OCTILE_CODE)
    }

    /*
     * Trioctile symbol
     */
    function trioctileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TRIOCTILE_CODE)
    }
  }
}




/***/ }),

/***/ "./src/utils/Utils.js":
/*!****************************!*\
  !*** ./src/utils/Utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Utils)
/* harmony export */ });
/**
 * @class
 * @classdesc Utility class
 * @public
 * @static
 * @hideconstructor
 */
class Utils {

  constructor() {
    if (this instanceof Utils) {
      throw Error('This is a static class and cannot be instantiated.');
    }
  }

  static DEG_360 = 360
  static DEG_180 = 180
  static DEG_0 = 0

  /**
   * Generate random ID
   *
   * @static
   * @return {String}
   */
  static generateUniqueId = function() {
    const randomNumber = Math.random() * 1000000;
    const timestamp = Date.now();
    const uniqueId = `id_${randomNumber}_${timestamp}`;
    return uniqueId;
  }

  /**
   * Inverted degree to radian
   * @static
   *
   * @param {Number} angleIndegree
   * @param {Number} shiftInDegree
   * @return {Number}
   */
  static degreeToRadian = function(angleInDegree, shiftInDegree = 0) {
    return (shiftInDegree - angleInDegree) * Math.PI / 180
  }

  /**
   * Converts radian to degree
   * @static
   *
   * @param {Number} radian
   * @return {Number}
   */
  static radianToDegree = function(radian) {
    return (radian * 180 / Math.PI)
  }

  /**
   * Calculates a position of the point on the circle.
   *
   * @param {Number} cx - center x
   * @param {Number} cy - center y
   * @param {Number} radius - circle radius
   * @param {Number} angleInRadians
   *
   * @return {Object} - {x:Number, y:Number}
   */
  static positionOnCircle(cx, cy, radius, angleInRadians) {
    return {
      x: (radius * Math.cos(angleInRadians) + cx),
      y: (radius * Math.sin(angleInRadians) + cy)
    };
  }

  /**
   * Calculates the angle between the line (2 points) and the x-axis.
   *
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   *
   * @return {Number} - degree
   */
  static positionToAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angleInRadians = Math.atan2(dy, dx);
    return Utils.radianToDegree(angleInRadians)
  }

  /**
   * Calculates new position of points on circle without overlapping each other
   *
   * @throws {Error} - If there is no place on the circle to place points.
   * @param {Array} points - [{name:"a", angle:10}, {name:"b", angle:20}]
   * @param {Number} collisionRadius - point radius
   * @param {Number} radius - circle radius
   *
   * @return {Object} - {"Moon":30, "Sun":60, "Mercury":86, ...}
   */
  static calculatePositionWithoutOverlapping(points, collisionRadius, circleRadius) {
    const STEP = 1 //degree

    const cellWidth = 10 //degree
    const numberOfCells = Utils.DEG_360 / cellWidth
    const frequency = new Array(numberOfCells).fill(0)
    for (const point of points) {
      const index = Math.floor(point.angle / cellWidth)
      frequency[index] += 1
    }

    // In this algorithm the order of points is crucial.
    // At that point in the circle, where the period changes in the circle (for instance:[358,359,0,1]), the points are arranged in incorrect order.
    // As a starting point, I try to find a place where there are no points. This place I use as START_ANGLE.
    const START_ANGLE = cellWidth * frequency.findIndex(count => count == 0)

    const _points = points.map(point => {
      return {
        name: point.name,
        angle: point.angle < START_ANGLE ? point.angle + Utils.DEG_360 : point.angle
      }
    })

    _points.sort((a, b) => {
      return a.angle - b.angle
    })

    // Recursive function
    const arrangePoints = () => {
      for (let i = 0, ln = _points.length; i < ln; i++) {
        const pointPosition = Utils.positionOnCircle(0, 0, circleRadius, Utils.degreeToRadian(_points[i].angle))
        _points[i].x = pointPosition.x
        _points[i].y = pointPosition.y

        for (let j = 0; j < i; j++) {
          const distance = Math.sqrt(Math.pow(_points[i].x - _points[j].x, 2) + Math.pow(_points[i].y - _points[j].y, 2));
          if (distance < (2 * collisionRadius)) {
            _points[i].angle += STEP
            _points[j].angle -= STEP
            arrangePoints() //======> Recursive call
          }
        }
      }
    }

    arrangePoints()

    return _points.reduce((accumulator, point, currentIndex) => {
      accumulator[point.name] = point.angle
      return accumulator
    }, {})
  }

  /**
   * Check if the angle collides with the points
   *
   * @param {Number} angle
   * @param {Array} anglesList
   * @param {Number} [collisionRadius]
   *
   * @return {Boolean}
   */
  static isCollision(angle, anglesList, collisionRadius = 10) {

    const pointInCollision = anglesList.find(point => {

      let a = (point - angle) > Utils.DEG_180 ? angle + Utils.DEG_360 : angle
      let p = (angle - point) > Utils.DEG_180 ? point + Utils.DEG_360 : point

      return Math.abs(a - p) <= collisionRadius
    })

    return pointInCollision === undefined ? false : true
  }

  

  /**
  * Removes the content of an element
  *
  * @param {String} elementID
  * @param {Function} [beforeHook]
    *
  * @warning - It removes Event Listeners too.
  * @warning - You will (probably) get memory leak if you delete elements that have attached listeners
  */
  static cleanUp( elementID, beforeHook){
    let elm = document.getElementById(elementID)
    if(!elm){
      return
    }

    (typeof beforeHook === 'function') && beforeHook()

    elm.innerHTML = ""
  }
}




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
/************************************************************************/
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RadixChart: () => (/* reexport safe */ _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   SVGUtils: () => (/* reexport safe */ _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   TransitChart: () => (/* reexport safe */ _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   Universe: () => (/* reexport safe */ _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   Utils: () => (/* reexport safe */ _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe/Universe.js */ "./src/universe/Universe.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./charts/TransitChart.js */ "./src/charts/TransitChart.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0EsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOVlrRDtBQUNOO0FBQ0k7QUFDSjtBQUNFO0FBQ0U7QUFDakQ7QUFDQSxpQ0FBaUMsRUFBRSxtREFBUSxFQUFFLGdEQUFLLEVBQUUsa0RBQU8sRUFBRSxnREFBSyxFQUFFLGlEQUFNLEVBQUUsa0RBQU87QUFDbkY7QUFJQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ087QUFDUCxHQUFHLG1DQUFtQztBQUN0QyxHQUFHLG9DQUFvQztBQUN2QyxHQUFHLCtCQUErQjtBQUNsQyxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0R1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2RQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFc0Q7QUFDakI7QUFDTjtBQUNXO0FBQ0k7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QzREIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL0NoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvUmFkaXhDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1RyYW5zaXRDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvcG9pbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Bc3BlY3RzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL0FzcGVjdFV0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9TVkdVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgYWxsIHR5cGUgb2YgQ2hhcnRcclxuICogQHB1YmxpY1xyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXHJcbiAqIEBhYnN0cmFjdFxyXG4gKi9cclxuY2xhc3MgQ2hhcnQge1xyXG5cclxuICAvLyNzZXR0aW5nc1xyXG5cclxuICAvKipcclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XHJcbiAgICAvL3RoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkXHJcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgdW5kZWZpbmVkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtpc1ZhbGlkOmJvb2xlYW4sIG1lc3NhZ2U6U3RyaW5nfVxyXG4gICAqL1xyXG4gIHZhbGlkYXRlRGF0YShkYXRhKSB7XHJcbiAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzaW5nIHBhcmFtIGRhdGEuXCIpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucG9pbnRzKSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgIG1lc3NhZ2U6IFwicG9pbnRzIGlzIG5vdCBBcnJheS5cIlxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY3VzcHMpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgICAgbWVzc2FnZTogXCJjdXBzIGlzIG5vdCBBcnJheS5cIlxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuY3VzcHMubGVuZ3RoICE9PSAxMikge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VzcHMubGVuZ3RoICE9PSAxMlwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBwb2ludCBvZiBkYXRhLnBvaW50cykge1xyXG4gICAgICBpZiAodHlwZW9mIHBvaW50Lm5hbWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lICE9PSAnc3RyaW5nJ1wiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb2ludC5uYW1lLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZS5sZW5ndGggPT0gMFwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQuYW5nbGUgIT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5hbmdsZSAhPT0gJ251bWJlcidcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGN1c3Agb2YgZGF0YS5jdXNwcykge1xyXG4gICAgICBpZiAodHlwZW9mIGN1c3AuYW5nbGUgIT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgbWVzc2FnZTogXCJjdXNwLmFuZ2xlICE9PSAnbnVtYmVyJ1wiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNWYWxpZDogdHJ1ZSxcclxuICAgICAgbWVzc2FnZTogXCJcIlxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvKipcclxuICAgKiBAYWJzdHJhY3RcclxuICAgKi9cclxuICBzZXREYXRhKGRhdGEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGFic3RyYWN0XHJcbiAgICovXHJcbiAgZ2V0UG9pbnRzKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAYWJzdHJhY3RcclxuICAgKi9cclxuICBnZXRQb2ludChuYW1lKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBhYnN0cmFjdFxyXG4gICAqL1xyXG4gIGFuaW1hdGVUbyhkYXRhKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcclxuICB9XHJcblxyXG4gIC8vICMjIFBST1RFQ1RFRCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgQ2hhcnQgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4uL3VuaXZlcnNlL1VuaXZlcnNlLmpzJztcclxuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcclxuaW1wb3J0IEFzcGVjdFV0aWxzIGZyb20gJy4uL3V0aWxzL0FzcGVjdFV0aWxzLmpzJztcclxuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXHJcbmltcG9ydCBQb2ludCBmcm9tICcuLi9wb2ludHMvUG9pbnQuanMnXHJcbmltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxyXG4gKiBAcHVibGljXHJcbiAqIEBleHRlbmRzIHtDaGFydH1cclxuICovXHJcbmNsYXNzIFJhZGl4Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XHJcblxyXG4gIC8qXHJcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXHJcbiAgICogSXQgY2FuIGJlIGNoYW5nZWQgZHluYW1pY2FsbHkgYnkgcHVibGljIHNldHRlci5cclxuICAgKi9cclxuICAjbnVtYmVyT2ZMZXZlbHMgPSAyNFxyXG5cclxuICAjdW5pdmVyc2VcclxuICAjc2V0dGluZ3NcclxuICAjcm9vdFxyXG4gICNkYXRhXHJcblxyXG4gICNjZW50ZXJYXHJcbiAgI2NlbnRlcllcclxuICAjcmFkaXVzXHJcblxyXG4gIC8qXHJcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcclxuICAgKi9cclxuICAjYmVmb3JlQ2xlYW5VcEhvb2tcclxuXHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKiBAcGFyYW0ge1VuaXZlcnNlfSBVbml2ZXJzZVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHVuaXZlcnNlKSB7XHJcblxyXG4gICAgaWYgKCF1bml2ZXJzZSBpbnN0YW5jZW9mIFVuaXZlcnNlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHVuaXZlcnNlLicpXHJcbiAgICB9XHJcblxyXG4gICAgc3VwZXIodW5pdmVyc2UuZ2V0U2V0dGluZ3MoKSlcclxuXHJcbiAgICB0aGlzLiN1bml2ZXJzZSA9IHVuaXZlcnNlXHJcbiAgICB0aGlzLiNzZXR0aW5ncyA9IHRoaXMuI3VuaXZlcnNlLmdldFNldHRpbmdzKClcclxuICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxyXG4gICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXHJcbiAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxyXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9YClcclxuICAgIHRoaXMuI3VuaXZlcnNlLmdldFNWR0RvY3VtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBjaGFydCBkYXRhXHJcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgbm90IHZhbGlkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cclxuICAgKi9cclxuICBzZXREYXRhKGRhdGEpIHtcclxuICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxyXG4gICAgaWYgKCFzdGF0dXMuaXNWYWxpZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2UpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcclxuICAgIHRoaXMuI2RyYXcoZGF0YSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGRhdGFcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0RGF0YSgpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgXCJwb2ludHNcIjpbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxyXG4gICAgICBcImN1c3BzXCI6Wy4uLnRoaXMuI2RhdGEuY3VzcHNdXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgbnVtYmVyIG9mIExldmVscy5cclxuICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIHNldE51bWJlck9mTGV2ZWxzKGxldmVscykge1xyXG4gICAgdGhpcy4jbnVtYmVyT2ZMZXZlbHMgPSBNYXRoLm1heCgyNCwgbGV2ZWxzKVxyXG4gICAgaWYgKHRoaXMuI2RhdGEpIHtcclxuICAgICAgdGhpcy4jZHJhdyh0aGlzLiNkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcmFkaXVzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFJhZGl1cygpIHtcclxuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSB7XHJcbiAgICByZXR1cm4gMjQgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHJhZGl1c1xyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRJbm5lckNpcmNsZVJhZGl1cygpIHtcclxuICAgIHJldHVybiAyMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcmFkaXVzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcclxuICAgIHJldHVybiAyMCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcmFkaXVzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIDE4ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIDEyICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBVbml2ZXJzZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7VW5pdmVyc2V9XHJcbiAgICovXHJcbiAgZ2V0VW5pdmVyc2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jdW5pdmVyc2VcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBBc2NlbmRhdCBzaGlmdFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldEFzY2VuZGFudFNoaWZ0KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLiNkYXRhPy5jdXNwc1swXT8uYW5nbGUgPz8gMCkgKyBVdGlscy5ERUdfMTgwXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYXNwZWN0c1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cclxuICAgKi9cclxuICBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKXtcclxuICAgIGlmKCF0aGlzLiNkYXRhKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgZnJvbVBvaW50cyA9IGZyb21Qb2ludHMgPz8gdGhpcy4jZGF0YS5wb2ludHMuZmlsdGVyKHggPT4gXCJhc3BlY3RcIiBpbiB4ID8geC5hc3BlY3QgOiB0cnVlKVxyXG4gICAgdG9Qb2ludHMgPSB0b1BvaW50cyA/PyBbLi4udGhpcy4jZGF0YS5wb2ludHMuZmlsdGVyKHggPT4gXCJhc3BlY3RcIiBpbiB4ID8geC5hc3BlY3QgOiB0cnVlKSwgLi4udGhpcy4jZGF0YS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXHJcbiAgICBhc3BlY3RzID0gYXNwZWN0cyA/PyB0aGlzLiNzZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFMgPz8gRGVmYXVsdFNldHRpbmdzLkRFRkFVTFRfQVNQRUNUU1xyXG5cclxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKS5maWx0ZXIoIGFzcGVjdCA9PiBhc3BlY3QuZnJvbS5uYW1lICE9IGFzcGVjdC50by5uYW1lKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhdyBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xyXG4gICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiN1bml2ZXJzZS5nZXRBc3BlY3RzRWxlbWVudCgpXHJcbiAgICBVdGlscy5jbGVhblVwKGFzcGVjdHNXcmFwcGVyLmdldEF0dHJpYnV0ZShcImlkXCIpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcclxuXHJcbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcclxuICAgICAgLnJlZHVjZSggKGFyciwgYXNwZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZSggZWxtID0+IHtcclxuICAgICAgICAgIHJldHVybiBlbG0uZnJvbS5uYW1lID09IGFzcGVjdC50by5uYW1lICYmIGVsbS50by5uYW1lID09IGFzcGVjdC5mcm9tLm5hbWVcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiggIWlzVGhlU2FtZSApe1xyXG4gICAgICAgICAgYXJyLnB1c2goYXNwZWN0KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgICB9LCBbXSlcclxuICAgICAgLmZpbHRlciggYXNwZWN0ID0+ICBhc3BlY3QuYXNwZWN0Lm5hbWUgIT0gJ0Nvbmp1bmN0aW9uJylcclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXHJcbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXHJcblxyXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoIEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbiAgLypcclxuICAgKiBEcmF3IHJhZGl4IGNoYXJ0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKi9cclxuICAjZHJhdyhkYXRhKSB7XHJcbiAgICBVdGlscy5jbGVhblVwKHRoaXMuI3Jvb3QuZ2V0QXR0cmlidXRlKCdpZCcpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcclxuICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcclxuICAgIHRoaXMuI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpXHJcbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxyXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxyXG4gICAgdGhpcy4jZHJhd0N1c3BzKGRhdGEpXHJcbiAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxyXG4gICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxyXG4gICAgdGhpcy4jc2V0dGluZ3MuRFJBV19BU1BFQ1RTICYmIHRoaXMuZHJhd0FzcGVjdHMoKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdCYWNrZ3JvdW5kKCkge1xyXG4gICAgY29uc3QgTUFTS19JRCA9IGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH0tYmFja2dyb3VuZC1tYXNrLTFgXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBtYXNrID0gU1ZHVXRpbHMuU1ZHTWFzayhNQVNLX0lEKVxyXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcclxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcclxuICAgIG1hc2suYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXHJcblxyXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcclxuICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG1hc2spXHJcblxyXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuUExBTkVUU19CQUNLR1JPVU5EX0NPTE9SKTtcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcclxuICAgIGNvbnN0IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlMgPSAxMlxyXG4gICAgY29uc3QgU1RFUCA9IDMwIC8vZGVncmVlXHJcbiAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxyXG4gICAgY29uc3QgU1lNQk9MX1NJR05TID0gW1NWR1V0aWxzLlNZTUJPTF9BUklFUywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSSwgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUiwgU1ZHVXRpbHMuU1lNQk9MX0xFTywgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPLCBTVkdVdGlscy5TWU1CT0xfTElCUkEsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk4sIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU11cclxuXHJcbiAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XHJcbiAgICAgIGxldCBwb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpIC8gMiksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlSW5EZWdyZWUgKyBTVEVQIC8gMiwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSlcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9TSUdOU19GT05UX1NJWkUpO1xyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SU1tzeW1ib2xJbmRleF0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU0lHTlNfQ09MT1IpO1xyXG4gICAgICByZXR1cm4gc3ltYm9sXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcclxuICAgICAgbGV0IGExID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVGcm9tSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcclxuICAgICAgbGV0IGEyID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVUb0luRGVncmVlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpXHJcbiAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCksIGExLCBhMiwgdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKTtcclxuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcclxuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IgOiBcIm5vbmVcIik7XHJcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XHJcbiAgICAgIHJldHVybiBzZWdtZW50XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSAwXHJcbiAgICBsZXQgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcclxuXHJcbiAgICAgIGxldCBzZWdtZW50ID0gbWFrZVNlZ21lbnQoaSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XHJcblxyXG4gICAgICBsZXQgc3ltYm9sID0gbWFrZVN5bWJvbChpLCBzdGFydEFuZ2xlKVxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcblxyXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVA7XHJcbiAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAjZHJhd1J1bGVyKCkge1xyXG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcclxuICAgIGNvbnN0IFNURVAgPSA1XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xyXG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXHJcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgKGkgJSAyKSA/IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSA6IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSk7XHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgLypcclxuICAgKiBEcmF3IHBvaW50c1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxyXG4gICAqL1xyXG4gICNkcmF3UG9pbnRzKGRhdGEpIHtcclxuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFV0aWxzLmNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpKVxyXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSwgY3VzcHMsIHRoaXMuI3NldHRpbmdzKVxyXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIC8vIHJ1bGVyIG1hcmtcclxuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXHJcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xyXG5cclxuICAgICAgLy8gc3ltYm9sXHJcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1BPSU5UU19GT05UX1NJWkUpXHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xyXG5cclxuICAgICAgLy8gcG9pbnRlclxyXG4gICAgICAvL2lmIChwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSAhPSBwb2ludERhdGEucG9zaXRpb24pIHtcclxuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcclxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xyXG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogRHJhdyBwb2ludHNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcclxuICAgKi9cclxuICAjZHJhd0N1c3BzKGRhdGEpIHtcclxuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCBtYWluQXhpc0luZGV4ZXMgPSBbMCwgMywgNiwgOV0gLy9BcywgSWMsIERzLCBNY1xyXG5cclxuICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyAxMClcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3BzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICBjb25zdCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA9ICF0aGlzLiNzZXR0aW5ncy5DSEFSVF9BTExPV19IT1VTRV9PVkVSTEFQICYmIFV0aWxzLmlzQ29sbGlzaW9uKGN1c3BzW2ldLmFuZ2xlLCBwb2ludHNQb3NpdGlvbnMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMgLyAyKVxyXG5cclxuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBjb25zdCBzdGFydEN1c3AgPSBjdXNwc1tpXS5hbmdsZVxyXG4gICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxyXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxyXG4gICAgICBjb25zdCB0ZXh0QW5nbGUgPSBzdGFydEN1c3AgKyBnYXAgLyAyXHJcblxyXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGNvbnN0IHRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHRleHRQb3MueCwgdGV4dFBvcy55LCBgJHtpKzF9YClcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSlcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9IT1VTRV9GT05UX1NJWkUpXHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcclxuXHJcbiAgICAgIGlmKHRoaXMuI3NldHRpbmdzLkRSQVdfSE9VU0VfREVHUkVFKSB7XHJcbiAgICAgICAgY29uc3QgZGVncmVlUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gMS4yLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEN1c3AgLSAyLjQsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgICAgY29uc3QgZGVncmVlID0gU1ZHVXRpbHMuU1ZHVGV4dChkZWdyZWVQb3MueCwgZGVncmVlUG9zLnksIE1hdGguZmxvb3IoY3VzcHNbaV0uYW5nbGUgJSAzMCkgKyBcIsK6XCIpXHJcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIC8gMilcclxuICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXHJcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkZWdyZWUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIERyYXcgbWFpbiBheGlzIGRlc2NyaXRpb25cclxuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxyXG4gICAqL1xyXG4gICNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKSB7XHJcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCBheGlzTGlzdCA9IFt7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1swXS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s5XS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgXVxyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgY29uc3QgcmFkMSA9IHRoaXMuI251bWJlck9mTGV2ZWxzID09PSAyNCA/IHRoaXMuZ2V0UmFkaXVzKCkgOiB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCk7XHJcbiAgICBjb25zdCByYWQyID0gdGhpcy4jbnVtYmVyT2ZMZXZlbHMgPT09IDI0ID8gdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RIIDogdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpICsgQVhJU19MRU5HVEggLyAyO1xyXG5cclxuICAgIGZvciAoY29uc3QgYXhpcyBvZiBheGlzTGlzdCkge1xyXG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xyXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xyXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBsZXQgdGV4dFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCByYWQyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBsZXQgc3ltYm9sO1xyXG4gICAgICBsZXQgU0hJRlRfWCA9IDA7XHJcbiAgICAgIGxldCBTSElGVF9ZID0gMDtcclxuICAgICAgY29uc3QgU1RFUCA9IDJcclxuICAgICAgc3dpdGNoIChheGlzLm5hbWUpIHtcclxuICAgICAgICBjYXNlIFwiQXNcIjpcclxuICAgICAgICAgIFNISUZUX1ggLT0gU1RFUFxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRHNcIjpcclxuICAgICAgICAgIFNISUZUX1ggKz0gU1RFUFxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJNY1wiOlxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC10b3BcIilcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJJY1wiOlxyXG4gICAgICAgICAgU0hJRlRfWSArPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXHJcbiAgICAgIH1cclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XHJcblxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdCb3JkZXJzKCkge1xyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkpXHJcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcclxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxyXG5cclxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xyXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXHJcblxyXG4gICAgY29uc3QgY2VudGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXHJcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XHJcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgUmFkaXhDaGFydCBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCJpbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XHJcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XHJcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xyXG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xyXG5pbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgZnJvbSBvdXRzaWRlIHRoZSBVbml2ZXJzZS5cclxuICogQHB1YmxpY1xyXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XHJcbiAqL1xyXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XHJcblxyXG4gIC8qXHJcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXHJcbiAgICogSXQgY2FuIGJlIGNoYW5nZWQgZHluYW1pY2FsbHkgYnkgcHVibGljIHNldHRlci5cclxuICAgKi9cclxuICAjbnVtYmVyT2ZMZXZlbHMgPSAzMlxyXG5cclxuICAjcmFkaXhcclxuICAjc2V0dGluZ3NcclxuICAjcm9vdFxyXG4gICNkYXRhXHJcblxyXG4gICNjZW50ZXJYXHJcbiAgI2NlbnRlcllcclxuICAjcmFkaXVzXHJcblxyXG4gIC8qXHJcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcclxuICAgKi9cclxuICAjYmVmb3JlQ2xlYW5VcEhvb2tcclxuXHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocmFkaXgpIHtcclxuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gcmFkaXguJylcclxuICAgIH1cclxuXHJcbiAgICBzdXBlcihyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKCkpXHJcblxyXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxyXG4gICAgdGhpcy4jc2V0dGluZ3MgPSB0aGlzLiNyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKClcclxuICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxyXG4gICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXHJcblxyXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlRSQU5TSVRfSUR9YClcclxuICAgIHRoaXMuI3JhZGl4LmdldFVuaXZlcnNlKCkuZ2V0U1ZHRG9jdW1lbnQoKS5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGNoYXJ0IGRhdGFcclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxyXG4gICAqL1xyXG4gIHNldERhdGEoZGF0YSkge1xyXG4gICAgbGV0IHN0YXR1cyA9IHRoaXMudmFsaWRhdGVEYXRhKGRhdGEpXHJcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNkYXRhID0gZGF0YVxyXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgZGF0YVxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICBnZXREYXRhKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBcInBvaW50c1wiOlsuLi50aGlzLiNkYXRhLnBvaW50c10sXHJcbiAgICAgIFwiY3VzcHNcIjpbLi4udGhpcy4jZGF0YS5jdXNwc11cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFJhZGl1cygpIHtcclxuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xyXG4gICAgaWYoIXRoaXMuI2RhdGEpe1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBmcm9tUG9pbnRzID0gZnJvbVBvaW50cyA/PyBbLi4udGhpcy4jZGF0YS5wb2ludHMuZmlsdGVyKHggPT4gXCJhc3BlY3RcIiBpbiB4ID8geC5hc3BlY3QgOiB0cnVlKSwgLi4udGhpcy4jZGF0YS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXHJcbiAgICB0b1BvaW50cyA9IHRvUG9pbnRzID8/IFsuLi50aGlzLiNyYWRpeC5nZXREYXRhKCkucG9pbnRzLmZpbHRlcih4ID0+IFwiYXNwZWN0XCIgaW4geCA/IHguYXNwZWN0IDogdHJ1ZSksIC4uLnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5maWx0ZXIoeCA9PiB4LmFzcGVjdCldXHJcbiAgICBhc3BlY3RzID0gYXNwZWN0cyA/PyB0aGlzLiNzZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFMgPz8gRGVmYXVsdFNldHRpbmdzLkRFRkFVTFRfQVNQRUNUU1xyXG5cclxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhdyBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xyXG4gICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiNyYWRpeC5nZXRVbml2ZXJzZSgpLmdldEFzcGVjdHNFbGVtZW50KClcclxuICAgIFV0aWxzLmNsZWFuVXAoYXNwZWN0c1dyYXBwZXIuZ2V0QXR0cmlidXRlKFwiaWRcIiksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxyXG5cclxuICAgIGNvbnN0IGFzcGVjdHNMaXN0ID0gdGhpcy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKVxyXG4gICAgICAuZmlsdGVyKCBhc3BlY3QgPT4gIGFzcGVjdC5hc3BlY3QubmFtZSAhPSAnQ29uanVuY3Rpb24nKVxyXG5cclxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpeC5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXHJcbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXHJcbiAgICBcclxuICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKCBBc3BlY3RVdGlscy5kcmF3QXNwZWN0cyh0aGlzLiNyYWRpeC5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbiAgLypcclxuICAgKiBEcmF3IHJhZGl4IGNoYXJ0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKi9cclxuICAjZHJhdyhkYXRhKSB7XHJcblxyXG4gICAgLy8gcmFkaXggcmVEcmF3XHJcbiAgICBVdGlscy5jbGVhblVwKHRoaXMuI3Jvb3QuZ2V0QXR0cmlidXRlKCdpZCcpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcclxuICAgIHRoaXMuI3JhZGl4LnNldE51bWJlck9mTGV2ZWxzKHRoaXMuI251bWJlck9mTGV2ZWxzKVxyXG5cclxuICAgIHRoaXMuI2RyYXdSdWxlcigpXHJcbiAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcclxuICAgIHRoaXMuI3NldHRpbmdzLkNIQVJUX0RSQVdfTUFJTl9BWElTICYmIHRoaXMuI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpXHJcbiAgICB0aGlzLiNkcmF3UG9pbnRzKGRhdGEpXHJcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXHJcbiAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXHJcbiAgfVxyXG5cclxuICAjZHJhd1J1bGVyKCkge1xyXG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcclxuICAgIGNvbnN0IFNURVAgPSA1XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcclxuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcclxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRSYWRpdXMoKSAtICgodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogRHJhdyBwb2ludHNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcclxuICAgKi9cclxuICAjZHJhd1BvaW50cyhkYXRhKSB7XHJcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xyXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkpXHJcbiAgICBmb3IgKGNvbnN0IHBvaW50RGF0YSBvZiBwb2ludHMpIHtcclxuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXHJcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gNCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG5cclxuICAgICAgLy8gcnVsZXIgbWFya1xyXG4gICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxyXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xyXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcclxuXHJcbiAgICAgIC8vIHN5bWJvbFxyXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSwgVXRpbHMuREVHXzAsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPVylcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX1BPSU5UU19GT05UX1NJWkUpXHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfUExBTkVUX0NPTE9SU1twb2ludERhdGEubmFtZV0gPz8gdGhpcy4jc2V0dGluZ3MuUExBTkVUX0NPTE9SU1twb2ludERhdGEubmFtZV0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUE9JTlRTX0NPTE9SKVxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcblxyXG4gICAgICAvLyBwb2ludGVyXHJcbiAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xyXG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGNvbnN0IHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXHJcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcclxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSAvIDIpO1xyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50ZXJMaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIERyYXcgcG9pbnRzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXHJcbiAgICovXHJcbiAgI2RyYXdDdXNwcyhkYXRhKSB7XHJcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xyXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXHJcblxyXG4gICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XHJcbiAgICAgIHJldHVybiBwb2ludC5hbmdsZVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxyXG5cclxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyA2KVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VzcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPSAhdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCAmJiBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcclxuXHJcbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG5cclxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb3MueCwgc3RhcnRQb3MueSwgZW5kUG9zLngsIGVuZFBvcy55KVxyXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxyXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBjb25zdCBzdGFydEN1c3AgPSBjdXNwc1tpXS5hbmdsZVxyXG4gICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxyXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxyXG4gICAgICBjb25zdCB0ZXh0QW5nbGUgPSBzdGFydEN1c3AgKyBnYXAgLyAyXHJcblxyXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCB0ZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dCh0ZXh0UG9zLngsIHRleHRQb3MueSwgYCR7aSsxfWApXHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpXHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfSE9VU0VfRk9OVF9TSVpFKVxyXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9IT1VTRV9OVU1CRVJfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SKVxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRleHQpXHJcblxyXG4gICAgICBpZih0aGlzLiNzZXR0aW5ncy5EUkFXX0hPVVNFX0RFR1JFRSkge1xyXG4gICAgICAgIGNvbnN0IGRlZ3JlZVBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRDdXNwIC0gMS43NSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgICAgY29uc3QgZGVncmVlID0gU1ZHVXRpbHMuU1ZHVGV4dChkZWdyZWVQb3MueCwgZGVncmVlUG9zLnksIE1hdGguZmxvb3IoY3VzcHNbaV0uYW5nbGUgJSAzMCkgKyBcIsK6XCIpXHJcbiAgICAgICAgZGVncmVlLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIGRlZ3JlZS5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFIC8gMilcclxuICAgICAgICBkZWdyZWUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0hPVVNFX05VTUJFUl9DT0xPUiB8fCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXHJcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkZWdyZWUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIERyYXcgbWFpbiBheGlzIGRlc2NyaXRpb25cclxuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxyXG4gICAqL1xyXG4gICNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKSB7XHJcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCBheGlzTGlzdCA9IFt7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1swXS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s5XS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgXVxyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgY29uc3QgcmFkMSA9IHRoaXMuZ2V0UmFkaXVzKCk7XHJcbiAgICBjb25zdCByYWQyID0gdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RIO1xyXG5cclxuICAgIGZvciAoY29uc3QgYXhpcyBvZiBheGlzTGlzdCkge1xyXG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcmFkMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XHJcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XHJcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcclxuXHJcbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJhZDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBsZXQgc3ltYm9sO1xyXG4gICAgICBsZXQgU0hJRlRfWCA9IDA7XHJcbiAgICAgIGxldCBTSElGVF9ZID0gMDtcclxuICAgICAgY29uc3QgU1RFUCA9IDJcclxuICAgICAgc3dpdGNoIChheGlzLm5hbWUpIHtcclxuICAgICAgICBjYXNlIFwiQXNcIjpcclxuICAgICAgICAgIFNISUZUX1ggLT0gU1RFUFxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRHNcIjpcclxuICAgICAgICAgIFNISUZUX1ggKz0gU1RFUFxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJNY1wiOlxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC10b3BcIilcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJJY1wiOlxyXG4gICAgICAgICAgU0hJRlRfWSArPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXHJcbiAgICAgIH1cclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XHJcblxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdCb3JkZXJzKCkge1xyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxyXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XHJcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAjZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSB7XHJcbiAgICByZXR1cm4gMjkgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxyXG4gIH1cclxuXHJcbiAgI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcclxuICAgIHJldHVybiAzMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXHJcbiAgfVxyXG5cclxuICAjZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIDI0ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gIFRyYW5zaXRDaGFydCBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNsYXNzIFBvaW50IHtcclxuXHJcbiAgI25hbWVcclxuICAjYW5nbGVcclxuICAjaXNSZXRyb2dyYWRlXHJcbiAgI2N1c3BzXHJcbiAgI3NldHRpbmdzXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50RGF0YSAtIHtuYW1lOlN0cmluZywgYW5nbGU6TnVtYmVyLCBpc1JldHJvZ3JhZGU6ZmFsc2V9XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGN1c3BzIC0gW3thbmdsZTpOdW1iZXJ9LCB7YW5nbGU6TnVtYmVyfSwge2FuZ2xlOk51bWJlcn0sIC4uLl1cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihwb2ludERhdGEsIGN1c3BzLCBzZXR0aW5ncykge1xyXG4gICAgdGhpcy4jbmFtZSA9IHBvaW50RGF0YS5uYW1lID8/IFwiVW5rbm93blwiXHJcbiAgICB0aGlzLiNhbmdsZSA9IHBvaW50RGF0YS5hbmdsZSA/PyAwXHJcbiAgICB0aGlzLiNpc1JldHJvZ3JhZGUgPSBwb2ludERhdGEuaXNSZXRyb2dyYWRlID8/IGZhbHNlXHJcblxyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGN1c3BzKSB8fCBjdXNwcy5sZW5ndGggIT0gMTIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmFkIHBhcmFtIGN1c3BzLiBcIilcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNjdXNwcyA9IGN1c3BzXHJcblxyXG4gICAgaWYgKCFzZXR0aW5ncykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBuYW1lXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLiNuYW1lXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJcyByZXRyb2dyYWRlXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzUmV0cm9ncmFkZSgpIHtcclxuICAgIHJldHVybiB0aGlzLiNpc1JldHJvZ3JhZGVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhbmdsZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldEFuZ2xlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI2FuZ2xlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgc3ltYm9sXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFthbmdsZVNoaWZ0XVxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzUHJvcGVydGllc10gLSBhbmdsZUluU2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldFN5bWJvbCh4UG9zLCB5UG9zLCBhbmdsZVNoaWZ0ID0gMCwgaXNQcm9wZXJ0aWVzID0gdHJ1ZSkge1xyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2wodGhpcy4jbmFtZSwgeFBvcywgeVBvcylcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxyXG5cclxuICAgIGlmIChpc1Byb3BlcnRpZXMgPT0gZmFsc2UpIHtcclxuICAgICAgcmV0dXJuIHdyYXBwZXIgLy89PT09PT0+XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hhcnRDZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcclxuICAgIGNvbnN0IGNoYXJ0Q2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxyXG4gICAgY29uc3QgYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIgPSBVdGlscy5wb3NpdGlvblRvQW5nbGUoeFBvcywgeVBvcywgY2hhcnRDZW50ZXJYLCBjaGFydENlbnRlclkpXHJcblxyXG4gICAgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XX0FOR0xFICYmIGFuZ2xlSW5TaWduLmNhbGwodGhpcylcclxuICAgIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPV19SRVRST0dSQURFICYmIHRoaXMuI2lzUmV0cm9ncmFkZSAmJiByZXRyb2dyYWRlLmNhbGwodGhpcylcclxuICAgIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPV19ESUdOSVRZICYmIHRoaXMuZ2V0RGlnbml0eSgpICYmIGRpZ25pdGllcy5jYWxsKHRoaXMpXHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXIgLy89PT09PT0+XHJcblxyXG4gICAgLypcclxuICAgICAqICBBbmdsZSBpbiBzaWduXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFuZ2xlSW5TaWduKCkge1xyXG4gICAgICBjb25zdCBhbmdsZUluU2lnblBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXHJcbiAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRvIHJvdGF0ZSB0aGUgdGV4dCwgd2hlbiB1bmNvbW1lbnQgYSBsaW5lIGJlbGxvdy5cclxuICAgICAgLy90ZXh0V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHJvdGF0ZSgke2FuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyfSwke3RleHRQb3NpdGlvbi54fSwke3RleHRQb3NpdGlvbi55fSlgKVxyXG5cclxuICAgICAgY29uc3QgYW5nbGVJblNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChhbmdsZUluU2lnblBvc2l0aW9uLngsIGFuZ2xlSW5TaWduUG9zaXRpb24ueSwgdGhpcy5nZXRBbmdsZUluU2lnbigpKVxyXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xyXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXHJcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XHJcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYW5nbGVJblNpZ25UZXh0KVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiAgUmV0cm9ncmFkZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZXRyb2dyYWRlKCkge1xyXG4gICAgICBjb25zdCByZXRyb2dyYWRlUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9PRkZTRVQgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIsIGFuZ2xlU2hpZnQpKVxyXG5cclxuICAgICAgY29uc3QgcmV0cm9ncmFkZVRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHJldHJvZ3JhZGVQb3NpdGlvbi54LCByZXRyb2dyYWRlUG9zaXRpb24ueSwgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREVfQ09ERSlcclxuICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xyXG4gICAgICByZXRyb2dyYWRlVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcclxuICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfUkVUUk9HUkFERV9TSVpFIHx8IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcclxuICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocmV0cm9ncmFkZVRleHQpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqICBEaWduaXRpZXNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGlnbml0aWVzKCkge1xyXG4gICAgICBjb25zdCBkaWduaXRpZXNQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXHJcbiAgICAgIGNvbnN0IGRpZ25pdGllc1RleHQgPSBTVkdVdGlscy5TVkdUZXh0KGRpZ25pdGllc1Bvc2l0aW9uLngsIGRpZ25pdGllc1Bvc2l0aW9uLnksIHRoaXMuZ2V0RGlnbml0eSgpKVxyXG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKTtcclxuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcclxuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XHJcbiAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfQ09MT1IgfHwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZGlnbml0aWVzVGV4dClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBob3VzZSBudW1iZXJcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRIb3VzZU51bWJlcigpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQuXCIpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgc2lnbiBudW1iZXJcclxuICAgKiBBcmlzZSA9IDEsIFRhdXJ1cyA9IDIsIC4uLlBpc2NlcyA9IDEyXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0U2lnbk51bWJlcigpIHtcclxuICAgIGxldCBhbmdsZSA9IHRoaXMuI2FuZ2xlICUgVXRpbHMuREVHXzM2MFxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKGFuZ2xlIC8gMzApICsgMSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhbmdsZSAoSW50ZWdlcikgaW4gdGhlIHNpZ24gaW4gd2hpY2ggaXQgc3RhbmRzLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldEFuZ2xlSW5TaWduKCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy4jYW5nbGUgJSAzMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBkaWduaXR5IHN5bWJvbCAociAtIHJ1bGVyc2hpcCwgZCAtIGRldHJpbWVudCwgZiAtIGZhbGwsIGUgLSBleGFsdGF0aW9uKVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSAtIGRpZ25pdHkgc3ltYm9sIChyLGQsZixlKVxyXG4gICAqL1xyXG4gIGdldERpZ25pdHkoKSB7XHJcbiAgICBjb25zdCBBUklFUyA9IDFcclxuICAgIGNvbnN0IFRBVVJVUyA9IDJcclxuICAgIGNvbnN0IEdFTUlOSSA9IDNcclxuICAgIGNvbnN0IENBTkNFUiA9IDRcclxuICAgIGNvbnN0IExFTyA9IDVcclxuICAgIGNvbnN0IFZJUkdPID0gNlxyXG4gICAgY29uc3QgTElCUkEgPSA3XHJcbiAgICBjb25zdCBTQ09SUElPID0gOFxyXG4gICAgY29uc3QgU0FHSVRUQVJJVVMgPSA5XHJcbiAgICBjb25zdCBDQVBSSUNPUk4gPSAxMFxyXG4gICAgY29uc3QgQVFVQVJJVVMgPSAxMVxyXG4gICAgY29uc3QgUElTQ0VTID0gMTJcclxuXHJcbiAgICBjb25zdCBSVUxFUlNISVBfU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMF07XHJcbiAgICBjb25zdCBERVRSSU1FTlRfU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMV07XHJcbiAgICBjb25zdCBFWEFMVEFUSU9OX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzJdO1xyXG4gICAgY29uc3QgRkFMTF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1szXTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMuI25hbWUpIHtcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcclxuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FOQ0VSKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcclxuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMpIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiXCJcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSkge1xyXG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0FHSVRUQVJJVVMpIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XHJcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XHJcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVJJRVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xyXG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XHJcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcclxuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiXCJcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xyXG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XHJcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcclxuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiXCJcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FQUklDT1JOIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTEVPKSB7XHJcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XHJcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiXCJcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkU6XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xyXG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVklSR08pIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUVVBUklVUykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExFTykge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUExVVE86XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcclxuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xyXG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcclxuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUykge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBQb2ludCBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxyXG5pbXBvcnQgKiBhcyBSYWRpeCBmcm9tIFwiLi9jb25zdGFudHMvUmFkaXguanNcIlxyXG5pbXBvcnQgKiBhcyBUcmFuc2l0IGZyb20gXCIuL2NvbnN0YW50cy9UcmFuc2l0LmpzXCJcclxuaW1wb3J0ICogYXMgUG9pbnQgZnJvbSBcIi4vY29uc3RhbnRzL1BvaW50LmpzXCJcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxyXG5pbXBvcnQgKiBhcyBBc3BlY3RzIGZyb20gXCIuL2NvbnN0YW50cy9Bc3BlY3RzLmpzXCJcclxuXHJcbmNvbnN0IFNFVFRJTkdTID0gT2JqZWN0LmFzc2lnbih7fSwgVW5pdmVyc2UsIFJhZGl4LCBUcmFuc2l0LCBQb2ludCwgQ29sb3JzLCBBc3BlY3RzKTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgU0VUVElOR1MgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiLypcclxuKiBBc3BlY3RzIHdyYXBwZXIgZWxlbWVudCBJRFxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgYXNwZWN0c1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQVNQRUNUU19JRCA9IFwiYXNwZWN0c1wiXHJcblxyXG4vKlxyXG4qIERyYXcgYXNwZWN0cyBpbnRvIGNoYXJ0IGR1cmluZyByZW5kZXJcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Qm9vbGVhbn1cclxuKiBAZGVmYXVsdCB0cnVlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBEUkFXX0FTUEVDVFMgPSB0cnVlXHJcblxyXG4vKlxyXG4qIEZvbnQgc2l6ZSAtIGFzcGVjdHNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDI3XHJcbiovXHJcbmV4cG9ydCBjb25zdCBBU1BFQ1RTX0ZPTlRfU0laRSA9IDE4XHJcblxyXG4vKipcclxuKiBEZWZhdWx0IGFzcGVjdHNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7QXJyYXl9XHJcbiovXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0FTUEVDVFMgPSBbXHJcbiAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6Mn0sXHJcbiAge25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LFxyXG4gIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn0sXHJcbiAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyfVxyXG5dXHJcbiIsIi8qKlxyXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICNmZmZcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIm5vbmVcIjtcclxuXHJcbi8qKlxyXG4qIFBsYW5ldHMgYmFja2dyb3VuZCBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgI2ZmZlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUExBTkVUU19CQUNLR1JPVU5EX0NPTE9SID0gXCIjZmZmXCI7XHJcblxyXG4vKipcclxuKiBBc3BlY3RzIGJhY2tncm91bmQgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICNmZmZcclxuKi9cclxuZXhwb3J0IGNvbnN0IEFTUEVDVFNfQkFDS0dST1VORF9DT0xPUiA9IFwiI2VlZVwiO1xyXG5cclxuLypcclxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjMzMzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9DSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcclxuXHJcbi8qXHJcbiogRGVmYXVsdCBjb2xvciBvZiBsaW5lcyBpbiBjaGFydHNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMzMzNcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX0xJTkVfQ09MT1IgPSBcIiM2NjZcIjtcclxuXHJcbi8qXHJcbiogRGVmYXVsdCBjb2xvciBvZiB0ZXh0IGluIGNoYXJ0c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzMzM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiI2JiYlwiO1xyXG5cclxuLypcclxuKiBEZWZhdWx0IGNvbG9yIG9mIGN1c3BzIG51bWJlclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzMzM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfSE9VU0VfTlVNQkVSX0NPTE9SID0gXCIjMzMzXCI7XHJcblxyXG4vKlxyXG4qIERlZmF1bHQgY29sb3Igb2YgbXFpbiBheGlzIC0gQXMsIERzLCBNYywgSWNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMwMDBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fQVhJU19DT0xPUiA9IFwiIzAwMFwiO1xyXG5cclxuLypcclxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjMDAwXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9TSUdOU19DT0xPUiA9IFwiIzMzM1wiO1xyXG5cclxuLypcclxuKiBEZWZhdWx0IGNvbG9yIG9mIHBsYW5ldHMgb24gdGhlIGNoYXJ0IChTdW4gc3ltYm9sLCBNb29uIHN5bWJvbCwgLi4uKVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzAwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfUE9JTlRTX0NPTE9SID0gXCIjMDAwXCI7XHJcblxyXG4vKlxyXG4qIERlZmF1bHQgY29sb3IgZm9yIHBvaW50IHByb3BlcnRpZXMgLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMzMzNcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQ09MT1IgPSBcIiMzMzNcIlxyXG5cclxuLypcclxuKiBBcmllcyBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgI0ZGNDUwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfQVJJRVMgPSBcIiNGRjQ1MDBcIjtcclxuXHJcbi8qXHJcbiogVGF1cnVzIGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjOEI0NTEzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDT0xPUl9UQVVSVVMgPSBcIiM4QjQ1MTNcIjtcclxuXHJcbi8qXHJcbiogR2VtaW55IGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjODdDRUVCXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDT0xPUl9HRU1JTkk9IFwiIzg3Q0VFQlwiO1xyXG5cclxuLypcclxuKiBDYW5jZXIgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMyN0FFNjBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX0NBTkNFUiA9IFwiIzI3QUU2MFwiO1xyXG5cclxuLypcclxuKiBMZW8gY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICNGRjQ1MDBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xyXG5cclxuLypcclxuKiBWaXJnbyBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzhCNDUxM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfVklSR08gPSBcIiM4QjQ1MTNcIjtcclxuXHJcbi8qXHJcbiogTGlicmEgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICM4N0NFRUJcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX0xJQlJBID0gXCIjODdDRUVCXCI7XHJcblxyXG4vKlxyXG4qIFNjb3JwaW8gY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMyN0FFNjBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcclxuXHJcbi8qXHJcbiogU2FnaXR0YXJpdXMgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICNGRjQ1MDBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX1NBR0lUVEFSSVVTID0gXCIjRkY0NTAwXCI7XHJcblxyXG4vKlxyXG4qIENhcHJpY29ybiBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzhCNDUxM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FQUklDT1JOID0gXCIjOEI0NTEzXCI7XHJcblxyXG4vKlxyXG4qIEFxdWFyaXVzIGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjODdDRUVCXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xyXG5cclxuLypcclxuKiBQaXNjZXMgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMyN0FFNjBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX1BJU0NFUyA9IFwiIzI3QUU2MFwiO1xyXG5cclxuLypcclxuKiBDb2xvciBvZiBjaXJjbGVzIGluIGNoYXJ0c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzMzM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XHJcblxyXG4vKlxyXG4qIENvbG9yIG9mIGFzcGVjdHNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7T2JqZWN0fVxyXG4qL1xyXG5leHBvcnQgY29uc3QgQVNQRUNUX0NPTE9SUyA9IHtcclxuICBDb25qdW5jdGlvbjpcIiMzMzNcIixcclxuICBPcHBvc2l0aW9uOlwiIzFCNEY3MlwiLFxyXG4gIFNxdWFyZTpcIiM2NDFFMTZcIixcclxuICBUcmluZTpcIiMwQjUzNDVcIixcclxuICBTZXh0aWxlOlwiIzMzM1wiLFxyXG4gIFF1aW5jdW54OlwiIzMzM1wiLFxyXG4gIFNlbWlzZXh0aWxlOlwiIzMzM1wiLFxyXG4gIFF1aW50aWxlOlwiIzMzM1wiLFxyXG4gIFRyaW9jdGlsZTpcIiMzMzNcIlxyXG59XHJcblxyXG4vKipcclxuICogT3ZlcnJpZGUgaW5kaXZpZHVhbCBwbGFuZXQgc3ltYm9sIGNvbG9ycyBieSBwbGFuZXQgbmFtZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBMQU5FVF9DT0xPUlMgPSB7XHJcbiAgLy9TdW46IFwiIzAwMFwiLFxyXG4gIC8vTW9vbjogXCIjYWFhXCIsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBvdmVycmlkZSBpbmRpdmlkdWFsIHNpZ24gc3ltYm9sIGNvbG9ycyBieSB6b2RpYWMgaW5kZXhcclxuICovXHJcbmV4cG9ydCBjb25zdCBTSUdOX0NPTE9SUyA9IHtcclxuICAvLzA6IFwiIzMzM1wiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lIG9uIHRyYW5zaXQgY2hhcnRzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVFJBTlNJVF9QTEFORVRfQ09MT1JTID0ge1xyXG4gIC8vU3VuOiBcIiMwMDBcIixcclxuICAvL01vb246IFwiI2FhYVwiLFxyXG59XHJcbiIsIi8qXHJcbiogUG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtCb29sZWFufVxyXG4qIEBkZWZhdWx0IHRydWVcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPVyA9IHRydWVcclxuXHJcbi8qXHJcbiogUG9pbnQgYW5nbGUgaW4gc2lnblxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtCb29sZWFufVxyXG4qIEBkZWZhdWx0IHRydWVcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPV19BTkdMRSA9IHRydWVcclxuXHJcbi8qXHJcbiogUG9pbnQgZGlnbml0eSBzeW1ib2xcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Qm9vbGVhbn1cclxuKiBAZGVmYXVsdCB0cnVlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfRElHTklUWSA9IHRydWVcclxuXHJcbi8qXHJcbiogUG9pbnQgcmV0cm9ncmFkZSBzeW1ib2xcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Qm9vbGVhbn1cclxuKiBAZGVmYXVsdCB0cnVlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfUkVUUk9HUkFERSA9IHRydWVcclxuXHJcbi8qXHJcbiogUG9pbnQgZGlnbml0eSBzeW1ib2xzIC0gW2RvbWljaWxlLCBkZXRyaW1lbnQsIGV4YWx0YXRpb24sIGZhbGxdXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge0Jvb2xlYW59XHJcbiogQGRlZmF1bHQgdHJ1ZVxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFMgPSBbXCJyXCIsIFwiZFwiLCBcImVcIiwgXCJmXCJdO1xyXG5cclxuLypcclxuKiBUZXh0IHNpemUgb2YgUG9pbnQgZGVzY3JpcHRpb24gLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDZcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFID0gMTZcclxuXHJcbi8qXHJcbiogVGV4dCBzaXplIG9mIGFuZ2xlIG51bWJlclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgNlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19BTkdMRV9TSVpFID0gMjVcclxuXHJcbi8qXHJcbiogVGV4dCBzaXplIG9mIHJldHJvZ3JhZGUgc3ltYm9sXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCA2XHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfU0laRSA9IDI1XHJcblxyXG4vKlxyXG4qIFRleHQgc2l6ZSBvZiBkaWduaXR5IHN5bWJvbFxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgNlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NJWkUgPSAxMlxyXG5cclxuLypcclxuKiBBbmdsZSBvZmZzZXQgbXVsdGlwbGllclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgNlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19BTkdMRV9PRkZTRVQgPSAyXHJcblxyXG4vKlxyXG4qIFJldHJvZ3JhZGUgc3ltYm9sIG9mZnNldCBtdWx0aXBsaWVyXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCA2XHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfT0ZGU0VUID0gMy41XHJcblxyXG4vKlxyXG4qIERpZ25pdHkgc3ltYm9sIG9mZnNldCBtdWx0aXBsaWVyXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCA2XHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfT0ZGU0VUID0gNVxyXG5cclxuLyoqXHJcbiogQSBwb2ludCBjb2xsaXNpb24gcmFkaXVzXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCAyXHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcclxuIiwiLypcclxuKiBSYWRpeCBjaGFydCBlbGVtZW50IElEXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCByYWRpeFxyXG4qL1xyXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcclxuXHJcbi8qXHJcbiogRm9udCBzaXplIC0gcG9pbnRzIChwbGFuZXRzKVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMjdcclxuKi9cclxuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19GT05UX1NJWkUgPSAyN1xyXG5cclxuLypcclxuKiBGb250IHNpemUgLSBob3VzZSBjdXNwIG51bWJlclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMjdcclxuKi9cclxuZXhwb3J0IGNvbnN0IFJBRElYX0hPVVNFX0ZPTlRfU0laRSA9IDIwXHJcblxyXG4vKlxyXG4qIEZvbnQgc2l6ZSAtIHNpZ25zXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCAyN1xyXG4qL1xyXG5leHBvcnQgY29uc3QgUkFESVhfU0lHTlNfRk9OVF9TSVpFID0gMjdcclxuXHJcbi8qXHJcbiogRm9udCBzaXplIC0gYXhpcyAoQXMsIERzLCBNYywgSWMpXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCAyNFxyXG4qL1xyXG5leHBvcnQgY29uc3QgUkFESVhfQVhJU19GT05UX1NJWkUgPSAzMlxyXG4iLCIvKlxyXG4qIFRyYW5zaXQgY2hhcnQgZWxlbWVudCBJRFxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgdHJhbnNpdFxyXG4qL1xyXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXHJcblxyXG4vKlxyXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDMyXHJcbiovXHJcbmV4cG9ydCBjb25zdCBUUkFOU0lUX1BPSU5UU19GT05UX1NJWkUgPSAyN1xyXG4iLCIvKipcclxuKiBDaGFydCBwYWRkaW5nXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCAxMHB4XHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcclxuXHJcbi8qKlxyXG4qIFNWRyB2aWV3Qm94IHdpZHRoXHJcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDgwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxyXG5cclxuLyoqXHJcbiogU1ZHIHZpZXdCb3ggaGVpZ2h0XHJcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDgwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcclxuXHJcbi8qXHJcbiogTGluZSBzdHJlbmd0aFxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMVxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFID0gMVxyXG5cclxuLypcclxuKiBMaW5lIHN0cmVuZ3RoIG9mIHRoZSBtYWluIGxpbmVzLiBGb3IgaW5zdGFuY2UgcG9pbnRzLCBtYWluIGF4aXMsIG1haW4gY2lyY2xlc1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMVxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXHJcblxyXG4vKipcclxuKiBObyBmaWxsLCBvbmx5IHN0cm9rZVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtib29sZWFufVxyXG4qIEBkZWZhdWx0IGZhbHNlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfT05MWSA9IGZhbHNlO1xyXG5cclxuLyoqXHJcbiogRm9udCBmYW1pbHlcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0XHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9GT05UX0ZBTUlMWSA9IFwiQXN0cm9ub21pY29uXCI7XHJcblxyXG4vKipcclxuKiBBbHdheXMgZHJhdyB0aGUgZnVsbCBob3VzZSBsaW5lcywgZXZlbiBpZiBpdCBvdmVybGFwcyB3aXRoIHBsYW5ldHNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Ym9vbGVhbn1cclxuKiBAZGVmYXVsdCBmYWxzZVxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfQUxMT1dfSE9VU0VfT1ZFUkxBUCA9IGZhbHNlO1xyXG5cclxuLyoqXHJcbiogRHJhdyBtYWlucyBheGlzIHN5bWJvbHMgb3V0c2lkZSB0aGUgY2hhcnQ6IEFjLCBNYywgSWMsIERjXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge2Jvb2xlYW59XHJcbiogQGRlZmF1bHQgZmFsc2VcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX0RSQVdfTUFJTl9BWElTID0gdHJ1ZTtcclxuIiwiaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xyXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xyXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XHJcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1RyYW5zaXRDaGFydC5qcyc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIEFuIHdyYXBwZXIgZm9yIGFsbCBwYXJ0cyBvZiBncmFwaC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuY2xhc3MgVW5pdmVyc2Uge1xyXG5cclxuICAjU1ZHRG9jdW1lbnRcclxuICAjc2V0dGluZ3NcclxuICAjcmFkaXhcclxuICAjdHJhbnNpdFxyXG4gICNhc3BlY3RzV3JhcHBlclxyXG5cclxuICAvKipcclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sRWxlbWVudElEIC0gSUQgb2YgdGhlIHJvb3QgZWxlbWVudCB3aXRob3V0IHRoZSAjIHNpZ25cclxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gQW4gb2JqZWN0IHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IHNldHRpbmdzIHZhbHVlc1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGh0bWxFbGVtZW50SUQsIG9wdGlvbnMgPSB7fSkge1xyXG5cclxuICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHJlcXVpcmVkIHBhcmFtZXRlciBpcyBtaXNzaW5nLicpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm90IGZpbmQgYSBIVE1MIGVsZW1lbnQgd2l0aCBJRCAnICsgaHRtbEVsZW1lbnRJRClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRTZXR0aW5ncywgb3B0aW9ucywge1xyXG4gICAgICBIVE1MX0VMRU1FTlRfSUQ6IGh0bWxFbGVtZW50SURcclxuICAgIH0pO1xyXG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQgPSBTVkdVdGlscy5TVkdEb2N1bWVudCh0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRILCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVClcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcclxuXHJcbiAgICAvLyBjaGFydCBiYWNrZ3JvdW5kXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDIpXHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQkFDS0dST1VORF9DT0xPUilcclxuICAgIHRoaXMuI1NWR0RvY3VtZW50LmFwcGVuZENoaWxkKGNpcmNsZSlcclxuXHJcbiAgICAvLyBjcmVhdGUgd3JhcHBlciBmb3IgYXNwZWN0c1xyXG4gICAgdGhpcy4jYXNwZWN0c1dyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcbiAgICB0aGlzLiNhc3BlY3RzV3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuQVNQRUNUU19JRH1gKVxyXG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQodGhpcy4jYXNwZWN0c1dyYXBwZXIpXHJcblxyXG4gICAgdGhpcy4jcmFkaXggPSBuZXcgUmFkaXhDaGFydCh0aGlzKVxyXG4gICAgdGhpcy4jdHJhbnNpdCA9IG5ldyBUcmFuc2l0Q2hhcnQodGhpcy4jcmFkaXgpXHJcblxyXG4gICAgdGhpcy4jbG9hZEZvbnQoXCJBc3Ryb25vbWljb25cIiwgJy4uL2Fzc2V0cy9mb250cy90dGYvQXN0cm9ub21pY29uRm9udHNfMS4xL0FzdHJvbm9taWNvbi50dGYnKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvLyAjIyBQVUJMSUMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBSYWRpeCBjaGFydFxyXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XHJcbiAgICovXHJcbiAgcmFkaXgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jcmFkaXhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBUcmFuc2l0IGNoYXJ0XHJcbiAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxyXG4gICAqL1xyXG4gIHRyYW5zaXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jdHJhbnNpdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGN1cnJlbnQgc2V0dGluZ3NcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0U2V0dGluZ3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByb290IFNWRyBkb2N1bWVudFxyXG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxyXG4gICAqL1xyXG4gIGdldFNWR0RvY3VtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI1NWR0RvY3VtZW50XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgZW1wdHkgYXNwZWN0cyB3cmFwcGVyIGVsZW1lbnRcclxuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XHJcbiAgICovXHJcbiAgZ2V0QXNwZWN0c0VsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jYXNwZWN0c1dyYXBwZXJcclxuICB9XHJcblxyXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcblxyXG4gIC8qXHJcbiAgKiBMb2FkIGZvbmQgdG8gRE9NXHJcbiAgKlxyXG4gICogQHBhcmFtIHtTdHJpbmd9IGZhbWlseVxyXG4gICogQHBhcmFtIHtTdHJpbmd9IHNvdXJjZVxyXG4gICogQHBhcmFtIHtPYmplY3R9XHJcbiAgKlxyXG4gICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRm9udEZhY2UvRm9udEZhY2VcclxuICAqL1xyXG4gIGFzeW5jICNsb2FkRm9udCggZmFtaWx5LCBzb3VyY2UsIGRlc2NyaXB0b3JzICl7XHJcblxyXG4gICAgaWYgKCEoJ0ZvbnRGYWNlJyBpbiB3aW5kb3cpKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPb29wcywgRm9udEZhY2UgaXMgbm90IGEgZnVuY3Rpb24uXCIpXHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DU1NfRm9udF9Mb2FkaW5nX0FQSVwiKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmb250ID0gbmV3IEZvbnRGYWNlKGZhbWlseSwgYHVybCgke3NvdXJjZX0pYCwgZGVzY3JpcHRvcnMpXHJcblxyXG4gICAgdHJ5e1xyXG4gICAgICBhd2FpdCBmb250LmxvYWQoKTtcclxuICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpXHJcbiAgICB9Y2F0Y2goZSl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBVbml2ZXJzZSBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscy5qcydcclxuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4vU1ZHVXRpbHMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcclxuICogQHB1YmxpY1xyXG4gKiBAc3RhdGljXHJcbiAqIEBoaWRlY29uc3RydWN0b3JcclxuICovXHJcbmNsYXNzIEFzcGVjdFV0aWxzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEFzcGVjdFV0aWxzKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgb3JiaXQgb2YgdHdvIGFuZ2xlcyBvbiBhIGNpcmNsZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21BbmdsZSAtIGFuZ2xlIGluIGRlZ3JlZSwgcG9pbnQgb24gdGhlIGNpcmNsZVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b0FuZ2xlIC0gYW5nbGUgaW4gZGVncmVlLCBwb2ludCBvbiB0aGUgY2lyY2xlXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFzcGVjdEFuZ2xlIC0gNjAsOTAsMTIwLCAuLi5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge051bWJlcn0gb3JiXHJcbiAgICovXHJcbiAgc3RhdGljIG9yYihmcm9tQW5nbGUsIHRvQW5nbGUsIGFzcGVjdEFuZ2xlKSB7XHJcbiAgICBsZXQgb3JiXHJcbiAgICBsZXQgc2lnbiA9IGZyb21BbmdsZSA+IHRvQW5nbGUgPyAxIDogLTFcclxuICAgIGxldCBkaWZmZXJlbmNlID0gTWF0aC5hYnMoZnJvbUFuZ2xlIC0gdG9BbmdsZSlcclxuXHJcbiAgICBpZiAoZGlmZmVyZW5jZSA+IFV0aWxzLkRFR18xODApIHtcclxuICAgICAgZGlmZmVyZW5jZSA9IFV0aWxzLkRFR18zNjAgLSBkaWZmZXJlbmNlO1xyXG4gICAgICBvcmIgPSAoZGlmZmVyZW5jZSAtIGFzcGVjdEFuZ2xlKSAqIC0xXHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3JiID0gKGRpZmZlcmVuY2UgLSBhc3BlY3RBbmdsZSkgKiBzaWduXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE51bWJlcihOdW1iZXIob3JiKS50b0ZpeGVkKDIpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGFzcGVjdHNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZnJvbVBvaW50cyAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gdG9Qb2ludHMgLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBhc3BlY3RzIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XHJcbiAgICovXHJcbiAgc3RhdGljIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xyXG4gICAgY29uc3QgYXNwZWN0TGlzdCA9IFtdXHJcbiAgICBmb3IgKGNvbnN0IGZyb21QIG9mIGZyb21Qb2ludHMpe1xyXG4gICAgICBmb3IgKGNvbnN0IHRvUCBvZiB0b1BvaW50cyl7XHJcbiAgICAgICAgZm9yIChjb25zdCBhc3BlY3Qgb2YgYXNwZWN0cyl7XHJcbiAgICAgICAgICBjb25zdCBvcmIgPSBBc3BlY3RVdGlscy5vcmIoZnJvbVAuYW5nbGUsIHRvUC5hbmdsZSwgYXNwZWN0LmFuZ2xlKVxyXG4gICAgICAgICAgaWYoIE1hdGguYWJzKCBvcmIgKSA8PSAgYXNwZWN0Lm9yYiApe1xyXG4gICAgICAgICAgICBhc3BlY3RMaXN0LnB1c2goIHsgYXNwZWN0OmFzcGVjdCwgZnJvbTpmcm9tUCwgdG86dG9QLCBwcmVjaXNpb246b3JiIH0gKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhc3BlY3RMaXN0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEcmF3IGFzcGVjdHNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNcclxuICAgKiBAcGFyYW0ge051bWJlcn0gYXNjZW5kYW50U2hpZnRcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGFzcGVjdHNMaXN0XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XHJcbiAgICovXHJcbiAgc3RhdGljIGRyYXdBc3BlY3RzKHJhZGl1cywgYXNjZW5kYW50U2hpZnQsIHNldHRpbmdzLCBhc3BlY3RzTGlzdCl7XHJcbiAgICBjb25zdCBjZW50ZXJYID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcclxuICAgIGNvbnN0IGNlbnRlclkgPSBzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcclxuXHJcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxyXG5cclxuICAgIGZvcihjb25zdCBhc3Agb2YgYXNwZWN0c0xpc3Qpe1xyXG5cclxuICAgICAgICAvLyBhc3BlY3QgYXMgc29saWQgbGluZVxyXG4gICAgICAgIGNvbnN0IGZyb21Qb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoY2VudGVyWCwgY2VudGVyWSwgcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhc3AuZnJvbS5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxyXG4gICAgICAgIGNvbnN0IHRvUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLnRvLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXHJcblxyXG4gICAgICAgIC8vIGRyYXcgc3ltYm9sIGluIGNlbnRlciBvZiBhc3BlY3RcclxuICAgICAgICBjb25zdCBsaW5lQ2VudGVyWCA9IChmcm9tUG9pbnQueCArICB0b1BvaW50LngpIC8gMlxyXG4gICAgICAgIGNvbnN0IGxpbmVDZW50ZXJZID0gKGZyb21Qb2ludC55ICsgIHRvUG9pbnQueSkgLyAyXHJcbiAgICAgICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGFzcC5hc3BlY3QubmFtZSwgbGluZUNlbnRlclgsIGxpbmVDZW50ZXJZKVxyXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XHJcbiAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgc2V0dGluZ3MuQVNQRUNUU19GT05UX1NJWkUpO1xyXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XHJcblxyXG4gICAgICAgIC8vIHNwYWNlIGZvciBzeW1ib2wgKGZyb21Qb2ludCAtIGNlbnRlcilcclxuICAgICAgICBjb25zdCBmcm9tUG9pbnRTcGFjZVggPSBmcm9tUG9pbnQueCArICggdG9Qb2ludC54IC0gZnJvbVBvaW50LnggKSAvIDIuMlxyXG4gICAgICAgIGNvbnN0IGZyb21Qb2ludFNwYWNlWSA9IGZyb21Qb2ludC55ICsgKCB0b1BvaW50LnkgLSBmcm9tUG9pbnQueSApIC8gMi4yXHJcblxyXG4gICAgICAgIC8vIHNwYWNlIGZvciBzeW1ib2wgKGNlbnRlciAtIHRvUG9pbnQpXHJcbiAgICAgICAgY29uc3QgdG9Qb2ludFNwYWNlWCA9IHRvUG9pbnQueCArICggZnJvbVBvaW50LnggLSB0b1BvaW50LnggKSAvIDIuMlxyXG4gICAgICAgIGNvbnN0IHRvUG9pbnRTcGFjZVkgPSB0b1BvaW50LnkgKyAoIGZyb21Qb2ludC55IC0gdG9Qb2ludC55ICkgLyAyLjJcclxuXHJcbiAgICAgICAgLy8gbGluZTogZnJvbVBvaW50IC0gY2VudGVyXHJcbiAgICAgICAgY29uc3QgbGluZTEgPSBTVkdVdGlscy5TVkdMaW5lKGZyb21Qb2ludC54LCBmcm9tUG9pbnQueSwgZnJvbVBvaW50U3BhY2VYLCBmcm9tUG9pbnRTcGFjZVkpXHJcbiAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XHJcbiAgICAgICAgbGluZTEuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcblxyXG4gICAgICAgIC8vIGxpbmU6IGNlbnRlciAtIHRvUG9pbnRcclxuICAgICAgICBjb25zdCBsaW5lMiA9IFNWR1V0aWxzLlNWR0xpbmUodG9Qb2ludFNwYWNlWCwgdG9Qb2ludFNwYWNlWSwgdG9Qb2ludC54LCB0b1BvaW50LnkpXHJcbiAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XHJcbiAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHNldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcblxyXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZTEpO1xyXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZTIpO1xyXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gd3JhcHBlclxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgQXNwZWN0VXRpbHMgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXHJcbiAqIEBwdWJsaWNcclxuICogQHN0YXRpY1xyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXHJcbiAqL1xyXG5jbGFzcyBTVkdVdGlscyB7XHJcblxyXG4gIHN0YXRpYyBTVkdfTkFNRVNQQUNFID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9UQVVSVVMgPSBcIlRhdXJ1c1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfR0VNSU5JID0gXCJHZW1pbmlcIjtcclxuICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9MRU8gPSBcIkxlb1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVklSR08gPSBcIlZpcmdvXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcclxuICBzdGF0aWMgU1lNQk9MX1NDT1JQSU8gPSBcIlNjb3JwaW9cIjtcclxuICBzdGF0aWMgU1lNQk9MX1NBR0lUVEFSSVVTID0gXCJTYWdpdHRhcml1c1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcclxuICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTID0gXCJBcXVhcml1c1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfUElTQ0VTID0gXCJQaXNjZXNcIjtcclxuXHJcbiAgc3RhdGljIFNZTUJPTF9TVU4gPSBcIlN1blwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTU9PTiA9IFwiTW9vblwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWSA9IFwiTWVyY3VyeVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVkVOVVMgPSBcIlZlbnVzXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9FQVJUSCA9IFwiRWFydGhcIjtcclxuICBzdGF0aWMgU1lNQk9MX01BUlMgPSBcIk1hcnNcIjtcclxuICBzdGF0aWMgU1lNQk9MX0pVUElURVIgPSBcIkp1cGl0ZXJcIjtcclxuICBzdGF0aWMgU1lNQk9MX1NBVFVSTiA9IFwiU2F0dXJuXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9VUkFOVVMgPSBcIlVyYW51c1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTkVQVFVORSA9IFwiTmVwdHVuZVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfUExVVE8gPSBcIlBsdXRvXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9DSElST04gPSBcIkNoaXJvblwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTElMSVRIID0gXCJMaWxpdGhcIjtcclxuICBzdGF0aWMgU1lNQk9MX05OT0RFID0gXCJOTm9kZVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU05PREUgPSBcIlNOb2RlXCI7XHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfQVMgPSBcIkFzXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcclxuICBzdGF0aWMgU1lNQk9MX01DID0gXCJNY1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfSUMgPSBcIkljXCI7XHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfUkVUUk9HUkFERSA9IFwiUmV0cm9ncmFkZVwiXHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfQ09OSlVOQ1RJT04gPSBcIkNvbmp1bmN0aW9uXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9PUFBPU0lUSU9OID0gXCJPcHBvc2l0aW9uXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TUVVBUkUgPSBcIlNxdWFyZVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVFJJTkUgPSBcIlRyaW5lXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TRVhUSUxFID0gXCJTZXh0aWxlXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9RVUlOQ1VOWCA9IFwiUXVpbmN1bnhcIjtcclxuICBzdGF0aWMgU1lNQk9MX1NFTUlTRVhUSUxFID0gXCJTZW1pc2V4dGlsZVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfT0NUSUxFID0gXCJPY3RpbGVcIjtcclxuICBzdGF0aWMgU1lNQk9MX1RSSU9DVElMRSA9IFwiVHJpb2N0aWxlXCI7XHJcblxyXG4gIC8vIEFzdHJvbm9taWNvbiBmb250IGNvZGVzXHJcbiAgc3RhdGljIFNZTUJPTF9BUklFU19DT0RFID0gXCJBXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9UQVVSVVNfQ09ERSA9IFwiQlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfR0VNSU5JX0NPREUgPSBcIkNcIjtcclxuICBzdGF0aWMgU1lNQk9MX0NBTkNFUl9DT0RFID0gXCJEXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9MRU9fQ09ERSA9IFwiRVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVklSR09fQ09ERSA9IFwiRlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTElCUkFfQ09ERSA9IFwiR1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU0NPUlBJT19DT0RFID0gXCJIXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVU19DT0RFID0gXCJJXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk5fQ09ERSA9IFwiSlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfQVFVQVJJVVNfQ09ERSA9IFwiS1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfUElTQ0VTX0NPREUgPSBcIkxcIjtcclxuXHJcbiAgc3RhdGljIFNZTUJPTF9TVU5fQ09ERSA9IFwiUVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTU9PTl9DT0RFID0gXCJSXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9NRVJDVVJZX0NPREUgPSBcIlNcIjtcclxuICBzdGF0aWMgU1lNQk9MX1ZFTlVTX0NPREUgPSBcIlRcIjtcclxuICBzdGF0aWMgU1lNQk9MX0VBUlRIX0NPREUgPSBcIj5cIjtcclxuICBzdGF0aWMgU1lNQk9MX01BUlNfQ09ERSA9IFwiVVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfSlVQSVRFUl9DT0RFID0gXCJWXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TQVRVUk5fQ09ERSA9IFwiV1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVVJBTlVTX0NPREUgPSBcIlhcIjtcclxuICBzdGF0aWMgU1lNQk9MX05FUFRVTkVfQ09ERSA9IFwiWVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfUExVVE9fQ09ERSA9IFwiWlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfQ0hJUk9OX0NPREUgPSBcInFcIjtcclxuICBzdGF0aWMgU1lNQk9MX0xJTElUSF9DT0RFID0gXCJ6XCI7XHJcbiAgc3RhdGljIFNZTUJPTF9OTk9ERV9DT0RFID0gXCJnXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TTk9ERV9DT0RFID0gXCJpXCI7XHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfQVNfQ09ERSA9IFwiY1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfRFNfQ09ERSA9IFwiZlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTUNfQ09ERSA9IFwiZFwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfSUNfQ09ERSA9IFwiZVwiO1xyXG5cclxuICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREVfQ09ERSA9IFwiTVwiXHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfQ09OSlVOQ1RJT05fQ09ERSA9IFwiIVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfT1BQT1NJVElPTl9DT0RFID0gJ1wiJztcclxuICBzdGF0aWMgU1lNQk9MX1NRVUFSRV9DT0RFID0gXCIjXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9UUklORV9DT0RFID0gXCIkXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TRVhUSUxFX0NPREUgPSBcIiVcIjtcclxuICBzdGF0aWMgU1lNQk9MX1FVSU5DVU5YX0NPREUgPSBcIiZcIjtcclxuICBzdGF0aWMgU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUgPSBcIicnXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9PQ1RJTEVfQ09ERSA9IFwiKFwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVFJJT0NUSUxFX0NPREUgPSBcIilcIjtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgU1ZHIGRvY3VtZW50XHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XHJcbiAgICovXHJcbiAgc3RhdGljIFNWR0RvY3VtZW50KHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcclxuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSk7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2ZXJzaW9uJywgXCIxLjFcIik7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcclxuICAgIHJldHVybiBzdmdcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFNWRyBncm91cCBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBTVkdHcm91cCgpIHtcclxuICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJnXCIpO1xyXG4gICAgcmV0dXJuIGdcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFNWRyBwYXRoIGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEBzdGF0aWNcclxuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XHJcbiAgICovXHJcbiAgc3RhdGljIFNWR1BhdGgoKSB7XHJcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcclxuICAgIHJldHVybiBwYXRoXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBTVkcgbWFzayBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHTWFza0VsZW1lbnR9XHJcbiAgICovXHJcbiAgc3RhdGljIFNWR01hc2soZWxlbWVudElEKSB7XHJcbiAgICBjb25zdCBtYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibWFza1wiKTtcclxuICAgIG1hc2suc2V0QXR0cmlidXRlKFwiaWRcIiwgZWxlbWVudElEKVxyXG4gICAgcmV0dXJuIG1hc2tcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNWRyBjaXJjdWxhciBzZWN0b3JcclxuICAgKlxyXG4gICAqIEBzdGF0aWNcclxuICAgKiBAcGFyYW0ge2ludH0geCAtIGNpcmNsZSB4IGNlbnRlciBwb3NpdGlvblxyXG4gICAqIEBwYXJhbSB7aW50fSB5IC0gY2lyY2xlIHkgY2VudGVyIHBvc2l0aW9uXHJcbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXMgaW4gcHhcclxuICAgKiBAcGFyYW0ge2ludH0gYTEgLSBhbmdsZUZyb20gaW4gcmFkaWFuc1xyXG4gICAqIEBwYXJhbSB7aW50fSBhMiAtIGFuZ2xlVG8gaW4gcmFkaWFuc1xyXG4gICAqIEBwYXJhbSB7aW50fSB0aGlja25lc3MgLSBmcm9tIG91dHNpZGUgdG8gY2VudGVyIGluIHB4XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBzZWdtZW50XHJcbiAgICovXHJcbiAgc3RhdGljIFNWR1NlZ21lbnQoeCwgeSwgcmFkaXVzLCBhMSwgYTIsIHRoaWNrbmVzcywgbEZsYWcsIHNGbGFnKSB7XHJcbiAgICAvLyBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXHJcbiAgICBjb25zdCBMQVJHRV9BUkNfRkxBRyA9IGxGbGFnIHx8IDA7XHJcbiAgICBjb25zdCBTV0VFVF9GTEFHID0gc0ZsYWcgfHwgMDtcclxuXHJcbiAgICBjb25zdCBzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcclxuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguc2luKGExKSkgKyBcIiBBIFwiICsgcmFkaXVzICsgXCIsIFwiICsgcmFkaXVzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIFNXRUVUX0ZMQUcgKyBcIiwgXCIgKyAoeCArIHJhZGl1cyAqIE1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoeSArIHJhZGl1cyAqIE1hdGguc2luKGEyKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5zaW4oYTIpKSArIFwiIEEgXCIgKyB0aGlja25lc3MgKyBcIiwgXCIgKyB0aGlja25lc3MgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgMSArIFwiLCBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSk7XHJcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xyXG4gICAgcmV0dXJuIHNlZ21lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTVkcgY2lyY2xlXHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHBhcmFtIHtpbnR9IGN4XHJcbiAgICogQHBhcmFtIHtpbnR9IGN5XHJcbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1c1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gY2lyY2xlXHJcbiAgICovXHJcbiAgc3RhdGljIFNWR0NpcmNsZShjeCwgY3ksIHJhZGl1cykge1xyXG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiY2lyY2xlXCIpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIGN4KTtcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjeSk7XHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiclwiLCByYWRpdXMpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xyXG4gICAgcmV0dXJuIGNpcmNsZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNWRyBsaW5lXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0geDFcclxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcclxuICAgKiBAcGFyYW0ge051bWJlcn0geDJcclxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcclxuICAgKi9cclxuICBzdGF0aWMgU1ZHTGluZSh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImxpbmVcIik7XHJcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngxXCIsIHgxKTtcclxuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgeTEpO1xyXG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB4Mik7XHJcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHkyKTtcclxuICAgIHJldHVybiBsaW5lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU1ZHIHRleHRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4XHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHh0XHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtzY2FsZV1cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcclxuICAgKi9cclxuICBzdGF0aWMgU1ZHVGV4dCh4LCB5LCB0eHQpIHtcclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJ0ZXh0XCIpO1xyXG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgpO1xyXG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkpO1xyXG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCJub25lXCIpO1xyXG4gICAgdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcclxuXHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNWRyBzeW1ib2xcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcclxuICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cclxuICAgKi9cclxuICBzdGF0aWMgU1ZHU3ltYm9sKG5hbWUsIHhQb3MsIHlQb3MpIHtcclxuICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUzpcclxuICAgICAgICByZXR1cm4gYXNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRFM6XHJcbiAgICAgICAgcmV0dXJuIGRzU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01DOlxyXG4gICAgICAgIHJldHVybiBtY1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9JQzpcclxuICAgICAgICByZXR1cm4gaWNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTOlxyXG4gICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVM6XHJcbiAgICAgICAgcmV0dXJuIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkk6XHJcbiAgICAgICAgcmV0dXJuIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVI6XHJcbiAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MRU86XHJcbiAgICAgICAgcmV0dXJuIGxlb1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WSVJHTzpcclxuICAgICAgICByZXR1cm4gdmlyZ29TeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElCUkE6XHJcbiAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU86XHJcbiAgICAgICAgcmV0dXJuIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVM6XHJcbiAgICAgICAgcmV0dXJuIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STjpcclxuICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTOlxyXG4gICAgICAgIHJldHVybiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVM6XHJcbiAgICAgICAgcmV0dXJuIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxyXG4gICAgICAgIHJldHVybiBzdW5TeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcclxuICAgICAgICByZXR1cm4gbW9vblN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZOlxyXG4gICAgICAgIHJldHVybiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxyXG4gICAgICAgIHJldHVybiB2ZW51c1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9FQVJUSDpcclxuICAgICAgICByZXR1cm4gZWFydGhTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcclxuICAgICAgICByZXR1cm4gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSOlxyXG4gICAgICAgIHJldHVybiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcclxuICAgICAgICByZXR1cm4gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcclxuICAgICAgICByZXR1cm4gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkU6XHJcbiAgICAgICAgcmV0dXJuIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUExVVE86XHJcbiAgICAgICAgcmV0dXJuIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTjpcclxuICAgICAgICByZXR1cm4gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJTElUSDpcclxuICAgICAgICByZXR1cm4gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05OT0RFOlxyXG4gICAgICAgIHJldHVybiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TTk9ERTpcclxuICAgICAgICByZXR1cm4gc25vZGVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREU6XHJcbiAgICAgICAgcmV0dXJuIHJldHJvZ3JhZGVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NPTkpVTkNUSU9OOlxyXG4gICAgICAgIHJldHVybiBjb25qdW5jdGlvblN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9PUFBPU0lUSU9OOlxyXG4gICAgICAgIHJldHVybiBvcHBvc2l0aW9uU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NRVUFSRTpcclxuICAgICAgICByZXR1cm4gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RSSU5FOlxyXG4gICAgICAgIHJldHVybiB0cmluZVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFOlxyXG4gICAgICAgIHJldHVybiBzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1FVSU5DVU5YOlxyXG4gICAgICAgIHJldHVybiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TRU1JU0VYVElMRTpcclxuICAgICAgICByZXR1cm4gc2VtaXNleHRpbGVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfT0NUSUxFOlxyXG4gICAgICAgIHJldHVybiBxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklPQ1RJTEU6XHJcbiAgICAgICAgcmV0dXJuIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zdCB1bmtub3duU3ltYm9sID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHhQb3MsIHlQb3MsIDgpXHJcbiAgICAgICAgdW5rbm93blN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjMzMzXCIpXHJcbiAgICAgICAgcmV0dXJuIHVua25vd25TeW1ib2xcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQXNjZW5kYW50IHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhc1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBEZXNjZW5kYW50IHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkc1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNZWRpdW0gY29lbGkgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1jU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01DX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEltbXVtIGNvZWxpIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpY1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBBcmllcyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXJpZXNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVJJRVNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGF1cnVzIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0YXVydXNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdlbWluaSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDYW5jZXIgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVJfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTGVvIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsZW9TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTEVPX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFZpcmdvIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9WSVJHT19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMaWJyYSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElCUkFfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2NvcnBpbyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNhZ2l0dGFyaXVzIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDYXByaWNvcm4gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk5fQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQXF1YXJpdXMgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFBpc2NlcyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTdW4gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHN1blN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TVU5fQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTW9vbiBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbW9vblN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NT09OX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE1lcmN1cnkgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBWZW51cyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVkVOVVNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogRWFydGggc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0VBUlRIX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE1hcnMgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1hcnNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUFSU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBKdXBpdGVyIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVJfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2F0dXJuIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0FUVVJOX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFVyYW51cyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBOZXB0dW5lIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUGx1dG8gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIENoaXJvbiBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTl9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMaWxpdGggc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEhfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTk5vZGUgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX05OT0RFX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNOb2RlIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzbm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TTk9ERV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXRyb2dyYWRlIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ29uanVuY3Rpb24gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNvbmp1bmN0aW9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE9wcG9zaXRpb24gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG9wcG9zaXRpb25TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTl9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTcXVhcmVzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NRVUFSRV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUcmluZSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdHJpbmVTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJTkVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2V4dGlsZSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFF1aW5jdW54IHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWF9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTZW1pc2V4dGlsZSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2VtaXNleHRpbGVTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUXVpbnRpbGUgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX09DVElMRV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUcmlvY3RpbGUgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UUklPQ1RJTEVfQ09ERSlcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgU1ZHVXRpbHMgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcclxuICogQHB1YmxpY1xyXG4gKiBAc3RhdGljXHJcbiAqIEBoaWRlY29uc3RydWN0b3JcclxuICovXHJcbmNsYXNzIFV0aWxzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIERFR18zNjAgPSAzNjBcclxuICBzdGF0aWMgREVHXzE4MCA9IDE4MFxyXG4gIHN0YXRpYyBERUdfMCA9IDBcclxuXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGUgcmFuZG9tIElEXHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIHN0YXRpYyBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDtcclxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCB1bmlxdWVJZCA9IGBpZF8ke3JhbmRvbU51bWJlcn1fJHt0aW1lc3RhbXB9YDtcclxuICAgIHJldHVybiB1bmlxdWVJZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEludmVydGVkIGRlZ3JlZSB0byByYWRpYW5cclxuICAgKiBAc3RhdGljXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJbmRlZ3JlZVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaGlmdEluRGVncmVlXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIHN0YXRpYyBkZWdyZWVUb1JhZGlhbiA9IGZ1bmN0aW9uKGFuZ2xlSW5EZWdyZWUsIHNoaWZ0SW5EZWdyZWUgPSAwKSB7XHJcbiAgICByZXR1cm4gKHNoaWZ0SW5EZWdyZWUgLSBhbmdsZUluRGVncmVlKSAqIE1hdGguUEkgLyAxODBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnRzIHJhZGlhbiB0byBkZWdyZWVcclxuICAgKiBAc3RhdGljXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFuXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZSA9IGZ1bmN0aW9uKHJhZGlhbikge1xyXG4gICAgcmV0dXJuIChyYWRpYW4gKiAxODAgLyBNYXRoLlBJKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyBhIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgY2lyY2xlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcclxuICAgKiBAcGFyYW0ge051bWJlcn0gY3kgLSBjZW50ZXIgeVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cclxuICAgKi9cclxuICBzdGF0aWMgcG9zaXRpb25PbkNpcmNsZShjeCwgY3ksIHJhZGl1cywgYW5nbGVJblJhZGlhbnMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykgKyBjeCksXHJcbiAgICAgIHk6IChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykgKyBjeSlcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGVzIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBsaW5lICgyIHBvaW50cykgYW5kIHRoZSB4LWF4aXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0geDFcclxuICAgKiBAcGFyYW0ge051bWJlcn0geTFcclxuICAgKiBAcGFyYW0ge051bWJlcn0geDJcclxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBkZWdyZWVcclxuICAgKi9cclxuICBzdGF0aWMgcG9zaXRpb25Ub0FuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICBjb25zdCBkeCA9IHgyIC0geDE7XHJcbiAgICBjb25zdCBkeSA9IHkyIC0geTE7XHJcbiAgICBjb25zdCBhbmdsZUluUmFkaWFucyA9IE1hdGguYXRhbjIoZHksIGR4KTtcclxuICAgIHJldHVybiBVdGlscy5yYWRpYW5Ub0RlZ3JlZShhbmdsZUluUmFkaWFucylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgbmV3IHBvc2l0aW9uIG9mIHBvaW50cyBvbiBjaXJjbGUgd2l0aG91dCBvdmVybGFwcGluZyBlYWNoIG90aGVyXHJcbiAgICpcclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGVyZSBpcyBubyBwbGFjZSBvbiB0aGUgY2lyY2xlIHRvIHBsYWNlIHBvaW50cy5cclxuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe25hbWU6XCJhXCIsIGFuZ2xlOjEwfSwge25hbWU6XCJiXCIsIGFuZ2xlOjIwfV1cclxuICAgKiBAcGFyYW0ge051bWJlcn0gY29sbGlzaW9uUmFkaXVzIC0gcG9pbnQgcmFkaXVzXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7XCJNb29uXCI6MzAsIFwiU3VuXCI6NjAsIFwiTWVyY3VyeVwiOjg2LCAuLi59XHJcbiAgICovXHJcbiAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgY29sbGlzaW9uUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHtcclxuICAgIGNvbnN0IFNURVAgPSAxIC8vZGVncmVlXHJcblxyXG4gICAgY29uc3QgY2VsbFdpZHRoID0gMTAgLy9kZWdyZWVcclxuICAgIGNvbnN0IG51bWJlck9mQ2VsbHMgPSBVdGlscy5ERUdfMzYwIC8gY2VsbFdpZHRoXHJcbiAgICBjb25zdCBmcmVxdWVuY3kgPSBuZXcgQXJyYXkobnVtYmVyT2ZDZWxscykuZmlsbCgwKVxyXG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKHBvaW50LmFuZ2xlIC8gY2VsbFdpZHRoKVxyXG4gICAgICBmcmVxdWVuY3lbaW5kZXhdICs9IDFcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbiB0aGlzIGFsZ29yaXRobSB0aGUgb3JkZXIgb2YgcG9pbnRzIGlzIGNydWNpYWwuXHJcbiAgICAvLyBBdCB0aGF0IHBvaW50IGluIHRoZSBjaXJjbGUsIHdoZXJlIHRoZSBwZXJpb2QgY2hhbmdlcyBpbiB0aGUgY2lyY2xlIChmb3IgaW5zdGFuY2U6WzM1OCwzNTksMCwxXSksIHRoZSBwb2ludHMgYXJlIGFycmFuZ2VkIGluIGluY29ycmVjdCBvcmRlci5cclxuICAgIC8vIEFzIGEgc3RhcnRpbmcgcG9pbnQsIEkgdHJ5IHRvIGZpbmQgYSBwbGFjZSB3aGVyZSB0aGVyZSBhcmUgbm8gcG9pbnRzLiBUaGlzIHBsYWNlIEkgdXNlIGFzIFNUQVJUX0FOR0xFLlxyXG4gICAgY29uc3QgU1RBUlRfQU5HTEUgPSBjZWxsV2lkdGggKiBmcmVxdWVuY3kuZmluZEluZGV4KGNvdW50ID0+IGNvdW50ID09IDApXHJcblxyXG4gICAgY29uc3QgX3BvaW50cyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6IHBvaW50Lm5hbWUsXHJcbiAgICAgICAgYW5nbGU6IHBvaW50LmFuZ2xlIDwgU1RBUlRfQU5HTEUgPyBwb2ludC5hbmdsZSArIFV0aWxzLkRFR18zNjAgOiBwb2ludC5hbmdsZVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIF9wb2ludHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGVcclxuICAgIH0pXHJcblxyXG4gICAgLy8gUmVjdXJzaXZlIGZ1bmN0aW9uXHJcbiAgICBjb25zdCBhcnJhbmdlUG9pbnRzID0gKCkgPT4ge1xyXG4gICAgICBmb3IgKGxldCBpID0gMCwgbG4gPSBfcG9pbnRzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcclxuICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSgwLCAwLCBjaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKF9wb2ludHNbaV0uYW5nbGUpKVxyXG4gICAgICAgIF9wb2ludHNbaV0ueCA9IHBvaW50UG9zaXRpb24ueFxyXG4gICAgICAgIF9wb2ludHNbaV0ueSA9IHBvaW50UG9zaXRpb24ueVxyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xyXG4gICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coX3BvaW50c1tpXS54IC0gX3BvaW50c1tqXS54LCAyKSArIE1hdGgucG93KF9wb2ludHNbaV0ueSAtIF9wb2ludHNbal0ueSwgMikpO1xyXG4gICAgICAgICAgaWYgKGRpc3RhbmNlIDwgKDIgKiBjb2xsaXNpb25SYWRpdXMpKSB7XHJcbiAgICAgICAgICAgIF9wb2ludHNbaV0uYW5nbGUgKz0gU1RFUFxyXG4gICAgICAgICAgICBfcG9pbnRzW2pdLmFuZ2xlIC09IFNURVBcclxuICAgICAgICAgICAgYXJyYW5nZVBvaW50cygpIC8vPT09PT09PiBSZWN1cnNpdmUgY2FsbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VQb2ludHMoKVxyXG5cclxuICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcclxuICAgICAgYWNjdW11bGF0b3JbcG9pbnQubmFtZV0gPSBwb2ludC5hbmdsZVxyXG4gICAgICByZXR1cm4gYWNjdW11bGF0b3JcclxuICAgIH0sIHt9KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgdGhlIGFuZ2xlIGNvbGxpZGVzIHdpdGggdGhlIHBvaW50c1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlXHJcbiAgICogQHBhcmFtIHtBcnJheX0gYW5nbGVzTGlzdFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbY29sbGlzaW9uUmFkaXVzXVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBzdGF0aWMgaXNDb2xsaXNpb24oYW5nbGUsIGFuZ2xlc0xpc3QsIGNvbGxpc2lvblJhZGl1cyA9IDEwKSB7XHJcblxyXG4gICAgY29uc3QgcG9pbnRJbkNvbGxpc2lvbiA9IGFuZ2xlc0xpc3QuZmluZChwb2ludCA9PiB7XHJcblxyXG4gICAgICBsZXQgYSA9IChwb2ludCAtIGFuZ2xlKSA+IFV0aWxzLkRFR18xODAgPyBhbmdsZSArIFV0aWxzLkRFR18zNjAgOiBhbmdsZVxyXG4gICAgICBsZXQgcCA9IChhbmdsZSAtIHBvaW50KSA+IFV0aWxzLkRFR18xODAgPyBwb2ludCArIFV0aWxzLkRFR18zNjAgOiBwb2ludFxyXG5cclxuICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSBwKSA8PSBjb2xsaXNpb25SYWRpdXNcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHBvaW50SW5Db2xsaXNpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZVxyXG4gIH1cclxuXHJcbiAgXHJcblxyXG4gIC8qKlxyXG4gICogUmVtb3ZlcyB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50XHJcbiAgKlxyXG4gICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxyXG4gICogQHBhcmFtIHtGdW5jdGlvbn0gW2JlZm9yZUhvb2tdXHJcbiAgICAqXHJcbiAgKiBAd2FybmluZyAtIEl0IHJlbW92ZXMgRXZlbnQgTGlzdGVuZXJzIHRvby5cclxuICAqIEB3YXJuaW5nIC0gWW91IHdpbGwgKHByb2JhYmx5KSBnZXQgbWVtb3J5IGxlYWsgaWYgeW91IGRlbGV0ZSBlbGVtZW50cyB0aGF0IGhhdmUgYXR0YWNoZWQgbGlzdGVuZXJzXHJcbiAgKi9cclxuICBzdGF0aWMgY2xlYW5VcCggZWxlbWVudElELCBiZWZvcmVIb29rKXtcclxuICAgIGxldCBlbG0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SUQpXHJcbiAgICBpZighZWxtKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgKHR5cGVvZiBiZWZvcmVIb29rID09PSAnZnVuY3Rpb24nKSAmJiBiZWZvcmVIb29rKClcclxuXHJcbiAgICBlbG0uaW5uZXJIVE1MID0gXCJcIlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBVdGlscyBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL3VuaXZlcnNlL1VuaXZlcnNlLmpzJ1xyXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi91dGlscy9TVkdVdGlscy5qcydcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXHJcbmltcG9ydCBSYWRpeENoYXJ0IGZyb20gJy4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnXHJcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJ1xyXG5cclxuZXhwb3J0IHtVbml2ZXJzZSwgU1ZHVXRpbHMsIFV0aWxzLCBSYWRpeENoYXJ0LCBUcmFuc2l0Q2hhcnR9XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==