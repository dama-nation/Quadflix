import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default:""
    },
    searchHistory:{
        type: Array,
        default:[]
    },
    myList: {
        type: Array,
        default: []
    },
    ratings: {
        type: Array,
        default: []
    },
    watchHistory: {
        type: Array,
        default: []
    }
})

const User =  mongoose.model("User", userSchema)
export default User



// password: 3uC2ISELLmRgwJID
// username: adamachide_db_user
// connection string: mongodb+srv://adamachide_db_user:3uC2ISELLmRgwJID@cluster0.7nkg8bb.mongodb.net/?appName=Cluster0