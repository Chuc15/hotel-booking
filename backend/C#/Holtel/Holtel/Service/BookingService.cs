using Holtel.Application.DTOs.Booking;
using Holtel.Data;
using Holtel.Entities;
using Holtel.Model;
using Microsoft.EntityFrameworkCore;

namespace Holtel.Service
{
	public class BookingService : IBookingService
	{
		private readonly AppDbContext _context;

		public BookingService(AppDbContext context)
		{
			_context = context;
		}

		// ================= GET ALL =================
		public async Task<List<BookingResponseDto>> GetAll()
		{
			return await _context.Bookings
				.Include(b => b.Room)
				.Select(b => new BookingResponseDto
				{
					Id = b.Id,
					UserId = b.UserId,
					RoomId = b.RoomId,
					RoomNumber = b.Room.Number,
					CheckIn = b.CheckIn,
					CheckOut = b.CheckOut,
					GuestCount = b.GuestCount,
					TotalPrice = b.TotalPrice,
					Status = b.Status
				})
				.ToListAsync();
		}

		// ================= GET BY ID =================
		public async Task<BookingResponseDto> GetById(int id)
		{
			var booking = await _context.Bookings
				.Include(b => b.Room)
				.ThenInclude(r => r.RoomType)
				.FirstOrDefaultAsync(b => b.Id == id);

			if (booking == null)
				throw new Exception("Booking không tồn tại");

			return MapToDto(booking);
		}

		// ================= GET BY USER =================
		public async Task<List<BookingResponseDto>> GetByUser(int userId)
		{
			return await _context.Bookings
				.Where(b => b.UserId == userId)
				.Include(b => b.Room)
				.Select(b => new BookingResponseDto 
				{ 
					Id = b.Id,
					UserId = b.UserId,
					RoomId = b.RoomId,
					RoomNumber = b.Room.Number,
					CheckIn = b.CheckIn, 
					CheckOut = b.CheckOut,
					GuestCount = b.GuestCount, 
					TotalPrice = b.TotalPrice, 
					Status = b.Status }
				)
				.ToListAsync();
		}

		// ================= CREATE =================
		public async Task<BookingResponseDto> Create(int userId, CreateBookingDto dto)
		{
			if (dto.CheckIn.Date >= dto.CheckOut.Date)
				throw new Exception("Check-out phải sau check-in");

			var room = await _context.Rooms
				.Include(r => r.RoomType)
				.FirstOrDefaultAsync(r => r.Id == dto.RoomId);

			if (room == null)
				throw new Exception("Phòng không tồn tại");

			// check trùng lịch
			var conflict = await _context.Bookings.AnyAsync(b =>
				b.RoomId == dto.RoomId &&
				b.Status != "Cancelled" &&
				dto.CheckIn < b.CheckOut &&
				dto.CheckOut > b.CheckIn
			);

			if (conflict)
				throw new Exception("Phòng đã được đặt");

			var days = (dto.CheckOut - dto.CheckIn).TotalDays;
			var totalPrice = (decimal)days * room.RoomType.BasePrice;

			var booking = new Booking
			{
				UserId = userId,
				RoomId = dto.RoomId,
				CheckIn = dto.CheckIn,
				CheckOut = dto.CheckOut,
				GuestCount = dto.GuestCount,
				TotalPrice = totalPrice,
				Status = "Pending",
				CreatedAt = DateTime.UtcNow
			};

			_context.Bookings.Add(booking);
			await _context.SaveChangesAsync();

			return MapToDto(booking, room.Number);
		}

		// ================= UPDATE =================
		public async Task<BookingResponseDto> Update(int id, UpdateBookingDto dto)
		{
			var booking = await _context.Bookings
				.Include(b => b.Room)
				.ThenInclude(r => r.RoomType)
				.FirstOrDefaultAsync(b => b.Id == id);

			if (booking == null)
				throw new Exception("Booking không tồn tại");

			if (dto.CheckIn.Date >= dto.CheckOut.Date)
				throw new Exception("Check-out phải sau check-in");

			var conflict = await _context.Bookings.AnyAsync(b =>
				b.RoomId == booking.RoomId &&
				b.Id != id &&
				b.Status != "Cancelled" &&
				dto.CheckIn < b.CheckOut &&
				dto.CheckOut > b.CheckIn
			);

			if (conflict)
				throw new Exception("Phòng đã được đặt");

			booking.CheckIn = dto.CheckIn;
			booking.CheckOut = dto.CheckOut;
			booking.GuestCount = dto.GuestCount;
			booking.Status = dto.Status;
			booking.UpdatedAt = DateTime.UtcNow;

			var days = (dto.CheckOut - dto.CheckIn).TotalDays;
			booking.TotalPrice = (decimal)days * booking.Room.RoomType.BasePrice;

			await _context.SaveChangesAsync();

			return MapToDto(booking);
		}

		// ================= DELETE (SOFT) =================
		public async Task Delete(int id)
		{
			var booking = await _context.Bookings.FindAsync(id);

			if (booking == null)
				throw new Exception("Booking không tồn tại");

			booking.Status = "Cancelled";
			booking.UpdatedAt = DateTime.UtcNow;

			await _context.SaveChangesAsync();
		}

		// ================= HELPER =================
		private BookingResponseDto MapToDto(Booking b, string? roomNumber = null)
		{
			return new BookingResponseDto
			{
				Id = b.Id,
				RoomId = b.RoomId,
				RoomNumber = roomNumber ?? b.Room?.Number,
				CheckIn = b.CheckIn,
				CheckOut = b.CheckOut,
				GuestCount = b.GuestCount,
				TotalPrice = b.TotalPrice,
				Status = b.Status
			};
		}
		public async Task UpdateStatus(int id, string status)
		{
			var booking = await _context.Bookings.FindAsync(id);

			if (booking == null)
				throw new Exception("Booking không tồn tại");

			// ✅ validate status hợp lệ
			var validStatuses = new[] { "Pending", "Confirmed", "Cancelled", "Completed" };

			if (string.IsNullOrEmpty(status) || !validStatuses.Contains(status))
				throw new Exception("Trạng thái không hợp lệ");

			// ❗ tránh update vô nghĩa
			if (booking.Status == status)
				throw new Exception("Trạng thái không thay đổi");

			// ❗ rule thực tế (rất nên có)
			if (booking.Status == "Cancelled")
				throw new Exception("Booking đã bị huỷ, không thể cập nhật");

			if (booking.Status == "Completed")
				throw new Exception("Booking đã hoàn thành, không thể cập nhật");

			booking.Status = status;
			booking.UpdatedAt = DateTime.UtcNow;

			await _context.SaveChangesAsync();
		}
	}
}