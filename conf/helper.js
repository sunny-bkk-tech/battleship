const _ = require('lodash')

class Helper {
  /**
   * get XY
   * @properties {string} cor - e.g. 1x1 {x}x{y}
   * @returns {object} xy
   */
  static _getXY (at) {
    // Example at = 1x1
    const xy = at.split('x')
    return {
      x: +xy[0], // parseInt
      y: +xy[1] // parseInt
    }
  }

  /**
   * Is ship adjacent to others?
   * if 2x2 then adjacents are 1x1, 1x2, 2x2, 3x2, 2x3, 3x3
   * @properties {string} board.square_grid - size of grid
   * @properties {object} ship.cors
   * @returns {object} True is adjacent(cannot place this ship). Otherwise false
   */
  static isAdjacent (ships, cors) {
    if (!ships.length) {
      return false
    }
    let totalCors = {}
    // loop get all cors from old ships
    for (let i = 0; i < ships.length; i++) {
      const oldShip = ships[i]
      Object.assign(totalCors, oldShip.cors)
    }

    // add adjacents cell from all cors to totalCors
    let keys = Object.keys(totalCors)
    for (let i = 0; i < keys.length; i++) {
      let { x, y } = Helper._getXY(keys[i])
      totalCors[`${x - 1}x${y - 1}`] = false
      totalCors[`${x - 1}x${y}`] = false
      totalCors[`${x}x${y - 1}`] = false
      totalCors[`${x + 1}x${y + 1}`] = false
      totalCors[`${x + 1}x${y}`] = false
      totalCors[`${x}x${y + 1}`] = false
      totalCors[`${x - 1}x${y + 1}`] = false
      totalCors[`${x + 1}x${y - 1}`] = false
    }

    // check new ship exists in totalCors or not
    keys = Object.keys(cors)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (typeof totalCors[key] !== 'undefined') {
        // if exists return true. its Adjacent
        return true
      }
    }
    return false
  }

  /**
   * Is ship over square grid?
   * @properties {string} board.square_grid - size of grid
   * @properties {object} ship.cors
   * @returns {object} True is overgrid(cannot place this ship). Otherwise false
   */
  static isShipOverGrid (grid, cors) {
    // loop go from last items
    const keys = Object.keys(cors)
    for (var i = keys.length - 1; i >= 0; i--) {
      const cor = keys[i]
      let { x, y } = Helper._getXY(cor)
      if (x > grid || y > grid || x < 0 || y < 0) {
        return true
      }
    }
    return false
  }

  /**
   * Get cors by start, length and direction
   * Example1 start=1x1 length=4, direction=vertical
   * It will get 1x1 1x2 1x3 1x4
   * Example2 start=1x1 length=4, direction=horizontal
   * It will get 1x1 2x1 3x1 4x1
   * @properties {string} body.at - cors pattern {x}x{y} e.g. 1x1
   * @properties {string} body.direction - enum('horizontal', 'vertical')
   * @properties {number} ship.l - length of ship
   * @returns {object} key is cors (1x1), value is boolean True is fired. Otherwise false
   */
  static getCors ({ at, direction }, { l }) {
    const cors = {}
    cors[at] = false

    // Example at = 1x1
    let { x, y } = Helper._getXY(at)

    let getCor = null
    if (direction === 'horizontal') {
      getCor = () => `${++x}x${y}`
    } else {
      getCor = () => `${x}x${++y}`
    }

    for (let i = 0; i < l - 1; i++) {
      cors[getCor()] = false
    }
    return cors
  }

  /**
   * The limit are
   * 1x Battleship, 2x Cruisers, 3x Destroyers and 4x Submarines.
   * @param {Object[]} ships - array of ship
   * @param {number} type - type of ship
   * @returns {boolean} True is the ship can put into board. Otherwise false
   */
  static checkLimitShipsInBoard (ships, type) {
    if (!ships.length) {
      // if no ship in board then true
      return true
    }
    const groupByType = _.groupBy(ships, ship => ship.type)
    let limit
    if (type === 1) {
      limit = 1
    } else if (type === 2) {
      limit = 2
    } else if (type === 3) {
      limit = 3
    } else if (type === 4) {
      limit = 4
    }
    // 0 < 2 true
    // 1 < 2 true
    // 2 < 2 false
    // 3 < 2 false
    let amount = groupByType[type] ? groupByType[type].length : 0
    return amount < limit
  }

  /**
   * get ship
   *
   * @param {number} type - type of ship
   * @returns {string} ship.name - name of ship
   * @returns {number} ship.l - length of ship
   */
  static getShip (type) {
    switch (type) {
      case 1:
        return {
          type,
          name: 'Battleship',
          l: 4
        }
      case 2:
        return {
          type,
          name: 'Cruiser',
          l: 3
        }
      case 3:
        return {
          type,
          name: 'Destroyer',
          l: 2
        }
      case 4:
        return {
          type,
          name: 'Submarine',
          l: 1
        }
    }
  }

  /**
   * private function get situations
   *
   * @param {Number} num - number of situation
   * @param {string} x - name of ship or number of moves
   * @returns {string} text - situation after fired
   */
  static _getSituation (num, x) {
    switch (num) {
      case 0:
        return 'Miss'
      case 1:
        return 'Hit'
      case 2:
        return `You just sank the ${x}`
      case 3:
        return `Win ! You completed the game in ${x} moves`
    }
  }


  static fireAndGetSituation (board, cellFired) {
    const ships = board.ships
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i]
      // if ship destroyed continue to next ship
      if (ship.destroyed) {
        continue
      }
      // if matched cors key in ship (it HITS)
      if (typeof ship.cors[cellFired] !== 'undefined') {
        ship.cors[cellFired] = true

        // checking Is this ship destroyed?
        const keys = Object.keys(ship.cors)
        ship.destroyed = true
        // if all cell of ship are false
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j]
          if (!ship.cors[key]) {
            ship.destroyed = false
            // JUST hit not destroyed
            return Helper._getSituation(1)
          }
        }
        board.ship_destroyed += 1
        if (board.ship_destroyed === ships.length) {
          board.state = 3 // state done
          return Helper._getSituation(3, board.fired.length)
        }
        // SHIP Destroyed
        return Helper._getSituation(2, ship.name)
      }
    }
    return Helper._getSituation(0)
  }
}

module.exports = Helper
