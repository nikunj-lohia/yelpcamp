var express=require("express");
var router=express.Router({mergeParams:true});
var campground=require("../models/campground");
var comment=require("../models/comments");
//======================================================//
//comment routes
//adding new route for comments as a get request//comment route//
router.get("/new",isLoggedIn,function(req,res){
    //find campground by id and send it to the comment
    campground.findById(req.params.id,function(err,campground)
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        res.render("comments/newComment",{campground:campground});
      }
    })
  
  });
  //======================================================//
  router.post("/",isLoggedIn,function(req,res){
    //look up campground using ID
    campground.findById(req.params.id,function(err,campground)
     {
       if(err)
       {
         console.log(err);
         res.redirect("/campgrounds");
       }
      else
      {
        comment.create(req.body.comment,function(err,comment)
        {
          if(err)
          {
            console.log(err);
          }
          else
          {
            // console.log(req.user.username);
            // add username and id to comments
            // save comments
            comment.author.id=req.user._id;
            comment.author.username=req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/'+campground._id);
          }
        });
      }
     })
    //create new comment
    //connect new comment to campground
    //redirect caampground show page
  });
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }
module.exports = router;
