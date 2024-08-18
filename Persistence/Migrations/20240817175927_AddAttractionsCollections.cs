using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAttractionsCollections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Reaction_Type",
                table: "Reactions");

            migrationBuilder.CreateTable(
                name: "AttractionsCollections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Thumbnail = table.Column<string>(type: "TEXT", nullable: false),
                    Visibility = table.Column<string>(type: "TEXT", nullable: false),
                    Index = table.Column<uint>(type: "INTEGER", nullable: false),
                    OwnerId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttractionsCollections", x => x.Id);
                    table.CheckConstraint("CK_AttractionsCollection_Visibility_IN_ENUM", "[Visibility] IN ('Public', 'Private')");
                    table.ForeignKey(
                        name: "FK_AttractionsCollections_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AttractionsCollectionItem",
                columns: table => new
                {
                    CollectionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AttractionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: true),
                    Index = table.Column<uint>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttractionsCollectionItem", x => new { x.CollectionId, x.AttractionId });
                    table.ForeignKey(
                        name: "FK_AttractionsCollectionItem_AttractionsCollections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "AttractionsCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AttractionsCollectionItem_Attractions_AttractionId",
                        column: x => x.AttractionId,
                        principalTable: "Attractions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Reaction_Type_IN_ENUM",
                table: "Reactions",
                sql: "[Type] IN ('Like', 'Dislike')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_UserRole_Name_IN_ENUM",
                table: "AspNetRoles",
                sql: "[Name] IN ('Admin', 'Member')");

            migrationBuilder.CreateIndex(
                name: "IX_AttractionsCollectionItem_AttractionId",
                table: "AttractionsCollectionItem",
                column: "AttractionId");

            migrationBuilder.CreateIndex(
                name: "IX_AttractionsCollections_OwnerId",
                table: "AttractionsCollections",
                column: "OwnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttractionsCollectionItem");

            migrationBuilder.DropTable(
                name: "AttractionsCollections");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Reaction_Type_IN_ENUM",
                table: "Reactions");

            migrationBuilder.DropCheckConstraint(
                name: "CK_UserRole_Name_IN_ENUM",
                table: "AspNetRoles");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Reaction_Type",
                table: "Reactions",
                sql: "[Type] IN ('Like', 'Dislike')");
        }
    }
}
