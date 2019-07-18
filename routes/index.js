let boardModel = require('../model/boardModel');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let boardAPi = mongoose.model('Board');
const boardCtrl = require('../controllers/boardCtrl')

router.get('/welcome',(req,res,next) =>{
    res.send('Welcome to BattleShip')
})

router.route('/')
    /** GET /api/boards - Get list of boards */
    .get(boardCtrl.list)

router.route('/api/board')
    /** POST /api/boards - Create new board */
    .post(boardCtrl.create)

router.route('/api/boards/:boardId')
    /** GET /api/boards/:boardId - Get board */
    .get(boardCtrl.get)


router.route('/api/ship/:boardId')
    /** POST /api/boards - Defender add ship to the game */
    .post(boardCtrl.placeShip)

router.route('/api/attack/:boardId/')
    /** POST /api/boards - Attacker fire the secret ship */
    .post(boardCtrl.fire)


router.route('/api/reset/:boardId')
    /** DELETE /api/boards/:boardId - Delete board */
    .delete(boardCtrl.remove)

/** Load board when API with boardId route parameter is hit */
router.param('boardId', boardCtrl.load);

module.exports = router;

//coder: Sunjay kumar

//For further details open README.md
