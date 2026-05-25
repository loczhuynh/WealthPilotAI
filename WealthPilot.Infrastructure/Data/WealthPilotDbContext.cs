using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WealthPilot.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace WealthPilot.Infrastructure.Data
{
    public class WealthPilotDbContext : DbContext
    {
        public WealthPilotDbContext(DbContextOptions<WealthPilotDbContext> options)
            : base(options)
        {
        }

        public DbSet<Asset> Assets => Set<Asset>();
        public DbSet<Debt> Debts => Set<Debt>();
        public DbSet<StockHolding> StockHoldings => Set<StockHolding>();
    }
}
