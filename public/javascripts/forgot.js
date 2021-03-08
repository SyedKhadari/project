var app = angular.module('mytest',[]);
app.controller('forgotcontroller', function($scope,$http,$window){

	$scope.user = {}
	$scope.showotp = false 
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
		console.log(value)
		if((value.email != undefined) && (value.otp.length == 5)){
			$http({
				method:'post',
				url:'/checkotp',
				data:value
			}).then(function(success){
				console.log(success)
				alert("success")
			}, function(error){
				alert("Invalid OTP")
			})	
		}
		else{
			alert("Please Check Your OTP")
		}
	}	


})