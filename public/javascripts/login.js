var app = angular.module('mytest',[]);
app.controller('logincontroller', function($scope,$http,$window){

	$scope.user = {}
	$scope.postdata = function(v){
		if((v.email != undefined)&&(v.password != undefined)){
			$http({
				method:'post',
				url:'/login',
				data:v
			}).then(function(success){
				console.log(success)
				alert("success")
				$scope.user = {}
				$window.location.href = '/home'
			},function(error){
				console.log(error)
				alert("error")
			})
		}
		else{
			alert("Please fill the details")
		}
	}

})