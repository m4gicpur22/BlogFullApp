var bodyParser = require("body-parser"),
methodOverride =require("method-override"),
mongoose    = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
express     = require("express"),
app         = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer);
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//INDEX
app.get("/", function(req, res){
   res.redirect("/blogs") 
});

//INDEX
app.get("/blogs", function(req,res){
    
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!");
        }
        else {
            res.render("index", {blogs: blogs});
        }
    });
});
//NEW
app.get("/blogs/new", function(req, res){
    res.render("new"); 
});
//CREATE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       }
   }); 
});
//SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog});
        }
    });
});
/*Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
    body: "HELLO THIS IS A BLOG POST!"
});*/
//EDIT
app.get("/blogs/:id/edit", function(req, res){
    
Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
        res.redirect("/blogs")
    }
    else{
        res.render("edit", {blog: foundBlog});
    }
});
});
//UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
        res.redirect("/blogs");
    }else{
        res.redirect("/blogs/" + req.params.id);
    }
    
    });
});
//DELETE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING");
});