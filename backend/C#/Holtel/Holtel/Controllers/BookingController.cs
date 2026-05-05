using Holtel.Application.DTOs.Booking;
using Holtel.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Holtel.Controllers
{
	[ApiController]
	[Route("api/booking")]
	[Authorize]
	public class BookingController : ControllerBase
	{
		private readonly IBookingService _service;

		public BookingController(IBookingService service)
		{
			_service = service;
		}

		private int GetUserId()
		{
			var claim = User.FindFirst(ClaimTypes.NameIdentifier);
			if (claim != null && int.TryParse(claim.Value, out int userId))
			{
				return userId;
			}
			throw new UnauthorizedAccessException("Token không chứa ID hợp lệ.");
		}

		// ================= CREATE =================
		[HttpPost]
		public async Task<IActionResult> Create(CreateBookingDto dto)
		{
			var result = await _service.Create(GetUserId(), dto);
			return Ok(result);
		}

		// ================= ADMIN: GET ALL =================
		[HttpGet("all")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> GetAll()
		{
			return Ok(await _service.GetAll());
		}

		// ================= USER: MY BOOKING =================
		[HttpGet("my")]
		public async Task<IActionResult> GetMy()
		{
			return Ok(await _service.GetByUser(GetUserId()));
		}

		// ================= GET BY ID =================
		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var booking = await _service.GetById(id);

			if (booking == null)
				return NotFound(new { message = "Không tìm thấy đơn đặt phòng" });

			if (booking.UserId != GetUserId() && !User.IsInRole("Admin"))
				return Forbid();

			return Ok(booking);
		}

		// ================= UPDATE =================
		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, UpdateBookingDto dto)
		{
			var booking = await _service.GetById(id);

			if (booking == null)
				return NotFound(new { message = "Không tìm thấy đơn đặt phòng" });

			if (booking.UserId != GetUserId() && !User.IsInRole("Admin"))
				return Forbid();

			return Ok(await _service.Update(id, dto));
		}

		// ================= DELETE =================
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var booking = await _service.GetById(id);

			if (booking == null)
				return NotFound(new { message = "Không tìm thấy đơn đặt phòng" });

			if (booking.UserId != GetUserId() && !User.IsInRole("Admin"))
				return Forbid();

			await _service.Delete(id);
			return Ok(new { message = "Deleted successfully" });
		}
		//[HttpPatch("{id}/status")]
		//[Authorize(Roles = "Admin")]
		//public async Task<IActionResult> UpdateStatus(int id, UpdateBookingStatusDto dto)
		//{
		//	await _service.UpdateStatus(id, dto.Status);
		//	return Ok();
		//}
	}
}
