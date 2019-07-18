// const APIError = require('../helpers/APIError')
const ApiBoard = require('.././model/boardModel')
const Helper = require('../conf/helper')
const mongoose = require('mongoose')
const Board = mongoose.model('Board')
const APIError = require('../conf/APIError');

/**
 * Load board and append to req.
 */
function load(req, res, next, id) {
  Board.get(id)
    .then((board) => {
      req.board = board
      return next()
    })
    .catch(e => next(new APIError(e)))
}

/**
 * Get board
 * @returns {Board}
 */
function get(req, res) {
  const board = req.board
  const type = req.query.type

  if (type === 'attacker') {
    // if attacker, it should delete secret position
    for (let i = 0; i < board.ships.length; i++) {
      const keys = Object.keys(board.ships[i].cors)
      for (let j = 0; j < keys.length; j++) {
        const isFired = board.ships[i].cors[keys[j]]
        if (!isFired) {
          delete board.ships[i].cors[keys[j]]
        }
      }
    }
  }

  return res.json(board)
}

/**
 * Create new board
 * @returns {Board}
 */
function create(req, res, next) {
  const squreGrid = 10 // default grid 10x10
  const board = new Board({
    square_grid: squreGrid
  })

  board.save()
    .then(savedBoard => res.json(savedBoard))
}

/**
 * Get board list.
 * @property {number} req.query.skip - Number of boards to be skipped.
 * @property {number} req.query.limit - Limit number of boards to be returned.
 * @returns {Board[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  Board.list({
    limit,
    skip
  })
    .then(boards => res.json(boards))
    .catch(e => next(new APIError(e)))
}

/**
 * Delete board.
 * @returns {Board}
 */
function remove(req, res, next) {
  const board = req.board
  board.remove().then(deletedBoard => res.json({board: deletedBoard, message: "Game is successfully Reset"}))
    .catch(e => next(new APIError(e)))
}

/**
 * placeShip
 * @returns {Board}
 */
async function placeShip(req, res, next) {
  const board = req.board
  const body = req.body

  if (board.state === 3) {
    res.json({
      error: true,
      message: 'Game Finished.'
    })
    return
  }

  if (board.state === 2) {
    res.json({
      error: true,
      message: 'Game is Ready.'
    })
    return
  }

  // get ship from type
  const ship = Helper.getShip(body.type)

  // check type ship should not more than 1x Battleship, 2x Cruisers, 3x Destroyers and 4x Submarines.
  const isNotLimitExeeded = Helper.checkLimitShipsInBoard(board.ships, ship.type)
  if (!isNotLimitExeeded) {
    res.json({
      error: true,
      message: `${ship.type} limit exceeded.`
    })
    return
  }

  // get all cors cells from start and l and direction
  const cors = Helper.getCors(body, ship)
  ship.cors = cors // set cors to ship

  // check ship over grid
  const isOver = Helper.isShipOverGrid(board.square_grid, ship.cors)
  if (isOver) {
    res.json({
      error: true,
      message: 'ship position is over grid.'
    })
    return
  }

  // check ship exists or adjacent cells
  const isAdjacent = Helper.isAdjacent(board.ships, ship.cors)
  if (isAdjacent) {
    res.json({
      error: true,
      message: 'The ship is adjacent.'
    })
    return
  }

  // pass all cases
  board.ships.push(ship)

  board.state = 1 // inprogress

  if (board.ships.length === 10) {
    board.state = 2 // ready to fire
  }

  try {
    await board.save()
  } catch (e) {
    return next()
  }

  res.json({
    message: 'placed',
    shipType: ship.name

  })
}

/**
 * Attacker fire the ship.
 * @returns {Promise<String, APIError>} text -
 */
async function fire(req, res, next) {
  const board = req.board
  const cell = req.body.fire
  // check pattern of cell
  const reg = new RegExp(/(\d+)x(\d+)/, 'g')
  if (!reg.test(cell)) {
    return next(new APIError('Bad request fire should be NUMBERxNUMBER', 400))
  }
  board.fired.push(cell)

  // Get result and set field in board object
  const result = Helper.fireAndGetSituation(board, cell)

  try {
    board.markModified('ships') // update mixed type in mongoose
    await board.save()
  } catch (e) {
    return next(new APIError(e))
  }

  return res.json({
    message: result
  })
}

module.exports = {
  load,
  get,
  create,
  list,
  remove,
  placeShip,
  fire
}
