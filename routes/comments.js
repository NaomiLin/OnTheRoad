var express = require("express");
var router = express.Router();
var Travelspot = require("../models/travelspot");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//Comments new
router.get("/travelspots/:id/comments/new",middleware.isLoggedIn,function(req, res){
	Travelspot.findById(req.params.id, function(err, travelspot){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {travelspot: travelspot});
		}
	})
	
});

//Comments create
router.post("/travelspots/:id/comments",middleware.isLoggedIn,function(req, res){
	//lookup travelspot using ID
	Travelspot.findById(req.params.id, function(err, travelspot){
		if(err){
			console.log(err);
			res.redirect("/travelspots");
		} else{
			console.log(req.body.comment);
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "something went wrong");
					console.log(err);
				} else{
					//add username and id to comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					
					//save comment
					comment.save();
					travelspot.comments.push(comment);
					travelspot.save();
					req.flash("success","Successfully added comment");
					res.redirect("/travelspots/" + travelspot._id);
				}
			});
			
		}
	});
});
//COMMENT EDIT ROUTE
router.get("/travelspots/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit",{travelspot_id:req.params.id, comment: foundComment});
		}
	});
});
//COMMENT UPDATE
router.put("/travelspots/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/travelspots/" + req.params.id);
		}
	})
});
//COMMENT DESTROY ROUTE
router.delete("/travelspots/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req, res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success","Comment deleted");
			res.redirect("/travelspots/" + req.params.id);
		}
	});
});



module.exports = router;