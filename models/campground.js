var mongoose=require("mongoose")

var campgroundSchema= new mongoose.Schema({
    title:String,
  image:String,
  description:String,
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    },
    username:String
  },
  comments:[{type:mongoose.Schema.Types.ObjectId,//square brackets for array
               ref:"comment" }]
  })
  module.exports=mongoose.model("Campground",campgroundSchema);