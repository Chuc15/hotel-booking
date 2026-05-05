namespace Holtel.Application.DTOs.Room
{
	public class UpdateRoomDto
	{
		public string? Number { get; set; }
		public int? Floor { get; set; }
		public int? RoomTypeId { get; set; }
		public int? Capacity { get; set; }
		public string? BedType { get; set; }
		public double? Area { get; set; }
		public decimal? PricePerNight { get; set; }
		public string? Amenities { get; set; }
		public string? Status { get; set; }
	}
}
