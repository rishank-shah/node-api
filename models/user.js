const moongoose = require("mongoose")
const uuidv1 = require("uuidv1")
const crypto = require("crypto")

const userSchema = new moongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt:String,
    created:{
        type:Date,
        default:Date.now()
    },
    updated:Date,
    photo:{
        data: Buffer,
        contentType: String
    }
})

userSchema
    .virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

userSchema.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
},

module.exports = moongoose.model("User",userSchema)


