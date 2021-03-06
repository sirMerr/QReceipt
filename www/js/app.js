// Ionic Starter App
/* global angular: true cordova: true StatusBar: true alert: true window: true */

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
const app = angular.module('starter', ['ionic', 'ngMockE2E', 'ngCordova', 'ion-floating-menu'])

.run($ionicPlatform => {
	$ionicPlatform.ready(() => {
		if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(($stateProvider, $urlRouterProvider, USER_ROLES) => {
	$stateProvider
  .state('login', {
	url: '/login',
	templateUrl: 'templates/login.html',
	controller: 'LoginCtrl'
})
  .state('main', {
	url: '/',
	abstract: true,
	templateUrl: 'templates/main.html'
})
  .state('main.dash', {
	url: 'main/dash',
	views: {
		'dash-tab': {
			templateUrl: 'templates/dashboard.html',
			controller: 'DashCtrl'
		}
	}
})
  .state('main.public', {
	url: 'main/public',
	views: {
		'public-tab': {
			templateUrl: 'templates/public.html'
		}
	}
})
  .state('main.admin', {
	url: 'main/admin',
	views: {
		'admin-tab': {
			templateUrl: 'templates/admin.html'
		}
	},
	data: {
		authorizedRoles: [USER_ROLES.admin]
	}
});

  // Thanks to Ben Noblet!
	$urlRouterProvider.otherwise(($injector, $location) => {
		const $state = $injector.get('$state');
		$state.go('main.dash');
	});
})

.run($httpBackend => {
	$httpBackend.whenGET('http://localhost:8100/valid')
        .respond({ message: 'This is my valid response!' });
	$httpBackend.whenGET('http://localhost:8100/notauthenticated')
        .respond(401, { message: 'Not Authenticated' });
	$httpBackend.whenGET('http://localhost:8100/notauthorized')
        .respond(403, { message: 'Not Authorized' });

	$httpBackend.whenGET(/templates\/\w+.*/).passThrough();
})

 .run(($rootScope, $state, AuthService, AUTH_EVENTS) => {
	$rootScope.$on('$stateChangeStart', (event, next, nextParams, fromState) => {
		if ('data' in next && 'authorizedRoles' in next.data) {
			const authorizedRoles = next.data.authorizedRoles;
			if (!AuthService.isAuthorized(authorizedRoles)) {
				event.preventDefault();
				$state.go($state.current, {}, { reload: true });
				$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			}
		}

		if (!AuthService.isAuthenticated()) {
			if (next.name !== 'login') {
				event.preventDefault();
				$state.go('login');
			}
		}
	});
});

app.controller('BarcodeCtrl', ($scope, $cordovaBarcodeScanner, $rootScope) => {
$scope.list=[];

	$scope.scanBarcode = function () {
		$cordovaBarcodeScanner.scan().then(imageData => {
			$rootScope.$broadcast('SOME_TAG', 'your value');
			$scope.list.push(imageData.text);
			//alert($scope.list);
			console.log('Barcode Format -> ' + imageData.format);
			console.log('Cancelled -> ' + imageData.cancelled);
		}, error => {
			console.log('An error happened -> ' + error);
		});
	};
});
