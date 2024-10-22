const Post = require("../models/posts")
const formidable = require("formidable")
const fs = require('fs')
const _ = require('lodash')
const mongoose = require('mongoose')

exports.getPosts = (req,res)=>{
  const posts = Post.find()
  .populate("postedBy", "_id name")
  .populate("comments", "text created")
  .populate("comments.postedBy", "_id name")
  .select("_id title body created likes")
  .sort({ created: -1 })
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
    .select('_id title body created likes')
    .sort("_created")
    .exec((err,posts)=>{
      if(err)
        return res.status(400).json({
          error:err
        })
      res.json(posts)
    })
}

exports.postById = (req,res,next,id)=>{
  Post.findById(id)
    .populate("postedBy","_id name")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
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

exports.updatePost= (req,res,next)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error: "Image couldn't be uploaded"
            })
        }
        let post = req.post
        post = _.extend(post,fields)
        post.updated = Date.now()
        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:err
                })
            }
            res.json(post)
        })
    })
}

exports.postPhoto = (req,res,next) =>{
  res.set("Content-Type",req.post.photo.contentType)
  return res.send(req.post.photo.data);
}

exports.onePost = (req, res) => {
  return res.json(req.post);
};

exports.likePost = (req,res)=>{
  Post.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.postId), 
    {$push: {likes: mongoose.Types.ObjectId(req.body.userId)}},
    {new:true})
    .exec((err,result)=>{
      if(err){
        return res.status(400).json({error:err})
      }
      res.json(result);
    })
}

exports.unlikePost = (req,res)=>{
  Post.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.postId), 
    {$pull: {likes: mongoose.Types.ObjectId(req.body.userId)}},
    {new:true})
    .exec((err,result)=>{
      if(err){
        return res.status(400).json({error:err})
      }
      res.json(result);
    })
}

exports.commentPost = (req,res)=>{
  let comment = req.body.comment
  comment.postedBy = mongoose.Types.ObjectId(req.body.userId);
  Post.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.postId), 
    {$push: {comments: comment}},
    {new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((err,result)=>{
      if(err){
        return res.status(400).json({error:err})
      }
      res.json(result);
    })
}

exports.uncommentPost = (req,res)=>{
  let comment = req.body.comment
  Post.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.postId), 
    {$pull: {comments: {_id:comment._id}}},
    {new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((err,result)=>{
      if(err){
        return res.status(400).json({error:err})
      }
      res.json(result);
    })
}