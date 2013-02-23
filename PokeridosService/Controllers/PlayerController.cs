using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PokeridosService.Models;

//@@@ http://www.piotrwalat.net/using-typescript-with-angularjs-and-web-api/

namespace PokeridosService.Controllers
{
    public class PlayerController : ApiController
    {
        private readonly DBContexts _db = new DBContexts();

        // GET api/Player
        public IEnumerable<Player> GetPlayers()
        {
            var players = new Dictionary<int, Player>();
            foreach (var player in _db.Players.AsEnumerable())
            {
                players.Add(player.Id, player);
            }

            // if we have a tournament, count the number of games per player, so the GUI can sort them accordingly
            var tc = new TournamentController();
            var lastTournament = tc.GetTournament(TournamentController.Last);
            if (lastTournament != null)
            {
                var gamePlayers = (from game in _db.Games
                                   join gamePlayer in _db.GamePlayers on game.Id equals gamePlayer.GameId
                                   where game.TournamentId == lastTournament.Id
                                   select gamePlayer);
                foreach (var gamePlayer in gamePlayers)
                {
                    players[gamePlayer.PlayerId].GamesInCurrentTournament++;
                }
            }

            return players.Values.AsEnumerable();
        }

        // GET api/Player/5
        public Player GetPlayer(string id)
        {
            Player player = _db.Players.Find(Convert.ToInt32(id));
            if (player == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return player;
        }

        // GET api/Player/username/password
        public Player GetPlayer(string username, string password)
        {
            Player player = (from u in _db.Players
                             where u.Name == username
                             && u.Password == password
                             select u).SingleOrDefault();
            if (player == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return player;
        }

        //// PUT api/Player/5
        //public HttpResponseMessage PutPlayer(int id, Player player)
        //{
        //    if (ModelState.IsValid && id == player.Id)
        //    {
        //        db.Entry(player).State = EntityState.Modified;

        //        try
        //        {
        //            db.SaveChanges();
        //        }
        //        catch (DbUpdateConcurrencyException)
        //        {
        //            return Request.CreateResponse(HttpStatusCode.NotFound);
        //        }

        //        return Request.CreateResponse(HttpStatusCode.OK);
        //    }
        //    else
        //    {
        //        return Request.CreateResponse(HttpStatusCode.BadRequest);
        //    }
        //}

        // POST api/Player
        public HttpResponseMessage PostPlayer(Player player)
        {
            if (ModelState.IsValid)
            {
                _db.Players.Add(player);
                _db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, player);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = player.Id }));
                return response;
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        //// DELETE api/Player/5
        //public HttpResponseMessage DeletePlayer(int id)
        //{
        //    Player player = db.Players.Find(id);
        //    if (player == null)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    db.Players.Remove(player);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK, player);
        //}

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}