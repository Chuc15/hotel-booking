namespace Holtel.Application.Auth
{
	public class ResetPasswordDto
	{
		public string Token { get; set; } = null!;
		public string NewPassword { get; set; } = null!;
	}
}
