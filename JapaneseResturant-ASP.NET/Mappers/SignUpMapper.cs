using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;
using Microsoft.AspNetCore.Identity;

namespace JapaneseResturant_ASP.NET.Mappers
{
    public static class SignUpMapper
    {
        public static User ToEntity(this SignUpDto dto) => new User() { UserName = dto.Name, Email = dto.Email };
    }
}
