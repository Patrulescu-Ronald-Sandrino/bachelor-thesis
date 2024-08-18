using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAttractionsCollectionsItemsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttractionsCollectionItem_AttractionsCollections_CollectionId",
                table: "AttractionsCollectionItem");

            migrationBuilder.DropForeignKey(
                name: "FK_AttractionsCollectionItem_Attractions_AttractionId",
                table: "AttractionsCollectionItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AttractionsCollectionItem",
                table: "AttractionsCollectionItem");

            migrationBuilder.RenameTable(
                name: "AttractionsCollectionItem",
                newName: "AttractionsCollectionsItems");

            migrationBuilder.RenameIndex(
                name: "IX_AttractionsCollectionItem_AttractionId",
                table: "AttractionsCollectionsItems",
                newName: "IX_AttractionsCollectionsItems_AttractionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AttractionsCollectionsItems",
                table: "AttractionsCollectionsItems",
                columns: new[] { "CollectionId", "AttractionId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AttractionsCollectionsItems_AttractionsCollections_CollectionId",
                table: "AttractionsCollectionsItems",
                column: "CollectionId",
                principalTable: "AttractionsCollections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AttractionsCollectionsItems_Attractions_AttractionId",
                table: "AttractionsCollectionsItems",
                column: "AttractionId",
                principalTable: "Attractions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttractionsCollectionsItems_AttractionsCollections_CollectionId",
                table: "AttractionsCollectionsItems");

            migrationBuilder.DropForeignKey(
                name: "FK_AttractionsCollectionsItems_Attractions_AttractionId",
                table: "AttractionsCollectionsItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AttractionsCollectionsItems",
                table: "AttractionsCollectionsItems");

            migrationBuilder.RenameTable(
                name: "AttractionsCollectionsItems",
                newName: "AttractionsCollectionItem");

            migrationBuilder.RenameIndex(
                name: "IX_AttractionsCollectionsItems_AttractionId",
                table: "AttractionsCollectionItem",
                newName: "IX_AttractionsCollectionItem_AttractionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AttractionsCollectionItem",
                table: "AttractionsCollectionItem",
                columns: new[] { "CollectionId", "AttractionId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AttractionsCollectionItem_AttractionsCollections_CollectionId",
                table: "AttractionsCollectionItem",
                column: "CollectionId",
                principalTable: "AttractionsCollections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AttractionsCollectionItem_Attractions_AttractionId",
                table: "AttractionsCollectionItem",
                column: "AttractionId",
                principalTable: "Attractions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
