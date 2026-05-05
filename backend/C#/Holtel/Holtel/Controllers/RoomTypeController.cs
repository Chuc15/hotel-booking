using Holtel.Application.DTOs.RoomType;
using Holtel.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Holtel.Controllers
{
	[ApiController]
	[Route("api/roomtypes")]
	[Authorize]
	public class RoomTypeController : ControllerBase
	{
		private readonly IRoomTypeService _roomTypeService;

		public RoomTypeController(IRoomTypeService roomTypeService)
		{
			_roomTypeService = roomTypeService;
		}

		// GET api/roomtypes
		[HttpGet]
		public async Task<ActionResult<IEnumerable<RoomTypeDto>>> GetAll()
		{
			var roomTypes = await _roomTypeService.GetAllAsync();
			return Ok(roomTypes);
		}

		// GET api/roomtypes/5
		[HttpGet("{id:int}")]
		public async Task<ActionResult<RoomTypeDto>> GetById(int id)
		{
			var roomType = await _roomTypeService.GetByIdAsync(id);
			return roomType is null ? NotFound() : Ok(roomType);
		}

		// POST api/roomtypes
		[HttpPost]
		public async Task<ActionResult<RoomTypeDto>> Create([FromBody] CreateRoomTypeDto dto)
		{
			try
			{
				var created = await _roomTypeService.CreateAsync(dto);
				return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
			}
			catch (InvalidOperationException ex)
			{
				return Conflict(new { message = ex.Message });
			}
		}

		// PUT api/roomtypes/5
		[HttpPut("{id:int}")]
		public async Task<ActionResult<RoomTypeDto>> Update(int id, [FromBody] UpdateRoomTypeDto dto)
		{
			var updated = await _roomTypeService.UpdateAsync(id, dto);
			return updated is null ? NotFound() : Ok(updated);
		}

		// DELETE api/roomtypes/5
		[HttpDelete("{id:int}")]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var deleted = await _roomTypeService.DeleteAsync(id);
				return deleted ? NoContent() : NotFound();
			}
			catch (InvalidOperationException ex)
			{
				return Conflict(new { message = ex.Message });
			}
		}
	
	}
}
