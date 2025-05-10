
using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Identity;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class SignUpEndpoint
    {

        public static void MapSignUpEndpoint(this WebApplication app)
        {

            app.MapPost("/signup",  async (SignUpDto dto,UserManager<User> userManager ,AppDbContext dbCOntext) =>
            {
            //Upload data to db 
                User newUser = dto.ToEntity();
                await userManager.CreateAsync(newUser, userManager.PasswordHasher.HashPassword(newUser, dto.Password));

                return Results.Ok(dto); //Debugging
            });
            
        }
    }
}
