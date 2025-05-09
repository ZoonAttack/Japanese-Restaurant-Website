using JapaneseRestaurantModel.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JapaneseRestaurantModel.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        void IEntityTypeConfiguration<Review>.Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Comment).HasColumnType("TEXT");
            builder.Property(x => x.Rating).IsRequired();

            // Dish <-1---N=> Review
            builder.HasOne(x => x.Dish)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.DishId)
                .IsRequired();

            // Customer <-1---N=> Review
            builder.HasOne(x => x.Customer)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.CustomerId)
                .IsRequired();
        }
    }
}
