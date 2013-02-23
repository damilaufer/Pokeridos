'use strict';

angular.module('ViewStandingsController', [])
  .controller('ViewStandingsController', ['$scope', '$location', 'DataService',

function ($scope, $location, DataService) {
    $scope.commonControllerInit();
    
    $scope.sort = {
        column: 'Points',
        descending: false
    };

    $scope.selectedTournament = {};
    $scope.fromDate = new Date("01/jan/2000");
    $scope.toDate = new Date();
    $scope.buyInAmount = 0;
    $scope.positions = [5, 3, 2]; //default
    $scope.gamesNumber = 0;

    // Table headers
    $scope.head = [{ name: 'playerName', text: "Player" },
        { name: 'points', text: "Points" },
        { name: 'games', text: "Games" },
        { name: 'finals', text: "Finals"}];
    for (var i = 0; i < 3; i++) {
        $scope.head.push({ name: 'position' + i, text: "#" + (i + 1) });
    };
    $scope.head.push({ name: 'pointsAverage', text: "Pts. avg" });
    $scope.head.push({ name: 'winnings', text: "Winnings" });
    $scope.head.push({ name: 'winningsAverage', text: "Winnings avg" });
    $scope.head.push({ name: 'finalsWonAverage', text: "Finals won %" });

    var promise = DataService.getTournaments($scope);
    promise.then(function (data) {
        $scope.tournaments = data;
        $scope.tournaments.sort(function (a, b) { return b.toDate > a.toDate; });
        if ($scope.tournaments.length > 0) {
            $scope.selectedTournament = $scope.tournaments[0];
            $scope.selectedTournamentChanged(); //needed because the line above does not fire the click event!
            $scope.getData('byDates');
        }
    }, function (data, status, headers, config) {
        alert('An error occurred. Please try again');
    });

    //#region Functions
    $scope.getData = function (byWhat) {
        var fromDate, toDate;
        if (byWhat == 'byDates') {
            try {
                // Check the validity of dates
                fromDate = new Date($scope.fromDate);
                toDate = new Date($scope.toDate);
            } catch (e) {
                alert('Enter valid dates');
                return;
            }
        }
        else {
            fromDate = new Date($scope.fromGame.date);
            toDate = new Date($scope.toGame.date);
        }

        var promise = DataService.getStandings($scope, fromDate, toDate);
        promise.then(function (data) {

            $scope.gamesNumber = data.numberOfGames;
            if (data.buyInAmount != null) {
                $scope.buyInAmount = data.buyInAmount;
            }
            else {
                $scope.buyInAmount = "N/A";
            }

            for (var i = 0; i < data.gamePlayerStandings.length; i++) {
                var s = data.gamePlayerStandings[i];
                s.points = 0;
                for (var positionIndex = 0; positionIndex < $scope.positions.length; positionIndex++) {
                    s.points += s.positionCounter[positionIndex] * $scope.positions[positionIndex];
                }
                s.finals = s.positionCounter[0] + s.positionCounter[1];
                s.position0 = s.positionCounter[0];
                s.position1 = s.positionCounter[1];
                s.position2 = s.positionCounter[2];
                s.pointsAverage = parseFloat(s.points / s.games).toFixed(2);
                s.winnings = s.winnings;
                s.winningsAverage = parseFloat(s.winnings / s.games).toFixed(2);
                s.finalsWonAverage = parseFloat(s.positionCounter[0] / s.finals).toFixed(2);
            }

            $scope.body = data.gamePlayerStandings;

            // Sort by points initially
            $scope.changeSorting('points');
            $scope.changeSorting('points');

        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    $scope.selectedCls = function (column) {
        return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
    };

    $scope.changeSorting = function (column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };

    $scope.selectedTournamentChanged = function () {
        if ($scope.selectedTournament != undefined) {
            $scope.games = $scope.selectedTournament.games;

            if ($scope.games.length > 0) {
                // Add the game's index, if not already there
                if ($scope.games[0].index == undefined) {
                    for (var i = 0; i < $scope.games.length; i++) {
                        $scope.games[i].index = i + 1;
                    }
                }
            }

            // Select first and last games, and first and last games
            $scope.fromDate = new Date($scope.selectedTournament.fromDate);
            $scope.toDate = new Date($scope.selectedTournament.toDate);
            $scope.fromGame = $scope.games[0];
            $scope.toGame = $scope.games[$scope.games.length - 1];

            $scope.buyInAmount = $scope.selectedTournament.buyInAmount;
            $scope.positions = [5, 3, 2]; //default
            $scope.gamesNumber = $scope.selectedTournament.games.length;
        }
    };

    $scope.GameDisplayValue = function (game) {
        return '#' + game.index.pad(2) + ' - ' + (new Date(game.date)).format("dd mmm yyyy");
    }

    $scope.orderGames = function (game) {
        return (new Date(game.date));
    }

    $scope.navigateBack = function () {
        $location.path('mainMenu');
    };
    //#endregion Functions
}
]);