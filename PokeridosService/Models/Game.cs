//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace PokeridosService.Models
//{
//    public class Game
//    {
//        [Key]
//        public int Id { get; set; }

//        public DateTime Date { get; set; }

//        public int TournamentId { get; set; }

//        [ForeignKey("TournamentId")]
//        public Tournament Tournament { get; set; }

//        public GamePlayer[] GamePlayers { get; set; }
//    }
//}