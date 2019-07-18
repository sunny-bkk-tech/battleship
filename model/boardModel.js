let mongoose = require('mongoose');
let toJson = require('meanie-mongoose-to-json');
const APIError = require('../conf/APIError');
const httpStatus = require('http-status')
const Schema = mongoose.Schema

let boardGameSchema = new mongoose.Schema({
     // size of square grid
     square_grid: {
      type: Number,
      required: true
    },

    ship_destroyed: {
      type: Number,
      default: 0
    },
  
    state: {
      type: Number,
      default: 0
    },
   
    fired: [{
      type: String
    }],
   
    ships: [{
    
      type: {
        type: Number
      },
     
      name: {
        type: String
      },
     
      l: {
        type: Number
      },
     
      destroyed: {
        type: Boolean,
        default: false
      },
      /*
       * corrodinates of the ship
       */
      cors: Schema.Types.Mixed
    }]

},{ versionKey: false });
boardGameSchema.method({
})

boardGameSchema.statics = {
  /**
   * List boards in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of boards to be skipped.
   * @param {number} limit - Limit number of boards to be returned.
   * @returns {Promise<Board[]>}
   */
  list ({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({
        createdAt: -1
      })
      .skip(+skip)
      .limit(+limit)
      .exec()
  },

  /**
   * Get board
   * @param {ObjectId} id - The objectId of board.
   * @returns {Promise<Board, APIError>}
   */
  async get (id) {
    const board = await this.findById(id).exec()
    if (board) {
      return board
    }
   const err = new APIError('No such a board exists!', httpStatus.NOT_FOUND)
    throw err;
  }
}
mongoose.plugin(schema => { schema.options.usePushEach = true });
boardGameSchema.plugin(toJson);
mongoose.model('Board', boardGameSchema);

module.exports = boardGameSchema
