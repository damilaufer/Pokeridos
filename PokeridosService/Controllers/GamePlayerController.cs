using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PokeridosService.Models;

namespace PokeridosService.Controllers
{
    public class GamePlayerController : ApiController
    {
        private readonly DBContexts _db = new DBContexts();

        // GET api/GamePlayer
        public IEnumerable<GamePlayer> GetGamePlayers()
        {
            return _db.GamePlayers.AsEnumerable();
        }

        // GET api/GamePlayer/5
        public GamePlayer GetGamePlayer(int id)
        {
            GamePlayer gameplayer = _db.GamePlayers.Find(id);
            if (gameplayer == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return gameplayer;
        }

        // PUT api/GamePlayer/5
        public HttpResponseMessage PutGamePlayer(int id, GamePlayer gameplayer)
        {
            if (ModelState.IsValid && id == gameplayer.Id)
            {
                _db.Entry(gameplayer).State = EntityState.Modified;
                
                try
                {
                    _db.SaveChanges();

                    var playingPlayersCount = _db.GamePlayers.Count(gp => (gp.GameId == gameplayer.GameId) && (gp.LostRoundIndex == null));
                    if ((playingPlayersCount == 1) && (gameplayer.LostRoundIndex == null))
                    {
                        // This is the winner, so calculate winnings, positions, etc

                        var tc = new TournamentController();
                        var lastTournament = tc.GetTournament(TournamentController.Last);   //cannot be null
                        var buyIn = lastTournament.BuyInAmount;

                        var gamePlayersOrderedDesc = (from gp in _db.GamePlayers
                                                      where gp.GameId == gameplayer.GameId
                                                      orderby -1 * gp.FinalPosition
                                                      select gp).ToArray();
                        var boxes = gamePlayersOrderedDesc.Length + gamePlayersOrderedDesc.Count(gp => gp.RebuyRoundIndex != null);
                        var totalWinnings  = boxes * buyIn;
                        for (int i = 0; i < gamePlayersOrderedDesc.Length; i++)
                        {
                            var gp = gamePlayersOrderedDesc[i];
                            var rebuy = (gp.RebuyRoundIndex == null ? 0 : buyIn);
                            gp.FinalPosition = gamePlayersOrderedDesc.Length - i;
                            switch (i)
                            {
                                case 0: // 1st place
                                    gp.Winnings = -(buyIn + rebuy) + (totalWinnings - buyIn) * 2 / 3;
                                    break;
                                case 1: // 2nd place
                                    gp.Winnings = -(buyIn + rebuy) + (totalWinnings - buyIn) * 1 / 3;
                                    break;
                                case 2: // 3rd place
                                    gp.Winnings = -(buyIn + rebuy) + buyIn; // it's equal to 1 rebuy
                                    break;
                                default:
                                    gp.Winnings = -(buyIn + rebuy);
                                    break;
                            }
                        }
                        
                        _db.SaveChanges();
                    }
                }
                catch (DbUpdateConcurrencyException)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        // POST api/GamePlayer
        public HttpResponseMessage PostGamePlayer(GamePlayer gameplayer)
        {
            if (ModelState.IsValid)
            {
                _db.GamePlayers.Add(gameplayer);
                _db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, gameplayer);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = gameplayer.Id }));
                return response;
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        // DELETE api/GamePlayer/5
        public HttpResponseMessage DeleteGamePlayer(int id)
        {
            GamePlayer gameplayer = _db.GamePlayers.Find(id);
            if (gameplayer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            _db.GamePlayers.Remove(gameplayer);

            try
            {
                _db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, gameplayer);
        }

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}