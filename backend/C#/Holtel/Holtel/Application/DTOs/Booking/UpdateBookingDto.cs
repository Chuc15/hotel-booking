namespace Holtel.Application.DTOs.Booking
{
	public class UpdateBookingDto
	{
		public int RoomId { get; set; }
		public DateTime CheckIn { get; set; }
		public DateTime CheckOut { get; set; }
		public int GuestCount { get; set; }
		public string Status { get; set; } = "Pending";
	}
}
