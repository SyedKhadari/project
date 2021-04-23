var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/TestTask');
var collection = db.get("usersdata");
var collection2 = db.get("usertasks")
var collection3 = db.get("userpic")
var login = db.get("login");
var moment = require('moment')
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })


var CronJob = require('cron').CronJob;

var job = new CronJob('05 06 12 * * *', function() {
  console.log('You will see this message every second');
});

job.start();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
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
	res.render('login2')
})


router.post('/login', function(req,res){
	login.findOne({"username":req.body.email,"password":req.body.password}, function(err,docs){
		if(err || (docs==null)){
			res.sendStatus(500)
		}
		else{
			// req.session.user = docs
			res.sendStatus(200)
		}
	})
})


router.get('/home', function(req,res){
  res.render('home')
  // if(req.session && req.session.user){
  // 	// console.log(req.session.user)
  // }
  // else{
  // 	req.session.reset()
  // 	res.redirect('/login')
  // }	
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
	// console.log(req.body)
var string = randomstring.generate({
				  length: 5,
				  charset: 'numeric'
				});

	collection.findOne({"email":req.body.email},function(err,docs){
		if(err || (docs==null)){
			res.sendStatus(500)
		}
		else{
			collection.update({"email":docs.email},{$set:{"OTP":string}})
			var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
			    user: 'syedkhadariafrid@gmail.com',
			    pass: '7794943053'
			  }
			});

			var mailOptions = {
			  from: 'syedkhadariafrid@gmail.com',
			  to: 'syedkhadariafrid@gmail.com',
			  subject: 'Sending OTP',
			  text: 'Your OTP is '+string
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
			res.sendStatus(200)
		}
	})
})


router.post('/checkotp', function(req,res){
	collection.findOne({"email":req.body.email,"OTP":req.body.otp},function(err,docs){
		if(err || (docs==null)){
			res.sendStatus(500)
		}
		else{
			res.sendStatus(200)
		}
	})
})


router.post('/changepassword', function(req,res){
	// console.log(req.body)
	collection.update({"email":req.body.email,"OTP":req.body.otp},{$set:{"password":req.body.newpassword}}, function(err,docs){
		console.log(docs)
		if(docs.nModified == 1){
			res.sendStatus(200)
		}
		else{
			res.sendStatus(500)
		}
	})
})


// router.get('/', function(req,res){
// 	collection3.find({},function(err,docs){
// 		if(err){
// 			console.log(err)
// 		}
// 		else{
// 			// console.log(docs)
// 			res.render('fileupload', {data:docs})
// 		}
// 	})
// })

router.post('/postfile',upload.single('file'), function(req,res){
	console.log(req.file)
	console.log(req.body)
	collection3.insert({"email":req.body.email,"myfile":req.file.originalname}, function(err,docs){
		if(err){
			res.sendStatus(500)
		}
		else{
			console.log(docs)
			res.redirect('/')
		}
	})

})


module.exports = router;