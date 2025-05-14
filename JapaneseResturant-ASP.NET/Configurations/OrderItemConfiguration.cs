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

            // ✅ Many OrderItems -> One Dish
            builder.HasOne(x => x.Dish)
                .WithMany(x => x.OrderItems) // No navigation property on Dish side, or use .WithMany(x => x.OrderItems)
                .HasForeignKey(x => x.DishId)
                .IsRequired();

            // ✅ Many OrderItems -> One Order
            builder.HasOne(x => x.Order)
                .WithMany(x => x.OrderItem)
                .HasForeignKey(x => x.OrderId)
                .IsRequired();
        }
    }
}
