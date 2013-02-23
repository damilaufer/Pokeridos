'use strict';

angular.module('PlayGameController', [])
  .controller('PlayGameController', ['$scope', '$location', 'DataService',

function ($scope, $location, DataService) {
    
    $scope.commonControllerInit();
    
    var currentGame;
    var blindsTimeInSeconds = 5;
    var currentPosition = 1;

    var promise = DataService.getLastGame($scope);
    promise.then(function (data) {
        startup(data);
    }, function (data, status, headers, config) {
        alert('An error occurred. Please try again');
    });


    //#region Functions
    function startup(lastGame) {
        currentGame = lastGame;
        if (currentGame == undefined) {
            alert('Could not get the current game');
            $location.path('mainMenu');
        };

        $scope.playersThatLost = [];    // users that lost and can rebuy
        $scope.rebuyPlayer = {};        // the user that is selected in the rebuy combo

        blindsTimeInSeconds = 5;

        $scope.playingPlayers = [];
        $scope.numberOfBoxes = currentGame.players.length;

        for (var i = 0; i < currentGame.players.length; i++) {
            var gamePlayer = currentGame.players[i];

            if (gamePlayer.lostRoundIndex == null) {
                gamePlayer.canRebuy = (gamePlayer.rebuyRoundIndex == null); //TODO: see if we are above 100/200

                // the player is playing if he didn't lost
                $scope.playingPlayers.push(gamePlayer);
            }
            else if (gamePlayer.rebuyRoundIndex == null) {
                // the player can rebuy if he lost and did not rebuy yet
                //TODO: see if we are above 100/200
                gamePlayer.canRebuy = true;
                addLoserToPlayersThatLost(gamePlayer);
            }

            if (gamePlayer.rebuyRoundIndex != null) {
                // The player re-bought and lost
                $scope.numberOfBoxes++;
                gamePlayer.canRebuy = false;
            }
        }

        var promise = DataService.getBlindsForGame($scope);
        promise.then(function (data) {
            $scope.blinds = data;
            blindsTimeInSeconds = $scope.blinds[0].periodInMinutes * 60;

            var timer = setInterval(function () {
                blindsTimeInSeconds--;

                if (blindsTimeInSeconds == 0) {
                    $scope.nextBlinds();
                }

                $scope.$apply();
            }, 1000);
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    }

    $scope.currentBlindsDescription = function () {
        if ($scope.blinds == undefined) {
            return '';
        }
        return 'Blinds ' + getBlindsDescription($scope.blinds[DataService.getCurrentBlindsIndex()]);
    };

    $scope.nextBlindsDescription = function () {
        if ($scope.blinds == undefined) {
            return '';
        }
        var currentBlindsIndex = DataService.getCurrentBlindsIndex();
        if (currentBlindsIndex + 1 < $scope.blinds.length) {
            return 'Next ' + getBlindsDescription($scope.blinds[currentBlindsIndex + 1]);
        }
        return '';
    };

    function getBlindsDescription(blind) {
        var text = (blind.amount / 2) + '/' + blind.amount;
        if (blind.anteAmount > 0) {
            text += ', ante ' + blind.anteAmount;
        }
        return text;
    }

    $scope.timetoNextBlind = function () {
        var minutes = Math.floor(blindsTimeInSeconds / 60);
        var seconds = blindsTimeInSeconds % 60;
        return minutes.pad(2) + ':' + seconds.pad(2);
    };

    $scope.previousBlinds = function () {
        var currentBlindsIndex = DataService.getCurrentBlindsIndex();
        if (currentBlindsIndex > 0) {
            currentBlindsIndex--;
            blindsTimeInSeconds = $scope.blinds[currentBlindsIndex].periodInMinutes * 60;
            DataService.setCurrentBlindsIndex(currentBlindsIndex);
        }
    };

    $scope.nextBlinds = function () {
        var currentBlindsIndex = DataService.getCurrentBlindsIndex();
        if (currentBlindsIndex + 1 < $scope.blinds.length) {
            currentBlindsIndex++;
            blindsTimeInSeconds = $scope.blinds[currentBlindsIndex].periodInMinutes * 60;
            DataService.setCurrentBlindsIndex(currentBlindsIndex);
        }
    };

    $scope.playerLost = function (gamePlayer) {
        gamePlayer.lostRoundIndex = DataService.getCurrentBlindsIndex();
        gamePlayer.finalPosition = currentPosition++;
        gamePlayer.canRebuy = false;
        var promise = DataService.playerLost($scope, gamePlayer);
        promise.then(function (data) {
            if (gamePlayer.rebuyRoundIndex == null) {
                addLoserToPlayersThatLost(gamePlayer);
            }
            var index = $scope.playingPlayers.indexOf(gamePlayer);
            $scope.playingPlayers.splice(index, 1);
            if ($scope.playingPlayers.length == 1) {
                $scope.playingPlayers[0].finalPosition = currentPosition++;
                var promise = DataService.playerWon($scope, $scope.playingPlayers[0]);
                promise.then(function (data) {
                    alert('we\'ve got a winner!\n' + $scope.playingPlayers[0].player.name + ' won tonight!');
                    $location.path('mainMenu');
                }, function (data, status, headers, config) {
                    alert('An error occurred. Please try again');
                });
            }
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    function addLoserToPlayersThatLost(gamePlayer) {
        // Add the user to the combo, so he can rebuy
        $scope.playersThatLost.push(gamePlayer);
    };

    $scope.playerRebuy = function () {
        if ($scope.rebuyPlayer.player == undefined) {
            alert('Please select a player that rebuys.');
            return;
        }
        if ($scope.rebuyPlayer.rebuyRoundIndex != null) {
            alert('You can only rebuy once.');
            return;
        }
        $scope.rebuyPlayer.rebuyRoundIndex = DataService.getCurrentBlindsIndex();
        $scope.rebuyPlayer.lostRoundIndex = null;
        var promise = DataService.playerRebuys($scope, $scope.rebuyPlayer);
        promise.then(function (data) {
            var index = $scope.playersThatLost.indexOf($scope.rebuyPlayer);
            $scope.playersThatLost.splice(index, 1);
            $scope.numberOfBoxes++;
            $scope.playingPlayers.push($scope.rebuyPlayer);
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    $scope.navigateBack = function () {
        $location.path('mainMenu');
    };

    $scope.averageStack = function () {
        if ($scope.playingPlayers == undefined) {
            return 0;
        }
        return parseInt($scope.numberOfBoxes * 1000 / $scope.playingPlayers.length, 10);
    }
    //#endregion Functions
}
]);