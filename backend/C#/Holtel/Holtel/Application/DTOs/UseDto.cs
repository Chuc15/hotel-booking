namespace Holtel.Application.DTOs
{
	public class UserDto
	{
		public int Id { get; set; }
		public string FullName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string? PhoneNumber { get; set; }
		public string? AvatarUrl { get; set; }
		public string Role { get; set; } = string.Empty;
		public bool IsActive { get; set; }
		public DateTime CreatedAt { get; set; }
	}

	// Dùng khi customer cập nhật thông tin bản thân
	public class UpdateProfileDto
	{
		public string FullName { get; set; } = string.Empty;
		public string? PhoneNumber { get; set; }
	}

	// Dùng khi đổi mật khẩu
	public class ChangePasswordDto
	{
		public string CurrentPassword { get; set; } = string.Empty;
		public string NewPassword { get; set; } = string.Empty;
		public string ConfirmPassword { get; set; } = string.Empty;
	}

	// Dùng khi admin khoá/mở khoá
	public class UpdateUserStatusDto
	{
		public bool IsActive { get; set; }

		
	}
}

