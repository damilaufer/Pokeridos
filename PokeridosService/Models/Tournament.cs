//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace PokeridosService.Models
//{
//    public class Tournament
//    {
//        [Key]
//        public int Id { get; set; }

//        [Required, MaxLength(20, ErrorMessage = "Name must be 20 characters or less")]
//        public string Name { get; set; }

//        public DateTime FromDate { get; set; }

//        public DateTime ToDate { get; set; }

//        public int BuyInAmount { get; set; }

//        public int[] PointsPerWin { get; set; }

//        //public Game[] Games { get; set; }

//        // Cannot make it a real Player because of Code-first cascade delete problems
//        public int WinnerPlayerId { get; set; }

//        //[ForeignKey("PlayerId")]
//        //public Player Winner { get; set; }
//    }
//}