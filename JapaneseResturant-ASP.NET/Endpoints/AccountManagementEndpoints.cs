using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Dtos;
using JapaneseResturant_ASP.NET.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace JapaneseResturant_ASP.NET.Endpoints
{
    public static class AccountManagementEndpoints
    {
        public static void MapAccountManagementEndpoints(this WebApplication app)
        {
            //For redirections based on role
            app.MapGet("/me", async (UserManager<User> userManager, ClaimsPrincipal userPrincipal) =>
            {
                var user = await userManager.GetUserAsync(userPrincipal);
                var roles = await userManager.GetRolesAsync(user!);

                return Results.Ok(new
                {
                    user!.Email,
                    Roles = roles
                });
            }).RequireAuthorization();

            //Override Identity register endpoint for role management
            app.MapPost("/assignrole", async ([FromBody] SignUpDto dto, UserManager<User> userManager, AppDbContext dbContext) =>
            {
                User? user = await userManager.FindByEmailAsync(dto.Email);

                if (user == null) return Results.BadRequest("User does not exist");
                //user.UserName = dto.Name;
                await userManager.AddToRoleAsync(user, dto.Role);
                if (await userManager.IsInRoleAsync(user, dto.Role))
                {
                    return Results.Ok("User was added successfully");
                }
                else return Results.BadRequest();
            });

        }
    }
}
