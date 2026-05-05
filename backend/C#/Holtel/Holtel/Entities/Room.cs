namespace Holtel.Model
{
	public class Room
	{
		public int Id { get; set; }
		public string Number { get; set; } = null!;
		public int Floor { get; set; }
		public string Status { get; set; } = "Trống";
		public int RoomTypeId { get; set; }

		// ── Thêm mới ──────────────────────────────
		public int Capacity { get; set; }           // Sức chứa
		public string BedType { get; set; } = null!; // Loại giường
		public double Area { get; set; }            // Diện tích (m²)
		public decimal PricePerNight { get; set; }  // Giá / đêm
		public string? Amenities { get; set; }      // Tiện nghi (lưu dạng "Wifi,TV,Điều hòa")

		// Navigation
		public RoomType RoomType { get; set; } = null!;
		public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
	}
}
