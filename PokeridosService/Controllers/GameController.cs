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
    public class GameController : ApiController
    {
        private readonly DBContexts _db = new DBContexts();
              
        // GET api/game
        public IEnumerable<Game> GetGames()
        {
            return _db.Games.AsEnumerable();
        }
        
        // GET api/game/fromDate/toDate
        public IEnumerable<Game> GetGames(string fromString, string toString)
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

            return (from g in _db.Games.Include("Players")
                    where (g.Date >= fromDate) && (g.Date <= toDate)
                    orderby g.Date
                    select g).AsEnumerable();
        }

        // GET api/game/5
        public Game GetGame(string id)
        {
            int idAsInt;
            Game game = null;
            if (int.TryParse(id, out idAsInt))
            {
                game = (from g in _db.Games.Include("Players.Player")
                       where g.Id == idAsInt
                       select g).SingleOrDefault();
                    
                    _db.Games.Find(idAsInt);
            }
            else if (id.ToLowerInvariant() == "last")
            {
                if (_db.Tournaments.Any())
                {
                    var maxDate = _db.Games.Max(t => t.Date);
                    game = (from g in _db.Games.Include("Players.Player")
                            where g.Date == maxDate
                            select g).SingleOrDefault();
                }
            }
            else
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotImplemented));
            }

            if (game == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return game;
        }
        
        // PUT api/game/5
        public HttpResponseMessage PutGame(int id, Game game)
        {
            if (ModelState.IsValid && id == game.Id)
            {
                _db.Entry(game).State = EntityState.Modified;

                try
                {
                    _db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        // POST api/game
        public HttpResponseMessage PostGame(Game game)
        {
            if (ModelState.IsValid)
            {
                game.Date = game.Date.Date;  //remove hh:mm:ss:sss

                _db.Games.Add(game);
                _db.SaveChanges();

                //load the player's data, so the client can show it
                foreach (var player in game.Players)
                {
                    player.Player = _db.Players.Find(player.PlayerId);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, game);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = game.Id }));
                return response;
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        // DELETE api/game/5
        public HttpResponseMessage DeleteGame(int id)
        {
            Game game = _db.Games.Find(id);
            if (game == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            _db.Games.Remove(game);

            try
            {
                _db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, game);
        }

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}