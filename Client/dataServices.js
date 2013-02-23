'use strict';

angular.module('services', [])
  .factory('DataService', ['$http', '$q', '$rootScope',

  function DataService($http, $q, $rootScope) {

      //#region const
      var playerUrl = '../PokeridosService/api/player';
      var tournamentUrl = '../PokeridosService/api/tournament';
      var gameUrl = '../PokeridosService/api/game';
      var blindLevelUrl = '../PokeridosService/api/blindlevel';
      var gamePlayerUrl = '../PokeridosService/api/gamePlayer';
      var standingsUrl = '../PokeridosService/api/standings';

      var localStorage_offlineQueue = 'offlineQueue';
      var localStorage_currentBlindsIndex = 'currentBlindsIndex';
      var localStorage_currentUsername = 'currentUsername';
      //#endregion

      var callService = function ($scope, method, url, data, contentType) {
          var deferred = $q.defer();

          var call = { method: method, url: url, data: data, contentType: contentType };

          var offlineQueue = JSON.parse(localStorage.getItem(localStorage_offlineQueue) || '[]');

          if ($rootScope.offline) {
              handleOfflineRequest(deferred, call, offlineQueue);
          }
          else {
              if (offlineQueue.length > 0) {
                  // enqueue de current call and send the first in the queue
                  handleItemFromOfflineQueue(offlineQueue, deferred, call);
              }
              else {
                  callHttp(deferred, call);
              }
          }
          return deferred.promise;
      };

      var handleItemFromOfflineQueue = function (offlineQueue, deferred, originalCall) {
          if (offlineQueue.length == 0) {
              // The queue is empty now, so make the original call and resolve the deferred
              callHttp(deferred, originalCall);
          }
          else {
              var offlineCall = offlineQueue[0];
              $http({ method: offlineCall.method, url: offlineCall.url, data: offlineCall.data, contentType: offlineCall.contentType })
              .success(function (data) {
                  offlineQueue.shift();
                  localStorage.setItem(localStorage_offlineQueue, JSON.stringify(offlineQueue));
                  handleItemFromOfflineQueue(offlineQueue, deferred, originalCall);
              })
              .error(function (data, status, headers, config) {
                  console.log('Error handling offline item calling: ' + offlineCall.url + '. (' + offlineCall.data + '\n' + status + ')');
              });
          }
      };

      var handleOfflineRequest = function (deferred, call, offlineQueue) {
          if (call.method == 'GET') {
              // Get last OK response from cache
              var offlineData = JSON.parse(localStorage.getItem(call.url));
              if (offlineData == null) {
                  console.log('Offline request not found in storage: ' + call.url);
                  deferred.reject(null, 404);
              }

              deferred.resolve(offlineData);
          }
          else {
              // write to q and resolve ok
              if (offlineQueue == undefined) {
                  offlineQueue = JSON.parse(localStorage.getItem(localStorage_offlineQueue) || '[]');
              }
              offlineQueue.push(call);
              localStorage.setItem(localStorage_offlineQueue, JSON.stringify(offlineQueue));

              deferred.resolve(null);   //@@@ Alguien usa la data del PUT/POST?
          }
      };

      var callHttp = function (deferred, call) {
          $http({ method: call.method, url: call.url, data: call.data, contentType: call.contentType })
            .success(function (data) {
                if (call.method = 'GET') {
                    // write the last OK response to cache
                    localStorage.setItem(call.url, JSON.stringify(data));
                }
                $rootScope.offline = false;
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                console.log('Error calling: ' + call.url + '. (' + data + '\n' + status + ')');

                // 404 is login failed (@@@ not working because we don't receive it)
                if (status != 404) {
                    $rootScope.offline = true;
                    handleOfflineRequest(deferred, call);
                }
                deferred.reject(data, status, headers, config);
            });
      };

      var callService2 = function ($scope, method, url, data, contentType) {
          return {
              then: function (f) {
                  var returnData;
                  switch (method) {
                      case "GET":
                          switch (url) {
                              case "../PokeridosService/api/game/01-Jun-2012/31-Dec-2012":
                              case "../PokeridosService/api/game/01-Jan-2013/30-Jun-2013":
                                  returnData = [{ "$id": "1", "tournament": null, "players": [{ "$id": "2", "player": null, "id": 161, "rebuyRoundIndex": 0, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 33 }, { "$id": "3", "player": null, "id": 162, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 1, "gameId": 33 }, { "$id": "4", "player": null, "id": 163, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 5, "gameId": 33 }, { "$id": "5", "player": null, "id": 164, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 33 }, { "$id": "6", "player": null, "id": 165, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 33 }, { "$id": "7", "player": null, "id": 166, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 33}], "id": 33, "date": "2012-06-07T00:00:00", "tournamentId": 10 }, { "$id": "8", "tournament": null, "players": [{ "$id": "9", "player": null, "id": 167, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 4, "gameId": 34 }, { "$id": "10", "player": null, "id": 168, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 5, "gameId": 34 }, { "$id": "11", "player": null, "id": 169, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 1, "gameId": 34 }, { "$id": "12", "player": null, "id": 170, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 12, "gameId": 34 }, { "$id": "13", "player": null, "id": 171, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 10, "gameId": 34 }, { "$id": "14", "player": null, "id": 172, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 34 }, { "$id": "15", "player": null, "id": 173, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 34 }, { "$id": "16", "player": null, "id": 174, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 34}], "id": 34, "date": "2012-06-14T00:00:00", "tournamentId": 10 }, { "$id": "17", "tournament": null, "players": [{ "$id": "18", "player": null, "id": 175, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 35 }, { "$id": "19", "player": null, "id": 176, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 35 }, { "$id": "20", "player": null, "id": 177, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 35 }, { "$id": "21", "player": null, "id": 178, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 10, "gameId": 35 }, { "$id": "22", "player": null, "id": 179, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 6, "gameId": 35 }, { "$id": "23", "player": null, "id": 180, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 35 }, { "$id": "24", "player": null, "id": 181, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 35}], "id": 35, "date": "2012-06-19T00:00:00", "tournamentId": 10 }, { "$id": "25", "tournament": null, "players": [{ "$id": "26", "player": null, "id": 182, "rebuyRoundIndex": 0, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 36 }, { "$id": "27", "player": null, "id": 183, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 36 }, { "$id": "28", "player": null, "id": 184, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 1, "gameId": 36 }, { "$id": "29", "player": null, "id": 185, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 6, "gameId": 36 }, { "$id": "30", "player": null, "id": 186, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 36}], "id": 36, "date": "2012-06-26T00:00:00", "tournamentId": 10 }, { "$id": "31", "tournament": null, "players": [{ "$id": "32", "player": null, "id": 187, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 37 }, { "$id": "33", "player": null, "id": 188, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 1, "gameId": 37 }, { "$id": "34", "player": null, "id": 189, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 5, "gameId": 37 }, { "$id": "35", "player": null, "id": 190, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 37 }, { "$id": "36", "player": null, "id": 191, "rebuyRoundIndex": 0, "lostRoundIndex": null, "finalPosition": 3, "playerId": 2, "gameId": 37 }, { "$id": "37", "player": null, "id": 192, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 37}], "id": 37, "date": "2012-07-26T00:00:00", "tournamentId": 10 }, { "$id": "38", "tournament": null, "players": [{ "$id": "39", "player": null, "id": 193, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 38 }, { "$id": "40", "player": null, "id": 194, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 1, "gameId": 38 }, { "$id": "41", "player": null, "id": 195, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 38 }, { "$id": "42", "player": null, "id": 196, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 2, "gameId": 38 }, { "$id": "43", "player": null, "id": 197, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 38 }, { "$id": "44", "player": null, "id": 198, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 10, "gameId": 38 }, { "$id": "45", "player": null, "id": 199, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 38}], "id": 38, "date": "2012-08-02T00:00:00", "tournamentId": 10 }, { "$id": "46", "tournament": null, "players": [{ "$id": "47", "player": null, "id": 200, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 39 }, { "$id": "48", "player": null, "id": 201, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 1, "gameId": 39 }, { "$id": "49", "player": null, "id": 202, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 39 }, { "$id": "50", "player": null, "id": 203, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 39 }, { "$id": "51", "player": null, "id": 204, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 39 }, { "$id": "52", "player": null, "id": 205, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 3, "gameId": 39}], "id": 39, "date": "2012-08-09T00:00:00", "tournamentId": 10 }, { "$id": "53", "tournament": null, "players": [{ "$id": "54", "player": null, "id": 206, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 4, "gameId": 40 }, { "$id": "55", "player": null, "id": 207, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 40 }, { "$id": "56", "player": null, "id": 208, "rebuyRoundIndex": 0, "lostRoundIndex": null, "finalPosition": 3, "playerId": 5, "gameId": 40 }, { "$id": "57", "player": null, "id": 209, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 40 }, { "$id": "58", "player": null, "id": 210, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 6, "gameId": 40 }, { "$id": "59", "player": null, "id": 211, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 40}], "id": 40, "date": "2012-08-21T00:00:00", "tournamentId": 10 }, { "$id": "60", "tournament": null, "players": [{ "$id": "61", "player": null, "id": 212, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 4, "gameId": 41 }, { "$id": "62", "player": null, "id": 213, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 41 }, { "$id": "63", "player": null, "id": 214, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 5, "gameId": 41 }, { "$id": "64", "player": null, "id": 215, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 6, "gameId": 41 }, { "$id": "65", "player": null, "id": 216, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 41 }, { "$id": "66", "player": null, "id": 217, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 41}], "id": 41, "date": "2012-09-06T00:00:00", "tournamentId": 10 }, { "$id": "67", "tournament": null, "players": [{ "$id": "68", "player": null, "id": 218, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 42 }, { "$id": "69", "player": null, "id": 219, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 6, "gameId": 42 }, { "$id": "70", "player": null, "id": 220, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 42 }, { "$id": "71", "player": null, "id": 221, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 3, "gameId": 42 }, { "$id": "72", "player": null, "id": 222, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 11, "gameId": 42}], "id": 42, "date": "2012-09-13T00:00:00", "tournamentId": 10 }, { "$id": "73", "tournament": null, "players": [{ "$id": "74", "player": null, "id": 223, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 4, "gameId": 43 }, { "$id": "75", "player": null, "id": 224, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 6, "gameId": 43 }, { "$id": "76", "player": null, "id": 225, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 43 }, { "$id": "77", "player": null, "id": 226, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 43 }, { "$id": "78", "player": null, "id": 227, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 43 }, { "$id": "79", "player": null, "id": 228, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 3, "gameId": 43}], "id": 43, "date": "2012-09-18T00:00:00", "tournamentId": 10 }, { "$id": "80", "tournament": null, "players": [{ "$id": "81", "player": null, "id": 229, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 4, "gameId": 44 }, { "$id": "82", "player": null, "id": 230, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 44 }, { "$id": "83", "player": null, "id": 231, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 5, "gameId": 44 }, { "$id": "84", "player": null, "id": 232, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 3, "gameId": 44 }, { "$id": "85", "player": null, "id": 233, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 44}], "id": 44, "date": "2012-09-27T00:00:00", "tournamentId": 10 }, { "$id": "86", "tournament": null, "players": [{ "$id": "87", "player": null, "id": 234, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 45 }, { "$id": "88", "player": null, "id": 235, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 5, "gameId": 45 }, { "$id": "89", "player": null, "id": 236, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 3, "gameId": 45 }, { "$id": "90", "player": null, "id": 237, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 2, "gameId": 45 }, { "$id": "91", "player": null, "id": 238, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 10, "gameId": 45 }, { "$id": "92", "player": null, "id": 239, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 11, "gameId": 45}], "id": 45, "date": "2012-10-06T00:00:00", "tournamentId": 10 }, { "$id": "93", "tournament": null, "players": [{ "$id": "94", "player": null, "id": 240, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 4, "gameId": 46 }, { "$id": "95", "player": null, "id": 241, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 6, "gameId": 46 }, { "$id": "96", "player": null, "id": 242, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 46 }, { "$id": "97", "player": null, "id": 243, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 46 }, { "$id": "98", "player": null, "id": 244, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 46 }, { "$id": "99", "player": null, "id": 245, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 46 }, { "$id": "100", "player": null, "id": 246, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 7, "gameId": 46}], "id": 46, "date": "2012-10-11T00:00:00", "tournamentId": 10 }, { "$id": "101", "tournament": null, "players": [{ "$id": "102", "player": null, "id": 247, "rebuyRoundIndex": 0, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 47 }, { "$id": "103", "player": null, "id": 248, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 6, "gameId": 47 }, { "$id": "104", "player": null, "id": 249, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 47 }, { "$id": "105", "player": null, "id": 250, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 47 }, { "$id": "106", "player": null, "id": 251, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 47 }, { "$id": "107", "player": null, "id": 252, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 47 }, { "$id": "108", "player": null, "id": 253, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 7, "gameId": 47 }, { "$id": "109", "player": null, "id": 254, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 10, "gameId": 47}], "id": 47, "date": "2012-10-18T00:00:00", "tournamentId": 10 }, { "$id": "110", "tournament": null, "players": [{ "$id": "111", "player": null, "id": 255, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 48 }, { "$id": "112", "player": null, "id": 256, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 48 }, { "$id": "113", "player": null, "id": 257, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 3, "gameId": 48 }, { "$id": "114", "player": null, "id": 258, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 2, "gameId": 48 }, { "$id": "115", "player": null, "id": 259, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 48 }, { "$id": "116", "player": null, "id": 260, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 7, "gameId": 48}], "id": 48, "date": "2012-10-23T00:00:00", "tournamentId": 10 }, { "$id": "117", "tournament": null, "players": [{ "$id": "118", "player": null, "id": 261, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 4, "gameId": 49 }, { "$id": "119", "player": null, "id": 262, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 49 }, { "$id": "120", "player": null, "id": 263, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 5, "gameId": 49 }, { "$id": "121", "player": null, "id": 264, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 49 }, { "$id": "122", "player": null, "id": 265, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 1, "gameId": 49 }, { "$id": "123", "player": null, "id": 266, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 49 }, { "$id": "124", "player": null, "id": 267, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 7, "gameId": 49 }, { "$id": "125", "player": null, "id": 268, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 10, "gameId": 49 }, { "$id": "126", "player": null, "id": 269, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 11, "gameId": 49}], "id": 49, "date": "2012-11-01T00:00:00", "tournamentId": 10 }, { "$id": "127", "tournament": null, "players": [{ "$id": "128", "player": null, "id": 270, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 50 }, { "$id": "129", "player": null, "id": 271, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 1, "gameId": 50 }, { "$id": "130", "player": null, "id": 272, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 50 }, { "$id": "131", "player": null, "id": 273, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 3, "gameId": 50 }, { "$id": "132", "player": null, "id": 274, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 2, "gameId": 50 }, { "$id": "133", "player": null, "id": 275, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 7, "gameId": 50}], "id": 50, "date": "2012-11-08T00:00:00", "tournamentId": 10 }, { "$id": "134", "tournament": null, "players": [{ "$id": "135", "player": null, "id": 276, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 51 }, { "$id": "136", "player": null, "id": 277, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 1, "gameId": 51 }, { "$id": "137", "player": null, "id": 278, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 51 }, { "$id": "138", "player": null, "id": 279, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 3, "gameId": 51 }, { "$id": "139", "player": null, "id": 280, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 51 }, { "$id": "140", "player": null, "id": 281, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 51 }, { "$id": "141", "player": null, "id": 282, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 7, "gameId": 51}], "id": 51, "date": "2012-11-22T00:00:00", "tournamentId": 10 }, { "$id": "142", "tournament": null, "players": [{ "$id": "143", "player": null, "id": 283, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 4, "gameId": 52 }, { "$id": "144", "player": null, "id": 284, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 6, "gameId": 52 }, { "$id": "145", "player": null, "id": 285, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 1, "gameId": 52 }, { "$id": "146", "player": null, "id": 286, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 52 }, { "$id": "147", "player": null, "id": 287, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 5, "gameId": 52 }, { "$id": "148", "player": null, "id": 288, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 52 }, { "$id": "149", "player": null, "id": 289, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 7, "gameId": 52 }, { "$id": "150", "player": null, "id": 290, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 10, "gameId": 52}], "id": 52, "date": "2012-11-29T00:00:00", "tournamentId": 10 }, { "$id": "151", "tournament": null, "players": [{ "$id": "152", "player": null, "id": 291, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 4, "gameId": 53 }, { "$id": "153", "player": null, "id": 292, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 1, "gameId": 53 }, { "$id": "154", "player": null, "id": 293, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 5, "gameId": 53 }, { "$id": "155", "player": null, "id": 294, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 53 }, { "$id": "156", "player": null, "id": 295, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 53 }, { "$id": "157", "player": null, "id": 296, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 9, "gameId": 53}], "id": 53, "date": "2012-12-06T00:00:00", "tournamentId": 10 }, { "$id": "158", "tournament": null, "players": [{ "$id": "159", "player": null, "id": 297, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 54 }, { "$id": "160", "player": null, "id": 298, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 1, "gameId": 54 }, { "$id": "161", "player": null, "id": 299, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 6, "gameId": 54 }, { "$id": "162", "player": null, "id": 300, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 5, "gameId": 54 }, { "$id": "163", "player": null, "id": 301, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 54 }, { "$id": "164", "player": null, "id": 302, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 54 }, { "$id": "165", "player": null, "id": 303, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 7, "gameId": 54}], "id": 54, "date": "2012-12-13T00:00:00", "tournamentId": 10 }, { "$id": "166", "tournament": null, "players": [{ "$id": "167", "player": null, "id": 304, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 55 }, { "$id": "168", "player": null, "id": 305, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 3, "playerId": 1, "gameId": 55 }, { "$id": "169", "player": null, "id": 306, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 6, "gameId": 55 }, { "$id": "170", "player": null, "id": 307, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 5, "gameId": 55 }, { "$id": "171", "player": null, "id": 308, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 55 }, { "$id": "172", "player": null, "id": 309, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 2, "gameId": 55 }, { "$id": "173", "player": null, "id": 310, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 7, "gameId": 55 }, { "$id": "174", "player": null, "id": 311, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 8, "gameId": 55 }, { "$id": "175", "player": null, "id": 312, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 9, "gameId": 55}], "id": 55, "date": "2012-12-20T00:00:00", "tournamentId": 10 }, { "$id": "176", "tournament": null, "players": [{ "$id": "177", "player": null, "id": 313, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 4, "gameId": 56 }, { "$id": "178", "player": null, "id": 314, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 2, "playerId": 1, "gameId": 56 }, { "$id": "179", "player": null, "id": 315, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 1, "playerId": 5, "gameId": 56 }, { "$id": "180", "player": null, "id": 316, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 6, "gameId": 56 }, { "$id": "181", "player": null, "id": 317, "rebuyRoundIndex": 0, "lostRoundIndex": null, "finalPosition": 3, "playerId": 2, "gameId": 56 }, { "$id": "182", "player": null, "id": 318, "rebuyRoundIndex": null, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 3, "gameId": 56 }, { "$id": "183", "player": null, "id": 319, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 7, "gameId": 56 }, { "$id": "184", "player": null, "id": 320, "rebuyRoundIndex": 0, "lostRoundIndex": 0, "finalPosition": 0, "playerId": 8, "gameId": 56}], "id": 56, "date": "2012-12-27T00:00:00", "tournamentId": 10}];
                                  break;
                              case "../PokeridosService/api/standings/01-Jun-2012/31-Dec-2012":
                              case "../PokeridosService/api/standings/01-Jan-2013/30-Jun-2013":
                                  returnData = { "$id": "1", "numberOfGames": 24, "buyInAmount": 30, "tournamentId": 10, "gamePlayerStandings": [{ "$id": "2", "playerName": "Damian", "games": 23, "positionCounter": [7, 5, 3], "winnings": 860 }, { "$id": "3", "playerName": "Ale", "games": 21, "positionCounter": [4, 5, 4], "winnings": 480 }, { "$id": "4", "playerName": "Nando", "games": 22, "positionCounter": [4, 2, 6], "winnings": 210 }, { "$id": "5", "playerName": "Seba", "games": 22, "positionCounter": [4, 2, 5], "winnings": 140 }, { "$id": "6", "playerName": "Alex", "games": 23, "positionCounter": [4, 2, 0], "winnings": -240 }, { "$id": "7", "playerName": "Carlos", "games": 24, "positionCounter": [1, 5, 2], "winnings": -610 }, { "$id": "8", "playerName": "Invitados", "games": 1, "positionCounter": [0, 0, 0], "winnings": -60 }, { "$id": "9", "playerName": "Idan", "games": 7, "positionCounter": [0, 1, 2], "winnings": -210 }, { "$id": "10", "playerName": "Lior", "games": 3, "positionCounter": [0, 0, 0], "winnings": -120 }, { "$id": "11", "playerName": "Zacky", "games": 10, "positionCounter": [0, 2, 2], "winnings": -210 }, { "$id": "12", "playerName": "Mariano", "games": 2, "positionCounter": [0, 0, 0], "winnings": -120 }, { "$id": "13", "playerName": "Miguel", "games": 2, "positionCounter": [0, 0, 0], "winnings": -120}] };
                                  break;
                              case "../PokeridosService/api/tournament/last":
                                  returnData = { "$id": "1", "games": [], "id": 11, "name": "Final 2013", "fromDate": "2013-01-01T00:00:00", "toDate": "2013-06-30T00:00:00", "buyInAmount": 30, "winnerId": null, "gamesCount": 0 };
                                  break;
                              case "../PokeridosService/api/game/last":
                                  returnData = { "$id": "1", "tournament": null, "players": [{ "$id": "2", "player": { "$id": "3", "gamesInCurrentTournament": 0, "id": 3, "name": "Carlos", "pictureName": "Carlos.jpg" }, "id": 321, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 3, "gameId": 57 }, { "$id": "4", "player": { "$id": "5", "gamesInCurrentTournament": 0, "id": 4, "name": "Damian", "pictureName": "DamiL.jpg" }, "id": 322, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 4, "gameId": 57 }, { "$id": "6", "player": { "$id": "7", "gamesInCurrentTournament": 0, "id": 2, "name": "Alex", "pictureName": "Alex.jpg" }, "id": 323, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 2, "gameId": 57 }, { "$id": "8", "player": { "$id": "9", "gamesInCurrentTournament": 0, "id": 1, "name": "Ale", "pictureName": "Ale.jpg" }, "id": 324, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 1, "gameId": 57 }, { "$id": "10", "player": { "$id": "11", "gamesInCurrentTournament": 0, "id": 7, "name": "Zacky", "pictureName": "Zacky.jpg" }, "id": 325, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 7, "gameId": 57}], "id": 57, "date": "2013-01-08T17:59:48", "tournamentId": 11 };
                                  break;
                              case "../PokeridosService/api/blindlevel":
                                  returnData = [{ "$id": "1", "id": 1, "periodInMinutes": 20, "amount": 10, "anteAmount": 0, "order": 1 }, { "$id": "2", "id": 2, "periodInMinutes": 20, "amount": 20, "anteAmount": 0, "order": 2 }, { "$id": "3", "id": 3, "periodInMinutes": 20, "amount": 50, "anteAmount": 0, "order": 3 }, { "$id": "4", "id": 4, "periodInMinutes": 15, "amount": 80, "anteAmount": 0, "order": 4 }, { "$id": "5", "id": 5, "periodInMinutes": 15, "amount": 100, "anteAmount": 0, "order": 5 }, { "$id": "6", "id": 6, "periodInMinutes": 15, "amount": 140, "anteAmount": 0, "order": 6 }, { "$id": "7", "id": 7, "periodInMinutes": 10, "amount": 160, "anteAmount": 0, "order": 7 }, { "$id": "8", "id": 8, "periodInMinutes": 10, "amount": 200, "anteAmount": 0, "order": 8 }, { "$id": "9", "id": 9, "periodInMinutes": 10, "amount": 300, "anteAmount": 0, "order": 9 }, { "$id": "10", "id": 10, "periodInMinutes": 10, "amount": 400, "anteAmount": 0, "order": 10 }, { "$id": "11", "id": 11, "periodInMinutes": 10, "amount": 500, "anteAmount": 0, "order": 11 }, { "$id": "12", "id": 12, "periodInMinutes": 999, "amount": 1000, "anteAmount": 0, "order": 12}];
                                  break;
                              case "../PokeridosService/api/player":
                                  returnData = [{ "$id": "1", "gamesInCurrentTournament": 2, "id": 1, "name": "Ale", "pictureName": "Ale.jpg" }, { "$id": "2", "gamesInCurrentTournament": 3, "id": 2, "name": "Alex", "pictureName": "Alex.jpg" }, { "$id": "3", "gamesInCurrentTournament": 3, "id": 3, "name": "Carlos", "pictureName": "Carlos.jpg" }, { "$id": "4", "gamesInCurrentTournament": 3, "id": 4, "name": "Damian", "pictureName": "DamiL.jpg" }, { "$id": "5", "gamesInCurrentTournament": 2, "id": 5, "name": "Nando", "pictureName": "Nando.jpg" }, { "$id": "6", "gamesInCurrentTournament": 2, "id": 6, "name": "Seba", "pictureName": "Seba.jpg" }, { "$id": "7", "gamesInCurrentTournament": 1, "id": 7, "name": "Zacky", "pictureName": "Zacky.jpg" }, { "$id": "8", "gamesInCurrentTournament": 0, "id": 8, "name": "Miguel", "pictureName": "Miguel.jpg" }, { "$id": "9", "gamesInCurrentTournament": 2, "id": 9, "name": "Mariano", "pictureName": "Guest.png" }, { "$id": "10", "gamesInCurrentTournament": 0, "id": 10, "name": "Idan", "pictureName": "Guest.png" }, { "$id": "11", "gamesInCurrentTournament": 0, "id": 11, "name": "Lior", "pictureName": "Guest.png" }, { "$id": "12", "gamesInCurrentTournament": 0, "id": 12, "name": "Invitados", "pictureName": "Guest.png"}];
                                  break;
                              case "../PokeridosService/api/tournament":
                                  returnData = [{ "$id": "1", "games": [], "id": 6, "name": "2010", "fromDate": "2010-03-02T00:00:00", "toDate": "2010-12-30T00:00:00", "buyInAmount": 30, "winnerId": 1, "gamesCount": 0 }, { "$id": "2", "games": [], "id": 7, "name": "Apertura 2011", "fromDate": "2011-01-01T00:00:00", "toDate": "2011-06-30T00:00:00", "buyInAmount": 30, "winnerId": 2, "gamesCount": 0 }, { "$id": "3", "games": [], "id": 8, "name": "Clausura 2011", "fromDate": "2011-06-01T00:00:00", "toDate": "2011-12-31T00:00:00", "buyInAmount": 30, "winnerId": 3, "gamesCount": 0 }, { "$id": "4", "games": [], "id": 9, "name": "Apertura 2012", "fromDate": "2012-01-01T00:00:00", "toDate": "2012-06-30T00:00:00", "buyInAmount": 30, "winnerId": 4, "gamesCount": 0 }, { "$id": "5", "games": [{ "$id": "6", "tournament": { "$ref": "5" }, "players": [], "id": 33, "date": "2012-06-07T00:00:00", "tournamentId": 10 }, { "$id": "7", "tournament": { "$ref": "5" }, "players": [], "id": 34, "date": "2012-06-14T00:00:00", "tournamentId": 10 }, { "$id": "8", "tournament": { "$ref": "5" }, "players": [], "id": 35, "date": "2012-06-19T00:00:00", "tournamentId": 10 }, { "$id": "9", "tournament": { "$ref": "5" }, "players": [], "id": 36, "date": "2012-06-26T00:00:00", "tournamentId": 10 }, { "$id": "10", "tournament": { "$ref": "5" }, "players": [], "id": 37, "date": "2012-07-26T00:00:00", "tournamentId": 10 }, { "$id": "11", "tournament": { "$ref": "5" }, "players": [], "id": 38, "date": "2012-08-02T00:00:00", "tournamentId": 10 }, { "$id": "12", "tournament": { "$ref": "5" }, "players": [], "id": 39, "date": "2012-08-09T00:00:00", "tournamentId": 10 }, { "$id": "13", "tournament": { "$ref": "5" }, "players": [], "id": 40, "date": "2012-08-21T00:00:00", "tournamentId": 10 }, { "$id": "14", "tournament": { "$ref": "5" }, "players": [], "id": 41, "date": "2012-09-06T00:00:00", "tournamentId": 10 }, { "$id": "15", "tournament": { "$ref": "5" }, "players": [], "id": 42, "date": "2012-09-13T00:00:00", "tournamentId": 10 }, { "$id": "16", "tournament": { "$ref": "5" }, "players": [], "id": 43, "date": "2012-09-18T00:00:00", "tournamentId": 10 }, { "$id": "17", "tournament": { "$ref": "5" }, "players": [], "id": 44, "date": "2012-09-27T00:00:00", "tournamentId": 10 }, { "$id": "18", "tournament": { "$ref": "5" }, "players": [], "id": 45, "date": "2012-10-06T00:00:00", "tournamentId": 10 }, { "$id": "19", "tournament": { "$ref": "5" }, "players": [], "id": 46, "date": "2012-10-11T00:00:00", "tournamentId": 10 }, { "$id": "20", "tournament": { "$ref": "5" }, "players": [], "id": 47, "date": "2012-10-18T00:00:00", "tournamentId": 10 }, { "$id": "21", "tournament": { "$ref": "5" }, "players": [], "id": 48, "date": "2012-10-23T00:00:00", "tournamentId": 10 }, { "$id": "22", "tournament": { "$ref": "5" }, "players": [], "id": 49, "date": "2012-11-01T00:00:00", "tournamentId": 10 }, { "$id": "23", "tournament": { "$ref": "5" }, "players": [], "id": 50, "date": "2012-11-08T00:00:00", "tournamentId": 10 }, { "$id": "24", "tournament": { "$ref": "5" }, "players": [], "id": 51, "date": "2012-11-22T00:00:00", "tournamentId": 10 }, { "$id": "25", "tournament": { "$ref": "5" }, "players": [], "id": 52, "date": "2012-11-29T00:00:00", "tournamentId": 10 }, { "$id": "26", "tournament": { "$ref": "5" }, "players": [], "id": 53, "date": "2012-12-06T00:00:00", "tournamentId": 10 }, { "$id": "27", "tournament": { "$ref": "5" }, "players": [], "id": 54, "date": "2012-12-13T00:00:00", "tournamentId": 10 }, { "$id": "28", "tournament": { "$ref": "5" }, "players": [], "id": 55, "date": "2012-12-20T00:00:00", "tournamentId": 10 }, { "$id": "29", "tournament": { "$ref": "5" }, "players": [], "id": 56, "date": "2012-12-27T00:00:00", "tournamentId": 10}], "id": 10, "name": "Clausura 2012", "fromDate": "2012-06-01T00:00:00", "toDate": "2012-12-31T00:00:00", "buyInAmount": 30, "winnerId": 4, "gamesCount": 24 }, { "$id": "30", "games": [{ "$id": "31", "tournament": { "$ref": "30" }, "players": [], "id": 29, "date": "2013-01-03T20:12:30", "tournamentId": 11 }, { "$id": "32", "tournament": { "$ref": "30" }, "players": [], "id": 31, "date": "2013-01-05T21:03:06", "tournamentId": 11 }, { "$id": "33", "tournament": { "$ref": "30" }, "players": [], "id": 32, "date": "2013-01-06T20:33:43", "tournamentId": 11}], "id": 11, "name": "Final 2013", "fromDate": "2013-01-01T00:00:00", "toDate": "2013-06-30T00:00:00", "buyInAmount": 30, "winnerId": null, "gamesCount": 3}];
                                  break;
                              default:
                                  returnData = {};
                                  break;
                          }
                          break;
                      case "POST":
                          returnData = { "$id": "1", "id": 57, "date": "2013-01-08T17:59:48Z", "tournamentId": 11, "tournament": null, "players": [{ "$id": "2", "id": 321, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 3, "gameId": 57, "player": { "$id": "3", "gamesInCurrentTournament": 0, "id": 3, "name": "Carlos", "pictureName": "Carlos.jpg"} }, { "$id": "4", "id": 322, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 4, "gameId": 57, "player": { "$id": "5", "gamesInCurrentTournament": 0, "id": 4, "name": "Damian", "pictureName": "DamiL.jpg"} }, { "$id": "6", "id": 323, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 2, "gameId": 57, "player": { "$id": "7", "gamesInCurrentTournament": 0, "id": 2, "name": "Alex", "pictureName": "Alex.jpg"} }, { "$id": "8", "id": 324, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 1, "gameId": 57, "player": { "$id": "9", "gamesInCurrentTournament": 0, "id": 1, "name": "Ale", "pictureName": "Ale.jpg"} }, { "$id": "10", "id": 325, "rebuyRoundIndex": null, "lostRoundIndex": null, "finalPosition": 0, "playerId": 7, "gameId": 57, "player": { "$id": "11", "gamesInCurrentTournament": 0, "id": 7, "name": "Zacky", "pictureName": "Zacky.jpg"}}] };
                          break;
                      default:
                          returnData = {};
                          break;
                  }
                  f(returnData);
              }
          };
      };

      return {

          clearOfflineQueue: function () {
              localStorage.removeItem(localStorage_offlineQueue);
          },

          getOffline: function () {
              return localStorage.getItem('offline') || false;
          },

          login: function ($scope, username, password) {
              var url = playerUrl + '/login/' + username + '/' + password;
              return callService($scope, 'GET', url);
          },

          getPlayers: function ($scope) {
              return callService($scope, 'GET', playerUrl);
          },

          getOpenTournament: function ($scope) {
              var url = tournamentUrl + '/last';
              return callService($scope, 'GET', url);
          },

          getTournaments: function ($scope) {
              return callService($scope, 'GET', tournamentUrl);
          },

          getTournament: function ($scope, id) {
              var url = tournamentUrl + '/' + id;
              return callService($scope, 'GET', url);
          },

          addPlayer: function ($scope, player) {
              return callService($scope, 'POST', playerUrl, player);
          },

          startGame: function ($scope, openTournament, playingPlayers) {
              var newGame = { date: (new Date).toUTCString(), tournamentId: openTournament.id };
              var gamePlayers = [];
              for (var i = 0; i < playingPlayers.length; i++) {
                  var p = playingPlayers[i];
                  gamePlayers.push({ /*game: newGame,*/playerId: p.id });
              }
              newGame.players = gamePlayers;

              return callService($scope, 'POST', gameUrl, newGame);
          },

          getLastGame: function ($scope) {
              var url = gameUrl + '/last';
              return callService($scope, 'GET', url);
          },

          getGames: function ($scope, fromDate, toDate) {
              fromDate = fromDate.format('dd-mmm-yyyy');
              toDate = toDate.format('dd-mmm-yyyy');

              var url = gameUrl + '/' + fromDate + '/' + toDate;
              return callService($scope, 'GET', url);
          },

          getBlindsForGame: function ($scope) {
              return callService($scope, 'GET', blindLevelUrl);
          },

          playerLost: function ($scope, gamePlayer) {
              var url = gamePlayerUrl + '/' + gamePlayer.id;
              return callService($scope, 'PUT', url, gamePlayer, 'application/json');
          },

          playerRebuys: function ($scope, gamePlayer) {
              return this.playerLost($scope, gamePlayer);  // uses the same api
          },

          playerWon: function ($scope, gamePlayer) {
              return this.playerLost($scope, gamePlayer);  // uses the same api
          },

          getStandings: function ($scope, fromDate, toDate) {
              fromDate = fromDate.format('dd-mmm-yyyy');
              toDate = toDate.format('dd-mmm-yyyy');

              var url = standingsUrl + '/' + fromDate + '/' + toDate;
              return callService($scope, 'GET', url);
          },

          fillPlayerNames: function ($scope) {
              var promise = callService($scope, 'GET', playerUrl);
              promise.then(function (data) {
                  localStorage.setItem('players', JSON.stringify(data));
              });
          },

          getPlayerName: function ($scope, playerId) {
              var players = JSON.parse(localStorage.getItem('players'));
              for (var i = 0; i < players.length; i++) {
                  if (players[i].id == playerId) {
                      return players[i].name;
                  }
              }
              return 'Unknown';
          },

          getCurrentBlindsIndex: function () {
              return parseInt(localStorage.getItem(localStorage_currentBlindsIndex) || 0, 10);
          },

          setCurrentBlindsIndex: function (newValue) {
              localStorage.setItem(localStorage_currentBlindsIndex, newValue);
          },

          getCurrentUsername: function () {
              return sessionStorage.getItem(localStorage_currentUsername);
          },

          setCurrentUsername: function (newValue) {
              sessionStorage.setItem(localStorage_currentUsername, newValue);
          }
      };
  } ]);
