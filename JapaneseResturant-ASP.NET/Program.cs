namespace JapaneseResturant_ASP.NET
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("bomboclat", () => "Rassclat");

            app.Run();
        }
    }
}
