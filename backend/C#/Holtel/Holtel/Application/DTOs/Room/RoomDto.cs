namespace Holtel.Application.DTOs.Room
{
	public class RoomDto
	{
		public int Id { get; set; }
		public string Number { get; set; } = null!;
		public int Floor { get; set; }
		public string Status { get; set; } = null!;
		public string RoomTypeName { get; set; } = null!;
		public int Capacity { get; set; }
		public string BedType { get; set; } = null!;
		public double Area { get; set; }
		public decimal PricePerNight { get; set; }
		public List<string> Amenities { get; set; } = new();
	}
}
