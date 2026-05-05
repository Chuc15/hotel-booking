using AutoMapper;
using Holtel.Application.DTOs.Room;
using Holtel.Common;
using Holtel.Data;
using Holtel.Model;
using Microsoft.EntityFrameworkCore;

namespace Holtel.Service
{
	public class RoomService:IRoomService
	{
		private readonly AppDbContext _context;
		private readonly IMapper _mapper;

		public RoomService(AppDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		// ── Lấy danh sách + filter ──────────────────────────────────────
		public async Task<PagedResult<RoomDto>> GetAllAsync(RoomFilterDto filter, int page = 1, int pageSize = 10)
		{
			var query = _context.Rooms
				.Include(r => r.RoomType)
				.AsQueryable();

			if (!string.IsNullOrWhiteSpace(filter.Status))
				query = query.Where(r => r.Status == filter.Status);

			if (filter.Floor.HasValue)
				query = query.Where(r => r.Floor == filter.Floor.Value);

			if (filter.RoomTypeId.HasValue)
				query = query.Where(r => r.RoomTypeId == filter.RoomTypeId.Value);

			if (filter.MinPrice.HasValue)
				query = query.Where(r => r.PricePerNight <= filter.MinPrice.Value);

			if (filter.MaxPrice.HasValue)
				query = query.Where(r => r.PricePerNight <= filter.MaxPrice.Value);

			var paged = await query.ToPagedResultAsync(page, pageSize);

			return new PagedResult<RoomDto>
			{
				Data = _mapper.Map<IEnumerable<RoomDto>>(paged.Data),
				TotalCount = paged.TotalCount,
				Page = paged.Page,
				PageSize = paged.PageSize
			};
		}

		// ── Lấy theo Id ─────────────────────────────────────────────────
		public async Task<RoomDto?> GetByIdAsync(int id)
		{
			var room = await _context.Rooms
				.Include(r => r.RoomType)
				.FirstOrDefaultAsync(r => r.Id == id);

			return room is null ? null : _mapper.Map<RoomDto>(room);
		}

		// ── Tạo mới ──────────────────────────────────────────────────────
		public async Task<RoomDto> CreateAsync(CreateRoomDto dto)
		{
			bool exists = await _context.Rooms.AnyAsync(r => r.Number == dto.Number);
			if (exists)
				throw new InvalidOperationException($"Phòng số '{dto.Number}' đã tồn tại.");

			var room = _mapper.Map<Room>(dto);

			_context.Rooms.Add(room);
			await _context.SaveChangesAsync();
			await _context.Entry(room).Reference(r => r.RoomType).LoadAsync();

			return _mapper.Map<RoomDto>(room);
		}

		// ── Cập nhật ─────────────────────────────────────────────────────
		public async Task<RoomDto?> UpdateAsync(int id, UpdateRoomDto dto)
		{
			var room = await _context.Rooms
				.Include(r => r.RoomType)
				.FirstOrDefaultAsync(r => r.Id == id);

			if (room is null) return null;

			_mapper.Map(dto, room);

			await _context.SaveChangesAsync();
			await _context.Entry(room).Reference(r => r.RoomType).LoadAsync();

			return _mapper.Map<RoomDto>(room);
		}

		// ── Xoá ──────────────────────────────────────────────────────────
		public async Task<bool> DeleteAsync(int id)
		{
			var room = await _context.Rooms.FindAsync(id);
			if (room is null) return false;

			_context.Rooms.Remove(room);
			await _context.SaveChangesAsync();
			return true;
		}
	}
}
