using JapaneseRestaurantModel.Data;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class SignUpEndpoint
    {

        public static void MapSignUpEndpoint(this WebApplication app)
        {


            //POST 

            app.MapPost("/signup", async ([FromBody] CreateCustomerDto createCustomerDto, AppDbContext dbContext) =>
            {
                await dbContext.Customers.AddAsync(createCustomerDto.ToEntity());
                dbContext.SaveChanges();
                return Results.Ok(createCustomerDto);
            });
        }
    }
}
