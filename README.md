#### # Starting the project

`npm install --save`
`npm start`
`npm test`

###### Load current board if created

Path: http://localhost:3000/
router.route('/')
    /** GET /api/boards - Get list of boards */
router.route('/api/board')
    /** POST /api/boards - Create new board */
router.route('/api/boards/:boardId')
    /** GET /api/boards/:boardId - Get board */
router.route('/api/ship/:boardId')
    /** POST /api/boards - Defender add ship to the game */
router.route('/api/attack/:boardId/')
    /** POST /api/boards - Attacker fire the secret ship */
router.route('/api/reset/:boardId')
    /** DELETE /api/boards/:boardId - Reset Game */
/** Load board when API with boardId route parameter is hit */
router.param('boardId', boardCtrl.load);

`npm test`

##### Note: during the test it is required to change _id of board with real record id to pass the tests 
###### # Developed by Sunjay Kumar
###### # Contact via email: sunjay.st116605@gmail.com