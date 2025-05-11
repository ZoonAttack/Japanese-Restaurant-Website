
namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderDto(
        int id,
        string Status,
        DateTime OrderDate,
        TimeOnly DeliveryTime,
        decimal Total,
        List<OrderItemsDto> Items
    );

}
