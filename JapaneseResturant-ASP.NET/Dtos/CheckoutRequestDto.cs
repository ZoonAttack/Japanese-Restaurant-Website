namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class CheckoutRequestDto
    (
             DateTime Date,
             string? note,
             List<CheckoutItemDto> Items,
             decimal Total
    );
}
