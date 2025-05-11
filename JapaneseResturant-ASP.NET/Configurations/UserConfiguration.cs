//using JapaneseRestaurantModel.Entities;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace JapaneseResturant_ASP.NET.Configurations
//{
//    public class UserConfiguration: IEntityTypeConfiguration<User>
//    {
//        void IEntityTypeConfiguration<User>.Configure(EntityTypeBuilder<User> builder)
//        {
//            // User <=1----N=> Orders
//            builder.HasMany(x => x.Orders)
//                .WithOne(x => x.User)
//                .HasForeignKey(x => x.UserId).IsRequired();

//            builder.HasMany(x => x.Reviews)
//                .WithOne(x => x.User)
//                .HasForeignKey(x => x.UserId).IsRequired();
//        }
//    }
//}
