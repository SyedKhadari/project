var app = angular.module('mytest',[]);
app.controller('forgotcontroller', function($scope,$http,$window){

	$scope.user = {}
	$scope.postdata = function(v){
		if(v.email != undefined){
			$http({
				method:'post',
				url:'/forgot',
				data:v
			}).then(function(success){
				console.log(success)
				alert("Please Check your Mail Id")
			},function(error){
				console.log(error)
				alert("Please enter Valid Mail address")
			})
		}
		else{
			alert("Please enter your email")
		}
	}

})