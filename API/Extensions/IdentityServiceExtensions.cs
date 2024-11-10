using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => 
                {        
                    var key = configuration["TokenKey"];
                #pragma warning disable CA5404 // Do not disable token validation checks
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(key)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                #pragma warning restore CA5404 // Do not disable token validation checks
                });

        return services;
    }
}
