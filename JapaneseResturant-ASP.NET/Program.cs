using JapaneseRestaurantModel.Data;
using JapaneseRestaurantModel.Entities;
using JapaneseResturant_ASP.NET.Endpoints;
using JapaneseResturant_ASP.NET.Extentions;
using Microsoft.AspNetCore.Identity;

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
                .AddEntityFrameworkStores<AppDbContext>()
                .AddApiEndpoints().AddDefaultTokenProviders();
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
            app.MapIdentityApi<User>();

            app.MapDashboardEndpoints();
            app.Run();
        }
    }
}
