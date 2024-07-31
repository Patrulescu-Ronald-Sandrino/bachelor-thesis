namespace Application.DTOs;

public class CommentDto
{
    public Guid Id { get; set; }
    public string Body { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorUsername { get; set; }
    public string AuthorPhoto { get; set; }
}
