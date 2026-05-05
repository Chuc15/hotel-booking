using Holtel.Application.DTOs.Room;
using Holtel.Common;

namespace Holtel.Service
{
	public interface IRoomService
	{
		Task<PagedResult<RoomDto>> GetAllAsync(RoomFilterDto filter, int page = 1, int pageSize = 10);
		Task<RoomDto?> GetByIdAsync(int id);
		Task<RoomDto> CreateAsync(CreateRoomDto dto);
		Task<RoomDto?> UpdateAsync(int id, UpdateRoomDto dto);
		Task<bool> DeleteAsync(int id);
	}
}
