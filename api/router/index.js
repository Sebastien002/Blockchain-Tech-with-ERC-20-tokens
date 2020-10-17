const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController')

// check_expire = async(req,res,next) =>{
//     next();
// }

router.use('/erc20',mainController);

module.exports = router;