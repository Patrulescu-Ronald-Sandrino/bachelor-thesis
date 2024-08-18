using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexForCollectionAndCollectionItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AttractionsCollectionsItems_CollectionId_AttractionId_Index",
                table: "AttractionsCollectionsItems",
                columns: new[] { "CollectionId", "AttractionId", "Index" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AttractionsCollections_Id_OwnerId_Index",
                table: "AttractionsCollections",
                columns: new[] { "Id", "OwnerId", "Index" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AttractionsCollectionsItems_CollectionId_AttractionId_Index",
                table: "AttractionsCollectionsItems");

            migrationBuilder.DropIndex(
                name: "IX_AttractionsCollections_Id_OwnerId_Index",
                table: "AttractionsCollections");
        }
    }
}
