'use strict';

angular.module('ViewWinnersController', [])
  .controller('ViewWinnersController', ['$scope', '$location', 'DataService',

function ($scope, $location, DataService) {
    $scope.commonControllerInit();

    $scope.winnersPerTournament = [];
    $scope.winnersPerPlayer = [];

    var promise = DataService.getTournaments($scope);
    promise.then(function (tournaments) {
        var promise = DataService.getPlayers($scope);
        promise.then(function (players) {
            var playersById = {};
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                player.winnings = 0;    //add property for the winnings per player table
                playersById[player.id] = player;

                //$scope.winnersPerPlayer.push(player);
            }

            for (var i = 0; i < tournaments.length; i++) {
                var tournament = tournaments[i];
                if (tournament.winnerId != undefined) {
                    $scope.winnersPerTournament.push(
                    {
                        name: tournament.name,
                        fromDateForOrderBy: new Date(Date.parse(tournament.fromDate)).format('yyyy/mm/dd'),
                        fromDate: new Date(Date.parse(tournament.fromDate)).format('mmm yyyy'),
                        toDate: new Date(Date.parse(tournament.toDate)).format('mmm yyyy'),
                        winner: playersById[tournament.winnerId].name
                    });

                    playersById[tournament.winnerId].winnings++;
                }
            }

            for (var i in playersById) {
                var player = playersById[i];
                if (player.winnings > 0) {
                    $scope.winnersPerPlayer.push(player);
                }
            }
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    }, function (data, status, headers, config) {
        alert('An error occurred. Please try again');
    });

    //#region Functions
    $scope.navigateBack = function () {
        $location.path('mainMenu');
    };
    //#endregion Functions
}
]);