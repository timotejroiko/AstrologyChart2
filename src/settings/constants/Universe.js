/**
* Chart padding
* @constant
* @type {Number}
* @default 10px
*/
export const CHART_PADDING = 40

/**
* SVG viewBox width
* @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
* @constant
* @type {Number}
* @default 800
*/
export const CHART_VIEWBOX_WIDTH = 800

/**
* SVG viewBox height
* @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
* @constant
* @type {Number}
* @default 800
*/
export const CHART_VIEWBOX_HEIGHT = 800

/*
* Line strength
* @constant
* @type {Number}
* @default 1
*/
export const CHART_STROKE = 1

/*
* Line strength of the main lines. For instance points, main axis, main circles
* @constant
* @type {Number}
* @default 1
*/
export const CHART_MAIN_STROKE = 2

/**
* No fill, only stroke
* @constant
* @type {boolean}
* @default false
*/
export const CHART_STROKE_ONLY = false;

/**
* Font family
* @constant
* @type {String}
* @default
*/
export const CHART_FONT_FAMILY = "Astronomicon";

/**
* Always draw the full house lines, even if it overlaps with planets
* @constant
* @type {boolean}
* @default false
*/
export const CHART_ALLOW_HOUSE_OVERLAP = false;

/**
* Draw mains axis symbols outside the chart: Ac, Mc, Ic, Dc
* @constant
* @type {boolean}
* @default false
*/
export const CHART_DRAW_MAIN_AXIS = true;
