using JapaneseRestaurantModel.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JapaneseRestaurantModel.Configurations
{
    public class ChefConfiguration : IEntityTypeConfiguration<Chef>
    {
        void IEntityTypeConfiguration<Chef>.Configure(EntityTypeBuilder<Chef> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Name).HasMaxLength(255).IsRequired();
            builder.Property(x => x.Email).HasColumnType("VARCHAR").HasMaxLength(255).IsRequired();
            builder.Property(x => x.Password).HasMaxLength(255).IsRequired();

            builder.HasData(LoadCustomers());

            builder.ToTable("Chefs");
        }

        private static List<Chef> LoadCustomers()
        {
            return new List<Chef>
            {
                new Chef {Id = 1, Name = "ChefOne", Email = "chefOne@ejust.edu.eg", Password = "ChefOnePassword"},
                new Chef {Id = 2, Name = "ChefTwo", Email = "chefTwo@ejust.edu.eg", Password = "ChefTwoPassword"}
            };
        }
    }
}
