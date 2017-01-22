angular.module('starter')

	.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
		$scope.username = AuthService.username();

		$scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
			const alertPopup = $ionicPopup.alert({
				title: 'Unauthorized!',
				template: 'You are not allowed to access this resource.'
			});
		});

		$scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
			AuthService.logout();
			$state.go('login');
			const alertPopup = $ionicPopup.alert({
				title: 'Session Lost!',
				template: 'Sorry, You have to login again.'
			});
		});

		$scope.setCurrentUsername = function(name) {
			$scope.username = name;
		};
	})
	.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
		$scope.data = {};

		$scope.login = function(data) {
			AuthService.login(data.username, data.password).then(function(authenticated) {
				$state.go('main.dash', {}, {
					reload: true
				});
				$scope.setCurrentUsername(data.username);
			}, function(err) {
				const alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Please check your credentials!'
				});
			});
		};
	})
	.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
		const sampleItems = ['Domain', 'Hosting', 'Web Design', 'Cake', 'Books', 'Paper', 'Shirt'];
		const samplePrices = ['$10.00', '$20.00', '$30.00', '$40.00', '$50.00', '$60.00', '$70.00', '$80.00'];
		$scope.groups = [{
			name: 'NameCheap',
			items: []
		}, {
			name: 'Loblaws',
			items: []
		}, {
			name: 'Paper Store',
			items: []
		}];
		for (var i = 0; i < 3; i++) {
			// $scope.groups[i] = {
			// 	name: i,
			// 	items: []
			// };
			for (var j = 1; j < 4; j++) {
				const random = Math.round(Math.random() * 6);
				$scope.groups[i].items.push(j + '. ' + sampleItems[random] + ' ------ ' + samplePrices[random]);
			}
		}

		$scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};
		$scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		};

		$scope.logout = function() {
			AuthService.logout();
			$state.go('login');
		};

		$scope.performValidRequest = function() {
			$http.get('http://localhost:8100/valid').then(
				function(result) {
					$scope.response = result;
				});
		};

		$scope.performUnauthorizedRequest = function() {
			$http.get('http://localhost:8100/notauthorized').then(
				function(result) {
					// No result here..
				},
				function(err) {
					$scope.response = err;
				});
		};

		$scope.performInvalidRequest = function() {
			$http.get('http://localhost:8100/notauthenticated').then(
				function(result) {
					// No result here..
				},
				function(err) {
					$scope.response = err;
				});
		};
	});
