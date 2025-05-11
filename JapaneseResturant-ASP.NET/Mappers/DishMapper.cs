using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;

namespace JapaneseResturant_ASP.NET.Mappers
{
    public static class DishMapper
    {
        public static Dish ToEntity(this DishSummaryDto dto)
        {
            return new Dish()
            {
                Name = dto.Name,
                Price = dto.Price,
                PictureURL = dto.PictureURL
            };
        }
        public static DishSummaryDto ToDto(this Dish dish)
        {
            return new 
                (
                dish.Id,
                dish.Name!,
                dish.Price,
                dish.Description!,
                dish.PictureURL!
                );
        }
    }
}
