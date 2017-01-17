/*
 * Module Init
 * */

var app = angular.module('demo', ['ngAnimate', 'ngMaterial', 'ui.router', 'angularAnimation']);

/*
 * Routes Config
 * */
app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/theProject");

        $stateProvider
            .state('theProject', {
                url: '/theProject',
                templateUrl: '/components/theProject/theProject.html',
                resolve: {
                    stateName: ['$rootScope', function($rootScope){
                        $rootScope.routeName = 'The Project'
                    }]
                }
            })

            .state('gettingStarted', {
                url: '/gettingStarted',
                templateUrl: '/components/gettingStarted/gettingStarted.html',
                resolve: {
                    stateName: ['$rootScope', function($rootScope){
                        $rootScope.routeName = 'Getting Started'
                    }]
                }
            })

            .state('samples', {
                url: '/sampleSelector',
                template: '<sample-selector></sample-selector>',
                resolve: {
                    stateName: ['$rootScope', function($rootScope){
                        $rootScope.routeName = 'Sample Selector'
                    }]
                }
            })

            .state('sampleSection', {
                url: '/sampleSection/:sectionName',
                template: '<samples></samples>',
                resolve: {
                    stateName: ['$rootScope', function($rootScope){
                        $rootScope.routeName = 'Sample'
                    }]
                }
            })

    }]);

/*
 * Run Config
 * */
app.run(['$rootScope', '$timeout',
    function($rootScope, $timeout) {


    }]);



/*
 * Theme Config
 * */
   app .config(['$mdThemingProvider', function($mdThemingProvider){
        $mdThemingProvider.theme('default')
            .primaryPalette("deep-purple", {
                'default': '500',
                'hue-1': '600',
                'hue-2': '700',
                'hue-3': '800'
            })
            .accentPalette('purple', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            })
            .warnPalette('deep-orange', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            });
        $mdThemingProvider.theme('purple')
            .primaryPalette("purple", {
                'default': '500',
                'hue-1': '600',
                'hue-2': '700',
                'hue-3': '800'
            })
            .accentPalette('purple', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            })
            .warnPalette('deep-orange', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            });
        $mdThemingProvider.theme('deep-purple')
            .primaryPalette("deep-purple", {
                'default': '500',
                'hue-1': '600',
                'hue-2': '700',
                'hue-3': '800'
            })
            .accentPalette('deep-purple', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            })
            .warnPalette('deep-orange', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            });
        $mdThemingProvider.theme('deep-orange')
            .primaryPalette("deep-orange", {
                'default': '500',
                'hue-1': '600',
                'hue-2': '700',
                'hue-3': '800'
            })
            .accentPalette('deep-orange', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            })
            .warnPalette('deep-orange', {
                'default': '400',
                'hue-1': '500',
                'hue-2': '600',
                'hue-3': '700'
            });
        $mdThemingProvider.alwaysWatchTheme(true);
    }]);