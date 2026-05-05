using System.ComponentModel.DataAnnotations;

namespace Holtel.Application.Auth
{
	public class RegisterDto
	{
		[Required(ErrorMessage = "Vui lòng nhập họ")]
		public string FirstName { get; set; } = null!;

		[Required(ErrorMessage = "Vui lòng nhập tên")]
		public string LastName { get; set; } = null!;

		[Required, EmailAddress(ErrorMessage = "Email không hợp lệ")]
		public string Email { get; set; } = null!;

		[Required]
		[MinLength(8, ErrorMessage = "Mật khẩu tối thiểu 8 ký tự")]
		[RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$",
			ErrorMessage = "Mật khẩu phải có chữ hoa, số và ký tự đặc biệt")]
		public string Password { get; set; } = null!;

		// Thêm xác nhận mật khẩu
		[Required(ErrorMessage = "Vui lòng xác nhận mật khẩu")]
		[Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp")]
		public string ConfirmPassword { get; set; } = null!;

		// Đổi Phone → PhoneNumber cho khớp với Entity
		[RegularExpression(@"^[0-9]{10,11}$", ErrorMessage = "Số điện thoại không hợp lệ")]
		public string? PhoneNumber { get; set; }


	}
}
