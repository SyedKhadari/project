var app = angular.module('mytest',[]);
app.controller('homecontroller', function($scope,$http,$window){

	$scope.user = {}
	$scope.usertasks = []
	$scope.posttask = function(v){
		if(v.task != undefined){
			$http({
				method:'post',
				url:'/posttask',
				data:v
			}).then(function(success){
				console.log(success)
				$scope.user= {}
			},function(error){
				console.log(error)
				alert("error")
			})
		}
		else{
			alert("Please fill the tasks")
		}
	}

	$scope.getdata = function(){
		$http({
			method:'get',
			url:"/gettasks"
		}).then(function(success){
			$scope.usertasks = success.data
		}, function(error){
			$scope.usertasks = []
		})
	}

	$scope.updatestatus = function(user){
		$http({
				method:'post',
				url:'/updatestatus',
				data:user
			}).then(function(success){
				console.log(success)
			},function(error){
				console.log(error)
				alert("error")
			})
	}

})