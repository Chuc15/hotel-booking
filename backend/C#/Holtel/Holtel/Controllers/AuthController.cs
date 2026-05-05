using Holtel.Application.Auth;
using Holtel.Data;
using Holtel.Entities;
using Holtel.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Holtel.Controllers
{
	[ApiController]
	[Route("api/auth")]
	public class AuthController : ControllerBase
	{
		private readonly AppDbContext _db;
		private readonly IConfiguration _config;

		public AuthController(AppDbContext db, IConfiguration config)
		{
			_db = db;
			_config = config;
		}

		// ================= LOGIN =================
		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto dto)
		{
			var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);

			if (user == null)
				return Unauthorized(new { message = "Email không tồn tại" });

			if (!user.IsActive)
				return Unauthorized(new { message = "Tài khoản đã bị khóa" });

			if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
				return Unauthorized(new { message = "Sai mật khẩu" });

			var token = GenerateToken(user);

			return Ok(new
			{
				message = "Đăng nhập thành công",
				accessToken = token,
				user = new
				{
					user.Id,
					user.FullName,
					user.Email,
					user.Role
				}
			});
		}

		// ================= REGISTER =================
		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			if (await _db.Users.AnyAsync(x => x.Email == dto.Email))
				return BadRequest(new { message = "Email đã tồn tại" });

			var user = new User
			{
				FullName = $"{dto.FirstName} {dto.LastName}",
				Email = dto.Email.ToLower().Trim(),
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
				PhoneNumber = dto.PhoneNumber,
				Role = "Customer",
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};

			_db.Users.Add(user);
			await _db.SaveChangesAsync();

			return Ok(new { message = "Đăng ký thành công" });
		}

		// ================= JWT =================
		private string GenerateToken(User user)
		{
			var jwt = _config.GetSection("JwtSettings");

			var key = new SymmetricSecurityKey(
				Encoding.UTF8.GetBytes(jwt["SecretKey"]!));

			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Role, user.Role)
			};

			var token = new JwtSecurityToken(
				issuer: jwt["Issuer"],
				audience: jwt["Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(
					int.Parse(jwt["AccessTokenExpiryMinutes"]!)),
				signingCredentials: creds
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}