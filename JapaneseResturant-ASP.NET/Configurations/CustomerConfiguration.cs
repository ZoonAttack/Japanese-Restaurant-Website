using JapaneseRestaurantModel.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JapaneseRestaurantModel.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        void IEntityTypeConfiguration<Customer>.Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedNever();

            builder.Property(x => x.Name).HasMaxLength(255).IsRequired();
            builder.Property(x => x.Password).HasMaxLength(255).IsRequired();
            builder.Property(x => x.Email).HasColumnType("VARCHAR").HasMaxLength(255).IsRequired();

            builder.ToTable("Customers");
        }
    }
}
