namespace JapaneseRestaurantModel.Entities
{
    public class Customer : User
    {
        public ICollection<Order> Orders { set; get; } = new List<Order>();
        public ICollection<Review> Reviews { set; get; } = new List<Review>();
    }
}
