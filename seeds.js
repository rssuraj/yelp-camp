var mongoose = require(`mongoose`);
var Campground =  require(`./models/campground`);
var Comment = require(`./models/comment`);

var data = [
    {
        name: `Muddy Mud`,
        image: `https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    },
    {
        name: `Nature And Water`,
        image: `https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    },
    {
        name: `Alone in the woods`,
        image: `https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60`,
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    }
];

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log(`Removed Campgrounds!`)

        Comment.remove({}, (err) => {
            if(err) {
                console.log(err);
            }
            console.log(`Removed Comments`);

            //Add a few Campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(`Added a Campground - ${campground}`);

                        //Create a Comment for this Campground
                        Comment.create(
                            {
                                text: `This place is great, but I wish there was internet`,
                                author: `Homer`
                            }, (err, comment) => {
                                if(err) {
                                    console.log(err);
                                }
                                else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log(`Created a new Comment ${comment} `);
                                }
                            }
                        );
                    }
                });
            });
        });
    });
}

module.exports = seedDB;