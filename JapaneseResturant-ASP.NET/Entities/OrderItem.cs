namespace JapaneseRestaurantModel.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int DishId { get; set; }
        public int Quantity { get; set; }
        public int SubTotal { get; set; }

        public Dish Dish { get; set; } = null!; // required
        public Order Order { get; set; } = null!; // required
    }
}
