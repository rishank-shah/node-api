const express = require('express');
const app = express()
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require("cors")
dotenv.config()

app.use(cors())
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,useUnifiedTopology:true })
  .then(()=>{console.log("DB Connected Sucessfully")})

mongoose.connection.on('error',err=>{
  console.log(`DB connection error: ${err}`)
})

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.get("/",(req,res)=>{
  res.json({
    "/" : "api docs",
    "/signup" : "signup",
    "/signout" : "signout",
    "/signin" : "signin",
    "/posts" : "get all Posts",
    "/post/new/:userId" : "create a new post",
    "/posts/by/:userId" : "get posts by user",
    "/post/:postId" : "update/delete user",
    "/users" : "get all users",
    "/users/:userId" : "(get user by id)/(update user)/(delete user)"
})
})

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/",postRoutes);
app.use("/",authRoutes);
app.use('/',userRoutes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error : 'Unauthorized User'});
  }
  next()
});

const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`Node JS Api is listening on port : ${port}`);
  }    
);
