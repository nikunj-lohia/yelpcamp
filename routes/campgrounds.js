var express=require("express");
var router=express.Router({mergeParams:true});
var campground=require("../models/campground");
var user=require("../models/user");
var mongoose=require("mongoose");

//================
//Campgrounds
//================
router.get("/",function(req,res)
    {
     campground.find({},function(error,campground){
       if(error){
         console.log("it is an error");
       }else{ res.render("campgrounds/index",{campgrounds:campground});}//req.user stores the info of user due to passpoert package
     })
   
    })
router.post("/",isLoggedIn,function(req,res){ 
    var image=req.body.image;
    var name=req.body.name;
    var description=req.body.description;
    var author={
      id:req.user._id,
      username:req.user.username
    }
    var newCampground={
        title:name,
        image:image,
        description:description,
        author:author
    }
  campground.create(newCampground,function(err,newlyCreated){
     if(err){
       console.log("asbc");
     }else{
       console.log(newlyCreated);
      res.redirect("/campgrounds");
     }
  })
console.log("hi");
});

router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/newCampground");
})                                                      //keeep :id below new or new will not work as it will treat new as an id
router.get("/:id",function(req,res){
  campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
    if(err)
    {
      console.log(err);
    }else
    {
    // console.log(foundcampground);
    res.render("campgrounds/show",{campground:foundcampground});
    }
  })
})
//==================
//EDIT CAMPGROUND ROUTE
//====================
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
   campground.findById(req.params.id,function(err,foundcampground){   
      res.render("campgrounds/edit",{campground:foundcampground});
    })
  })
//====================
//UPDATE CAMPGROUND ROUTE
//=================
router.put("/:id",checkCampgroundOwnership,function(req,res){
  campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err)
    {
      res.redirect("/campgrounds");
    }
    else
    { console.log(req.body.campground);
      res.redirect("/campgrounds/"+req.params.id);
    }
  })
})
//DESTROY ROUTE
router.delete("/:id",checkCampgroundOwnership,function(req,res){
  // res.send("you are trying to delete something"); 
  campground.findByIdAndRemove(req.params.id,function(err)
  {
    if(err)
    {
      res.redirect("/campgrounds");
    }else
    {
      res.redirect("/campgrounds");
    }
  })
})
function checkCampgroundOwnership(req,res,next){
  if(req.isAuthenticated()){
    campground.findById(req.params.id,function(err,foundcampground){
      if(err)
      {
        res.redirect("back");
      }
      else
      { 
        if(foundcampground.author.id.equals(req.user._id)){//cant do triple equals as one of them is a string and other is a object
        next();
        }
       else
        {
        res.redirect("back");
        } 
      }
    })
  }
  else{
   res.redirect("back");
  }
}
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = router;