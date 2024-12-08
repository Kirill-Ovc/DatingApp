using System.Security.Authentication;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.Name)
            ?? throw new AuthenticationException("Cannot get username from token");

        return username;
    }

        public static int GetUserId(this ClaimsPrincipal user)
    {
        var idValue = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new AuthenticationException("Cannot get user id from token");

        var userId = int.Parse(idValue);

        return userId;
    }
}
