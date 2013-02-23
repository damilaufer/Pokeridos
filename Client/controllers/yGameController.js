'use strict';
function PlayGameController($scope, $route, $routeParams, $location) {
    $scope.players = dataService.getPlayersForGame();
    $scope.blinds = dataService.getBlindsForGame();
    var currentBlindsIndex = 0;
    $scope.currentBlindsDescription = function () {
        return 'Blinds ' + getBlindsDescription($scope.blinds[currentBlindsIndex].value);
    };
    $scope.nextBlindsDescription = function () {
        if(currentBlindsIndex + 1 < $scope.blinds.length) {
            return 'Next ' + getBlindsDescription($scope.blinds[currentBlindsIndex + 1].value);
        }
        return '';
    };
    function getBlindsDescription(bigBlind) {
        return (bigBlind / 2) + '/' + bigBlind;
    }
    var blindsTimeInSeconds = $scope.blinds[0].period * 60;
    $scope.timetoNextBlind = function () {
        var minutes = Math.floor(blindsTimeInSeconds / 60);
        var seconds = blindsTimeInSeconds % 60;
        return minutes.pad(2) + ':' + seconds.pad(2);
    };
    var timer = setInterval(function () {
        blindsTimeInSeconds--;
        $scope.$apply();
    }, 1000);
    $scope.previousBlinds = function () {
        if(currentBlindsIndex > 0) {
            currentBlindsIndex--;
            blindsTimeInSeconds = $scope.blinds[currentBlindsIndex].period * 60;
        }
    };
    $scope.nextBlinds = function () {
        if(currentBlindsIndex + 1 < $scope.blinds.length) {
            currentBlindsIndex++;
            blindsTimeInSeconds = $scope.blinds[currentBlindsIndex].period * 60;
        }
    };
    $scope.playerLost = function (player) {
        dataService.playerLost(player, currentBlindsIndex);
        if(player.firstRebuy) {
            $scope.playersThatLost.push(player);
        }
        var index = $scope.players.indexOf(player);
        $scope.players.splice(index, 1);
        if($scope.players.length == 1) {
            dataService.playerWon(player);
            alert('we\'ve got a winner!\n' + $scope.players[0].name + ' won tonight!');
            $location.path('main');
        }
    };
    $scope.playerRebuy = function () {
        if($scope.rebuyPlayer.name == undefined) {
            alert('Please select a player that rebuys.');
            return;
        }
        if($scope.rebuyPlayer.firstRebuy == false) {
            alert('You can only rebuy once.');
            return;
        }
        $scope.rebuyPlayer.firstRebuy = false;
        dataService.playerRebuys($scope.rebuyPlayer, currentBlindsIndex);
        var index = $scope.playersThatLost.indexOf($scope.rebuyPlayer);
        $scope.playersThatLost.splice(index, 1);
        $scope.players.push($scope.rebuyPlayer);
    };
    $scope.playersThatLost = [];
    $scope.rebuyPlayer = {
    };
}
; ;
PlayGameController.$inject = [
    '$scope', 
    '$route', 
    '$routeParams', 
    '$location'
];
//@ sourceMappingURL=yGameController.js.map
