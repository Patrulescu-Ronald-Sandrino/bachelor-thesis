using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexForCollectionItem_CollectionAndAttraction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AttractionsCollectionsItems_CollectionId_AttractionId",
                table: "AttractionsCollectionsItems",
                columns: new[] { "CollectionId", "AttractionId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AttractionsCollectionsItems_CollectionId_AttractionId",
                table: "AttractionsCollectionsItems");
        }
    }
}
