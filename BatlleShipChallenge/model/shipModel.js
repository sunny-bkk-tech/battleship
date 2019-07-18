let mongoose = require('mongoose');
const APIError = require('../conf/APIError');
let ShipSchema = new mongoose.Schema({
  // squareSize
  name: {
    type: String,
    required: true
  },
  l: {
    type: Number,
    required: true
  }
})

ShipSchema.statics = {
  async get(id) {
    const ship = await this.findById(id).exec()
    if (ship) {
      return ship
    }
      const err = new APIError('No such a ship exists!', httpStatus.NOT_FOUND)
    throw err
  }
}

mongoose.plugin(schema => { schema.options.usePushEach = true });
mongoose.model('Ship', ShipSchema);