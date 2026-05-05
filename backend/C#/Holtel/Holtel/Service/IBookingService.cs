using Holtel.Application.DTOs.Booking;
using Holtel.Common;
namespace Holtel.Service
{
	public interface IBookingService
	{
		Task<List<BookingResponseDto>> GetAll();
		Task<BookingResponseDto> GetById(int id);
		Task<List<BookingResponseDto>> GetByUser(int userId);

		Task<BookingResponseDto> Create(int userId, CreateBookingDto dto);
		Task<BookingResponseDto> Update(int id, UpdateBookingDto dto);
		Task Delete(int id);
		
	}
}
