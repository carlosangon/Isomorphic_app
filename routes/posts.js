var express = require('express');
var router = express.Router();
var Post = require('./../models/posts');

// posts

router.get('/', ensureAuthenticated, function(req, res) {
  Post.find({}).exec(function(err, posts) {
  	res.render('posts/index', {posts: posts});
  });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

router.get('/', function(req, res, next) {
	Post.find({}).exec(function(err, posts) {
		if (err) {
			console.log("db error in GET /posts: " + err);
			next(err);
		}
	});
});

router.get('/new', ensureAuthenticated, function(req, res) {
  var post = new Post();
  res.render('posts/new', {post: post});
});;

router.get('/:id', function(req, res) {
  Post.findById(req.params.id).exec(function(err, post) {
    if (err) {
      console.log("db error in GET /posts: " + err);
      res.render('500');
    } else if (!post) {
      res.render('404');
    } else {
      res.render('posts/show', {post: post});
    }
  });
});

router.post('/', function(req, res) {
  var post = new Post(req.body);
  post.save(function(err) {
    if (err && err.name == "ValidationError") {
      res.locals.message = {'danger': err};
      res.render('posts/new', {post: post});
    } else if (err) {
      console.log("db error in POST /posts: " + err);
      res.render('500');
    } else {
      var url = '/posts/'+post.id;
      req.flash('success', 'A new post was created');
      res.redirect(url);
    }
  });
});
router.get('/:id/edit', function(req, res) {
  Post.findById(req.params.id).exec(function(err, post) {
    if (err) {
      console.log("db error in GET /posts: " + err);
      res.render('500');
    } else if (!post) {
      res.render('404');
    } else {
      res.render('posts/edit', {post: post});
    }
  });
});

router.put('/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      console.log("db find error in PUT /posts/" + req.params.id + ": " + err);
      res.render('500');
    } else if (!post) {
      res.render('404');
    } else {
      // update properties that can be modified. assumes properties are set in request body
      post.title = req.body.title;
      post.body = req.body.body;

      post.save(function(err) {
        if (err && err.name == "ValidationError") {
          res.locals.message = {'danger': err};
          res.render('posts/edit', {post: post});
        }
        else if (err) {
          console.log("db save error in PUT /posts/" + req.params.id + ": " + err);
          console.log(err.errors);
        } else {
          var url = '/posts/'+post.id;
          req.flash('success', 'Post updated');
          res.redirect(url);
        }
      });
    }
  });
});

router.delete('/:id', function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log("db save error in DELETE /posts/" + req.params.id + ": " + err);
      res.render('500');
    } else {
      req.flash('success', 'Post deleted');
      res.redirect('/posts');
    }
  });
});

module.exports = router;
