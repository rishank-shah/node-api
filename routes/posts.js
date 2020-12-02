const express = require('express');
const postController = require("../controllers/post")
const router = express.Router()
const {check,validationResult } = require('express-validator')
const {requireSignin} = require("../controllers/auth")
const {userById} = require("../controllers/user")


router.get("/posts",postController.getPosts)

router.post("/post/new/:userId",requireSignin,postController.createPost,[
  check('title',"Write A Title").notEmpty()
  ,check("title","Title must be between 4 to 150 characters").isLength({
      min:4,
      max:150
    })
  ,check('body',"Write A Body").notEmpty()
  ,check("body","Body must be between 4 to 2000 characters").isLength({
        min:4,
        max:2000
      })
  ],
  (req,res,next)=>{
    const error = validationResult(req)
        if(!error.isEmpty()){
          return res.status(422).json(error.array()[0])
        }
    next()
  }
)

router.get("/posts/by/:userId",requireSignin,postController.postByUser)

router.delete("/post/:postId",requireSignin,postController.isPoster,postController.deletePost)

router.put("/post/:postId",requireSignin,postController.isPoster,postController.updatePost)

router.param("userId",userById)

router.param("postId",postController.postById)

module.exports = router;
