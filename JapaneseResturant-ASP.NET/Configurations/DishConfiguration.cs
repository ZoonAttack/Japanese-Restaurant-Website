using JapaneseRestaurantModel.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JapaneseRestaurantModel.Configurations
{
    public class DishConfiguration : IEntityTypeConfiguration<Dish>
    {
        void IEntityTypeConfiguration<Dish>.Configure(EntityTypeBuilder<Dish> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Name).HasColumnType("VARCHAR").HasMaxLength(100).IsRequired();
            builder.Property(x=>x.Price).HasPrecision(5, 2);
            builder.Property(x => x.Description).HasColumnType("TEXT").IsRequired();
            builder.Property(x => x.Category).HasColumnType("VARCHAR").HasMaxLength(100).IsRequired();
            builder.Property(x=>x.PictureURL).HasColumnType("VARCHAR").HasMaxLength(255).IsRequired();

            builder.HasData(LoadDishs());
        }

        private static List<Dish> LoadDishs()
        {
            return new List<Dish>
            {

            };
        }
    }
}
