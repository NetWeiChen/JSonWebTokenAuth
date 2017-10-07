
//calling order:
//app.config()  
//app.run()     
//directive's compile functions (if they are found in the dom)
//app.controller()
//directive's link functions (again, if found)
(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }
//Run blocks - get executed after the injector is created and are  used to kickstart the      application. Only instances and constants can be injected into run blocks. This is to prevent      further system configuration during application run time.
//Run blocks are the closest thing in Angular to the main method. A run  block is the code which needs to run to kickstart the application. It  is executed after all of the service have been configured and the  injector has been created. Run blocks typically contain code which is  hard to unit-test, and for this reason should be declared in isolated  modules, so that they can be ignored in the unit-tests.
    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
     //angular.bootstrap is a function component in the core ng module that is used for starting up the Angular application manually, which gives you more control over how you initialize your application https://appendto.com/2016/05/angular-bootstrap-explained-3-examples/
               
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();
