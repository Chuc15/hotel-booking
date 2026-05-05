namespace Holtel.Entities
{
	public class PasswordResetToken
	{
		public int Id { get; set; }
		public string Email { get; set; } = null!;
		public string Token { get; set; } = null!;
		public DateTime ExpireAt { get; set; }
	}
}
