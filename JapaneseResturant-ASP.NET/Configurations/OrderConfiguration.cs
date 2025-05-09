using JapaneseRestaurantModel.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JapaneseRestaurantModel.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        void IEntityTypeConfiguration<Order>.Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Status)
                .HasConversion<string>()
                .HasMaxLength(15)
                .HasColumnType("VARCHAR")
                .HasDefaultValue(Status.Pending);

            builder.Property(x => x.TotalPrice).HasPrecision(6, 2);

            // Order <=N----1=> Customer
            builder.HasOne(x => x.Customer)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.CustomerId)
                .IsRequired();
        }
    }
}
