using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UserOwnsAttraction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatorId",
                table: "Attractions",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_AttractionTypes_Name",
                table: "AttractionTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attractions_CreatorId",
                table: "Attractions",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attractions_AspNetUsers_CreatorId",
                table: "Attractions",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attractions_AspNetUsers_CreatorId",
                table: "Attractions");

            migrationBuilder.DropIndex(
                name: "IX_AttractionTypes_Name",
                table: "AttractionTypes");

            migrationBuilder.DropIndex(
                name: "IX_Attractions_CreatorId",
                table: "Attractions");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Attractions");
        }
    }
}
