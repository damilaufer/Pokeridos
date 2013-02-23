'use strict';

angular.module('ViewAGameController', [])
  .controller('ViewAGameController', ['$scope', '$location', 'DataService',

function ($scope, $location, DataService) {

    $scope.commonControllerInit();

    $scope.selectedTournament = {};
    $scope.buyInAmount = 0;
    $scope.positions = [5, 3, 2]; //default

    // Table headers
    $scope.head = [{ name: 'playerName', text: "Player" },
        { name: 'points', text: "Points" },
        { name: 'winnings', text: "Winnings"}];

    var promise = DataService.getTournaments($scope);
    promise.then(function (data) {
        $scope.tournaments = data;
        $scope.tournaments.sort(function (a, b) { return b.toDate > a.toDate; });
        if ($scope.tournaments.length > 0) {
            $scope.selectedTournament = $scope.tournaments[0];
            $scope.selectedTournamentChanged(); //needed because the line above does not fire the click event!
        }
    }, function (data, status, headers, config) {
        alert('An error occurred. Please try again');
    });

    //#region Functions
    $scope.getData = function () {
        var gameDate;
        try {
            // Check the validity of dates
            gameDate = new Date($scope.selectedGame.date);
        } catch (e) {
            alert('Please select a game.');
            return;
        }

        // Load the data
        var promise = DataService.getStandings($scope, gameDate, gameDate);
        promise.then(function (data) {
            for (var i = 0; i < data.gamePlayerStandings.length; i++) {
                var s = data.gamePlayerStandings[i];
                s.points = 0;
                for (var positionIndex = 0; positionIndex < $scope.positions.length; positionIndex++) {
                    s.points += s.positionCounter[positionIndex] * $scope.positions[positionIndex];
                }
                s.winnings = s.winnings;
            }

            $scope.body = data.gamePlayerStandings;

        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    $scope.orderGames = function (game) {
        return (new Date(game.date));
    }

    $scope.selectedTournamentChanged = function () {
        if ($scope.selectedTournament != undefined) {
            $scope.buyInAmount = $scope.selectedTournament.buyInAmount;

            $scope.games = $scope.selectedTournament.games;
            if ($scope.games.length > 0) {
                $scope.selectedGame = $scope.games[$scope.games.length -1]; // select the NEWEST (last position)
                $scope.selectedGameChanged(); //needed because the line above does not fire the click event!
            }
        }
    };

    $scope.selectedGameChanged = function () {
        if ($scope.selectedGame != undefined) {
            $scope.getData();
        }
    }

    $scope.GameDisplayValue = function (game) {
        return new Date(game.date).format("dd mmm yyyy");
    }

    $scope.navigateBack = function () {
        $location.path('mainMenu');
    };
    //#endregion Functions
}
]);