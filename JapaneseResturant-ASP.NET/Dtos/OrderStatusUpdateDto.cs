namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderStatusUpdateDto
        (
            int orderid,
            string status
        );
}
