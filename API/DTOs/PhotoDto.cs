#pragma warning disable CA1056 // URI-like properties should not be strings
namespace API.DTOs;

public class PhotoDto
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
}
