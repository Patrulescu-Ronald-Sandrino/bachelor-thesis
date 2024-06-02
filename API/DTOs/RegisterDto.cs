using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto : LoginDto
{
    [Required] public string Username { get; set; }
}