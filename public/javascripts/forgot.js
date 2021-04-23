var app = angular.module('mytest',[]);
app.controller('forgotcontroller', function($scope,$http,$window){

	$scope.user = {}
	$scope.showotp = false 
	$scope.Password = false
	$scope.postdata = function(v){
		if(v.email != undefined){
			$http({
				method:'post',
				url:'/forgot',
				data:v
			}).then(function(success){
				console.log(success)
				alert("Please Check your Mail")
				$scope.showotp = true
			},function(error){
				console.log(error)
				alert("Please enter Valid Mail address")
			})
		}
		else{
			alert("Please enter your email")
		}
	}

	$scope.sendotp = function(value){
		// console.log(value)
		if((value.email != undefined) && (value.otp.length == 5)){
			$http({
				method:'post',
				url:'/checkotp',
				data:value
			}).then(function(success){
				console.log(success)
				alert("success")
				$scope.showotp = false
				$scope.Password = true
			}, function(error){
				alert("Invalid OTP")
			})	
		}
		else{
			alert("Please Check Your OTP")
		}
	}	

	$scope.sendpassword = function(user){
		if((user.newpassword != undefined) && (user.cpassword != undefined)){
			if((user.newpassword.length >= 8) && (user.cpassword.length >= 8)){
				if(user.newpassword == user.cpassword){
					$http({
						method:'post',
						url:'/changepassword',
						data:user
					}).then(function(success){
						alert("success updated")
					}, function(error){
						alert("error")
					})
				}
				else{
					alert("Please Check the Password")
				}	
			}
			else{
				alert("Min length 8")
			}
		}
		else{
			alert('Please fill the Fields')
		}
	}
 
})