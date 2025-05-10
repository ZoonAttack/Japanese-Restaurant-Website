namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class DishSummaryDto
        (
            string Name,
            decimal Price,
            string PictureURL
        );
}
