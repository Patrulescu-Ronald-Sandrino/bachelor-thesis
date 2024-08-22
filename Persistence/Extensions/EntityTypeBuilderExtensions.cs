using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Persistence.Util;

namespace Persistence.Extensions;

public static class EntityTypeBuilderExtensions
{
    private static void HasEnumValueCheckConstraint<TTable, TColumn>(this EntityTypeBuilder<TTable> @this,
        string columnName)
        where TTable : class
        where TColumn : Enum
    {
        @this.ToTable(b =>
        {
            var tableName = typeof(TTable).Name;
            var checkConstraintName = $"CK_{tableName}_{columnName}_IN_ENUM";
            var values = EnumUtil.GetValues<TColumn>().Select(x => $"'{x}'");
            var checkConstraint = $""" "{columnName}" IN ({string.Join(", ", values)}) """;
            b.HasCheckConstraint(checkConstraintName, checkConstraint);
        });
    }

    #region EntityTypeBuilder

    // (not ideal) alternative to the lack of partial type inference
    // ie - having to: b.HasEnumValueCheckConstraint<Reaction, ReactionType>(nameof(Reaction.Type));
    public static EntityTypeBuilderWrapper<TTable> Wrapper<TTable>(this EntityTypeBuilder<TTable> @this)
        where TTable : class
    {
        return new EntityTypeBuilderWrapper<TTable>(@this);
    }

    public class EntityTypeBuilderWrapper<TTable>(EntityTypeBuilder<TTable> tableBuilder) where TTable : class
    {
        public void HasEnumValueCheckConstraint<TColumn>(string columnName)
            where TColumn : Enum
        {
            tableBuilder.HasEnumValueCheckConstraint<TTable, TColumn>(columnName);
        }
    }

    #endregion
}
