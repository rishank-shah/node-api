const express = require("express")
const router = express.Router()
const {allUsers,userById, getUser, updateUser, deleteUser} = require("../controllers/user")
const {requireSignin} = require("../controllers/auth")
const {check,validationResult } = require('express-validator')

router.get('/users',allUsers)

router.get('/users/:userId',requireSignin,getUser)

router.put('/user/:userId',requireSignin,updateUser)

router.delete('/user/:userId',requireSignin,deleteUser)

router.param("userId",userById)

module.exports = router;
