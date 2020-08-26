var Travelspot = require("../models/travelspot");
var Comment = require("../models/comment");
//all middleware goes here
var middlewareObj = {};

middlewareObj.checkTravelspotOwnership = function(req, res, next){
	
	if(req.isAuthenticated()){
		Travelspot.findById(req.params.id, function(err, foundTravelspot){
		if(err){
			req.flash("error","Travelspot not found");
			res.redirect("back");
		} else{
		//does the user own the travelspot
			if(foundTravelspot.author.id.equals(req.user._id)){
				next();
			} else{
				req.flash("error","You don't have the permission to do that");
				res.redirect("back");
			}
		}
		});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}

}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
		//does the user own the comment
			if(foundComment.author.id.equals(req.user._id)){
				next();
			} else{
				req.flash("error","You don't have the permission to do that");
				res.redirect("back");
			}
		}
		});
	}else{
		eq.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}



module.exports = middlewareObj;