using System.ComponentModel.DataAnnotations;

namespace Holtel.Application.DTOs.Room
{
	public class CreateRoomDto
	{
		[Required(ErrorMessage = "Vui lòng nhập số phòng")]
		public string Number { get; set; } = null!;

		[Range(1, 100, ErrorMessage = "Tầng phải từ 1 đến 100")]
		public int Floor { get; set; }

		[Range(1, int.MaxValue, ErrorMessage = "Vui lòng chọn loại phòng")]
		public int RoomTypeId { get; set; }

		[Range(1, 20, ErrorMessage = "Sức chứa phải từ 1 đến 20")]
		public int Capacity { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập loại giường")]
		public string BedType { get; set; } = null!;

		[Range(1, 10000, ErrorMessage = "Diện tích phải từ 1 đến 10000 m²")]
		public double Area { get; set; }

		[Range(1, (double)decimal.MaxValue, ErrorMessage = "Giá phòng phải lớn hơn 0")]
		public decimal PricePerNight { get; set; }

		public string? Amenities { get; set; }

		public string Status { get; set; } = "Trống";
	}
}
