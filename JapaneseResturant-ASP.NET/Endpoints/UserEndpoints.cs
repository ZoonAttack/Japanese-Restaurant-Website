using System.Security.Claims;
using Azure.Core;
using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class UserEndpoints
    {
        public static RouteGroupBuilder MapUserEndpoints(this WebApplication app)
        {
            RouteGroupBuilder userPageGroup = app.MapGroup("UserPage/");
            //Fix logout in menu page(dashboard) *** done
            //Prevent back button from enabling them to enter dashboard after logging out *** done
            userPageGroup.MapPost("logout", () =>
            {
                return Results.Ok();
            }).RequireAuthorization();

            userPageGroup.MapGet("getmenudata", async (HttpContext context, AppDbContext dbContext) =>
            {
                //Debugging
                //var isAuthenticated = context.User.Identity?.IsAuthenticated ?? false;
                //var claims = context.User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                //return Results.Ok(new { isAuthenticated, claims });

                var dishes = await dbContext.Dishes.Select(x => x.ToDto()).ToListAsync();
                return Results.Ok(dishes);
            }).RequireAuthorization().WithName("GetMenu");

            //After getting the email. get the orders for the user with THAT email and return them.
            //In the frontend receive those orders and update the UI with those data
            //Would probably convert json to the array just as i did in dashboard for menus
            //Fix filters in the orders page ***
            userPageGroup.MapGet("getordersdata", async (HttpContext context, AppDbContext dbContext) =>
            {
                var userId = context.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                    ?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Results.BadRequest("Invalid user ID.");

                var orders = await dbContext.Orders
                        .AsNoTracking()
                        .Where(o => o.UserId == userId)
                        .Select(o => new OrderDetailsDto(
                            o.Id,
                            o.User.UserName!,
                            o.Status.ToString(),              
                            o.OrderDate,                      
                            o.DeliveryTime,                   
                            o.TotalPrice,                     
                            o.OrderItem.Select(oi => new OrderItemsDto(
                                oi.DishId,                    
                                oi.Dish.Name,
                                oi.Dish.Price,
                                oi.Quantity,
                                oi.Dish.PictureURL
                            )).ToList()                       
                        ))
                        .ToListAsync();

                return Results.Ok(orders);
            }).RequireAuthorization().WithName("GetOrders");


            userPageGroup.MapPost("updateorders", async (HttpContext context,[FromBody] CheckoutRequestDto dto, AppDbContext dbContext) =>
            {
                //First we get user ID
                var userId = context.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                    ?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Results.BadRequest("Unauthorized");
                if (dto.Items == null || !dto.Items.Any())
                    return Results.BadRequest("No items provided.");
                List<Order> pendingOrders = null;
                try
                {
                    pendingOrders = await dbContext.Orders
                        .Include(o => o.OrderItem)
                        .Where(o => o.UserId == userId && o.Status == Status.Pending)
                        .ToListAsync();
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message + " | " + ex.InnerException?.Message);
                };
                foreach (var pendingOrder in pendingOrders)
                {
                    var dishIds = pendingOrder.OrderItem.Select(oi => oi.DishId).ToList();
                    var requestDishesIds = dto.Items.Select(i => i.ProductId).ToList();

                    //Existing order!!
                    if (dishIds.SequenceEqual(requestDishesIds))
                    {
                        foreach(var updatedItem in dto.Items)
                        {
                            var item = pendingOrder.OrderItem.First(pi => pi.DishId == updatedItem.ProductId);

                            item.Quantity += updatedItem.Quantity;
                            item.SubTotal += updatedItem.Quantity * updatedItem.Price;
                        }
                        pendingOrder.TotalPrice = pendingOrder.OrderItem.Sum(oi => oi.SubTotal);
                        pendingOrder.OrderDate = DateTime.Now;
                        pendingOrder.DeliveryTime = new TimeOnly(12,00);

                        await dbContext.SaveChangesAsync();
                        return Results.Ok();
                    }
                }

                //No Existing order
                Order order = dbContext.Orders.Add( new Order()
                { 
                    UserId = userId,
                    Note = dto.note,
                    Status = Status.Pending,
                    OrderDate = dto.Date,
                    DeliveryTime = new TimeOnly(),
                    TotalPrice = dto.Total
                }).Entity;
                await dbContext.SaveChangesAsync();

                foreach (var request in dto.Items)
                {
                    await dbContext.OrderItems.AddAsync(new OrderItem()
                    {
                        OrderId = order.Id,
                        DishId = request.ProductId,
                        Quantity = request.Quantity,
                        SubTotal = request.Price
                    });
                }
                await dbContext.SaveChangesAsync();

                return Results.Ok("Order stored");
            }).RequireAuthorization().WithName("UpdateOrder");

            return userPageGroup;
        }
    }
}
