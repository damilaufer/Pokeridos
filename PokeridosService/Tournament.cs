//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PokeridosService
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tournament
    {
        public Tournament()
        {
            this.Games = new HashSet<Game>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public System.DateTime FromDate { get; set; }
        public System.DateTime ToDate { get; set; }
        public int BuyInAmount { get; set; }
        public Nullable<int> WinnerId { get; set; }
    
        public virtual ICollection<Game> Games { get; set; }
    }
}
