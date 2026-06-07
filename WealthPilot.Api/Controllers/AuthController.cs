using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly WealthPilotDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(WealthPilotDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Email and password are required.");

        var email = request.Email.Trim().ToLower();

        var exists = await _context.Users.AnyAsync(x => x.Email == email);
        if (exists)
            return BadRequest("Email already exists.");

        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Email,
            Message = "User registered successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

        if (user == null)
            return Unauthorized("Invalid email or password.");

        var validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!validPassword)
            return Unauthorized("Invalid email or password.");

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.Email
            }
        });
    }

    private string GenerateJwtToken(User user)
    {
        var key = _configuration["Jwt:Key"]!;
        var issuer = _configuration["Jwt:Issuer"]!;
        var audience = _configuration["Jwt:Audience"]!;

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class RegisterRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

public class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}