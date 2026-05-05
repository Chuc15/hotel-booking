using System;

namespace Holtel.Model
{
	public class User
	{
		public int Id { get; set; }
		public string FullName { get; set; } = null!;
		public string Email { get; set; } = null!;
		public string PasswordHash { get; set; } = null!;
		public string? PhoneNumber { get; set; }
		public string Role { get; set; } = null!;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public bool IsActive { get; set; } = true;

		public DateTime? UpdatedAt { get; set; }
		// Navigation
		public ICollection<Review> Reviews { get; set; } = new List<Review>();
	}
}



