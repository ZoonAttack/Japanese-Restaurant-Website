using System.Security.Claims;
using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class DashboardEndpoints
    {
        public static void MapDashboardEndpoints(this WebApplication app)
        {
            app.MapPost("/logout", async (SignInManager<User> signInManager, UserManager<User> UserManager, [FromBody] object empty) =>
            {
                if (empty != null)
                {
                    await signInManager.SignOutAsync();
                    return Results.Ok();
                }
                return Results.Unauthorized();
            }).RequireAuthorization();

            app.MapGet("/getmenudata", async (HttpContext context, AppDbContext dbContext) =>
            {
                var isAuthenticated = context.User.Identity?.IsAuthenticated ?? false;
                var claims = context.User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                return Results.Ok(new { isAuthenticated, claims });

                var dishes = await dbContext.Dishes.Select(x => x.ToDto()).ToListAsync();
                return Results.Ok(dishes);
            }).RequireAuthorization();

            //After getting the email. get the orders for the user with THAT email and return them.
            //In the frontend receive those orders and update the UI with those data
            //Would probably convert json to the array just as i did in dashboard for menus

            //app.MapGet("/getordersdata", async (HttpContext context, AppDbContext dbContext) =>
            //{
            //    var email = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            //    if (email == null)
            //    {
            //        return Results.Unauthorized();
            //    }

            //    return Results.Ok(email);
            //}).RequireAuthorization();
        }
    }
}
