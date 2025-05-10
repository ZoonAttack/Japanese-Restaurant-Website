using JapaneseRestaurantModel.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
            });

        }
    }
}
