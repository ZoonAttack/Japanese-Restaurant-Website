namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class SignUpDto(
        string Name,
        string Email,
        string Password,
        string Role
        );
}
