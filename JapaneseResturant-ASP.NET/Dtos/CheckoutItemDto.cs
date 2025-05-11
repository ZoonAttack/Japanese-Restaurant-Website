namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class CheckoutItemDto
        (
             int ProductId,
             string Name,
             int Quantity,
             int Price 
        );

}
