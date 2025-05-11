namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class OrderItemsDto
        (
            int DishId,
            string Name,
            decimal Price,
            int Quantity,
            string PictureUrl
        );
}
