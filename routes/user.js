const express = require("express")
const router = express.Router()
const {allUsers,userById, getUser, updateUser, deleteUser,userPhoto,addFollowing,addFollower,removeFollowing,removeFollower,findUsers} = require("../controllers/user")
const {requireSignin} = require("../controllers/auth")

router.put("/user/follow", requireSignin, addFollowing, addFollower);

router.put('/user/unfollow',requireSignin,removeFollowing,removeFollower)

router.get('/users',allUsers)

router.get('/users/:userId',requireSignin,getUser)

router.put('/user/:userId',requireSignin,updateUser)

router.delete('/user/:userId',requireSignin,deleteUser)

router.get('/user/photo/:userId',userPhoto)

router.get('/user/findUsers/:userId',requireSignin,findUsers)

router.param("userId",userById)

module.exports = router;
