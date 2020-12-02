const User = require("../models/user")
const _ = require("lodash")

exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if(err || !user)
            return res.status(400).json({
                error: "User not found"
            })
        req.profile = user
        next()
    })
}

exports.hasAuthorization = (req,res,next) =>{
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if(!authorized)
        return res.status(403).json({
            error:"User is not authorized"
        })
}

exports.allUsers = (req,res)=>{
    User.find((err,users)=>{
        if(err)
            return res.status(400).json({
                error:err
            })
        
        res.json({
            users: users
        })
    }).select("name email updated created")
}

exports.getUser = (req,res)=>{
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.updateUser= (req,res,next)=>{
    let user = req.profile
    user = _.extend(user,req.body)
    user.updated = Date.now()
    user.save((err)=>{
        if(err)
            return res.status(400).json({
                error: "You are not Authorised to perform this action"
            })
            user.hashed_password = undefined
            user.salt = undefined
            res.json({
                user: user
            })        
    })
}

exports.deleteUser = (req,res,next)=>{
    let user = req.profile;
    user.remove((err,user)=>{
        if(err)
            return res.status(400).json({
                error: err
            })
        user.hashed_password = undefined
        user.salt = undefined
        return res.json({
            message: "user deleted succesfully"
        })
    });
}