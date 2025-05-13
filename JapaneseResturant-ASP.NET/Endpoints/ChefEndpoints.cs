using JapaneseRestaurantModel.Data;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class ChefEndpoints
    {
        public static RouteGroupBuilder MapChefEndpoints(this WebApplication app)
        {
            RouteGroupBuilder chefPagesGroup = app.MapGroup("ChefPage/ChefMenuItemsPage");
            //Fix logout in menu page(dashboard) *** 
            //Prevent back button from enabling them to enter dashboard after logging out *** 
            chefPagesGroup.MapPost("logout", () =>
            {
                return Results.Ok();
            }).RequireAuthorization();
            chefPagesGroup.MapGet("getmenudata", async (HttpContext context, AppDbContext dbContext) =>
            {
                //Debugging
                //var isAuthenticated = context.User.Identity?.IsAuthenticated ?? false;
                //var claims = context.User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                //return Results.Ok(new { isAuthenticated, claims });

                var dishes = await dbContext.Dishes.Select(x => x.ToDto()).ToListAsync();
                return Results.Ok(dishes);
            }).RequireAuthorization();



            chefPagesGroup.MapPost("updatedish", async ([FromBody] DishSummaryDto dto, AppDbContext dbContext) =>
            {
                var dish = await dbContext.Dishes.FindAsync(dto.Id);
                if (dish == null) return Results.NotFound();
                dish.Name = dto.Name;
                dish.Price = dto.Price;
                dish.Description = dto.Description;
                dish.PictureURL = dto.PictureURL;
                await dbContext.SaveChangesAsync();
                return Results.Ok(dish.ToDto());
            }).RequireAuthorization();



            chefPagesGroup.MapPost("deletedish", async ([FromBody] int itemId, AppDbContext dbContext) =>
            {
               await dbContext.Dishes.Where(item => item.Id == itemId).ExecuteDeleteAsync();

                return Results.Ok("Dish deleted");
            });
            return chefPagesGroup;
        }
    }

}
