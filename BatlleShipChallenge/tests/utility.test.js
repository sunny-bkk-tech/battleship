const chai = require('chai')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const Helper = require('../conf/helper')

chai.config.includeStack = true
const board = {
  _id: '5d3099df3f04c25bc1b96923',
  square_grid: 10,
  ships: [{
    type: 1,
    name: 'Battleship',
    l: 4,
    cors: {
      '10x7': false,
      '10x8': false,
      '10x9': false,
      '10x10': false
    },
    _id: '59b93d03192c6f05fb01e7fe',
    destroyed: false
  }],
  fired: [],
  state: 0,
  ship_destroyed: 0
}

describe('## Helper', () => {
  it('should has function _getXY', () => {
    expect(Helper._getXY).to.be.an.instanceof(Function)
  })

  it('should has function isAdjacent', () => {
    expect(Helper.isAdjacent).to.be.an.instanceof(Function)
  })

  it('should has function isShipOverGrid', () => {
    expect(Helper.isShipOverGrid).to.be.an.instanceof(Function)
  })

  it('should has function getCors', () => {
    expect(Helper.isShipOverGrid).to.be.an.instanceof(Function)
  })

  it('should has function checkLimitShipsInBoard', () => {
    expect(Helper.checkLimitShipsInBoard).to.be.an.instanceof(Function)
  })

  it('should has function getShip', () => {
    expect(Helper.getShip).to.be.an.instanceof(Function)
  })

  it('should has function _getSituation', () => {
    expect(Helper.getShip).to.be.an.instanceof(Function)
  })

  it('should has function fireAndGetSituation', () => {
    expect(Helper.fireAndGetSituation).to.be.an.instanceof(Function)
  })

  it('should return { x: 4, y: 5 }', () => {
    const { x, y } = Helper._getXY('4x5')
    expect(x).to.be.equal(4)
    expect(y).to.be.equal(5)
  })

  it('should return isAdjacent to true', () => {
    const _ship = {
      type: 4,
      name: 'Submarine',
      l: 1,
      cors: {
        '9x6': false
      }
    }
    const isAdjacent = Helper.isAdjacent(board.ships, _ship.cors)
    expect(isAdjacent).to.be.equal(true)
  })

  it('should return isAdjacent to false', () => {
    const _ship = {
      type: 4,
      name: 'Submarine',
      l: 1,
      cors: {
        '8x6': false
      }
    }
    const isAdjacent = Helper.isAdjacent(board.ships, _ship.cors)
    expect(isAdjacent).to.be.equal(false)
  })

  it('should return isShipOverGrid to false', () => {
    const _ship = {
      type: 4,
      name: 'Submarine',
      l: 1,
      cors: {
        '8x6': false
      }
    }
    const isShipOverGrid = Helper.isShipOverGrid(10, _ship.cors)
    expect(isShipOverGrid).to.be.equal(false)
  })

  it('should return isShipOverGrid to true', () => {
    const _ship = {
      type: 4,
      name: 'Submarine',
      l: 1,
      cors: {
        '0x-1': false
      }
    }
    const isShipOverGrid = Helper.isShipOverGrid(10, _ship.cors)
    expect(isShipOverGrid).to.be.equal(true)
  })

  it('should return isShipOverGrid to true', () => {
    const _ship = {
      type: 4,
      name: 'Submarine',
      l: 1,
      cors: {
        '14x6': false
      }
    }
    const isShipOverGrid = Helper.isShipOverGrid(10, _ship.cors)
    expect(isShipOverGrid).to.be.equal(true)
  })

  it('should return cors of vertical battleship', () => {
    const _ship = {
      type: 1,
      name: 'Battleship',
      l: 4
    }
    const battleship = {
      direction: 'vertical',
      type: 1,
      at: '10x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '10x7': false,
      '10x8': false,
      '10x9': false,
      '10x10': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of horizontal battleship', () => {
    const _ship = {
      type: 1,
      name: 'Battleship',
      l: 4
    }
    const battleship = {
      direction: 'horizontal',
      type: 1,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false,
      '2x7': false,
      '3x7': false,
      '4x7': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of horizontal Cruiser', () => {
    const _ship = {
      type: 1,
      name: 'Cruiser',
      l: 3
    }
    const battleship = {
      direction: 'horizontal',
      type: 2,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false,
      '2x7': false,
      '3x7': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of vertical Cruiser', () => {
    const _ship = {
      type: 1,
      name: 'Cruiser',
      l: 3
    }
    const battleship = {
      direction: 'vertical',
      type: 2,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false,
      '1x8': false,
      '1x9': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of horizontal Destroyer', () => {
    const _ship = {
      type: 1,
      name: 'Destroyer',
      l: 2
    }
    const battleship = {
      direction: 'horizontal',
      type: 3,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false,
      '2x7': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of vertical Destroyer', () => {
    const _ship = {
      type: 1,
      name: 'Destroyer',
      l: 2
    }
    const battleship = {
      direction: 'vertical',
      type: 3,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false,
      '1x8': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of horizontal Submarine', () => {
    const _ship = {
      type: 1,
      name: 'Submarine',
      l: 1
    }
    const battleship = {
      direction: 'horizontal',
      type: 4,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return cors of vertical Submarine', () => {
    const _ship = {
      type: 1,
      name: 'Submarine',
      l: 1
    }
    const battleship = {
      direction: 'vertical',
      type: 4,
      at: '1x7'
    }
    const cors = Helper.getCors(battleship, _ship)
    const expected = {
      '1x7': false
    }
    expect(cors).to.have.all.deep.keys(expected)
  })

  it('should return Battleship by getShip', () => {
    const { type, name, l } = Helper.getShip(1)
    expect(type).to.be.equal(1)
    expect(name).to.be.equal('Battleship')
    expect(l).to.be.equal(4)
  })

  it('should return Cruiser by getShip', () => {
    const { type, name, l } = Helper.getShip(2)
    expect(type).to.be.equal(2)
    expect(name).to.be.equal('Cruiser')
    expect(l).to.be.equal(3)
  })

  it('should return Destroyer by getShip', () => {
    const { type, name, l } = Helper.getShip(3)
    expect(type).to.be.equal(3)
    expect(name).to.be.equal('Destroyer')
    expect(l).to.be.equal(2)
  })

  it('should return Submarine by getShip', () => {
    const { type, name, l } = Helper.getShip(4)
    expect(type).to.be.equal(4)
    expect(name).to.be.equal('Submarine')
    expect(l).to.be.equal(1)
  })

  it('should return Miss', () => {
    const text = Helper._getSituation(0)
    expect(text).to.be.equal('Miss')
  })

  it('should return Hit', () => {
    const text = Helper._getSituation(1)
    expect(text).to.be.equal('Hit')
  })

  it('should return You just sank the X', () => {
    const text = Helper._getSituation(2, 'X')
    expect(text).to.be.equal('You just sank the X')
  })

  it('should return Win ! You completed the game in X moves', () => {
    const text = Helper._getSituation(3, 'X')
    expect(text).to.be.equal('Win ! You completed the game in X moves')
  })

  it('should return Miss', () => {
    const text = Helper.fireAndGetSituation(board, '10x6')
    expect(text).to.be.equal('Miss')
  })

  it('should return Hit', () => {
    const text = Helper.fireAndGetSituation(board, '10x7')
    expect(text).to.be.equal('Hit')
  })

  it('should return Hit', () => {
    const text = Helper.fireAndGetSituation(board, '10x8')
    expect(text).to.be.equal('Hit')
  })

  it('should return Hit', () => {
    const text = Helper.fireAndGetSituation(board, '10x9')
    expect(text).to.be.equal('Hit')
  })

  it('should return Win ! You completed the game in 0 moves', () => {
    const text = Helper.fireAndGetSituation(board, '10x10')
    expect(text).to.be.equal('Win ! You completed the game in 0 moves')
  })
})
