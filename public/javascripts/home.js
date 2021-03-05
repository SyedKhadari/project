var app = angular.module('mytest',[]);
app.controller('indexcontroller', function($scope,$http){

	$scope.user = {}
	$scope.usersdata = []

	$scope.update = false

	$scope.postdata = function(v){
		// console.log(v)
		if(v.username != undefined){
			$http({
				method:'post',
				url:'/postingdata',
				data:v
			}).then(function(success){
				console.log(success)
			},function(error){
				console.log(error)
			})
			$scope.usersdata.push(v)
			$scope.user = {}
		}
		// console.log($scope.usersdata)
	}

	$scope.deletedata = function(index,val){
		// console.log(index)
		// console.log(val)
		$scope.usersdata.splice(index, 1)
	}

	$scope.getdata = function(){
		$http({
			method:'get',
			url:'/gettingusersdata'
		}).then(function(success){
			console.log(success.data)
			$scope.usersdata = success.data
		}, function(error){
			alert("error")
			$scope.usersdata = []
		})
	}

	$scope.updatedata = function(index,val){
		$http({
			method:'post',
			url:'/updateuserdata',
			data:val
		}).then(function(success){
			// console.log(success)
			alert("successfully updated")
		}, function(error){
			alert("error")
		})
	}

})