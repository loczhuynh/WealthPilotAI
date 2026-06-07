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

        public DbSet<RentalProperty> RentalProperties => Set<RentalProperty>();

        public DbSet<NetWorthSnapshot> NetWorthSnapshots => Set<NetWorthSnapshot>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define the initial schema for the database
            modelBuilder.Entity<Asset>().ToTable("Assets");
            modelBuilder.Entity<Debt>().ToTable("Debts");
            modelBuilder.Entity<StockHolding>().ToTable("StockHoldings");
            modelBuilder.Entity<RentalProperty>().ToTable("RentalProperties");
            modelBuilder.Entity<NetWorthSnapshot>().ToTable("NetWorthSnapshots");
        }
    }
}
