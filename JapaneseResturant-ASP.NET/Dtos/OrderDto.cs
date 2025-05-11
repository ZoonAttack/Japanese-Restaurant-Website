using JapaneseRestaurantModel.Entities;

namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderDto
        (
            string UserId,
            Status Status,
            DateTime OrderDate,
            TimeOnly DeliveryTime,
            decimal Total
        );
}
