using System.ComponentModel.DataAnnotations;

namespace Holtel.Application.DTOs.RoomType
{
	public class CreateRoomTypeDto
	{
		[Required(ErrorMessage = "Vui lòng nhập tên loại phòng")]
		public string Name { get; set; } = null!;
		public string? Description { get; set; }

		[Required]
		[Range(0, double.MaxValue)]
		public decimal BasePrice { get; set; }

		[Required]
		[Range(1, 20)]
		public int MaxOccupancy { get; set; }

		public string? Amenities { get; set; }
	}
}
