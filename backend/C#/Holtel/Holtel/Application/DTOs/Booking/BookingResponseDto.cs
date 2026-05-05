namespace Holtel.Application.DTOs.Booking
{
	public class BookingResponseDto
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public int RoomId { get; set; }
		public string RoomNumber { get; set; } = "";
		public DateTime CheckIn { get; set; }
		public DateTime CheckOut { get; set; }
		public int GuestCount { get; set; }
		public decimal TotalPrice { get; set; }
		public string Status { get; set; } = "";
	}
}
