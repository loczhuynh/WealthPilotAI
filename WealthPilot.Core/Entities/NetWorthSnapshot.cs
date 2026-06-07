using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WealthPilot.Core.Entities;

public class NetWorthSnapshot
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public decimal TotalAssets { get; set; }
    public decimal TotalDebts { get; set; }
    public decimal StockValue { get; set; }
    public decimal NetWorth { get; set; }

    public DateTime SnapshotDate { get; set; } = DateTime.UtcNow;
}
