using JapaneseRestaurantModel.Data;
using JapaneseResturant_ASP.NET.Endpoints;
using JapaneseResturant_ASP.NET.Extentions;

namespace JapaneseResturant_ASP.NET
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connstring = builder.Configuration.GetConnectionString("conn");
            builder.Services.AddSqlServer<AppDbContext>(connstring);
            builder.Services.AddAntiforgery();
            builder.Services.AddEndpointsApiExplorer();
            var app = builder.Build();
            app.UseStaticFiles();

            app.UseAntiforgery();
            app.MapSignUpEndpoint();
            app.MapSignInEndpoint();
            await app.MigrateDb();
            app.Run();
        }
    }
}
