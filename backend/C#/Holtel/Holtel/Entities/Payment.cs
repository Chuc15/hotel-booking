namespace Holtel.Model
{
	public class Payment
	{
		public int Id { get; set; }

		public int BookingId { get; set; }

		public decimal Amount { get; set; }

		public string Method { get; set; } = null!;

		public string TransactionId { get; set; } = null!;

		public string Status { get; set; } = null!;

		public DateTime? PaidAt { get; set; }

		// Navigation
		public Booking Booking { get; set; } = null!;
		//public PaymentStatus Status { get; set; }
	}
}
