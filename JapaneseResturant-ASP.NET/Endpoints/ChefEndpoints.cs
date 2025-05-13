using JapaneseRestaurantModel.Data;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.EntityFrameworkCore;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class ChefEndpoints
    {
        public static void MapChefEndpoints(this WebApplication app)
        {
            //Fix logout in menu page(dashboard) *** 
            //Prevent back button from enabling them to enter dashboard after logging out *** 
            app.MapPost("chef/logout", () =>
            {
                return Results.Ok();
            }).RequireAuthorization();
            app.MapGet("chef/getmenudata", async (HttpContext context, AppDbContext dbContext) =>
            {
                //Debugging
                //var isAuthenticated = context.User.Identity?.IsAuthenticated ?? false;
                //var claims = context.User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                //return Results.Ok(new { isAuthenticated, claims });

                var dishes = await dbContext.Dishes.Select(x => x.ToDto()).ToListAsync();
                return Results.Ok(dishes);
            }).RequireAuthorization();
        }
    }

}
