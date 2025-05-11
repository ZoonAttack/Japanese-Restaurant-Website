using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;

namespace JapaneseResturant_ASP.NET.Mappers
{
    public static class OrderMapper
    {

        //public static Order ToEntity(this OrderDto dto)
        //{
        //    return new Order()
        //    {
        //        Status = Enum.TryParse<Status>(dto.Status, out var parsedStatus) ? parsedStatus : throw new ArgumentException("Invalid status"),
        //        OrderDate = dto.OrderDate,
        //        DeliveryTime = dto.DeliveryTime,
        //        TotalPrice = dto.Total
        //    };
        //}

        //public static OrderDto ToDto(this Order order)
        //{
        //    return new OrderDto(
        //        order.Status.ToString(), // convert enum to string
        //        order.OrderDate,
        //        order.DeliveryTime,
        //        order.TotalPrice
        //    );
        //}

    }
}
