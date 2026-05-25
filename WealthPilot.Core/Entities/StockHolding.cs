using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WealthPilot.Core.Entities
{
    public class StockHolding
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Ticker { get; set; } = "";
        public decimal Shares { get; set; }
        public decimal AvgCost { get; set; }
        public decimal CurrentPrice { get; set; }
    }
}
