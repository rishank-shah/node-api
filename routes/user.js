const express = require("express")
const router = express.Router()
const {allUsers,userById, getUser, updateUser, deleteUser} = require("../controllers/user")
const {requireSignin} = require("../controllers/auth")
const {check,validationResult } = require('express-validator')

router.get('/users',allUsers)

router.get('/users/:userId',requireSignin,getUser)

router.put('/user/:userId',requireSignin,[
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
  ,updateUser)

router.delete('/user/:userId',requireSignin,deleteUser)

router.param("userId",userById)

module.exports = router;
