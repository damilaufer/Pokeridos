'use strict';

angular.module('LoginController', []).controller('LoginController', ['$scope', '$location', 'DataService',
function ($scope, $location, DataService) {
    
    $scope.hideAddressBar();

    DataService.fillPlayerNames($scope);

    $scope.username = DataService.getCurrentUsername();
    $scope.password = "";

    $scope.login = function () {
        var promise = DataService.login($scope, $scope.username, $scope.password);
        promise.then(function (data) {
            DataService.setCurrentUsername($scope.username);
            localStorage.setItem('lastActionTime', (new Date()).getTime());

            $location.path('mainMenu');

        }, function (data, status, headers, config) {
            //@@@ data y status tienen valor en $q, pero no acá!
            alert('Invalid username or password.');
        });
    };
} ]);