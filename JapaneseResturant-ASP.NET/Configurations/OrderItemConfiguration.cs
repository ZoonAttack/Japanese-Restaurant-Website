using JapaneseRestaurantModel.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JapaneseRestaurantModel.Configurations
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        void IEntityTypeConfiguration<OrderItem>.Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Quantity).IsRequired();
            
            // OrderItem <=1-----1-> Dish
            builder.HasOne(x => x.Dish)
                .WithOne(x => x.OrderItem)
                .HasForeignKey<OrderItem>(x => x.DishId)
                .IsRequired();
            builder.HasIndex(x => x.DishId).IsUnique(); // every OrderItem has one Dish (DishId in unique in the table)

            // Order <=N----1=> OrderItem
            builder.HasOne(x => x.Order)
                .WithMany(x => x.OrderItem)
                .HasForeignKey(x => x.OrderId)
                .IsRequired();
        }
    }
}
