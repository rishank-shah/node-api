const express = require("express")
const router = express.Router()
const {allUsers,userById, getUser, updateUser, deleteUser,userPhoto,addFollowing,addFollower,removeFollowing,removeFollower} = require("../controllers/user")
const {requireSignin} = require("../controllers/auth")
const {check,validationResult } = require('express-validator')

router.put("/user/follow", requireSignin, addFollowing, addFollower);

router.get('/users',allUsers)

router.get('/users/:userId',requireSignin,getUser)

router.put('/user/:userId',requireSignin,updateUser)

router.delete('/user/:userId',requireSignin,deleteUser)


router.put('/user/unfollow',requireSignin,removeFollowing,removeFollower)

router.get('/user/photo/:userId',userPhoto)



router.param("userId",userById)

module.exports = router;
