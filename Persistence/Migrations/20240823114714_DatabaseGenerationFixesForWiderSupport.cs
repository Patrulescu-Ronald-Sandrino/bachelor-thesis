using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseGenerationFixesForWiderSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Reaction_Type_IN_ENUM",
                table: "Reactions");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Friendship_Status_IN_ENUM",
                table: "Friendships");

            migrationBuilder.DropCheckConstraint(
                name: "NoSelfFriendship",
                table: "Friendships");

            migrationBuilder.DropCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections");

            migrationBuilder.DropCheckConstraint(
                name: "CK_UserRole_Name_IN_ENUM",
                table: "AspNetRoles");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Reaction_Type_IN_ENUM",
                table: "Reactions",
                sql: " \"Type\" IN ('Like', 'Dislike') ");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Friendship_Status_IN_ENUM",
                table: "Friendships",
                sql: " \"Status\" IN ('Accepted', 'Pending') ");

            migrationBuilder.AddCheckConstraint(
                name: "NoSelfFriendship",
                table: "Friendships",
                sql: " \"SenderId\" <> \"ReceiverId\" ");

            migrationBuilder.AddCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections",
                sql: " \"Visibility\" IN ('Public', 'Friends', 'Private') ");

            migrationBuilder.AddCheckConstraint(
                name: "CK_UserRole_Name_IN_ENUM",
                table: "AspNetRoles",
                sql: " \"Name\" IN ('Admin', 'Member') ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Reaction_Type_IN_ENUM",
                table: "Reactions");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Friendship_Status_IN_ENUM",
                table: "Friendships");

            migrationBuilder.DropCheckConstraint(
                name: "NoSelfFriendship",
                table: "Friendships");

            migrationBuilder.DropCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections");

            migrationBuilder.DropCheckConstraint(
                name: "CK_UserRole_Name_IN_ENUM",
                table: "AspNetRoles");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Reaction_Type_IN_ENUM",
                table: "Reactions",
                sql: "[Type] IN ('Like', 'Dislike')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Friendship_Status_IN_ENUM",
                table: "Friendships",
                sql: "[Status] IN ('Accepted', 'Pending')");

            migrationBuilder.AddCheckConstraint(
                name: "NoSelfFriendship",
                table: "Friendships",
                sql: "SenderId <> ReceiverId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_AttractionsCollection_Visibility_IN_ENUM",
                table: "AttractionsCollections",
                sql: "[Visibility] IN ('Public', 'Friends', 'Private')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_UserRole_Name_IN_ENUM",
                table: "AspNetRoles",
                sql: "[Name] IN ('Admin', 'Member')");
        }
    }
}
