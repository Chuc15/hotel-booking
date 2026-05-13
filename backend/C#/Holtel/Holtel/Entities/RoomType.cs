namespace Holtel.Model
{
	public class RoomType
	{
		public int Id { get; set; }

		public string Name { get; set; } = null!;

		public string? Description { get; set; }

		public decimal BasePrice { get; set; }

		public int MaxOccupancy { get; set; }

		public string? Amenities { get; set; }

		// Navigation
		public ICollection<Room> Rooms { get; set; } = new List<Room>();

		public bool IsDeleted { get; set; } = false;
	}
}
