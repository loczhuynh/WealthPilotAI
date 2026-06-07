using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WealthPilot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RestoreRentalProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
