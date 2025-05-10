using JapaneseRestaurantModel.Data;
using Microsoft.EntityFrameworkCore;

namespace JapaneseResturant_ASP.NET.Extentions
{
    public static class DataExtention
    {
        public static async Task MigrateDb(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                await dbContext.Database.MigrateAsync();
            }
        }
    }
}
