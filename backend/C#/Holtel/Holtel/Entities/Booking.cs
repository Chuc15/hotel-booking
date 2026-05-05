namespace Holtel.Model
{
	public class Booking
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public int RoomId { get; set; }
		public DateTime CheckIn { get; set; }
		public DateTime CheckOut { get; set; }
		public int GuestCount { get; set; }
		public decimal TotalPrice { get; set; }
		public string Status { get; set; } = "Pending"; // Pending/Confirmed/Cancelled
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public User User { get; set; } = null!;
		public Room Room { get; set; } = null!;
		public ICollection<Payment> Payments { get; set; } = new List<Payment>();
		public Review? Review { get; set; }
		public DateTime UpdatedAt { get; internal set; }
	}
}
