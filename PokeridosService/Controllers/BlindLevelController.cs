using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PokeridosService.Models;

namespace PokeridosService.Controllers
{
    public class BlindLevelController : ApiController
    {
        private readonly DBContexts _db = new DBContexts();

        // GET api/Player
        public IEnumerable<BlindLevel> GetPlayers()
        {
            return _db.BlindLevels.OrderBy(b=>b.Order).AsEnumerable();
        }
 
        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}