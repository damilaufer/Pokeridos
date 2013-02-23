using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;

namespace PokeridosService.Models
{
    public class Standing
    {
        public Standing(int numberOfGames)
        {
            NumberOfGames = numberOfGames;
            GamePlayerStandingsDictionary = new Dictionary<int, GamePlayerStanding>();
        }

        public int NumberOfGames { get; set; }

        public Nullable<int> BuyInAmount { get; set; }

        public Nullable<int> TournamentId { get; set; }

        [JsonIgnore]
        public Dictionary<int, GamePlayerStanding> GamePlayerStandingsDictionary { get; set; }

        public IEnumerable<GamePlayerStanding> GamePlayerStandings
        {
            get { return GamePlayerStandingsDictionary.Values.AsEnumerable(); }
        }

        public void AddGamePlayerStanding(int playerId)
        {
            if (GamePlayerStandingsDictionary.ContainsKey(playerId) == false)
            {
                GamePlayerStandingsDictionary.Add(playerId, new GamePlayerStanding(playerId));
            }
        }

        public class GamePlayerStanding
        {
            public GamePlayerStanding(int playerId)
            {
                PlayerId = playerId;
                PositionCounter = new int[3]; //@@@ GET THE number of players, so we can draw each player's history
                Winnings = 0;
            }

            [JsonIgnore]
            public int PlayerId { get; set; }

            public string PlayerName { get; set; }

            public int Games { get; set; }

            public int[] PositionCounter { get; set; }

            public int Winnings { get; set; }

        }
    }
}