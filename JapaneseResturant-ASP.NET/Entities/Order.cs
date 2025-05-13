namespace JapaneseRestaurantModel.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public Status Status { get; set; }
        public DateTime OrderDate { get; set; }
        public TimeOnly DeliveryTime { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Note { get; set; }
        public ICollection<OrderItem> OrderItem { get; set; } = new List<OrderItem>();
        public User User { set; get; } = null!; // required
    }
    public enum Status
    {
        Pending,
        In_Prgress,
        Ready,
        Completed
    }
}
