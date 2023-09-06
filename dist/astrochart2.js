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

    fromPoints = fromPoints ?? this.#data.points
    toPoints = toPoints ?? [...this.#data.points, {name:"AS", angle:this.#data.cusps.at(0)}, {name:"IC", angle:this.#data.cusps.at(3)}, {name:"DS", angle:this.#data.cusps.at(6)}, {name:"MC", angle:this.#data.cusps.at(9)}]
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
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
      text.setAttribute("fill", this.#settings.CHART_HOUSE_NUMBER_COLOR)
      wrapper.appendChild(text)
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

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius() + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius() + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
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

    fromPoints = fromPoints ?? this.#data.points
    toPoints = toPoints ?? [...this.#radix.getData().points, {name:"AS", angle:this.#radix.getData().cusps.at(0)}, {name:"IC", angle:this.#radix.getData().cusps.at(3)}, {name:"DS", angle:this.#radix.getData().cusps.at(6)}, {name:"MC", angle:this.#radix.getData().cusps.at(9)}]
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
      symbol.setAttribute("fill", this.#settings.PLANET_COLORS[pointData.name] ?? this.#settings.CHART_POINTS_COLOR)
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
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_HOUSE_FONT_SIZE)
      text.setAttribute("fill", this.#settings.CHART_HOUSE_NUMBER_COLOR)
      wrapper.appendChild(text)
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
    this.#settings.POINT_PROPERTIES_SHOW_RETROGRADE && retrograde.call(this)
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
      angleInSignText.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
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
      retrogradeText.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
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
      dignitiesText.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
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
    return Math.round(this.#angle % 30)
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
/* harmony export */   SIGN_COLORS: () => (/* binding */ SIGN_COLORS)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLDhCQUE4Qix1REFBSztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDBEQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlZa0Q7QUFDTjtBQUNJO0FBQ0o7QUFDRTtBQUNFO0FBQ2pEO0FBQ0EsaUNBQWlDLEVBQUUsbURBQVEsRUFBRSxnREFBSyxFQUFFLGtEQUFPLEVBQUUsZ0RBQUssRUFBRSxpREFBTSxFQUFFLGtEQUFPO0FBQ25GO0FBSUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNPO0FBQ1AsR0FBRyxtQ0FBbUM7QUFDdEMsR0FBRyxvQ0FBb0M7QUFDdkMsR0FBRywrQkFBK0I7QUFDbEMsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5TkE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RHUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7O0FDdENQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZFA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEVzRDtBQUNqQjtBQUNOO0FBQ1c7QUFDSTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUM7Ozs7Ozs7Ozs7Ozs7OztBQ25JRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZDO0FBQ0g7QUFDTjtBQUNXO0FBQ0k7QUFDbkQ7QUFDNEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvQ2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9SYWRpeENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvVHJhbnNpdENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9wb2ludHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL0FzcGVjdHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Db2xvcnMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1JhZGl4LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVHJhbnNpdC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91bml2ZXJzZS9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvQXNwZWN0VXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1NWR1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9VdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIEFuIGFic3RyYWN0IGNsYXNzIGZvciBhbGwgdHlwZSBvZiBDaGFydFxyXG4gKiBAcHVibGljXHJcbiAqIEBoaWRlY29uc3RydWN0b3JcclxuICogQGFic3RyYWN0XHJcbiAqL1xyXG5jbGFzcyBDaGFydCB7XHJcblxyXG4gIC8vI3NldHRpbmdzXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcclxuICAgIC8vdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgdGhlIGRhdGEgaXMgdmFsaWRcclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyB1bmRlZmluZWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge2lzVmFsaWQ6Ym9vbGVhbiwgbWVzc2FnZTpTdHJpbmd9XHJcbiAgICovXHJcbiAgdmFsaWRhdGVEYXRhKGRhdGEpIHtcclxuICAgIGlmICghZGF0YSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNpbmcgcGFyYW0gZGF0YS5cIilcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5wb2ludHMpKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgICAgbWVzc2FnZTogXCJwb2ludHMgaXMgbm90IEFycmF5LlwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jdXNwcykpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcclxuICAgICAgICBtZXNzYWdlOiBcImN1cHMgaXMgbm90IEFycmF5LlwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5jdXNwcy5sZW5ndGggIT09IDEyKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgICAgbWVzc2FnZTogXCJjdXNwcy5sZW5ndGggIT09IDEyXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IHBvaW50IG9mIGRhdGEucG9pbnRzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQubmFtZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUgIT09ICdzdHJpbmcnXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBvaW50Lm5hbWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lLmxlbmd0aCA9PSAwXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHR5cGVvZiBwb2ludC5hbmdsZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50LmFuZ2xlICE9PSAnbnVtYmVyJ1wiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgY3VzcCBvZiBkYXRhLmN1c3BzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgY3VzcC5hbmdsZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXHJcbiAgICAgICAgICBtZXNzYWdlOiBcImN1c3AuYW5nbGUgIT09ICdudW1iZXInXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiBcIlwiXHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8qKlxyXG4gICAqIEBhYnN0cmFjdFxyXG4gICAqL1xyXG4gIHNldERhdGEoZGF0YSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAYWJzdHJhY3RcclxuICAgKi9cclxuICBnZXRQb2ludHMoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBhYnN0cmFjdFxyXG4gICAqL1xyXG4gIGdldFBvaW50KG5hbWUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGFic3RyYWN0XHJcbiAgICovXHJcbiAgYW5pbWF0ZVRvKGRhdGEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gIyMgUFJPVEVDVEVEICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBDaGFydCBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi4vdW5pdmVyc2UvVW5pdmVyc2UuanMnO1xyXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xyXG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xyXG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcclxuaW1wb3J0IFBvaW50IGZyb20gJy4uL3BvaW50cy9Qb2ludC5qcydcclxuaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGluc2lkZSB0aGUgVW5pdmVyc2UuXHJcbiAqIEBwdWJsaWNcclxuICogQGV4dGVuZHMge0NoYXJ0fVxyXG4gKi9cclxuY2xhc3MgUmFkaXhDaGFydCBleHRlbmRzIENoYXJ0IHtcclxuXHJcbiAgLypcclxuICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cclxuICAgKiBJdCBjYW4gYmUgY2hhbmdlZCBkeW5hbWljYWxseSBieSBwdWJsaWMgc2V0dGVyLlxyXG4gICAqL1xyXG4gICNudW1iZXJPZkxldmVscyA9IDI0XHJcblxyXG4gICN1bml2ZXJzZVxyXG4gICNzZXR0aW5nc1xyXG4gICNyb290XHJcbiAgI2RhdGFcclxuXHJcbiAgI2NlbnRlclhcclxuICAjY2VudGVyWVxyXG4gICNyYWRpdXNcclxuXHJcbiAgLypcclxuICAgKiBAc2VlIFV0aWxzLmNsZWFuVXAoKVxyXG4gICAqL1xyXG4gICNiZWZvcmVDbGVhblVwSG9va1xyXG5cclxuICAvKipcclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqIEBwYXJhbSB7VW5pdmVyc2V9IFVuaXZlcnNlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IodW5pdmVyc2UpIHtcclxuXHJcbiAgICBpZiAoIXVuaXZlcnNlIGluc3RhbmNlb2YgVW5pdmVyc2UpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gdW5pdmVyc2UuJylcclxuICAgIH1cclxuXHJcbiAgICBzdXBlcih1bml2ZXJzZS5nZXRTZXR0aW5ncygpKVxyXG5cclxuICAgIHRoaXMuI3VuaXZlcnNlID0gdW5pdmVyc2VcclxuICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jdW5pdmVyc2UuZ2V0U2V0dGluZ3MoKVxyXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXHJcbiAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXHJcbiAgICB0aGlzLiNyYWRpdXMgPSBNYXRoLm1pbih0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZKSAtIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BBRERJTkdcclxuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH1gKVxyXG4gICAgdGhpcy4jdW5pdmVyc2UuZ2V0U1ZHRG9jdW1lbnQoKS5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGNoYXJ0IGRhdGFcclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxyXG4gICAqL1xyXG4gIHNldERhdGEoZGF0YSkge1xyXG4gICAgbGV0IHN0YXR1cyA9IHRoaXMudmFsaWRhdGVEYXRhKGRhdGEpXHJcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNkYXRhID0gZGF0YVxyXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgZGF0YVxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICBnZXREYXRhKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBcInBvaW50c1wiOlsuLi50aGlzLiNkYXRhLnBvaW50c10sXHJcbiAgICAgIFwiY3VzcHNcIjpbLi4udGhpcy4jZGF0YS5jdXNwc11cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBudW1iZXIgb2YgTGV2ZWxzLlxyXG4gICAqIExldmVscyBkZXRlcm1pbmUgdGhlIHdpZHRoIG9mIGluZGl2aWR1YWwgcGFydHMgb2YgdGhlIGNoYXJ0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgc2V0TnVtYmVyT2ZMZXZlbHMobGV2ZWxzKSB7XHJcbiAgICB0aGlzLiNudW1iZXJPZkxldmVscyA9IE1hdGgubWF4KDI0LCBsZXZlbHMpXHJcbiAgICBpZiAodGhpcy4jZGF0YSkge1xyXG4gICAgICB0aGlzLiNkcmF3KHRoaXMuI2RhdGEpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0UmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI3JhZGl1c1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHJhZGl1c1xyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRPdXRlckNpcmNsZVJhZGl1cygpIHtcclxuICAgIHJldHVybiAyNCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcmFkaXVzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldElubmVyQ2lyY2xlUmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIDIxICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIDIwICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSB7XHJcbiAgICByZXR1cm4gMTggKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHJhZGl1c1xyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSB7XHJcbiAgICByZXR1cm4gMTIgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IFVuaXZlcnNlXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtVbml2ZXJzZX1cclxuICAgKi9cclxuICBnZXRVbml2ZXJzZSgpIHtcclxuICAgIHJldHVybiB0aGlzLiN1bml2ZXJzZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IEFzY2VuZGF0IHNoaWZ0XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0QXNjZW5kYW50U2hpZnQoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMuI2RhdGE/LmN1c3BzWzBdPy5hbmdsZSA/PyAwKSArIFV0aWxzLkRFR18xODBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xyXG4gICAgaWYoIXRoaXMuI2RhdGEpe1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBmcm9tUG9pbnRzID0gZnJvbVBvaW50cyA/PyB0aGlzLiNkYXRhLnBvaW50c1xyXG4gICAgdG9Qb2ludHMgPSB0b1BvaW50cyA/PyBbLi4udGhpcy4jZGF0YS5wb2ludHMsIHtuYW1lOlwiQVNcIiwgYW5nbGU6dGhpcy4jZGF0YS5jdXNwcy5hdCgwKX0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6dGhpcy4jZGF0YS5jdXNwcy5hdCgzKX0sIHtuYW1lOlwiRFNcIiwgYW5nbGU6dGhpcy4jZGF0YS5jdXNwcy5hdCg2KX0sIHtuYW1lOlwiTUNcIiwgYW5nbGU6dGhpcy4jZGF0YS5jdXNwcy5hdCg5KX1dXHJcbiAgICBhc3BlY3RzID0gYXNwZWN0cyA/PyB0aGlzLiNzZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFMgPz8gRGVmYXVsdFNldHRpbmdzLkRFRkFVTFRfQVNQRUNUU1xyXG5cclxuICAgIHJldHVybiBBc3BlY3RVdGlscy5nZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKS5maWx0ZXIoIGFzcGVjdCA9PiBhc3BlY3QuZnJvbS5uYW1lICE9IGFzcGVjdC50by5uYW1lKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhdyBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGRyYXdBc3BlY3RzKCBmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cyApe1xyXG4gICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiN1bml2ZXJzZS5nZXRBc3BlY3RzRWxlbWVudCgpXHJcbiAgICBVdGlscy5jbGVhblVwKGFzcGVjdHNXcmFwcGVyLmdldEF0dHJpYnV0ZShcImlkXCIpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcclxuXHJcbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcclxuICAgICAgLnJlZHVjZSggKGFyciwgYXNwZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZSggZWxtID0+IHtcclxuICAgICAgICAgIHJldHVybiBlbG0uZnJvbS5uYW1lID09IGFzcGVjdC50by5uYW1lICYmIGVsbS50by5uYW1lID09IGFzcGVjdC5mcm9tLm5hbWVcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiggIWlzVGhlU2FtZSApe1xyXG4gICAgICAgICAgYXJyLnB1c2goYXNwZWN0KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgICB9LCBbXSlcclxuICAgICAgLmZpbHRlciggYXNwZWN0ID0+ICBhc3BlY3QuYXNwZWN0Lm5hbWUgIT0gJ0Nvbmp1bmN0aW9uJylcclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCB0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0JBQ0tHUk9VTkRfQ09MT1IpXHJcbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXHJcblxyXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoIEFzcGVjdFV0aWxzLmRyYXdBc3BlY3RzKHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbiAgLypcclxuICAgKiBEcmF3IHJhZGl4IGNoYXJ0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKi9cclxuICAjZHJhdyhkYXRhKSB7XHJcbiAgICBVdGlscy5jbGVhblVwKHRoaXMuI3Jvb3QuZ2V0QXR0cmlidXRlKCdpZCcpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcclxuICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcclxuICAgIHRoaXMuI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpXHJcbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxyXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxyXG4gICAgdGhpcy4jZHJhd0N1c3BzKGRhdGEpXHJcbiAgICB0aGlzLiNzZXR0aW5ncy5DSEFSVF9EUkFXX01BSU5fQVhJUyAmJiB0aGlzLiNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKVxyXG4gICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxyXG4gICAgdGhpcy4jc2V0dGluZ3MuRFJBV19BU1BFQ1RTICYmIHRoaXMuZHJhd0FzcGVjdHMoKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdCYWNrZ3JvdW5kKCkge1xyXG4gICAgY29uc3QgTUFTS19JRCA9IGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH0tYmFja2dyb3VuZC1tYXNrLTFgXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBtYXNrID0gU1ZHVXRpbHMuU1ZHTWFzayhNQVNLX0lEKVxyXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcclxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcclxuICAgIG1hc2suYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXHJcblxyXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcclxuICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG1hc2spXHJcblxyXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuUExBTkVUU19CQUNLR1JPVU5EX0NPTE9SKTtcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcclxuICAgIGNvbnN0IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlMgPSAxMlxyXG4gICAgY29uc3QgU1RFUCA9IDMwIC8vZGVncmVlXHJcbiAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxyXG4gICAgY29uc3QgU1lNQk9MX1NJR05TID0gW1NWR1V0aWxzLlNZTUJPTF9BUklFUywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSSwgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUiwgU1ZHVXRpbHMuU1lNQk9MX0xFTywgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPLCBTVkdVdGlscy5TWU1CT0xfTElCUkEsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk4sIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU11cclxuXHJcbiAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XHJcbiAgICAgIGxldCBwb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkpIC8gMiksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlSW5EZWdyZWUgKyBTVEVQIC8gMiwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSlcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9TSUdOU19GT05UX1NJWkUpO1xyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5TSUdOX0NPTE9SU1tzeW1ib2xJbmRleF0gPz8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU0lHTlNfQ09MT1IpO1xyXG4gICAgICByZXR1cm4gc3ltYm9sXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcclxuICAgICAgbGV0IGExID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVGcm9tSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcclxuICAgICAgbGV0IGEyID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVUb0luRGVncmVlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpXHJcbiAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCksIGExLCBhMiwgdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKTtcclxuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcclxuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IgOiBcIm5vbmVcIik7XHJcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XHJcbiAgICAgIHJldHVybiBzZWdtZW50XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSAwXHJcbiAgICBsZXQgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcclxuXHJcbiAgICAgIGxldCBzZWdtZW50ID0gbWFrZVNlZ21lbnQoaSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XHJcblxyXG4gICAgICBsZXQgc3ltYm9sID0gbWFrZVN5bWJvbChpLCBzdGFydEFuZ2xlKVxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcblxyXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVA7XHJcbiAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAjZHJhd1J1bGVyKCkge1xyXG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcclxuICAgIGNvbnN0IFNURVAgPSA1XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xyXG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXHJcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgKGkgJSAyKSA/IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSA6IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSk7XHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgLypcclxuICAgKiBEcmF3IHBvaW50c1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxyXG4gICAqL1xyXG4gICNkcmF3UG9pbnRzKGRhdGEpIHtcclxuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFV0aWxzLmNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpKVxyXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSwgY3VzcHMsIHRoaXMuI3NldHRpbmdzKVxyXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIC8vIHJ1bGVyIG1hcmtcclxuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXHJcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xyXG5cclxuICAgICAgLy8gc3ltYm9sXHJcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCBVdGlscy5ERUdfMCwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XKVxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1BPSU5UU19GT05UX1NJWkUpXHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xyXG5cclxuICAgICAgLy8gcG9pbnRlclxyXG4gICAgICAvL2lmIChwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSAhPSBwb2ludERhdGEucG9zaXRpb24pIHtcclxuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcclxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xyXG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogRHJhdyBwb2ludHNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcclxuICAgKi9cclxuICAjZHJhd0N1c3BzKGRhdGEpIHtcclxuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCBtYWluQXhpc0luZGV4ZXMgPSBbMCwgMywgNiwgOV0gLy9BcywgSWMsIERzLCBNY1xyXG5cclxuICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyAxMClcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3BzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICBjb25zdCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA9ICF0aGlzLiNzZXR0aW5ncy5DSEFSVF9BTExPV19IT1VTRV9PVkVSTEFQICYmIFV0aWxzLmlzQ29sbGlzaW9uKGN1c3BzW2ldLmFuZ2xlLCBwb2ludHNQb3NpdGlvbnMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMgLyAyKVxyXG5cclxuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBjb25zdCBzdGFydEN1c3AgPSBjdXNwc1tpXS5hbmdsZVxyXG4gICAgICBjb25zdCBlbmRDdXNwID0gY3VzcHNbKGkgKyAxKSAlIDEyXS5hbmdsZVxyXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxyXG4gICAgICBjb25zdCB0ZXh0QW5nbGUgPSBzdGFydEN1c3AgKyBnYXAgLyAyXHJcblxyXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXHJcbiAgICAgIGNvbnN0IHRleHQgPSBTVkdVdGlscy5TVkdUZXh0KHRleHRQb3MueCwgdGV4dFBvcy55LCBgJHtpKzF9YClcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9IT1VTRV9GT05UX1NJWkUpXHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IpXHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIERyYXcgbWFpbiBheGlzIGRlc2NyaXRpb25cclxuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxyXG4gICAqL1xyXG4gICNkcmF3TWFpbkF4aXNEZXNjcmlwdGlvbihkYXRhKSB7XHJcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXHJcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcclxuXHJcbiAgICBjb25zdCBheGlzTGlzdCA9IFt7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1swXS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1szXS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxyXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s5XS5hbmdsZVxyXG4gICAgICB9LFxyXG4gICAgXVxyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XHJcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuICAgICAgbGV0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xyXG5cclxuICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBsZXQgc3ltYm9sO1xyXG4gICAgICBsZXQgU0hJRlRfWCA9IDA7XHJcbiAgICAgIGxldCBTSElGVF9ZID0gMDtcclxuICAgICAgY29uc3QgU1RFUCA9IDJcclxuICAgICAgc3dpdGNoIChheGlzLm5hbWUpIHtcclxuICAgICAgICBjYXNlIFwiQXNcIjpcclxuICAgICAgICAgIFNISUZUX1ggLT0gU1RFUFxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRHNcIjpcclxuICAgICAgICAgIFNISUZUX1ggKz0gU1RFUFxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXHJcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJNY1wiOlxyXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC10b3BcIilcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJJY1wiOlxyXG4gICAgICAgICAgU0hJRlRfWSArPSBTVEVQXHJcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcclxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBheGlzIG5hbWUuXCIpXHJcbiAgICAgIH1cclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9BWElTX0ZPTlRfU0laRSk7XHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fQVhJU19DT0xPUik7XHJcblxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgI2RyYXdCb3JkZXJzKCkge1xyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkpXHJcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcclxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxyXG5cclxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSlcclxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xyXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXHJcblxyXG4gICAgY29uc3QgY2VudGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXHJcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XHJcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgUmFkaXhDaGFydCBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCJpbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XHJcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XHJcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xyXG5pbXBvcnQgQXNwZWN0VXRpbHMgZnJvbSAnLi4vdXRpbHMvQXNwZWN0VXRpbHMuanMnO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xyXG5pbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XHJcblxyXG4vKipcclxuICogQGNsYXNzXHJcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgZnJvbSBvdXRzaWRlIHRoZSBVbml2ZXJzZS5cclxuICogQHB1YmxpY1xyXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XHJcbiAqL1xyXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XHJcblxyXG4gIC8qXHJcbiAgICogTGV2ZWxzIGRldGVybWluZSB0aGUgd2lkdGggb2YgaW5kaXZpZHVhbCBwYXJ0cyBvZiB0aGUgY2hhcnQuXHJcbiAgICogSXQgY2FuIGJlIGNoYW5nZWQgZHluYW1pY2FsbHkgYnkgcHVibGljIHNldHRlci5cclxuICAgKi9cclxuICAjbnVtYmVyT2ZMZXZlbHMgPSAzMlxyXG5cclxuICAjcmFkaXhcclxuICAjc2V0dGluZ3NcclxuICAjcm9vdFxyXG4gICNkYXRhXHJcblxyXG4gICNjZW50ZXJYXHJcbiAgI2NlbnRlcllcclxuICAjcmFkaXVzXHJcblxyXG4gIC8qXHJcbiAgICogQHNlZSBVdGlscy5jbGVhblVwKClcclxuICAgKi9cclxuICAjYmVmb3JlQ2xlYW5VcEhvb2tcclxuXHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocmFkaXgpIHtcclxuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gcmFkaXguJylcclxuICAgIH1cclxuXHJcbiAgICBzdXBlcihyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKCkpXHJcblxyXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxyXG4gICAgdGhpcy4jc2V0dGluZ3MgPSB0aGlzLiNyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKClcclxuICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxyXG4gICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXHJcblxyXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlRSQU5TSVRfSUR9YClcclxuICAgIHRoaXMuI3JhZGl4LmdldFVuaXZlcnNlKCkuZ2V0U1ZHRG9jdW1lbnQoKS5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGNoYXJ0IGRhdGFcclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxyXG4gICAqL1xyXG4gIHNldERhdGEoZGF0YSkge1xyXG4gICAgbGV0IHN0YXR1cyA9IHRoaXMudmFsaWRhdGVEYXRhKGRhdGEpXHJcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNkYXRhID0gZGF0YVxyXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgZGF0YVxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICBnZXREYXRhKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBcInBvaW50c1wiOlsuLi50aGlzLiNkYXRhLnBvaW50c10sXHJcbiAgICAgIFwiY3VzcHNcIjpbLi4udGhpcy4jZGF0YS5jdXNwc11cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCByYWRpdXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFJhZGl1cygpIHtcclxuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xyXG4gICAgaWYoIXRoaXMuI2RhdGEpe1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBmcm9tUG9pbnRzID0gZnJvbVBvaW50cyA/PyB0aGlzLiNkYXRhLnBvaW50c1xyXG4gICAgdG9Qb2ludHMgPSB0b1BvaW50cyA/PyBbLi4udGhpcy4jcmFkaXguZ2V0RGF0YSgpLnBvaW50cywge25hbWU6XCJBU1wiLCBhbmdsZTp0aGlzLiNyYWRpeC5nZXREYXRhKCkuY3VzcHMuYXQoMCl9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOnRoaXMuI3JhZGl4LmdldERhdGEoKS5jdXNwcy5hdCgzKX0sIHtuYW1lOlwiRFNcIiwgYW5nbGU6dGhpcy4jcmFkaXguZ2V0RGF0YSgpLmN1c3BzLmF0KDYpfSwge25hbWU6XCJNQ1wiLCBhbmdsZTp0aGlzLiNyYWRpeC5nZXREYXRhKCkuY3VzcHMuYXQoOSl9XVxyXG4gICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gdGhpcy4jc2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTID8/IERlZmF1bHRTZXR0aW5ncy5ERUZBVUxUX0FTUEVDVFNcclxuXHJcbiAgICByZXR1cm4gQXNwZWN0VXRpbHMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYXcgYXNwZWN0c1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cclxuICAgKi9cclxuICBkcmF3QXNwZWN0cyggZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMgKXtcclxuICAgIGNvbnN0IGFzcGVjdHNXcmFwcGVyID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRBc3BlY3RzRWxlbWVudCgpXHJcbiAgICBVdGlscy5jbGVhblVwKGFzcGVjdHNXcmFwcGVyLmdldEF0dHJpYnV0ZShcImlkXCIpLCB0aGlzLiNiZWZvcmVDbGVhblVwSG9vaylcclxuXHJcbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcclxuICAgICAgLmZpbHRlciggYXNwZWN0ID0+ICBhc3BlY3QuYXNwZWN0Lm5hbWUgIT0gJ0Nvbmp1bmN0aW9uJylcclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXguZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy4jc2V0dGluZ3MuQVNQRUNUU19CQUNLR1JPVU5EX0NPTE9SKVxyXG4gICAgYXNwZWN0c1dyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxyXG4gICAgXHJcbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZCggQXNwZWN0VXRpbHMuZHJhd0FzcGVjdHModGhpcy4jcmFkaXguZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCksIHRoaXMuI3NldHRpbmdzLCBhc3BlY3RzTGlzdCkpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcblxyXG4gIC8qXHJcbiAgICogRHJhdyByYWRpeCBjaGFydFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgI2RyYXcoZGF0YSkge1xyXG5cclxuICAgIC8vIHJhZGl4IHJlRHJhd1xyXG4gICAgVXRpbHMuY2xlYW5VcCh0aGlzLiNyb290LmdldEF0dHJpYnV0ZSgnaWQnKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXHJcbiAgICB0aGlzLiNyYWRpeC5zZXROdW1iZXJPZkxldmVscyh0aGlzLiNudW1iZXJPZkxldmVscylcclxuXHJcbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxyXG4gICAgdGhpcy4jZHJhd0N1c3BzKGRhdGEpXHJcbiAgICB0aGlzLiNkcmF3UG9pbnRzKGRhdGEpXHJcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXHJcbiAgICB0aGlzLiNzZXR0aW5ncy5EUkFXX0FTUEVDVFMgJiYgdGhpcy5kcmF3QXNwZWN0cygpXHJcbiAgfVxyXG5cclxuICAjZHJhd1J1bGVyKCkge1xyXG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcclxuICAgIGNvbnN0IFNURVAgPSA1XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KClcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcclxuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcclxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCAoaSAlIDIpID8gdGhpcy5nZXRSYWRpdXMoKSAtICgodGhpcy5nZXRSYWRpdXMoKSAtIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDIpIDogdGhpcy5nZXRSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XHJcblxyXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogRHJhdyBwb2ludHNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcclxuICAgKi9cclxuICAjZHJhd1BvaW50cyhkYXRhKSB7XHJcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xyXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIHRoaXMuI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkpXHJcbiAgICBmb3IgKGNvbnN0IHBvaW50RGF0YSBvZiBwb2ludHMpIHtcclxuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXHJcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gNCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG5cclxuICAgICAgLy8gcnVsZXIgbWFya1xyXG4gICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxyXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xyXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcclxuXHJcbiAgICAgIC8vIHN5bWJvbFxyXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSwgVXRpbHMuREVHXzAsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPVylcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX1BPSU5UU19GT05UX1NJWkUpXHJcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBMQU5FVF9DT0xPUlNbcG9pbnREYXRhLm5hbWVdID8/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xyXG5cclxuICAgICAgLy8gcG9pbnRlclxyXG4gICAgICAvL2lmIChwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSAhPSBwb2ludERhdGEucG9zaXRpb24pIHtcclxuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxyXG4gICAgICBjb25zdCBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxyXG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XHJcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgLypcclxuICAgKiBEcmF3IHBvaW50c1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxyXG4gICAqL1xyXG4gICNkcmF3Q3VzcHMoZGF0YSkge1xyXG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcclxuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xyXG5cclxuICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xyXG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNilcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gIXRoaXMuI3NldHRpbmdzLkNIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgJiYgVXRpbHMuaXNDb2xsaXNpb24oY3VzcHNbaV0uYW5nbGUsIHBvaW50c1Bvc2l0aW9ucywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUyAvIDIpXHJcblxyXG4gICAgICBjb25zdCBzdGFydFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA/IHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpICsgKCh0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDYpIDogdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuXHJcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvcy54LCBlbmRQb3MueSlcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcclxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xyXG5cclxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcclxuICAgICAgY29uc3QgZW5kQ3VzcCA9IGN1c3BzWyhpICsgMSkgJSAxMl0uYW5nbGVcclxuICAgICAgY29uc3QgZ2FwID0gZW5kQ3VzcCAtIHN0YXJ0Q3VzcCA+IDAgPyBlbmRDdXNwIC0gc3RhcnRDdXNwIDogZW5kQ3VzcCAtIHN0YXJ0Q3VzcCArIFV0aWxzLkRFR18zNjBcclxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxyXG5cclxuICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLiNyYWRpeC5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcclxuICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2krMX1gKVxyXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxyXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0hPVVNFX0ZPTlRfU0laRSlcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0hPVVNFX05VTUJFUl9DT0xPUilcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcclxuICB9XHJcblxyXG4gICNkcmF3Qm9yZGVycygpIHtcclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcclxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xyXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXHJcblxyXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgI2dldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xyXG4gICAgcmV0dXJuIDI5ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcclxuICB9XHJcblxyXG4gICNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSB7XHJcbiAgICByZXR1cm4gMzEgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxyXG4gIH1cclxuXHJcbiAgI2dldENlbnRlckNpcmNsZVJhZGl1cygpIHtcclxuICAgIHJldHVybiAyNCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBUcmFuc2l0Q2hhcnQgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBSZXByZXNlbnRzIGEgcGxhbmV0IG9yIHBvaW50IG9mIGludGVyZXN0IGluIHRoZSBjaGFydFxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jbGFzcyBQb2ludCB7XHJcblxyXG4gICNuYW1lXHJcbiAgI2FuZ2xlXHJcbiAgI2lzUmV0cm9ncmFkZVxyXG4gICNjdXNwc1xyXG4gICNzZXR0aW5nc1xyXG5cclxuICAvKipcclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludERhdGEgLSB7bmFtZTpTdHJpbmcsIGFuZ2xlOk51bWJlciwgaXNSZXRyb2dyYWRlOmZhbHNlfVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdXNwcyAtIFt7YW5nbGU6TnVtYmVyfSwge2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCAuLi5dXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocG9pbnREYXRhLCBjdXNwcywgc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuI25hbWUgPSBwb2ludERhdGEubmFtZSA/PyBcIlVua25vd25cIlxyXG4gICAgdGhpcy4jYW5nbGUgPSBwb2ludERhdGEuYW5nbGUgPz8gMFxyXG4gICAgdGhpcy4jaXNSZXRyb2dyYWRlID0gcG9pbnREYXRhLmlzUmV0cm9ncmFkZSA/PyBmYWxzZVxyXG5cclxuICAgIGlmICghQXJyYXkuaXNBcnJheShjdXNwcykgfHwgY3VzcHMubGVuZ3RoICE9IDEyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbSBjdXNwcy4gXCIpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jY3VzcHMgPSBjdXNwc1xyXG5cclxuICAgIGlmICghc2V0dGluZ3MpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gc2V0dGluZ3MuJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgbmFtZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jbmFtZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSXMgcmV0cm9ncmFkZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBpc1JldHJvZ3JhZGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4jaXNSZXRyb2dyYWRlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYW5nbGVcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRBbmdsZSgpIHtcclxuICAgIHJldHVybiB0aGlzLiNhbmdsZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHN5bWJvbFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcclxuICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbYW5nbGVTaGlmdF1cclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1Byb3BlcnRpZXNdIC0gYW5nbGVJblNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cclxuICAgKi9cclxuICBnZXRTeW1ib2woeFBvcywgeVBvcywgYW5nbGVTaGlmdCA9IDAsIGlzUHJvcGVydGllcyA9IHRydWUpIHtcclxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXHJcblxyXG4gICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI25hbWUsIHhQb3MsIHlQb3MpXHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbClcclxuXHJcbiAgICBpZiAoaXNQcm9wZXJ0aWVzID09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNoYXJ0Q2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXHJcbiAgICBjb25zdCBjaGFydENlbnRlclkgPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcclxuICAgIGNvbnN0IGFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyID0gVXRpbHMucG9zaXRpb25Ub0FuZ2xlKHhQb3MsIHlQb3MsIGNoYXJ0Q2VudGVyWCwgY2hhcnRDZW50ZXJZKVxyXG5cclxuICAgIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPV19BTkdMRSAmJiBhbmdsZUluU2lnbi5jYWxsKHRoaXMpXHJcbiAgICB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1dfUkVUUk9HUkFERSAmJiByZXRyb2dyYWRlLmNhbGwodGhpcylcclxuICAgIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPV19ESUdOSVRZICYmIHRoaXMuZ2V0RGlnbml0eSgpICYmIGRpZ25pdGllcy5jYWxsKHRoaXMpXHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXIgLy89PT09PT0+XHJcblxyXG4gICAgLypcclxuICAgICAqICBBbmdsZSBpbiBzaWduXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFuZ2xlSW5TaWduKCkge1xyXG4gICAgICBjb25zdCBhbmdsZUluU2lnblBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0FOR0xFX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXHJcbiAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRvIHJvdGF0ZSB0aGUgdGV4dCwgd2hlbiB1bmNvbW1lbnQgYSBsaW5lIGJlbGxvdy5cclxuICAgICAgLy90ZXh0V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHJvdGF0ZSgke2FuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyfSwke3RleHRQb3NpdGlvbi54fSwke3RleHRQb3NpdGlvbi55fSlgKVxyXG5cclxuICAgICAgY29uc3QgYW5nbGVJblNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChhbmdsZUluU2lnblBvc2l0aW9uLngsIGFuZ2xlSW5TaWduUG9zaXRpb24ueSwgdGhpcy5nZXRBbmdsZUluU2lnbigpKVxyXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xyXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXHJcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XHJcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xyXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFuZ2xlSW5TaWduVGV4dClcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogIFJldHJvZ3JhZGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmV0cm9ncmFkZSgpIHtcclxuICAgICAgY29uc3QgcmV0cm9ncmFkZVBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh4UG9zLCB5UG9zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfT0ZGU0VUICogdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4oLWFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyLCBhbmdsZVNoaWZ0KSlcclxuXHJcbiAgICAgIGNvbnN0IHJldHJvZ3JhZGVUZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChyZXRyb2dyYWRlUG9zaXRpb24ueCwgcmV0cm9ncmFkZVBvc2l0aW9uLnksIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXHJcbiAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcclxuICAgICAgcmV0cm9ncmFkZVRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXHJcbiAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1JFVFJPR1JBREVfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XHJcbiAgICAgIHJldHJvZ3JhZGVUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocmV0cm9ncmFkZVRleHQpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqICBEaWduaXRpZXNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGlnbml0aWVzKCkge1xyXG4gICAgICBjb25zdCBkaWduaXRpZXNQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX09GRlNFVCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXHJcbiAgICAgIGNvbnN0IGRpZ25pdGllc1RleHQgPSBTVkdVdGlscy5TVkdUZXh0KGRpZ25pdGllc1Bvc2l0aW9uLngsIGRpZ25pdGllc1Bvc2l0aW9uLnksIHRoaXMuZ2V0RGlnbml0eSgpKVxyXG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKTtcclxuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcclxuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU0laRSB8fCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XHJcbiAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0NPTE9SKTtcclxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkaWduaXRpZXNUZXh0KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGhvdXNlIG51bWJlclxyXG4gICAqXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldEhvdXNlTnVtYmVyKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldC5cIilcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBzaWduIG51bWJlclxyXG4gICAqIEFyaXNlID0gMSwgVGF1cnVzID0gMiwgLi4uUGlzY2VzID0gMTJcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRTaWduTnVtYmVyKCkge1xyXG4gICAgbGV0IGFuZ2xlID0gdGhpcy4jYW5nbGUgJSBVdGlscy5ERUdfMzYwXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoYW5nbGUgLyAzMCkgKyAxKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGFuZ2xlIChJbnRlZ2VyKSBpbiB0aGUgc2lnbiBpbiB3aGljaCBpdCBzdGFuZHMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0QW5nbGVJblNpZ24oKSB7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLiNhbmdsZSAlIDMwKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGRpZ25pdHkgc3ltYm9sIChyIC0gcnVsZXJzaGlwLCBkIC0gZGV0cmltZW50LCBmIC0gZmFsbCwgZSAtIGV4YWx0YXRpb24pXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gZGlnbml0eSBzeW1ib2wgKHIsZCxmLGUpXHJcbiAgICovXHJcbiAgZ2V0RGlnbml0eSgpIHtcclxuICAgIGNvbnN0IEFSSUVTID0gMVxyXG4gICAgY29uc3QgVEFVUlVTID0gMlxyXG4gICAgY29uc3QgR0VNSU5JID0gM1xyXG4gICAgY29uc3QgQ0FOQ0VSID0gNFxyXG4gICAgY29uc3QgTEVPID0gNVxyXG4gICAgY29uc3QgVklSR08gPSA2XHJcbiAgICBjb25zdCBMSUJSQSA9IDdcclxuICAgIGNvbnN0IFNDT1JQSU8gPSA4XHJcbiAgICBjb25zdCBTQUdJVFRBUklVUyA9IDlcclxuICAgIGNvbnN0IENBUFJJQ09STiA9IDEwXHJcbiAgICBjb25zdCBBUVVBUklVUyA9IDExXHJcbiAgICBjb25zdCBQSVNDRVMgPSAxMlxyXG5cclxuICAgIGNvbnN0IFJVTEVSU0hJUF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1swXTtcclxuICAgIGNvbnN0IERFVFJJTUVOVF9TWU1CT0wgPSB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0RJR05JVFlfU1lNQk9MU1sxXTtcclxuICAgIGNvbnN0IEVYQUxUQVRJT05fU1lNQk9MID0gdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX1NZTUJPTFNbMl07XHJcbiAgICBjb25zdCBGQUxMX1NZTUJPTCA9IHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTWzNdO1xyXG5cclxuICAgIHN3aXRjaCAodGhpcy4jbmFtZSkge1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExFTykge1xyXG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XHJcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVJJRVMpIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NT09OOlxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcclxuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xyXG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gR0VNSU5JKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQUdJVFRBUklVUykge1xyXG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVklSR08pIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiXCJcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcclxuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XHJcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBTkNFUikge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0FHSVRUQVJJVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBHRU1JTkkgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVklSR08pIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBTkNFUikge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4gfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcclxuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBTkNFUiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcclxuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcclxuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiXCJcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcclxuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExFTykge1xyXG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xyXG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCJcIlxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XHJcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xyXG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0FHSVRUQVJJVVMgfHwgdGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTEVPKSB7XHJcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xyXG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMSUJSQSkge1xyXG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XHJcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBcIlwiXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gIFBvaW50IGFzXHJcbiAgZGVmYXVsdFxyXG59XHJcbiIsImltcG9ydCAqIGFzIFVuaXZlcnNlIGZyb20gXCIuL2NvbnN0YW50cy9Vbml2ZXJzZS5qc1wiXHJcbmltcG9ydCAqIGFzIFJhZGl4IGZyb20gXCIuL2NvbnN0YW50cy9SYWRpeC5qc1wiXHJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxyXG5pbXBvcnQgKiBhcyBQb2ludCBmcm9tIFwiLi9jb25zdGFudHMvUG9pbnQuanNcIlxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSBcIi4vY29uc3RhbnRzL0NvbG9ycy5qc1wiXHJcbmltcG9ydCAqIGFzIEFzcGVjdHMgZnJvbSBcIi4vY29uc3RhbnRzL0FzcGVjdHMuanNcIlxyXG5cclxuY29uc3QgU0VUVElOR1MgPSBPYmplY3QuYXNzaWduKHt9LCBVbml2ZXJzZSwgUmFkaXgsIFRyYW5zaXQsIFBvaW50LCBDb2xvcnMsIEFzcGVjdHMpO1xyXG5cclxuZXhwb3J0IHtcclxuICBTRVRUSU5HUyBhc1xyXG4gIGRlZmF1bHRcclxufVxyXG4iLCIvKlxyXG4qIEFzcGVjdHMgd3JhcHBlciBlbGVtZW50IElEXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCBhc3BlY3RzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBBU1BFQ1RTX0lEID0gXCJhc3BlY3RzXCJcclxuXHJcbi8qXHJcbiogRHJhdyBhc3BlY3RzIGludG8gY2hhcnQgZHVyaW5nIHJlbmRlclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtCb29sZWFufVxyXG4qIEBkZWZhdWx0IHRydWVcclxuKi9cclxuZXhwb3J0IGNvbnN0IERSQVdfQVNQRUNUUyA9IHRydWVcclxuXHJcbi8qXHJcbiogRm9udCBzaXplIC0gYXNwZWN0c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMjdcclxuKi9cclxuZXhwb3J0IGNvbnN0IEFTUEVDVFNfRk9OVF9TSVpFID0gMThcclxuXHJcbi8qKlxyXG4qIERlZmF1bHQgYXNwZWN0c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtBcnJheX1cclxuKi9cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQVNQRUNUUyA9IFtcclxuICB7bmFtZTpcIkNvbmp1bmN0aW9uXCIsIGFuZ2xlOjAsIG9yYjoyfSxcclxuICB7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sXHJcbiAge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfSxcclxuICB7bmFtZTpcIlNxdWFyZVwiLCBhbmdsZTo5MCwgb3JiOjJ9XHJcbl1cclxuIiwiLyoqXHJcbiogQ2hhcnQgYmFja2dyb3VuZCBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgI2ZmZlxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwibm9uZVwiO1xyXG5cclxuLyoqXHJcbiogUGxhbmV0cyBiYWNrZ3JvdW5kIGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjZmZmXHJcbiovXHJcbmV4cG9ydCBjb25zdCBQTEFORVRTX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIiNmZmZcIjtcclxuXHJcbi8qKlxyXG4qIEFzcGVjdHMgYmFja2dyb3VuZCBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgI2ZmZlxyXG4qL1xyXG5leHBvcnQgY29uc3QgQVNQRUNUU19CQUNLR1JPVU5EX0NPTE9SID0gXCIjZWVlXCI7XHJcblxyXG4vKlxyXG4qIERlZmF1bHQgY29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMzMzNcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xyXG5cclxuLypcclxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzMzM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfTElORV9DT0xPUiA9IFwiIzY2NlwiO1xyXG5cclxuLypcclxuKiBEZWZhdWx0IGNvbG9yIG9mIHRleHQgaW4gY2hhcnRzXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjMzMzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9URVhUX0NPTE9SID0gXCIjYmJiXCI7XHJcblxyXG4vKlxyXG4qIERlZmF1bHQgY29sb3Igb2YgY3VzcHMgbnVtYmVyXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjMzMzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9IT1VTRV9OVU1CRVJfQ09MT1IgPSBcIiMzMzNcIjtcclxuXHJcbi8qXHJcbiogRGVmYXVsdCBjb2xvciBvZiBtcWluIGF4aXMgLSBBcywgRHMsIE1jLCBJY1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzAwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9BWElTX0NPTE9SID0gXCIjMDAwXCI7XHJcblxyXG4vKlxyXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICMwMDBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMzMzXCI7XHJcblxyXG4vKlxyXG4qIERlZmF1bHQgY29sb3Igb2YgcGxhbmV0cyBvbiB0aGUgY2hhcnQgKFN1biBzeW1ib2wsIE1vb24gc3ltYm9sLCAuLi4pXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjMDAwXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVFNfQ09MT1IgPSBcIiMwMDBcIjtcclxuXHJcbi8qXHJcbiogRGVmYXVsdCBjb2xvciBmb3IgcG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzMzM1xyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19DT0xPUiA9IFwiIzMzM1wiXHJcblxyXG4vKlxyXG4qIEFyaWVzIGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjRkY0NTAwXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDT0xPUl9BUklFUyA9IFwiI0ZGNDUwMFwiO1xyXG5cclxuLypcclxuKiBUYXVydXMgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICM4QjQ1MTNcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX1RBVVJVUyA9IFwiIzhCNDUxM1wiO1xyXG5cclxuLypcclxuKiBHZW1pbnkgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICM4N0NFRUJcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XHJcblxyXG4vKlxyXG4qIENhbmNlciBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzI3QUU2MFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FOQ0VSID0gXCIjMjdBRTYwXCI7XHJcblxyXG4vKlxyXG4qIExlbyBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgI0ZGNDUwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfTEVPID0gXCIjRkY0NTAwXCI7XHJcblxyXG4vKlxyXG4qIFZpcmdvIGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjOEI0NTEzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xyXG5cclxuLypcclxuKiBMaWJyYSBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzg3Q0VFQlxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfTElCUkEgPSBcIiM4N0NFRUJcIjtcclxuXHJcbi8qXHJcbiogU2NvcnBpbyBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzI3QUU2MFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfU0NPUlBJTyA9IFwiIzI3QUU2MFwiO1xyXG5cclxuLypcclxuKiBTYWdpdHRhcml1cyBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgI0ZGNDUwMFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcclxuXHJcbi8qXHJcbiogQ2Fwcmljb3JuIGNvbG9yXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjOEI0NTEzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDT0xPUl9DQVBSSUNPUk4gPSBcIiM4QjQ1MTNcIjtcclxuXHJcbi8qXHJcbiogQXF1YXJpdXMgY29sb3JcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0ICM4N0NFRUJcclxuKi9cclxuZXhwb3J0IGNvbnN0IENPTE9SX0FRVUFSSVVTID0gXCIjODdDRUVCXCI7XHJcblxyXG4vKlxyXG4qIFBpc2NlcyBjb2xvclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgIzI3QUU2MFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XHJcblxyXG4vKlxyXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdCAjMzMzXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcclxuXHJcbi8qXHJcbiogQ29sb3Igb2YgYXNwZWN0c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtPYmplY3R9XHJcbiovXHJcbmV4cG9ydCBjb25zdCBBU1BFQ1RfQ09MT1JTID0ge1xyXG4gIENvbmp1bmN0aW9uOlwiIzMzM1wiLFxyXG4gIE9wcG9zaXRpb246XCIjMUI0RjcyXCIsXHJcbiAgU3F1YXJlOlwiIzY0MUUxNlwiLFxyXG4gIFRyaW5lOlwiIzBCNTM0NVwiLFxyXG4gIFNleHRpbGU6XCIjMzMzXCIsXHJcbiAgUXVpbmN1bng6XCIjMzMzXCIsXHJcbiAgU2VtaXNleHRpbGU6XCIjMzMzXCIsXHJcbiAgUXVpbnRpbGU6XCIjMzMzXCIsXHJcbiAgVHJpb2N0aWxlOlwiIzMzM1wiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPdmVycmlkZSBpbmRpdmlkdWFsIHBsYW5ldCBzeW1ib2wgY29sb3JzIGJ5IHBsYW5ldCBuYW1lXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgUExBTkVUX0NPTE9SUyA9IHtcclxuICAvL1N1bjogXCIjMDAwXCIsXHJcbiAgLy9Nb29uOiBcIiNhYWFcIixcclxufVxyXG5cclxuLyoqXHJcbiAqIG92ZXJyaWRlIGluZGl2aWR1YWwgc2lnbiBzeW1ib2wgY29sb3JzIGJ5IHpvZGlhYyBpbmRleFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFNJR05fQ09MT1JTID0ge1xyXG4gIC8vMDogXCIjMzMzXCJcclxufVxyXG4iLCIvKlxyXG4qIFBvaW50IHByb3BlcnRpZXMgLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Qm9vbGVhbn1cclxuKiBAZGVmYXVsdCB0cnVlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1cgPSB0cnVlXHJcblxyXG4vKlxyXG4qIFBvaW50IGFuZ2xlIGluIHNpZ25cclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Qm9vbGVhbn1cclxuKiBAZGVmYXVsdCB0cnVlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX1NIT1dfQU5HTEUgPSB0cnVlXHJcblxyXG4vKlxyXG4qIFBvaW50IGRpZ25pdHkgc3ltYm9sXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge0Jvb2xlYW59XHJcbiogQGRlZmF1bHQgdHJ1ZVxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XX0RJR05JVFkgPSB0cnVlXHJcblxyXG4vKlxyXG4qIFBvaW50IHJldHJvZ3JhZGUgc3ltYm9sXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge0Jvb2xlYW59XHJcbiogQGRlZmF1bHQgdHJ1ZVxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XX1JFVFJPR1JBREUgPSB0cnVlXHJcblxyXG4vKlxyXG4qIFBvaW50IGRpZ25pdHkgc3ltYm9scyAtIFtkb21pY2lsZSwgZGV0cmltZW50LCBleGFsdGF0aW9uLCBmYWxsXVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtCb29sZWFufVxyXG4qIEBkZWZhdWx0IHRydWVcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TWU1CT0xTID0gW1wiclwiLCBcImRcIiwgXCJlXCIsIFwiZlwiXTtcclxuXHJcbi8qXHJcbiogVGV4dCBzaXplIG9mIFBvaW50IGRlc2NyaXB0aW9uIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCA2XHJcbiovXHJcbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSA9IDE2XHJcblxyXG4vKlxyXG4qIFRleHQgc2l6ZSBvZiBhbmdsZSBudW1iZXJcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDZcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQU5HTEVfU0laRSA9IDI1XHJcblxyXG4vKlxyXG4qIFRleHQgc2l6ZSBvZiByZXRyb2dyYWRlIHN5bWJvbFxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgNlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX1NJWkUgPSAyNVxyXG5cclxuLypcclxuKiBUZXh0IHNpemUgb2YgZGlnbml0eSBzeW1ib2xcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDZcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRElHTklUWV9TSVpFID0gMTJcclxuXHJcbi8qXHJcbiogQW5nbGUgb2Zmc2V0IG11bHRpcGxpZXJcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDZcclxuKi9cclxuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQU5HTEVfT0ZGU0VUID0gMlxyXG5cclxuLypcclxuKiBSZXRyb2dyYWRlIHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgNlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19SRVRST0dSQURFX09GRlNFVCA9IDMuNVxyXG5cclxuLypcclxuKiBEaWduaXR5IHN5bWJvbCBvZmZzZXQgbXVsdGlwbGllclxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgNlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19ESUdOSVRZX09GRlNFVCA9IDVcclxuXHJcbi8qKlxyXG4qIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMlxyXG4qL1xyXG5leHBvcnQgY29uc3QgUE9JTlRfQ09MTElTSU9OX1JBRElVUyA9IDEyXHJcbiIsIi8qXHJcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtTdHJpbmd9XHJcbiogQGRlZmF1bHQgcmFkaXhcclxuKi9cclxuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXHJcblxyXG4vKlxyXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDI3XHJcbiovXHJcbmV4cG9ydCBjb25zdCBSQURJWF9QT0lOVFNfRk9OVF9TSVpFID0gMjdcclxuXHJcbi8qXHJcbiogRm9udCBzaXplIC0gaG91c2UgY3VzcCBudW1iZXJcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDI3XHJcbiovXHJcbmV4cG9ydCBjb25zdCBSQURJWF9IT1VTRV9GT05UX1NJWkUgPSAyMFxyXG5cclxuLypcclxuKiBGb250IHNpemUgLSBzaWduc1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMjdcclxuKi9cclxuZXhwb3J0IGNvbnN0IFJBRElYX1NJR05TX0ZPTlRfU0laRSA9IDI3XHJcblxyXG4vKlxyXG4qIEZvbnQgc2l6ZSAtIGF4aXMgKEFzLCBEcywgTWMsIEljKVxyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMjRcclxuKi9cclxuZXhwb3J0IGNvbnN0IFJBRElYX0FYSVNfRk9OVF9TSVpFID0gMzJcclxuIiwiLypcclxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7U3RyaW5nfVxyXG4qIEBkZWZhdWx0IHRyYW5zaXRcclxuKi9cclxuZXhwb3J0IGNvbnN0IFRSQU5TSVRfSUQgPSBcInRyYW5zaXRcIlxyXG5cclxuLypcclxuKiBGb250IHNpemUgLSBwb2ludHMgKHBsYW5ldHMpXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCAzMlxyXG4qL1xyXG5leHBvcnQgY29uc3QgVFJBTlNJVF9QT0lOVFNfRk9OVF9TSVpFID0gMjdcclxuIiwiLyoqXHJcbiogQ2hhcnQgcGFkZGluZ1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtOdW1iZXJ9XHJcbiogQGRlZmF1bHQgMTBweFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfUEFERElORyA9IDQwXHJcblxyXG4vKipcclxuKiBTVkcgdmlld0JveCB3aWR0aFxyXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCA4MDBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX1ZJRVdCT1hfV0lEVEggPSA4MDBcclxuXHJcbi8qKlxyXG4qIFNWRyB2aWV3Qm94IGhlaWdodFxyXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge051bWJlcn1cclxuKiBAZGVmYXVsdCA4MDBcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX1ZJRVdCT1hfSEVJR0hUID0gODAwXHJcblxyXG4vKlxyXG4qIExpbmUgc3RyZW5ndGhcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDFcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRSA9IDFcclxuXHJcbi8qXHJcbiogTGluZSBzdHJlbmd0aCBvZiB0aGUgbWFpbiBsaW5lcy4gRm9yIGluc3RhbmNlIHBvaW50cywgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7TnVtYmVyfVxyXG4qIEBkZWZhdWx0IDFcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fU1RST0tFID0gMlxyXG5cclxuLyoqXHJcbiogTm8gZmlsbCwgb25seSBzdHJva2VcclxuKiBAY29uc3RhbnRcclxuKiBAdHlwZSB7Ym9vbGVhbn1cclxuKiBAZGVmYXVsdCBmYWxzZVxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFX09OTFkgPSBmYWxzZTtcclxuXHJcbi8qKlxyXG4qIEZvbnQgZmFtaWx5XHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge1N0cmluZ31cclxuKiBAZGVmYXVsdFxyXG4qL1xyXG5leHBvcnQgY29uc3QgQ0hBUlRfRk9OVF9GQU1JTFkgPSBcIkFzdHJvbm9taWNvblwiO1xyXG5cclxuLyoqXHJcbiogQWx3YXlzIGRyYXcgdGhlIGZ1bGwgaG91c2UgbGluZXMsIGV2ZW4gaWYgaXQgb3ZlcmxhcHMgd2l0aCBwbGFuZXRzXHJcbiogQGNvbnN0YW50XHJcbiogQHR5cGUge2Jvb2xlYW59XHJcbiogQGRlZmF1bHQgZmFsc2VcclxuKi9cclxuZXhwb3J0IGNvbnN0IENIQVJUX0FMTE9XX0hPVVNFX09WRVJMQVAgPSBmYWxzZTtcclxuXHJcbi8qKlxyXG4qIERyYXcgbWFpbnMgYXhpcyBzeW1ib2xzIG91dHNpZGUgdGhlIGNoYXJ0OiBBYywgTWMsIEljLCBEY1xyXG4qIEBjb25zdGFudFxyXG4qIEB0eXBlIHtib29sZWFufVxyXG4qIEBkZWZhdWx0IGZhbHNlXHJcbiovXHJcbmV4cG9ydCBjb25zdCBDSEFSVF9EUkFXX01BSU5fQVhJUyA9IHRydWU7XHJcbiIsImltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcclxuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcclxuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xyXG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNsYXNzIFVuaXZlcnNlIHtcclxuXHJcbiAgI1NWR0RvY3VtZW50XHJcbiAgI3NldHRpbmdzXHJcbiAgI3JhZGl4XHJcbiAgI3RyYW5zaXRcclxuICAjYXNwZWN0c1dyYXBwZXJcclxuXHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEFuIG9iamVjdCB0aGF0IG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBzZXR0aW5ncyB2YWx1ZXNcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGh0bWxFbGVtZW50SUQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5vdCBmaW5kIGEgSFRNTCBlbGVtZW50IHdpdGggSUQgJyArIGh0bWxFbGVtZW50SUQpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0U2V0dGluZ3MsIG9wdGlvbnMsIHtcclxuICAgICAgSFRNTF9FTEVNRU5UX0lEOiBodG1sRWxlbWVudElEXHJcbiAgICB9KTtcclxuICAgIHRoaXMuI1NWR0RvY3VtZW50ID0gU1ZHVXRpbHMuU1ZHRG9jdW1lbnQodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKS5hcHBlbmRDaGlsZCh0aGlzLiNTVkdEb2N1bWVudCk7XHJcblxyXG4gICAgLy8gY2hhcnQgYmFja2dyb3VuZFxyXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyKVxyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0JBQ0tHUk9VTkRfQ09MT1IpXHJcbiAgICB0aGlzLiNTVkdEb2N1bWVudC5hcHBlbmRDaGlsZChjaXJjbGUpXHJcblxyXG4gICAgLy8gY3JlYXRlIHdyYXBwZXIgZm9yIGFzcGVjdHNcclxuICAgIHRoaXMuI2FzcGVjdHNXcmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxyXG4gICAgdGhpcy4jYXNwZWN0c1dyYXBwZXIuc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLkFTUEVDVFNfSUR9YClcclxuICAgIHRoaXMuI1NWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI2FzcGVjdHNXcmFwcGVyKVxyXG5cclxuICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcylcclxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI3JhZGl4KVxyXG5cclxuICAgIHRoaXMuI2xvYWRGb250KFwiQXN0cm9ub21pY29uXCIsICcuLi9hc3NldHMvZm9udHMvdHRmL0FzdHJvbm9taWNvbkZvbnRzXzEuMS9Bc3Ryb25vbWljb24udHRmJylcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gIyMgUFVCTElDICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgUmFkaXggY2hhcnRcclxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxyXG4gICAqL1xyXG4gIHJhZGl4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI3JhZGl4XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgVHJhbnNpdCBjaGFydFxyXG4gICAqIEByZXR1cm4ge1RyYW5zaXRDaGFydH1cclxuICAgKi9cclxuICB0cmFuc2l0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI3RyYW5zaXRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IHNldHRpbmdzXHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGdldFNldHRpbmdzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgcm9vdCBTVkcgZG9jdW1lbnRcclxuICAgKiBAcmV0dXJuIHtTVkdEb2N1bWVudH1cclxuICAgKi9cclxuICBnZXRTVkdEb2N1bWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLiNTVkdEb2N1bWVudFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGVtcHR5IGFzcGVjdHMgd3JhcHBlciBlbGVtZW50XHJcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxyXG4gICAqL1xyXG4gIGdldEFzcGVjdHNFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI2FzcGVjdHNXcmFwcGVyXHJcbiAgfVxyXG5cclxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG5cclxuICAvKlxyXG4gICogTG9hZCBmb25kIHRvIERPTVxyXG4gICpcclxuICAqIEBwYXJhbSB7U3RyaW5nfSBmYW1pbHlcclxuICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2VcclxuICAqIEBwYXJhbSB7T2JqZWN0fVxyXG4gICpcclxuICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZvbnRGYWNlL0ZvbnRGYWNlXHJcbiAgKi9cclxuICBhc3luYyAjbG9hZEZvbnQoIGZhbWlseSwgc291cmNlLCBkZXNjcmlwdG9ycyApe1xyXG5cclxuICAgIGlmICghKCdGb250RmFjZScgaW4gd2luZG93KSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiT29vcHMsIEZvbnRGYWNlIGlzIG5vdCBhIGZ1bmN0aW9uLlwiKVxyXG4gICAgICBjb25zb2xlLmVycm9yKFwiQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ1NTX0ZvbnRfTG9hZGluZ19BUElcIilcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZm9udCA9IG5ldyBGb250RmFjZShmYW1pbHksIGB1cmwoJHtzb3VyY2V9KWAsIGRlc2NyaXB0b3JzKVxyXG5cclxuICAgIHRyeXtcclxuICAgICAgYXdhaXQgZm9udC5sb2FkKCk7XHJcbiAgICAgIGRvY3VtZW50LmZvbnRzLmFkZChmb250KVxyXG4gICAgfWNhdGNoKGUpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgVW5pdmVyc2UgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMuanMnXHJcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL1NWR1V0aWxzLmpzJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXHJcbiAqIEBwdWJsaWNcclxuICogQHN0YXRpY1xyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXHJcbiAqL1xyXG5jbGFzcyBBc3BlY3RVdGlscyB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBBc3BlY3RVdGlscykge1xyXG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIG9yYml0IG9mIHR3byBhbmdsZXMgb24gYSBjaXJjbGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tQW5nbGUgLSBhbmdsZSBpbiBkZWdyZWUsIHBvaW50IG9uIHRoZSBjaXJjbGVcclxuICAgKiBAcGFyYW0ge051bWJlcn0gdG9BbmdsZSAtIGFuZ2xlIGluIGRlZ3JlZSwgcG9pbnQgb24gdGhlIGNpcmNsZVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhc3BlY3RBbmdsZSAtIDYwLDkwLDEyMCwgLi4uXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG9yYlxyXG4gICAqL1xyXG4gIHN0YXRpYyBvcmIoZnJvbUFuZ2xlLCB0b0FuZ2xlLCBhc3BlY3RBbmdsZSkge1xyXG4gICAgbGV0IG9yYlxyXG4gICAgbGV0IHNpZ24gPSBmcm9tQW5nbGUgPiB0b0FuZ2xlID8gMSA6IC0xXHJcbiAgICBsZXQgZGlmZmVyZW5jZSA9IE1hdGguYWJzKGZyb21BbmdsZSAtIHRvQW5nbGUpXHJcblxyXG4gICAgaWYgKGRpZmZlcmVuY2UgPiBVdGlscy5ERUdfMTgwKSB7XHJcbiAgICAgIGRpZmZlcmVuY2UgPSBVdGlscy5ERUdfMzYwIC0gZGlmZmVyZW5jZTtcclxuICAgICAgb3JiID0gKGRpZmZlcmVuY2UgLSBhc3BlY3RBbmdsZSkgKiAtMVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9yYiA9IChkaWZmZXJlbmNlIC0gYXNwZWN0QW5nbGUpICogc2lnblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG9yYikudG9GaXhlZCgyKSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZyb21Qb2ludHMgLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cclxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHRvUG9pbnRzIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxyXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gYXNwZWN0cyAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKXtcclxuICAgIGNvbnN0IGFzcGVjdExpc3QgPSBbXVxyXG4gICAgZm9yIChjb25zdCBmcm9tUCBvZiBmcm9tUG9pbnRzKXtcclxuICAgICAgZm9yIChjb25zdCB0b1Agb2YgdG9Qb2ludHMpe1xyXG4gICAgICAgIGZvciAoY29uc3QgYXNwZWN0IG9mIGFzcGVjdHMpe1xyXG4gICAgICAgICAgY29uc3Qgb3JiID0gQXNwZWN0VXRpbHMub3JiKGZyb21QLmFuZ2xlLCB0b1AuYW5nbGUsIGFzcGVjdC5hbmdsZSlcclxuICAgICAgICAgIGlmKCBNYXRoLmFicyggb3JiICkgPD0gIGFzcGVjdC5vcmIgKXtcclxuICAgICAgICAgICAgYXNwZWN0TGlzdC5wdXNoKCB7IGFzcGVjdDphc3BlY3QsIGZyb206ZnJvbVAsIHRvOnRvUCwgcHJlY2lzaW9uOm9yYiB9IClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXNwZWN0TGlzdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhdyBhc3BlY3RzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFzY2VuZGFudFNoaWZ0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXHJcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBhc3BlY3RzTGlzdFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBkcmF3QXNwZWN0cyhyYWRpdXMsIGFzY2VuZGFudFNoaWZ0LCBzZXR0aW5ncywgYXNwZWN0c0xpc3Qpe1xyXG4gICAgY29uc3QgY2VudGVyWCA9IHNldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXHJcbiAgICBjb25zdCBjZW50ZXJZID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcclxuXHJcbiAgICBmb3IoY29uc3QgYXNwIG9mIGFzcGVjdHNMaXN0KXtcclxuXHJcbiAgICAgICAgLy8gYXNwZWN0IGFzIHNvbGlkIGxpbmVcclxuICAgICAgICBjb25zdCBmcm9tUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLmZyb20uYW5nbGUsIGFzY2VuZGFudFNoaWZ0KSlcclxuICAgICAgICBjb25zdCB0b1BvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC50by5hbmdsZSwgYXNjZW5kYW50U2hpZnQpKVxyXG5cclxuICAgICAgICAvLyBkcmF3IHN5bWJvbCBpbiBjZW50ZXIgb2YgYXNwZWN0XHJcbiAgICAgICAgY29uc3QgbGluZUNlbnRlclggPSAoZnJvbVBvaW50LnggKyAgdG9Qb2ludC54KSAvIDJcclxuICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9IChmcm9tUG9pbnQueSArICB0b1BvaW50LnkpIC8gMlxyXG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChhc3AuYXNwZWN0Lm5hbWUsIGxpbmVDZW50ZXJYLCBsaW5lQ2VudGVyWSlcclxuICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xyXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcclxuICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHNldHRpbmdzLkFTUEVDVFNfRk9OVF9TSVpFKTtcclxuICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xyXG5cclxuICAgICAgICAvLyBzcGFjZSBmb3Igc3ltYm9sIChmcm9tUG9pbnQgLSBjZW50ZXIpXHJcbiAgICAgICAgY29uc3QgZnJvbVBvaW50U3BhY2VYID0gZnJvbVBvaW50LnggKyAoIHRvUG9pbnQueCAtIGZyb21Qb2ludC54ICkgLyAyLjJcclxuICAgICAgICBjb25zdCBmcm9tUG9pbnRTcGFjZVkgPSBmcm9tUG9pbnQueSArICggdG9Qb2ludC55IC0gZnJvbVBvaW50LnkgKSAvIDIuMlxyXG5cclxuICAgICAgICAvLyBzcGFjZSBmb3Igc3ltYm9sIChjZW50ZXIgLSB0b1BvaW50KVxyXG4gICAgICAgIGNvbnN0IHRvUG9pbnRTcGFjZVggPSB0b1BvaW50LnggKyAoIGZyb21Qb2ludC54IC0gdG9Qb2ludC54ICkgLyAyLjJcclxuICAgICAgICBjb25zdCB0b1BvaW50U3BhY2VZID0gdG9Qb2ludC55ICsgKCBmcm9tUG9pbnQueSAtIHRvUG9pbnQueSApIC8gMi4yXHJcblxyXG4gICAgICAgIC8vIGxpbmU6IGZyb21Qb2ludCAtIGNlbnRlclxyXG4gICAgICAgIGNvbnN0IGxpbmUxID0gU1ZHVXRpbHMuU1ZHTGluZShmcm9tUG9pbnQueCwgZnJvbVBvaW50LnksIGZyb21Qb2ludFNwYWNlWCwgZnJvbVBvaW50U3BhY2VZKVxyXG4gICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xyXG4gICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xyXG5cclxuICAgICAgICAvLyBsaW5lOiBjZW50ZXIgLSB0b1BvaW50XHJcbiAgICAgICAgY29uc3QgbGluZTIgPSBTVkdVdGlscy5TVkdMaW5lKHRvUG9pbnRTcGFjZVgsIHRvUG9pbnRTcGFjZVksIHRvUG9pbnQueCwgdG9Qb2ludC55KVxyXG4gICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xyXG4gICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xyXG5cclxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUxKTtcclxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUyKTtcclxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXJcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gIEFzcGVjdFV0aWxzIGFzXHJcbiAgZGVmYXVsdFxyXG59XHJcbiIsIi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBTVkcgdXRpbGl0eSBjbGFzc1xyXG4gKiBAcHVibGljXHJcbiAqIEBzdGF0aWNcclxuICogQGhpZGVjb25zdHJ1Y3RvclxyXG4gKi9cclxuY2xhc3MgU1ZHVXRpbHMge1xyXG5cclxuICBzdGF0aWMgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG5cclxuICBzdGF0aWMgU1lNQk9MX0FSSUVTID0gXCJBcmllc1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcclxuICBzdGF0aWMgU1lNQk9MX0dFTUlOSSA9IFwiR2VtaW5pXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9DQU5DRVIgPSBcIkNhbmNlclwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcclxuICBzdGF0aWMgU1lNQk9MX1ZJUkdPID0gXCJWaXJnb1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTElCUkEgPSBcIkxpYnJhXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVUyA9IFwiU2FnaXR0YXJpdXNcIjtcclxuICBzdGF0aWMgU1lNQk9MX0NBUFJJQ09STiA9IFwiQ2Fwcmljb3JuXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcclxuICBzdGF0aWMgU1lNQk9MX1BJU0NFUyA9IFwiUGlzY2VzXCI7XHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcclxuICBzdGF0aWMgU1lNQk9MX01PT04gPSBcIk1vb25cIjtcclxuICBzdGF0aWMgU1lNQk9MX01FUkNVUlkgPSBcIk1lcmN1cnlcIjtcclxuICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfRUFSVEggPSBcIkVhcnRoXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9NQVJTID0gXCJNYXJzXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TQVRVUk4gPSBcIlNhdHVyblwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVVJBTlVTID0gXCJVcmFudXNcIjtcclxuICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcclxuICBzdGF0aWMgU1lNQk9MX1BMVVRPID0gXCJQbHV0b1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfQ0hJUk9OID0gXCJDaGlyb25cIjtcclxuICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9OTk9ERSA9IFwiTk5vZGVcIjtcclxuICBzdGF0aWMgU1lNQk9MX1NOT0RFID0gXCJTTm9kZVwiO1xyXG5cclxuICBzdGF0aWMgU1lNQk9MX0FTID0gXCJBc1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfRFMgPSBcIkRzXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9NQyA9IFwiTWNcIjtcclxuICBzdGF0aWMgU1lNQk9MX0lDID0gXCJJY1wiO1xyXG5cclxuICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREUgPSBcIlJldHJvZ3JhZGVcIlxyXG5cclxuICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OID0gXCJDb25qdW5jdGlvblwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfT1BQT1NJVElPTiA9IFwiT3Bwb3NpdGlvblwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU1FVQVJFID0gXCJTcXVhcmVcIjtcclxuICBzdGF0aWMgU1lNQk9MX1RSSU5FID0gXCJUcmluZVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU0VYVElMRSA9IFwiU2V4dGlsZVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlggPSBcIlF1aW5jdW54XCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRSA9IFwiU2VtaXNleHRpbGVcIjtcclxuICBzdGF0aWMgU1lNQk9MX09DVElMRSA9IFwiT2N0aWxlXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEUgPSBcIlRyaW9jdGlsZVwiO1xyXG5cclxuICAvLyBBc3Ryb25vbWljb24gZm9udCBjb2Rlc1xyXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVNfQ09ERSA9IFwiQVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTX0NPREUgPSBcIkJcIjtcclxuICBzdGF0aWMgU1lNQk9MX0dFTUlOSV9DT0RFID0gXCJDXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9DQU5DRVJfQ09ERSA9IFwiRFwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTEVPX0NPREUgPSBcIkVcIjtcclxuICBzdGF0aWMgU1lNQk9MX1ZJUkdPX0NPREUgPSBcIkZcIjtcclxuICBzdGF0aWMgU1lNQk9MX0xJQlJBX0NPREUgPSBcIkdcIjtcclxuICBzdGF0aWMgU1lNQk9MX1NDT1JQSU9fQ09ERSA9IFwiSFwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSA9IFwiSVwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOX0NPREUgPSBcIkpcIjtcclxuICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTX0NPREUgPSBcIktcIjtcclxuICBzdGF0aWMgU1lNQk9MX1BJU0NFU19DT0RFID0gXCJMXCI7XHJcblxyXG4gIHN0YXRpYyBTWU1CT0xfU1VOX0NPREUgPSBcIlFcIjtcclxuICBzdGF0aWMgU1lNQk9MX01PT05fQ09ERSA9IFwiUlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWV9DT0RFID0gXCJTXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9WRU5VU19DT0RFID0gXCJUXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9FQVJUSF9DT0RFID0gXCI+XCI7XHJcbiAgc3RhdGljIFNZTUJPTF9NQVJTX0NPREUgPSBcIlVcIjtcclxuICBzdGF0aWMgU1lNQk9MX0pVUElURVJfQ09ERSA9IFwiVlwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU0FUVVJOX0NPREUgPSBcIldcIjtcclxuICBzdGF0aWMgU1lNQk9MX1VSQU5VU19DT0RFID0gXCJYXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9ORVBUVU5FX0NPREUgPSBcIllcIjtcclxuICBzdGF0aWMgU1lNQk9MX1BMVVRPX0NPREUgPSBcIlpcIjtcclxuICBzdGF0aWMgU1lNQk9MX0NISVJPTl9DT0RFID0gXCJxXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9MSUxJVEhfQ09ERSA9IFwielwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfTk5PREVfQ09ERSA9IFwiZ1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU05PREVfQ09ERSA9IFwiaVwiO1xyXG5cclxuICBzdGF0aWMgU1lNQk9MX0FTX0NPREUgPSBcImNcIjtcclxuICBzdGF0aWMgU1lNQk9MX0RTX0NPREUgPSBcImZcIjtcclxuICBzdGF0aWMgU1lNQk9MX01DX0NPREUgPSBcImRcIjtcclxuICBzdGF0aWMgU1lNQk9MX0lDX0NPREUgPSBcImVcIjtcclxuXHJcbiAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFX0NPREUgPSBcIk1cIlxyXG5cclxuICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OX0NPREUgPSBcIiFcIjtcclxuICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT05fQ09ERSA9ICdcIic7XHJcbiAgc3RhdGljIFNZTUJPTF9TUVVBUkVfQ09ERSA9IFwiI1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfVFJJTkVfQ09ERSA9IFwiJFwiO1xyXG4gIHN0YXRpYyBTWU1CT0xfU0VYVElMRV9DT0RFID0gXCIlXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9RVUlOQ1VOWF9DT0RFID0gXCImXCI7XHJcbiAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRV9DT0RFID0gXCInJ1wiO1xyXG4gIHN0YXRpYyBTWU1CT0xfT0NUSUxFX0NPREUgPSBcIihcIjtcclxuICBzdGF0aWMgU1lNQk9MX1RSSU9DVElMRV9DT0RFID0gXCIpXCI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTVkdVdGlscykge1xyXG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxyXG4gICAqXHJcbiAgICogQHN0YXRpY1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJzdmdcIik7XHJcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsIFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UpO1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIFwiMCAwIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCk7XHJcbiAgICByZXR1cm4gc3ZnXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBTVkcgZ3JvdXAgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHN0YXRpY1xyXG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cclxuICAgKi9cclxuICBzdGF0aWMgU1ZHR3JvdXAoKSB7XHJcbiAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiZ1wiKTtcclxuICAgIHJldHVybiBnXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBTVkcgcGF0aCBlbGVtZW50XHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBTVkdQYXRoKCkge1xyXG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XHJcbiAgICByZXR1cm4gcGF0aFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgU1ZHIG1hc2sgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQHN0YXRpY1xyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50SURcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1NWR01hc2tFbGVtZW50fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBTVkdNYXNrKGVsZW1lbnRJRCkge1xyXG4gICAgY29uc3QgbWFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcIm1hc2tcIik7XHJcbiAgICBtYXNrLnNldEF0dHJpYnV0ZShcImlkXCIsIGVsZW1lbnRJRClcclxuICAgIHJldHVybiBtYXNrXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTVkcgY2lyY3VsYXIgc2VjdG9yXHJcbiAgICpcclxuICAgKiBAc3RhdGljXHJcbiAgICogQHBhcmFtIHtpbnR9IHggLSBjaXJjbGUgeCBjZW50ZXIgcG9zaXRpb25cclxuICAgKiBAcGFyYW0ge2ludH0geSAtIGNpcmNsZSB5IGNlbnRlciBwb3NpdGlvblxyXG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XHJcbiAgICogQHBhcmFtIHtpbnR9IGExIC0gYW5nbGVGcm9tIGluIHJhZGlhbnNcclxuICAgKiBAcGFyYW0ge2ludH0gYTIgLSBhbmdsZVRvIGluIHJhZGlhbnNcclxuICAgKiBAcGFyYW0ge2ludH0gdGhpY2tuZXNzIC0gZnJvbSBvdXRzaWRlIHRvIGNlbnRlciBpbiBweFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gc2VnbWVudFxyXG4gICAqL1xyXG4gIHN0YXRpYyBTVkdTZWdtZW50KHgsIHksIHJhZGl1cywgYTEsIGEyLCB0aGlja25lc3MsIGxGbGFnLCBzRmxhZykge1xyXG4gICAgLy8gQHNlZSBTVkcgUGF0aCBhcmM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvcGF0aHMuaHRtbCNQYXRoRGF0YVxyXG4gICAgY29uc3QgTEFSR0VfQVJDX0ZMQUcgPSBsRmxhZyB8fCAwO1xyXG4gICAgY29uc3QgU1dFRVRfRkxBRyA9IHNGbGFnIHx8IDA7XHJcblxyXG4gICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XHJcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLnNpbihhMSkpICsgXCIgQSBcIiArIHJhZGl1cyArIFwiLCBcIiArIHJhZGl1cyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyBTV0VFVF9GTEFHICsgXCIsIFwiICsgKHggKyByYWRpdXMgKiBNYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKHkgKyByYWRpdXMgKiBNYXRoLnNpbihhMikpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguc2luKGEyKSkgKyBcIiBBIFwiICsgdGhpY2tuZXNzICsgXCIsIFwiICsgdGhpY2tuZXNzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIDEgKyBcIiwgXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkpO1xyXG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcclxuICAgIHJldHVybiBzZWdtZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU1ZHIGNpcmNsZVxyXG4gICAqXHJcbiAgICogQHN0YXRpY1xyXG4gICAqIEBwYXJhbSB7aW50fSBjeFxyXG4gICAqIEBwYXJhbSB7aW50fSBjeVxyXG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXNcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGNpcmNsZVxyXG4gICAqL1xyXG4gIHN0YXRpYyBTVkdDaXJjbGUoY3gsIGN5LCByYWRpdXMpIHtcclxuICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImNpcmNsZVwiKTtcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjeCk7XHJcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3lcIiwgY3kpO1xyXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgcmFkaXVzKTtcclxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcclxuICAgIHJldHVybiBjaXJjbGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTVkcgbGluZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXHJcbiAgICovXHJcbiAgc3RhdGljIFNWR0xpbmUoeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJsaW5lXCIpO1xyXG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MVwiLCB4MSk7XHJcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkxXCIsIHkxKTtcclxuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgeDIpO1xyXG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MlwiLCB5Mik7XHJcbiAgICByZXR1cm4gbGluZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNWRyB0ZXh0XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0geFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5XHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR4dFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXHJcbiAgICovXHJcbiAgc3RhdGljIFNWR1RleHQoeCwgeSwgdHh0KSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwidGV4dFwiKTtcclxuICAgIHRleHQuc2V0QXR0cmlidXRlKFwieFwiLCB4KTtcclxuICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCB5KTtcclxuICAgIHRleHQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwibm9uZVwiKTtcclxuICAgIHRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KSk7XHJcblxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTVkcgc3ltYm9sXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XHJcbiAgICovXHJcbiAgc3RhdGljIFNWR1N5bWJvbChuYW1lLCB4UG9zLCB5UG9zKSB7XHJcbiAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XHJcbiAgICAgICAgcmV0dXJuIGFzU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxyXG4gICAgICAgIHJldHVybiBkc1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcclxuICAgICAgICByZXR1cm4gbWNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XHJcbiAgICAgICAgcmV0dXJuIGljU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUklFUzpcclxuICAgICAgICByZXR1cm4gYXJpZXNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVEFVUlVTOlxyXG4gICAgICAgIHJldHVybiB0YXVydXNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxyXG4gICAgICAgIHJldHVybiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSOlxyXG4gICAgICAgIHJldHVybiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTEVPOlxyXG4gICAgICAgIHJldHVybiBsZW9TeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XHJcbiAgICAgICAgcmV0dXJuIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBOlxyXG4gICAgICAgIHJldHVybiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPOlxyXG4gICAgICAgIHJldHVybiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxyXG4gICAgICAgIHJldHVybiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk46XHJcbiAgICAgICAgcmV0dXJuIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUzpcclxuICAgICAgICByZXR1cm4gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxyXG4gICAgICAgIHJldHVybiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NVTjpcclxuICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XHJcbiAgICAgICAgcmV0dXJuIG1vb25TeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcclxuICAgICAgICByZXR1cm4gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcclxuICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRUFSVEg6XHJcbiAgICAgICAgcmV0dXJuIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XHJcbiAgICAgICAgcmV0dXJuIG1hcnNTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcclxuICAgICAgICByZXR1cm4ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk46XHJcbiAgICAgICAgcmV0dXJuIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XHJcbiAgICAgICAgcmV0dXJuIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxyXG4gICAgICAgIHJldHVybiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPOlxyXG4gICAgICAgIHJldHVybiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DSElST046XHJcbiAgICAgICAgcmV0dXJuIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEg6XHJcbiAgICAgICAgcmV0dXJuIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OTk9ERTpcclxuICAgICAgICByZXR1cm4gbm5vZGVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU05PREU6XHJcbiAgICAgICAgcmV0dXJuIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFOlxyXG4gICAgICAgIHJldHVybiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTjpcclxuICAgICAgICByZXR1cm4gY29uanVuY3Rpb25TeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTjpcclxuICAgICAgICByZXR1cm4gb3Bwb3NpdGlvblN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkU6XHJcbiAgICAgICAgcmV0dXJuIHNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklORTpcclxuICAgICAgICByZXR1cm4gdHJpbmVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VYVElMRTpcclxuICAgICAgICByZXR1cm4gc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWDpcclxuICAgICAgICByZXR1cm4gcXVpbmN1bnhTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEU6XHJcbiAgICAgICAgcmV0dXJuIHNlbWlzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX09DVElMRTpcclxuICAgICAgICByZXR1cm4gcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFOlxyXG4gICAgICAgIHJldHVybiB0cmlvY3RpbGVTeW1ib2woeFBvcywgeVBvcylcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxyXG4gICAgICAgIHVua25vd25TeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiIzMzM1wiKVxyXG4gICAgICAgIHJldHVybiB1bmtub3duU3ltYm9sXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEFzY2VuZGFudCBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogRGVzY2VuZGFudCBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZHNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTWVkaXVtIGNvZWxpIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtY1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJbW11bSBjb2VsaSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaWNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfSUNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQXJpZXMgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFRhdXJ1cyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHZW1pbmkgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9HRU1JTklfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ2FuY2VyIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIExlbyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbGVvU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xFT19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBWaXJnbyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdmlyZ29TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVklSR09fQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTGlicmEgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNjb3JwaW8gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0NPUlBJT19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTYWdpdHRhcml1cyBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ2Fwcmljb3JuIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEFxdWFyaXVzIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVU19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBQaXNjZXMgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU3VuIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzdW5TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU1VOX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE1vb24gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1vb25TeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTU9PTl9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNZXJjdXJ5IHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUllfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVmVudXMgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHZlbnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEVhcnRoIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9FQVJUSF9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNYXJzIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtYXJzU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01BUlNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSnVwaXRlciBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNhdHVybiBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTl9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBVcmFudXMgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVNfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTmVwdHVuZSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFBsdXRvIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9QTFVUT19DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDaGlyb24gc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DSElST05fQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTGlsaXRoIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElMSVRIX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE5Ob2RlIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9OTk9ERV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTTm9kZSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc25vZGVTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU05PREVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0cm9ncmFkZSBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmV0cm9ncmFkZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIENvbmp1bmN0aW9uIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjb25qdW5jdGlvblN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTl9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBPcHBvc2l0aW9uIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBvcHBvc2l0aW9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX09QUE9TSVRJT05fQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU3F1YXJlc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNxdWFyZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVHJpbmUgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRyaW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1RSSU5FX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNleHRpbGUgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNleHRpbGVTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU0VYVElMRV9DT0RFKVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBRdWluY3VueCBzeW1ib2xcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcXVpbmN1bnhTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUVVJTkNVTlhfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2VtaXNleHRpbGUgc3ltYm9sXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNlbWlzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcclxuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUpXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFF1aW50aWxlIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBxdWludGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XHJcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9PQ1RJTEVfQ09ERSlcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVHJpb2N0aWxlIHN5bWJvbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0cmlvY3RpbGVTeW1ib2woeFBvcywgeVBvcykge1xyXG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFX0NPREUpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQge1xyXG4gIFNWR1V0aWxzIGFzXHJcbiAgZGVmYXVsdFxyXG59XHJcbiIsIi8qKlxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXHJcbiAqIEBwdWJsaWNcclxuICogQHN0YXRpY1xyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXHJcbiAqL1xyXG5jbGFzcyBVdGlscyB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVdGlscykge1xyXG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBERUdfMzYwID0gMzYwXHJcbiAgc3RhdGljIERFR18xODAgPSAxODBcclxuICBzdGF0aWMgREVHXzAgPSAwXHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlIHJhbmRvbSBJRFxyXG4gICAqXHJcbiAgICogQHN0YXRpY1xyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICBzdGF0aWMgZ2VuZXJhdGVVbmlxdWVJZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgcmFuZG9tTnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIDEwMDAwMDA7XHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgdW5pcXVlSWQgPSBgaWRfJHtyYW5kb21OdW1iZXJ9XyR7dGltZXN0YW1wfWA7XHJcbiAgICByZXR1cm4gdW5pcXVlSWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXHJcbiAgICogQHN0YXRpY1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcclxuICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbihhbmdsZUluRGVncmVlLCBzaGlmdEluRGVncmVlID0gMCkge1xyXG4gICAgcmV0dXJuIChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgKiBNYXRoLlBJIC8gMTgwXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb252ZXJ0cyByYWRpYW4gdG8gZGVncmVlXHJcbiAgICogQHN0YXRpY1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhblxyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUgPSBmdW5jdGlvbihyYWRpYW4pIHtcclxuICAgIHJldHVybiAocmFkaWFuICogMTgwIC8gTWF0aC5QSSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgYSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIGNpcmNsZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeCAtIGNlbnRlciB4XHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN5IC0gY2VudGVyIHlcclxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluUmFkaWFuc1xyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHt4Ok51bWJlciwgeTpOdW1iZXJ9XHJcbiAgICovXHJcbiAgc3RhdGljIHBvc2l0aW9uT25DaXJjbGUoY3gsIGN5LCByYWRpdXMsIGFuZ2xlSW5SYWRpYW5zKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAocmFkaXVzICogTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpICsgY3gpLFxyXG4gICAgICB5OiAocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlcyB0aGUgYW5nbGUgYmV0d2VlbiB0aGUgbGluZSAoMiBwb2ludHMpIGFuZCB0aGUgeC1heGlzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkxXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gZGVncmVlXHJcbiAgICovXHJcbiAgc3RhdGljIHBvc2l0aW9uVG9BbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgY29uc3QgZHggPSB4MiAtIHgxO1xyXG4gICAgY29uc3QgZHkgPSB5MiAtIHkxO1xyXG4gICAgY29uc3QgYW5nbGVJblJhZGlhbnMgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XHJcbiAgICByZXR1cm4gVXRpbHMucmFkaWFuVG9EZWdyZWUoYW5nbGVJblJhZGlhbnMpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxyXG4gICAqXHJcbiAgICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuXHJcbiAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBhbmdsZToxMH0sIHtuYW1lOlwiYlwiLCBhbmdsZToyMH1dXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxyXG4gICAqL1xyXG4gIHN0YXRpYyBjYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIGNvbGxpc2lvblJhZGl1cywgY2lyY2xlUmFkaXVzKSB7XHJcbiAgICBjb25zdCBTVEVQID0gMSAvL2RlZ3JlZVxyXG5cclxuICAgIGNvbnN0IGNlbGxXaWR0aCA9IDEwIC8vZGVncmVlXHJcbiAgICBjb25zdCBudW1iZXJPZkNlbGxzID0gVXRpbHMuREVHXzM2MCAvIGNlbGxXaWR0aFxyXG4gICAgY29uc3QgZnJlcXVlbmN5ID0gbmV3IEFycmF5KG51bWJlck9mQ2VsbHMpLmZpbGwoMClcclxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihwb2ludC5hbmdsZSAvIGNlbGxXaWR0aClcclxuICAgICAgZnJlcXVlbmN5W2luZGV4XSArPSAxXHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW4gdGhpcyBhbGdvcml0aG0gdGhlIG9yZGVyIG9mIHBvaW50cyBpcyBjcnVjaWFsLlxyXG4gICAgLy8gQXQgdGhhdCBwb2ludCBpbiB0aGUgY2lyY2xlLCB3aGVyZSB0aGUgcGVyaW9kIGNoYW5nZXMgaW4gdGhlIGNpcmNsZSAoZm9yIGluc3RhbmNlOlszNTgsMzU5LDAsMV0pLCB0aGUgcG9pbnRzIGFyZSBhcnJhbmdlZCBpbiBpbmNvcnJlY3Qgb3JkZXIuXHJcbiAgICAvLyBBcyBhIHN0YXJ0aW5nIHBvaW50LCBJIHRyeSB0byBmaW5kIGEgcGxhY2Ugd2hlcmUgdGhlcmUgYXJlIG5vIHBvaW50cy4gVGhpcyBwbGFjZSBJIHVzZSBhcyBTVEFSVF9BTkdMRS5cclxuICAgIGNvbnN0IFNUQVJUX0FOR0xFID0gY2VsbFdpZHRoICogZnJlcXVlbmN5LmZpbmRJbmRleChjb3VudCA9PiBjb3VudCA9PSAwKVxyXG5cclxuICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBwb2ludC5uYW1lLFxyXG4gICAgICAgIGFuZ2xlOiBwb2ludC5hbmdsZSA8IFNUQVJUX0FOR0xFID8gcG9pbnQuYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogcG9pbnQuYW5nbGVcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBfcG9pbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgcmV0dXJuIGEuYW5nbGUgLSBiLmFuZ2xlXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvblxyXG4gICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxuID0gX3BvaW50cy5sZW5ndGg7IGkgPCBsbjsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoMCwgMCwgY2lyY2xlUmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihfcG9pbnRzW2ldLmFuZ2xlKSlcclxuICAgICAgICBfcG9pbnRzW2ldLnggPSBwb2ludFBvc2l0aW9uLnhcclxuICAgICAgICBfcG9pbnRzW2ldLnkgPSBwb2ludFBvc2l0aW9uLnlcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcclxuICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KF9wb2ludHNbaV0ueCAtIF9wb2ludHNbal0ueCwgMikgKyBNYXRoLnBvdyhfcG9pbnRzW2ldLnkgLSBfcG9pbnRzW2pdLnksIDIpKTtcclxuICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xyXG4gICAgICAgICAgICBfcG9pbnRzW2ldLmFuZ2xlICs9IFNURVBcclxuICAgICAgICAgICAgX3BvaW50c1tqXS5hbmdsZSAtPSBTVEVQXHJcbiAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUG9pbnRzKClcclxuXHJcbiAgICByZXR1cm4gX3BvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwb2ludCwgY3VycmVudEluZGV4KSA9PiB7XHJcbiAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQuYW5nbGVcclxuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yXHJcbiAgICB9LCB7fSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIHRoZSBhbmdsZSBjb2xsaWRlcyB3aXRoIHRoZSBwb2ludHNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZVxyXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFuZ2xlc0xpc3RcclxuICAgKiBAcGFyYW0ge051bWJlcn0gW2NvbGxpc2lvblJhZGl1c11cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgc3RhdGljIGlzQ29sbGlzaW9uKGFuZ2xlLCBhbmdsZXNMaXN0LCBjb2xsaXNpb25SYWRpdXMgPSAxMCkge1xyXG5cclxuICAgIGNvbnN0IHBvaW50SW5Db2xsaXNpb24gPSBhbmdsZXNMaXN0LmZpbmQocG9pbnQgPT4ge1xyXG5cclxuICAgICAgbGV0IGEgPSAocG9pbnQgLSBhbmdsZSkgPiBVdGlscy5ERUdfMTgwID8gYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogYW5nbGVcclxuICAgICAgbGV0IHAgPSAoYW5nbGUgLSBwb2ludCkgPiBVdGlscy5ERUdfMTgwID8gcG9pbnQgKyBVdGlscy5ERUdfMzYwIDogcG9pbnRcclxuXHJcbiAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gcCkgPD0gY29sbGlzaW9uUmFkaXVzXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiBwb2ludEluQ29sbGlzaW9uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWVcclxuICB9XHJcblxyXG4gIFxyXG5cclxuICAvKipcclxuICAqIFJlbW92ZXMgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudFxyXG4gICpcclxuICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50SURcclxuICAqIEBwYXJhbSB7RnVuY3Rpb259IFtiZWZvcmVIb29rXVxyXG4gICAgKlxyXG4gICogQHdhcm5pbmcgLSBJdCByZW1vdmVzIEV2ZW50IExpc3RlbmVycyB0b28uXHJcbiAgKiBAd2FybmluZyAtIFlvdSB3aWxsIChwcm9iYWJseSkgZ2V0IG1lbW9yeSBsZWFrIGlmIHlvdSBkZWxldGUgZWxlbWVudHMgdGhhdCBoYXZlIGF0dGFjaGVkIGxpc3RlbmVyc1xyXG4gICovXHJcbiAgc3RhdGljIGNsZWFuVXAoIGVsZW1lbnRJRCwgYmVmb3JlSG9vayl7XHJcbiAgICBsZXQgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxyXG4gICAgaWYoIWVsbSl7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgICh0eXBlb2YgYmVmb3JlSG9vayA9PT0gJ2Z1bmN0aW9uJykgJiYgYmVmb3JlSG9vaygpXHJcblxyXG4gICAgZWxtLmlubmVySFRNTCA9IFwiXCJcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgVXRpbHMgYXNcclxuICBkZWZhdWx0XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcclxuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4vdXRpbHMvU1ZHVXRpbHMuanMnXHJcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzL1V0aWxzLmpzJ1xyXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xyXG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4vY2hhcnRzL1RyYW5zaXRDaGFydC5qcydcclxuXHJcbmV4cG9ydCB7VW5pdmVyc2UsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=