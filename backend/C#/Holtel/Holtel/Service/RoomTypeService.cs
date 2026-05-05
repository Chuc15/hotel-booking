using AutoMapper;
using Holtel.Application.DTOs.RoomType;
using Holtel.Data;
using Holtel.Model;
using Microsoft.EntityFrameworkCore;

namespace Holtel.Service
{
	public class RoomTypeService : IRoomTypeService
	{
		private readonly AppDbContext _context;
		private readonly IMapper _mapper;

		public RoomTypeService(AppDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		public async Task<IEnumerable<RoomTypeDto>> GetAllAsync()
		{
			var roomTypes = await _context.RoomTypes.ToListAsync();
			return _mapper.Map<IEnumerable<RoomTypeDto>>(roomTypes);
		}

		public async Task<RoomTypeDto?> GetByIdAsync(int id)
		{
			var roomType = await _context.RoomTypes.FindAsync(id);
			return roomType is null ? null : _mapper.Map<RoomTypeDto>(roomType);
		}

		public async Task<RoomTypeDto> CreateAsync(CreateRoomTypeDto dto)
		{
			bool exists = await _context.RoomTypes.AnyAsync(rt => rt.Name == dto.Name);
			if (exists)
				throw new InvalidOperationException($"Loại phòng '{dto.Name}' đã tồn tại.");

			var roomType = _mapper.Map<RoomType>(dto);

			_context.RoomTypes.Add(roomType);
			await _context.SaveChangesAsync();

			return _mapper.Map<RoomTypeDto>(roomType);
		}

		public async Task<RoomTypeDto?> UpdateAsync(int id, UpdateRoomTypeDto dto)
		{
			var roomType = await _context.RoomTypes.FindAsync(id);
			if (roomType is null) return null;

			_mapper.Map(dto, roomType);

			await _context.SaveChangesAsync();
			return _mapper.Map<RoomTypeDto>(roomType);
		}

		public async Task<bool> DeleteAsync(int id)
		{
			var roomType = await _context.RoomTypes.FindAsync(id);
			if (roomType is null) return false;

			// Kiểm tra còn phòng đang dùng loại này không
			bool hasRooms = await _context.Rooms.AnyAsync(r => r.RoomTypeId == id);
			if (hasRooms)
				throw new InvalidOperationException("Không thể xoá vì vẫn còn phòng thuộc loại này.");

			_context.RoomTypes.Remove(roomType);
			await _context.SaveChangesAsync();
			return true;
		}
	
	}
}
