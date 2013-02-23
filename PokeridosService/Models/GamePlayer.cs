//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace PokeridosService.Models
//{
//    public class GamePlayer
//    {
//        [Key]
//        public int Id { get; set; }

//        public int GameId { get; set; }

//        [Required, ForeignKey("GameId")]
//        public Game Game { get; set; }

//        public int PlayerId { get; set; }

//        [Required, ForeignKey("PlayerId")]
//        public Player Player { get; set; }

//        public int? RebuyRoundIndex { get; set; }

//        public int? LostRoundIndex { get; set; }

//        public int FinalPosition { get; set; }
//    }
//}