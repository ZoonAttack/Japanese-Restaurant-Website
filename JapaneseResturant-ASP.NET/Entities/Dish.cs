namespace JapaneseRestaurantModel.Entities
{
    public class Dish
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string? PictureURL { get; set; }
        public int PreparationTime { get; set; }
        public bool IsAvailable { get; set; }
        public string? Category { get; set; }
        public double Rating { get; set; }

        public OrderItem? OrderItem { get; set; } // optional
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
