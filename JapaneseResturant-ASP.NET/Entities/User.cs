using Microsoft.AspNetCore.Identity;

namespace JapaneseRestaurantModel.Entities
{
    public class User : IdentityUser
    {
        public ICollection<Order> Orders { set; get; } = new List<Order>();
        public ICollection<Review> Reviews { set; get; } = new List<Review>();
    }
}
