using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using PokeridosService.Models;

namespace PokeridosService.Controllers
{
    public class StandingsController : ApiController
    {
        private readonly DBContexts _db = new DBContexts();

        // GET api/Standing/from/to
        public Standing GetStandings(string fromString, string toString)
        {
            DateTime fromDate, toDate;
            if (DateTime.TryParse(fromString, out fromDate) == false)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotAcceptable));
            }
            if (DateTime.TryParse(toString, out toDate) == false)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotAcceptable));
            }
            
            var games = (from g in _db.Games.Include("Players")
                         where (g.Date >= fromDate) && (g.Date <= toDate)
                         select g);
            var standingResult = new Standing(games.Count());
            if (games.Any())
            {
                var firstTournamentId = games.First().TournamentId;
                if (games.All(g => g.TournamentId == firstTournamentId))
                {
                    standingResult.TournamentId = firstTournamentId;

                    var tournament = _db.Tournaments.Find(firstTournamentId);
                    standingResult.BuyInAmount = tournament.BuyInAmount;
                }
            }

            foreach (var game in games)
            {
                var gamePlayers = game.Players.OrderBy(p => -p.FinalPosition).ToArray();
                
                for (int finalPosition = 0; finalPosition < gamePlayers.Length; finalPosition++)
                {
                    var gamePlayer = gamePlayers[finalPosition];
                    standingResult.AddGamePlayerStanding(gamePlayer.PlayerId);

                    var standing = standingResult.GamePlayerStandingsDictionary[gamePlayer.PlayerId];
                    standing.Games++;
                    if (standing.PositionCounter.Length > finalPosition)
                    {
                        standing.PositionCounter[finalPosition]++;
                    }
                    standing.Winnings += gamePlayer.Winnings;
                }
            }

            // Fill the names.
            foreach (var player in _db.Players)
            {
                if (standingResult.GamePlayerStandingsDictionary.ContainsKey(player.Id))
                {
                    standingResult.GamePlayerStandingsDictionary[player.Id].PlayerName = player.Name;
                }
            }
            return standingResult;
        }
    }
}