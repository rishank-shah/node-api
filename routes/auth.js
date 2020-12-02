const express = require("express")
const router = express.Router()
const { signup,signin, signout } = require('../controllers/auth')
const {check,validationResult } = require('express-validator')
const {userById} = require("../controllers/user")

router.post('/signup',[
    check('name','Name cannot be null').notEmpty(),
    check('name','Name should be between 4 to 10 characters').isLength({min:4,max:10}),
    check('email','Email cannot be empty').notEmpty(),
    check('email','Email is not Valid').matches(/.+\@.+\..+/).isLength({min:4,max:35}),
    check('password','Password is required').notEmpty(),
    check('password','Password must contain 6 characters').isLength({min:6,max:100}),
    check('password','Password must contain a digit').matches(/\d/)
  ],(req,res,next)=>{
      const error = validationResult(req)
          if(!error.isEmpty()){
            return res.status(400).json({error:error.array()[0]})
          }
      next()
    }
  ,signup);

router.post('/signin',signin);

router.get('/signout',signout);

router.param("userId",userById)

module.exports = router