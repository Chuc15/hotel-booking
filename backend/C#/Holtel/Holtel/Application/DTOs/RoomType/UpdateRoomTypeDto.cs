namespace Holtel.Application.DTOs.RoomType
{
	public class UpdateRoomTypeDto
	{
		public string? Name { get; set; }
		public string? Description { get; set; }
		public decimal? BasePrice { get; set; }
		public int? MaxOccupancy { get; set; }
		public string? Amenities { get; set; }
	}
}
