'use strict';

angular.module('MainMenuController', []).controller('MainMenuController', ['$scope', '$location', 'DataService',
function ($scope, $location, DataService) {

    $scope.commonControllerInit();
    
    var promise = DataService.getLastGame($scope);
    promise.then(function (data) {
        var playingPlayersCount = 0;
        for (var i = 0; i < data.players.length; i++) {
            if (data.players[i].lostRoundIndex == null) {
                playingPlayersCount++;
            }
        }
        if (playingPlayersCount > 1) {
            $scope.gameTitle = "View current game";
            $scope.gameHref = "#/playGame";
        } else {
            $scope.gameTitle = "Start new game";
            $scope.gameHref = "#/newGame";
        }
    }, function (data, status, headers, config) {
        alert('An error occurred. Please try again');
    });

    //#region Functions
    $scope.clearOfflineQueue = function () {
        DataService.clearOfflineQueue();
    };
    //#endregion Functions
} ]);