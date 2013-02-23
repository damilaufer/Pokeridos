'use strict';


// Declare app level module which depends on filters, and services
var pokeridosApp = angular.module('pokeridosApp', ['filters', 'directives', 'services',
                                , 'MainMenuController', 'NewGameController', 'PlayGameController'
                                , 'ViewStandingsController', 'ViewAGameController', 'ViewPointsController', 'ViewWinnersController'
                                , 'LoginController'
                                , 'ui.directives']).
  config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/login', { templateUrl: 'views/Login.html', controller: 'LoginController' });
      $routeProvider.when('/mainMenu', { templateUrl: 'views/MainMenu.html', controller: 'MainMenuController' });
      $routeProvider.when('/newGame', { templateUrl: 'views/NewGame.html', controller: 'NewGameController' });
      $routeProvider.when('/playGame', { templateUrl: 'views/PlayGame.html', controller: 'PlayGameController' });

      $routeProvider.when('/viewStandings', { templateUrl: 'views/ViewStandings.html', controller: 'ViewStandingsController' });
      $routeProvider.when('/viewAGame', { templateUrl: 'views/ViewAGame.html', controller: 'ViewAGameController' });
      $routeProvider.when('/viewPoints', { templateUrl: 'views/ViewPoints.html', controller: 'ViewPointsController' });
      $routeProvider.when('/viewWinners', { templateUrl: 'views/ViewWinners.html', controller: 'ViewWinnersController' });

      $routeProvider.otherwise({ redirectTo: '/login' });
  } ]);

  pokeridosApp.run(function ($rootScope, $location, DataService) {
      $rootScope.reconnect = function () {
          $rootScope.offline = false;
          alert('Will try to reconnect in the next call.');
      };

      $rootScope.commonControllerInit = function () {
          forceLogin();
          $rootScope.hideAddressBar();
      };

      var forceLogin = function () {
          if (DataService.getCurrentUsername() == undefined) {
              $location.path('login');
          }
      };

      $rootScope.hideAddressBar = function () {
          //TODO: ver si esta function se llama cuando hacen BACK
          //TODO: hacer que entre hoja y hoja no aparezca el address bar
          //if (!window.location.hash) {
          if (document.height < window.outerHeight) {
              document.body.style.height = (window.outerHeight + 50) + 'px';
          }

          setTimeout(function () { window.scrollTo(0, 1); }, 10);
          //};
      };

      $rootScope.getCurrentUsername = function () {
          return DataService.getCurrentUsername();
      };
  });

Number.prototype.pad = function (size) {
    if (typeof (size) !== "number") { size = 2; }
    var s = String(this);
    while (s.length < size) s = "0" + s;
    return s;
}