using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTypeCountryReaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MainPictureUrl",
                table: "Attractions",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "CityId",
                table: "Attractions",
                newName: "CountryId");

            migrationBuilder.AddColumn<Guid>(
                name: "AttractionTypeId",
                table: "Attractions",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "AttractionTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttractionTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attractions_AttractionTypeId",
                table: "Attractions",
                column: "AttractionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Attractions_CountryId",
                table: "Attractions",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attractions_AttractionTypes_AttractionTypeId",
                table: "Attractions",
                column: "AttractionTypeId",
                principalTable: "AttractionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attractions_Countries_CountryId",
                table: "Attractions",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attractions_AttractionTypes_AttractionTypeId",
                table: "Attractions");

            migrationBuilder.DropForeignKey(
                name: "FK_Attractions_Countries_CountryId",
                table: "Attractions");

            migrationBuilder.DropTable(
                name: "AttractionTypes");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropIndex(
                name: "IX_Attractions_AttractionTypeId",
                table: "Attractions");

            migrationBuilder.DropIndex(
                name: "IX_Attractions_CountryId",
                table: "Attractions");

            migrationBuilder.DropColumn(
                name: "AttractionTypeId",
                table: "Attractions");

            migrationBuilder.RenameColumn(
                name: "CountryId",
                table: "Attractions",
                newName: "CityId");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Attractions",
                newName: "MainPictureUrl");
        }
    }
}
