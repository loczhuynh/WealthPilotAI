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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure decimal precision to match SQL decimal columns and avoid silent truncation / casting issues
            modelBuilder.Entity<Debt>().Property(d => d.Amount).HasPrecision(18, 2);

            modelBuilder.Entity<StockHolding>(eb =>
            {
                eb.Property(s => s.Shares).HasPrecision(18, 4);
                eb.Property(s => s.AvgCost).HasPrecision(18, 2);
                eb.Property(s => s.CurrentPrice).HasPrecision(18, 2);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
