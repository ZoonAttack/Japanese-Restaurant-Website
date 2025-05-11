﻿namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class CheckoutRequestDto
    (
             DateTime Date,
             List<CheckoutItemDto> Items,
             decimal Total
    );
}
