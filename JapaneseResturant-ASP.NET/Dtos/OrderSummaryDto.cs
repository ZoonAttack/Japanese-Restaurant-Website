using JapaneseRestaurantModel.Entities;

namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderSummaryDto
        (
            DateTime Date,
            List<Dish> Dishes,
            decimal TotalPrices,
            int Quantity
        );

}
