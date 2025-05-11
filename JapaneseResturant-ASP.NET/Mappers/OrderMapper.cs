using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;

namespace JapaneseResturant_ASP.NET.Mappers
{
    public static class OrderMapper
    {

        public static Order ToEntity(this OrderDto dto)
        {
            return new Order()
            {
                Status = dto.Status,
                OrderDate = dto.OrderDate,
                DeliveryTime = dto.DeliveryTime,
                TotalPrice = dto.Total
            };
        }
        public static OrderDto ToEntity(this Order order)
        {
            return new OrderDto(order.UserId, order.Status, order.OrderDate, order.DeliveryTime, order.TotalPrice);
        }
    }
}
