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

  /**
   * Inverted degree to radian
   * @static
   *
   * @param {Number} angleIndegree
   * @param {Number} shiftInDegree
   * @return {Number}
   */
  static degreeToRadian = function(angleInDegree, shiftInDegree = 0) {
    return ((shiftInDegree - angleInDegree) % 360) * Math.PI / 180
  }

  /**
   * Converts radian to degree
   * @static
   *
   * @param {Number} radian
   * @return {Number}
   */
  static radianToDegree = function(radian) {
    return (radian * 180 / Math.PI) % 360
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
      x: Math.round(radius * Math.cos(angleInRadians) + cx),
      y: Math.round(radius * Math.sin(angleInRadians) + cy)
    };
  }

  /**
   * Calculates new position of points on circle without overlapping each other
   *
   * @throws {Error} - If there is no place on the circle to place points.
   * @param {Array} points - [{name:"a", position:10}, {name:"b", position:20}]
   * @param {Number} pointRadius - point radius
   * @param {Number} radius - circle radius
   *
   * @return {Object} - {"Moon":30, "Sun":60, "Mercury":86, ...}
   */
  static calculatePositionWithoutOverlapping(points, pointRadius, circleRadius) {
    const pointWidth = 2 * pointRadius
    const circleCircumference = 2 * Math.PI * circleRadius
    const pointsCircumference = points.length * pointWidth
    if (pointsCircumference > circleCircumference) {
      throw new Error(`There is no place on the circle to place points.`)
    }

    points.sort((a, b) => {
      return a.position - b.position
    })

    const numberOfCellsInGrid = Math.floor(Utils.DEG_360 / pointWidth)    
    const linearGrid = new Array(numberOfCellsInGrid)

    for (const point of points) {
      let idx = Math.floor(point.position / pointWidth)

      while (linearGrid[idx] !== undefined) {
        idx = (idx + 1) % numberOfCellsInGrid
      }

      linearGrid[idx] = point
    }

    return linearGrid.reduce((accumulator, point, currentIndex) => {

      // a Point has a space to draw itself at the precise position.
      if (linearGrid[(currentIndex - 1) % numberOfCellsInGrid] === undefined && linearGrid[(currentIndex + 1) % numberOfCellsInGrid] === undefined) {
        accumulator[point.name] = point.position
        return accumulator
      }

      // a Point has a more space from the left side
      if (linearGrid[(currentIndex - 1) % numberOfCellsInGrid] === undefined ) {
        accumulator[point.name] = (currentIndex * pointWidth) - pointRadius
        return accumulator
      }

      // a Point has a more space from the right side
      if (linearGrid[(currentIndex + 1) % numberOfCellsInGrid] === undefined ) {
        accumulator[point.name] = (currentIndex * pointWidth) + pointRadius
        return accumulator
      }

      accumulator[point.name] = (currentIndex * pointWidth)
      return accumulator
    }, {})
  }
}

export {
  Utils as
  default
}
