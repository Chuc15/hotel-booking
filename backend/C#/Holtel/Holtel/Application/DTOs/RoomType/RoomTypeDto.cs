namespace Holtel.Application.DTOs.RoomType
{
	public class RoomTypeDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = null!;
		public string? Description { get; set; }
		public decimal BasePrice { get; set; }
		public int MaxOccupancy { get; set; }
		public List<string> Amenities { get; set; } = new();
	}
}

