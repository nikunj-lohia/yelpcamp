var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var methodOverride=require("method-override");
var LocalStrategy=require("passport-local");
var campground=require("./models/campground");
var comment=require("./models/comments");
var user=require("./models/user");
var seedDB=require("./seed");
//==================================//
var campgroundRoutes=require("./routes/campgrounds");
var   commentRoutes=require("./routes/comments");
var   indexRoutes=require("./routes/index");
   
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/yelp_camp_v9")
//seed the data base;
// seedDB();
//==============
//passport
//===============
app.use(require("express-session")({
  secret:"nikunj is a hero",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser())
//===========================
app.set("view engine","ejs");
//a kind of middleware to pass info to all the routes about the current user
app.use(function(req,res,next){
  res.locals.currentUser=req.user;//every route will have req.user as currentUser
  next()//without these the code will stop
})
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);
app.listen(3000,function(){
    console.log("hi i am server fuck you");
});