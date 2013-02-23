'use strict';

angular.module('ViewPointsController', [])
  .controller('ViewPointsController', ['$scope', '$location', 'DataService', '$rootScope',

function ($scope, $location, DataService, $rootScope) {

    $scope.commonControllerInit();

    $scope.selectedTournament = {};

    $scope.fromDate = new Date("01/jan/2000");
    $scope.toDate = new Date();
    $scope.positions = [5, 3, 2];

    var promise = DataService.getTournaments($scope);
    promise.then(function (data) {
        $scope.tournaments = data;
        $scope.tournaments.sort(function (a, b) { return b.toDate > a.toDate; });
        if ($scope.tournaments.length > 0) {

            $scope.selectedTournament = $scope.tournaments[0];
            $scope.selectedTournamentChanged(); //needed because the line above does not fire the click event!
            setTimeout(function() {
                //Without this setTimeout, sometimes the height of the graph is 0, so it does not work :(
                 $scope.getData('byDates');
            }, 100);
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

        var promise = DataService.getGames($scope, fromDate, toDate);
        promise.then(function (games) {
            var data = [];

            var playersById = {};
            for (var i = 0; i < games.length; i++) {
                var game = games[i];

                game.players.sort(function (a, b) { return b.finalPosition - a.finalPosition; });

                // Add each game as an X entry, with all the player's points as Y
                // Each player must be a new [[x,y],[x,y],[x,y]...] in data
                for (var j = 0; j < game.players.length; j++) {
                    var gamePlayer = game.players[j];
                    if (playersById[gamePlayer.playerId] == undefined) {
                        playersById[gamePlayer.playerId] = { playerId: game.players[j].playerId, points: 0, positions: [] };
                    }
                    var points = 0;
                    switch (j) {
                        case 0:
                            points = $scope.positions[0];
                            break;
                        case 1:
                            points = $scope.positions[1];
                            break;
                        case 2:
                            points = $scope.positions[2];
                            break;
                    }
                    playersById[gamePlayer.playerId].points += parseInt(points, 10);
                    playersById[gamePlayer.playerId].positions.push([Date.parse(game.date), playersById[gamePlayer.playerId].points]);
                }

                for (var playerIndex in playersById) {
                    var player = playersById[playerIndex];
                    if (player.positions.length <= i) {
                        var lastPosition = player.positions[player.positions.length - 1][1];
                        player.positions.push([Date.parse(game.date), lastPosition]);
                    }
                }
            }

            drawGraphic(document.getElementById('graph'), playersById);
        }, function (data, status, headers, config) {
            alert('An error occurred. Please try again');
        });
    };

    // Draws a graph
    function drawGraphic(container, data) {
        var dataForGraph = [];
        var gameDates = [];
        var xaxisMax = 0;

        for (var i in data) {
            var playerName = DataService.getPlayerName($scope, data[i].playerId);
            dataForGraph.push({ data: data[i].positions, label: playerName, lines: { show: true }, points: { show: true} });
        }

        if (dataForGraph.length > 0) {
            xaxisMax = dataForGraph[dataForGraph.length - 1].data[0][0];
        }

        Flotr.draw(container, dataForGraph, {
            xaxis: {
                mode: 'time',
                labelsAngle: 45,
                autoscale: true,
                //autoscaleMargin: 0.01,
                noticks: 10,
                showMinorLabels: true,
                minorTickFreq: 3,
            },
            yaxis: {
                 autoscale: true
             },
            selection: {
                //mode: 'x'
            },
            HtmlText: false,
            title: 'Points',
            grid: {
                minorverticalLines: true,
                verticalLines: true,
                backgroundColor: {
                    colors: [[0, '#fff'], [1, '#ccc']],
                    start: 'top',
                    end: 'bottom'
                }
            },
            mouse: {
                track: true, // Enable mouse tracking
                //lineColor: 'purple',
                relative: true,
                position: 'sw',
                sensibility: 10,
                //trackDecimals: 2,
                trackFormatter: function (o) {
                    return o.series.label + ', ' + (new Date(parseInt(o.x, 10))).format('dd/mm/yyyy') + ', ' + parseInt(o.y) + ' points';
                }
            },
            crosshair: {
                //mode: 'xy'
            },
            legend: {
                position: 'nw'
            }
        });
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

            $scope.positions = [5, 3, 2]; //default
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