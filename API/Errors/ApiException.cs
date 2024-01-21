namespace API.Errors;

#pragma warning disable CA1711 // Identifiers should not have incorrect suffix
public class ApiException
#pragma warning restore CA1711 // Identifiers should not have incorrect suffix
{
    public ApiException(int statusCode, string message, string details)
    {
        StatusCode = statusCode;
        Message = message;
        Details = details;
    }

    public int StatusCode { get; set; }

    public string Message { get; set; }

    public string Details { get; set; }
}
