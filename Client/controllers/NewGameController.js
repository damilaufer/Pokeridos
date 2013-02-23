'use strict';

angular.module('NewGameController', []).controller('NewGameController', ['$scope', '$location', 'DataService',
function ($scope, $location, DataService) {

    $scope.commonControllerInit();
    
    $scope.newPlayerName = "";
    $scope.openTournament = undefined;
    
    var promise = DataService.getOpenTournament($scope);
    promise.then(function (data) {
        $scope.openTournament = data;

        var promise = DataService.getPlayers($scope);
        promise.then(function (data) {
            // Sort the player by number of games played in the current tournament
            data.sort(function (a, b) { return b.gamesInCurrentTournament - a.gamesInCurrentTournament; });
            $scope.players = data;
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
            $location.path('mainMenu');
        });
    }, function (data, status, headers, config) {
        if (status == 404) {
            alert('No open tournament is defined. Please contact DamiL.');
            $location.path('mainMenu');
        }
        else {
            alert('An error occurred. Please try again');
        }
    });

    //#region Functions
    var privatePlayingPlayers = function () {
        var returnValue = [];
        var count = 0;
        angular.forEach($scope.players, function (player) {
            if (player.playing) {
                count += 1;
                returnValue.push(player);
            }
        });
        return returnValue;
    };

    /// Starts a game
    $scope.start = function () {
        var playingPlayers = privatePlayingPlayers();
        if (playingPlayers.length < 2) {
            alert('You cannot start a game with less than two players.');
            return;
        }

        for (var i = 0; i < playingPlayers.length; i++) {
            playingPlayers[i].firstRebuy = true;
        }

        var promise = DataService.startGame($scope, $scope.openTournament, playingPlayers);
        promise.then(function (data) {
            $location.path('playGame');
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    $scope.togglePlayer = function (player) {
        player.playing = !player.playing;
    };

    /// Adds a new player to the list of players (also in the service)
    $scope.addPlayer = function (e) {
        if ($scope.newPlayerName.length == 0) {
            alert('Please enter the name of the new player');
            var txtPlayerName = document.getElementById("newPlayerName");
            txtPlayerName.focus();
            return;
        }
        var newPlayer = { name: $scope.newPlayerName, playing: true, pictureName: 'Guest.png' };   //Invitado1, invitado2, etc

        var promise = DataService.addPlayer($scope, newPlayer);
        promise.then(function (data) {
            data.playing = true;  //Starts playing
            $scope.players.push(data);

            $scope.newPlayerName = "";
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    $scope.navigateBack = function () {
        $location.path('mainMenu');
    };

    //#endregion
} ]);