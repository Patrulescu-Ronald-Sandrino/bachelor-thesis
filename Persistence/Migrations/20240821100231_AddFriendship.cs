using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFriendship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections");

            migrationBuilder.CreateTable(
                name: "Friendships",
                columns: table => new
                {
                    SenderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReceiverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendships", x => new { x.SenderId, x.ReceiverId });
                    table.CheckConstraint("CK_Friendship_Status_IN_ENUM", "[Status] IN ('Accepted', 'Pending')");
                    table.ForeignKey(
                        name: "FK_Friendships_AspNetUsers_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friendships_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections",
                sql: "[Visibility] IN ('Public', 'Friends', 'Private')");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_ReceiverId",
                table: "Friendships",
                column: "ReceiverId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Friendships");

            migrationBuilder.DropCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections");

            migrationBuilder.AddCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections",
                sql: "[Visibility] IN ('Public', 'Private')");
        }
    }
}
