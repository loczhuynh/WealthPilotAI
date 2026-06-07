using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WealthPilot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNetWorthSnapshots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalProperties",
                table: "RentalProperties");

            migrationBuilder.RenameTable(
                name: "RentalProperties",
                newName: "NetWorthSnapshot");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NetWorthSnapshot",
                table: "NetWorthSnapshot",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "NetWorthSnapshots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalAssets = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalDebts = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NetWorth = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NetWorthSnapshots", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NetWorthSnapshots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NetWorthSnapshot",
                table: "NetWorthSnapshot");

            migrationBuilder.RenameTable(
                name: "NetWorthSnapshot",
                newName: "RentalProperties");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalProperties",
                table: "RentalProperties",
                column: "Id");
        }
    }
}
