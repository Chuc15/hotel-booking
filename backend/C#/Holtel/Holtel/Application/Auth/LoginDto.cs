using System.ComponentModel.DataAnnotations;

namespace Holtel.Application.Auth
{
	public class LoginDto
	{
		[Required(ErrorMessage = "Vui lòng nhập email")]
		[EmailAddress(ErrorMessage = "Email không hợp lệ")]
		public string Email { get; set; } = null!;

		[Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
		public string Password { get; set; } = null!;
	}
}
