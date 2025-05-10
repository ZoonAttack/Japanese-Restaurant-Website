using JapaneseRestaurantModel.Data;
using JapaneseResturant_ASP.NET.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class SignInEndpoint
    {

        public static void MapSignInEndpoint(this WebApplication app)
        {


            app.MapGet("/signin", ([FromBody] CustomerSummaryDto customerDto, AppDbContext dbContext) =>
            {
                var customer = dbContext.Customers.Where(customer => customer.Email == customerDto.Email).FirstOrDefault();

                return Results.Ok(customer);
            });

        }

    }
}
