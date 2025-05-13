
namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderDetailsDto(
        int id,
        string customer,
        string Status,
        DateTime OrderDate,
        TimeOnly DeliveryTime,
        decimal Total,
        List<OrderItemsDto> Items
    );

}
