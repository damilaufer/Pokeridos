using System.Data.Entity;

namespace PokeridosService.Models
{
    public class DBContexts : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, add the following
        // code to the Application_Start method in your Global.asax file.
        // Note: this will destroy and re-create your database with every model change.
        // 
        // System.Data.Entity.Database.SetInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<PokeridosService.Models.GameContext>());

        public DBContexts() : base("name=DBContexts")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<GamePlayer> GamePlayers { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<BlindLevel> BlindLevels { get; set; }
    }
}
