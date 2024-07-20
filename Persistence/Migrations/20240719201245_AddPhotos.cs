using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AttractionPhotos",
                columns: table => new
                {
                    Url = table.Column<string>(type: "TEXT", nullable: false),
                    Position = table.Column<uint>(type: "INTEGER", nullable: false),
                    AttractionId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttractionPhotos", x => x.Url);
                    table.ForeignKey(
                        name: "FK_AttractionPhotos_Attractions_AttractionId",
                        column: x => x.AttractionId,
                        principalTable: "Attractions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttractionPhotos_AttractionId_Position",
                table: "AttractionPhotos",
                columns: new[] { "AttractionId", "Position" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttractionPhotos");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "AspNetUsers");
        }
    }
}
