var mongoose = require("mongoose");
var Travelspot = require("./models/travelspot");
var Comment   = require("./models/comment");
 
var data = [
   
]
 
function seedDB(){
   //Remove all campgrounds
   Travelspot.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Travelspot.create(seed, function(err, travelspot){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a travelspot");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    travelspot.comments.push(comment);
                                    travelspot.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;
