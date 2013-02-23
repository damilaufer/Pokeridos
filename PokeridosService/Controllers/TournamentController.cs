using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PokeridosService.Models;

namespace PokeridosService.Controllers
{
    public class TournamentController : ApiController
    {
        public const string Last = "last";

        private readonly DBContexts _db = new DBContexts();

        // GET api/Tournament
        public IEnumerable<Tournament> GetTournaments()
        {
            var tournaments = from t in _db.Tournaments.Include("Games")
                              select t;
            foreach (var t in tournaments)
            {
                t.GamesCount = t.Games.Count();
            }

            return tournaments.AsEnumerable();
        }

        // GET api/Tournament/5
        // GET api/Tournament/last
        public Tournament GetTournament(string id)
        {
            int idAsInt;
            Tournament tournament = null;
            if (int.TryParse(id, out idAsInt))
            {
                tournament = (from t in _db.Tournaments.Include("Games")
                              where t.Id == idAsInt
                              select t).SingleOrDefault();
            }
            else if (id.ToLowerInvariant() == Last)
            {
                if (_db.Tournaments.Any())
                {
                    var maxDate = _db.Tournaments.Max(t => t.ToDate);
                    tournament = _db.Tournaments.Single(t => t.ToDate == maxDate);
                }
            }
            else
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotImplemented));
            }

            if (tournament == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return tournament;
        }

        //// PUT api/Tournament/5
        //public HttpResponseMessage PutTournament(int id, Tournament tournament)
        //{
        //    if (ModelState.IsValid && id == tournament.Id)
        //    {
        //        db.Entry(tournament).State = EntityState.Modified;

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

        //// POST api/Tournament
        //public HttpResponseMessage PostTournament(Tournament tournament)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Tournaments.Add(tournament);
        //        db.SaveChanges();

        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tournament);
        //        response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = tournament.Id }));
        //        return response;
        //    }
        //    else
        //    {
        //        return Request.CreateResponse(HttpStatusCode.BadRequest);
        //    }
        //}

        //// DELETE api/Tournament/5
        //public HttpResponseMessage DeleteTournament(int id)
        //{
        //    Tournament tournament = db.Tournaments.Find(id);
        //    if (tournament == null)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    db.Tournaments.Remove(tournament);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK, tournament);
        //}

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}