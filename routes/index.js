var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/Project');
var collection = db.get("usersdata");
var collection2 = db.get("usertasks")
var moment = require('moment')

var CronJob = require('cron').CronJob;

var job = new CronJob('05 06 12 * * *', function() {
  console.log('You will see this message every second');
});

job.start();
/* GET home page. */
router.get('/dattaas', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postingdata', function(req,res){
	collection.insert(req.body, function(err,docs){
		if(err){
			res.sendStatus(500)
		}
		else{
			console.log(docs)
			res.sendStatus(200)
		}
	})
});

router.post('/updateuserdata', function(req,res){
	console.log(req.body)
	var data = {
		Username:req.body.username,
		Email:req.body.email,
		password:req.body.password
	}
	collection.update({"_id":req.body._id},{$set:req.body}, function(err,docs){
		if(err){
			res.sendStatus(500)
		}
		else{
			res.sendStatus(200)
		}
	})
})

router.get('/gettingusersdata', function(req,res){
	collection.find({}, function(err,docs){
		if(err){
			res.sendStatus(500)
		}
		else{
			res.send(docs)
		}
	})
})

router.get("/login", function(req,res){
	res.render('login')
})


router.post('/login', function(req,res){
	collection.findOne({"email":req.body.email,"password":req.body.password}, function(err,docs){
		if(err || (docs==null)){
			res.sendStatus(500)
		}
		else{
			req.session.user = docs
			res.sendStatus(200)
		}
	})
})


router.get('/home', function(req,res){
  if(req.session && req.session.user){
  	// console.log(req.session.user)
  	res.render('home', {user:req.session.user})
  }
  else{
  	req.session.reset()
  	res.redirect('/login')
  }	
})

router.get('/logout', function(req,res){
	req.session.reset()
	res.redirect('/login')
})

router.post("/posttask", function(req,res){
	if(req.session && req.session.user){
		// console.log(moment().format('DD-MM-YYYY'))
	var data = {
		task : req.body.task,
		user : req.session.user.email,
		date : moment().format('DD-MM-YYYY'),
		status : "Pending"
	}
	collection2.insert(data, function(err,docs){
		if(err){
			res.sendStatus(500)
		}
		else{
			res.sendStatus(200)
		}
	})
	}
})


router.get('/gettasks', function(req,res){
	if(req.session && req.session.user){
	collection2.find({'user':req.session.user.email,date:moment().format('DD-MM-YYYY')}, function(err,docs){
		if(err){
			res.sendStatus(500)
		}else{
			res.send(docs)
		}
	})
	}
})

router.post('/updatestatus', function(req,res){
	console.log(req.body)
	if(req.session && req.session.user){
		collection2.update({"_id":req.body._id},{$set:{"status":"Completed"}}, function(err,docs){
			if(err){
				res.sendStatus(500)
			}
			else{
				res.sendStatus(200)
			}
		})
	}
})

router.get('/forgot', function(req,res){
	res.render('forgot')
})


router.post('/forgot', function(req,res){
	console.log(req.body)
	collection.findOne({"email":req.body.email},function(err,docs){
		if(err || (docs==null)){
			res.sendStatus(500)
		}
		else{
			res.sendStatus(200)
		}
	})
})


module.exports = router;