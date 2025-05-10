using System.ComponentModel.DataAnnotations;

namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class CreateCustomerDto
        (
            [Required][StringLength(20)] string Name,
            [Required][StringLength(50)] string Email,
            [Required][StringLength(35)] string password
        );
}
