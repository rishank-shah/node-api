const Post = require("../models/posts")
const formidable = require("formidable")
const fs = require('fs')
const _ = require('lodash')

exports.getPosts = (req,res)=>{
  const posts = Post.find().select("_id title body")
  .then((posts)=>{
    res.status(200).json({posts:posts})
  })
  .catch(err=> console.log(err)) 
}

exports.createPost = (req,res)=>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true
  form.parse(req,(err,fields,files)=>{
    if(err)
      return res.status(400).json({
        error: "Image couldn't be uploaded"
      })
    post = new Post(fields)
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    post.postedBy = req.profile
    if(files.photo){
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save((err,sucess)=>{
      if(err){
        return res.status(400).json({error: err})
      }
      res.status(200).json({post: sucess})
    })
  })
}

exports.postByUser = (req,res)=>{
  Post.find({postedBy:req.profile._id})
    .populate("postedBy","_id name")
    .sort("_created")
    .exec((err,post)=>{
      if(err)
        return res.status(400).json({
          error:err
        })
      res.json(post)
    })
}

exports.postById = (req,res,next,id)=>{
  Post.findById(id)
    .populate("postedBy","_id name")
    .exec((err,post)=>{
      if(err)
        res.status(400).json({
          error:err
        })
      req.post = post
      next()
    })
}

exports.isPoster = (req,res,next)=>{
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if(!isPoster)
    return res.status(403).json({
      error: "User not authorized"
    })
  next()
}

exports.deletePost = (req,res)=>{
  let post = req.post
  post.remove((err)=>{
    if(err)
      return res.status(400).json({
        error:err
      })
    res.json({
      message:"Post Deleted!!!"
    })
  })
}

exports.updatePost = (req,res,next)=>{
  let post = req.post
  post = _.extend(post,req.body)
  post.save((err)=>{
    if(err)
      return res.status(400).json({
          error: "You are not Authorised to perform this action"
      })
  })
  res.json({post})
}