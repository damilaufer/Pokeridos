using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Diagnostics;
using System.ComponentModel.DataAnnotations.Schema;

namespace PokeridosService
{
    [DebuggerDisplay("{Id}, {Name}")]
    public partial class Player
    {
        [NotMapped]
        public int GamesInCurrentTournament { get; set; }
    }

    [DebuggerDisplay("{Id}, {Name}, ${BuyInAmount}, WinId {WinnerId}")]
    public partial class Tournament
    {
        [NotMapped]
        public int GamesCount { get; set; }
    }

    [DebuggerDisplay("{Id}, {Date}, Tournament {TournamentId}")]
    public partial class Game
    {
    }

    [DebuggerDisplay("Game {GameId}, player {PlayerId}, Pos {FinalPosition}, Lost {LostRoundIndex}, rebuy {RebuyRoundIndex}")]
    public partial class GamePlayer
    {
    }

    [DebuggerDisplay("{Amount} for {PeriodInMinutes} minutes")]
    public partial class BlindLevel
    {
    }
}