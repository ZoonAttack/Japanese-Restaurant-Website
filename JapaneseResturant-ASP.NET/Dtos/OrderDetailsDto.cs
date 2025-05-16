
namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderDetailsDto(
        int id,
        string? note,
        string customer,
        string Status,
        DateTime OrderDate,
        TimeOnly DeliveryTime,
        decimal Total,
        List<OrderItemsDto> Items
    );

}
