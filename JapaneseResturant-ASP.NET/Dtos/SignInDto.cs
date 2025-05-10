namespace JapaneseResturant_ASP.NET.Dtos
{
    public record class SignInDto(
        
            string Email,
            string passord,
            string Role
        );
}
