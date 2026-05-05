using Holtel.Application.DTOs.RoomType;

namespace Holtel.Service
{
	public interface IRoomTypeService
	{
		Task<IEnumerable<RoomTypeDto>> GetAllAsync();
		Task<RoomTypeDto?> GetByIdAsync(int id);
		Task<RoomTypeDto> CreateAsync(CreateRoomTypeDto dto);
		Task<RoomTypeDto?> UpdateAsync(int id, UpdateRoomTypeDto dto);
		Task<bool> DeleteAsync(int id);
	}
}
