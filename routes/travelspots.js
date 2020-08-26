var express = require("express");
var router = express.Router();
var Travelspot = require("../models/travelspot");
var middleware = require("../middleware");
//INDEX -show all travelspots
router.get("/travelspots", function(req, res){
	
	//Get all travelspots from DB
	Travelspot.find({}, function(err, allTravelspots){
		if(err){
			console.log(err);
		} else{
			res.render("travelspots/index", {travelspots: allTravelspots, currentUser: req.user});
		}
	});
});


//CREATE - add new travelspot to DB
router.post("/travelspots",middleware.isLoggedIn,function(req, res){
	//get data from form and add to travelspots array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author ={
		id: req.user._id,
		username:req.user.username
	}
	var newTravelspots = {name: name, image: image, description: desc, author: author};
	//create a new travelspot and save to DB
	Travelspot.create(newTravelspots, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//redirect to travelsites page
			res.redirect("/travelspots");
		}
	});
});

//NEW - show form to create new travelspot
router.get("/travelspots/new",middleware.isLoggedIn,function(req, res){
	res.render("travelspots/new");
});

//SHOW - show more info about one travelspot
router.get("/travelspots/:id", function(req,res){
	//find travelspot with provided ID
	Travelspot.findById(req.params.id).populate("comments").exec(function(err, foundTravelspot){
		if(err){
			console.log(err);
		} else{
			console.log(foundTravelspot);
				//render show template
				res.render("travelspots/show",{travelspot: foundTravelspot});
		}
	});
});

//EDIT ROUTE
router.get("/travelspots/:id/edit", middleware.checkTravelspotOwnership,function(req,res){
		Travelspot.findById(req.params.id, function(err, foundTravelspot){
				res.render("travelspots/edit",{travelspot: foundTravelspot});
		});
});

//UPDATE ROUTE
router.put("/travelspots/:id",middleware.checkTravelspotOwnership,function(req, res){
	//find and update the correct travelspot
	Travelspot.findByIdAndUpdate(req.params.id, req.body.travelspot, function(err, updatedTravelspot){
		if(err){
			res.redirect("/travelspots");
		} else{
			res.redirect("/travelspots/" + req.params.id);
		}
	});
	//redirect somewhere
});

//DESTROY ROUTE
router.delete("/travelspots/:id",middleware.checkTravelspotOwnership, function(req,res){
	Travelspot.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/travelspots");
		} else{
			res.redirect("/travelspots");
		}
	});
});


module.exports = router;