using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Endpoints;
using JapaneseResturant_ASP.NET.Extentions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static System.Formats.Asn1.AsnWriter;

namespace JapaneseResturant_ASP.NET
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication()
                .AddBearerToken(IdentityConstants.BearerScheme);

            builder.Services.AddIdentityCore<User>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddApiEndpoints().AddDefaultTokenProviders();
            builder.Services.Configure<IdentityOptions>(config =>
            {
                config.Password.RequiredUniqueChars = 0;
                config.Password.RequireDigit = false;
            });
            builder.Services.AddOpenApiDocument();

            var connstring = builder.Configuration.GetConnectionString("conn");
            builder.Services.AddSqlServer<AppDbContext>(connstring);
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                await app.MigrateDb();
                app.UseOpenApi();

                app.UseSwaggerUi();
            }

            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapIdentityApi<User>();

            app.MapUserEndpoints();


            app.MapChefEndpoints();
            app.MapAccountManagementEndpoints();

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                await SeedRolesAsync(services);
            }
            app.MapGet("", (context) =>
            {
                context.Response.Redirect("/index.html");
                return Task.CompletedTask;
            });

            app.Run();

        }
        static async Task SeedRolesAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<User>>();
            string[] roles = ["user", "chef"];

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            //Initialize chef
            string chefEmail = "chef1@gmail.com";
            string chefPassword = "Chef@2121";
            if(await userManager.FindByEmailAsync(chefEmail) == null)
            {
                User user = new User()
                {
                    UserName = chefEmail,
                    Email = chefEmail
                };
                await userManager.CreateAsync(user, chefPassword);
            }
        }

    }
}
