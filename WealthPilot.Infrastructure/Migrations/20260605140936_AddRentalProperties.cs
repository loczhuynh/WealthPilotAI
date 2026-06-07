using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WealthPilot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRentalProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RentalProperties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PropertyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PurchasePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LoanAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MonthlyRent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MonthlyExpenses = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MonthlyCashFlow = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AnnualCashFlow = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NOI = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CapRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalCashInvested = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CashOnCashReturn = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalProperties", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalProperties");
        }
    }
}
