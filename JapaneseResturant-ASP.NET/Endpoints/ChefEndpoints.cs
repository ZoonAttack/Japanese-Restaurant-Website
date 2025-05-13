using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class ChefEndpoints
    {
        public static RouteGroupBuilder MapChefEndpoints(this WebApplication app)
        {
            RouteGroupBuilder chefPagesGroup = app.MapGroup("ChefPage/");
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

            chefPagesGroup.MapGet("getordersdata", async (AppDbContext dbContext) =>
            {
                var query =  await dbContext.Orders.Select(order => new OrderDetailsDto(

                    order.Id,
                    order.User.UserName!,
                    order.Status.ToString(),
                    order.OrderDate,
                    order.DeliveryTime,
                    order.TotalPrice,
                    order.OrderItem.Select(oi => new OrderItemsDto(
                        oi.DishId,
                        oi.Dish.Name!,
                        oi.Dish.Price,
                        oi.Quantity,
                        oi.Dish.PictureURL!
                    )).ToList<OrderItemsDto>())).ToListAsync();
                return query;
            });

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

            chefPagesGroup.MapPost("updateorderstatus", async ([FromBody] OrderStatusUpdateDto dto, AppDbContext dbContext) =>
            {
            Order order = dbContext.Orders.FirstOrDefault(order => order.Id == dto.orderid)!;

                if (order == null) return Results.BadRequest("check request data!");
                order.Status = Enum.TryParse(dto.status, out Status myStatus) ? myStatus : Status.UNKOWN;
                await dbContext.SaveChangesAsync();
                return Results.Ok();
            });

            return chefPagesGroup;
        }
    }

}
