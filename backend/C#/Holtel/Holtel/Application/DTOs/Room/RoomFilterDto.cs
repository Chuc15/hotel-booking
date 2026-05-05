namespace Holtel.Application.DTOs.Room
{
	public class RoomFilterDto
	{
		public string? Status { get; set; }   // "Available", "Booked", ...
		public int? Floor { get; set; }
		public int? RoomTypeId { get; set; }

		public decimal? MaxPrice { get; set; }
		public decimal? MinPrice { get; set; }
	}
}
