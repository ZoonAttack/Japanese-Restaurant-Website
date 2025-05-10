using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;

namespace JapaneseResturant_ASP.NET.Mappers
{
    public static class CustomerMapping
    {
        public static Customer ToEntity(this CreateCustomerDto dto)
        {
            return new Customer()
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.password
            };
        }
    }
}
