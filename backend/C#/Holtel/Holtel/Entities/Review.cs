namespace Holtel.Model
{
	public class Review
	{
		public int Id { get; set; }

		public int BookingId { get; set; }

		public int UserId { get; set; }

		public int Rating { get; set; }

		public string? Comment { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public bool IsDeleted { get; set; } = false;
		// Navigation
		public Booking Booking { get; set; } = null!;
		public User User { get; set; } = null!;
	}
}
