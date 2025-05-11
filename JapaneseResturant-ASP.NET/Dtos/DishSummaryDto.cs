namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class DishSummaryDto
        (
            int Id,
            string Name,
            decimal Price,
            string Description,
            string PictureURL
        );
}
