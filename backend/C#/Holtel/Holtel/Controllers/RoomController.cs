using Holtel.Application.DTOs.Room;
using Holtel.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Holtel.Controllers
{
	[ApiController]
	[Route("api/rooms")]
	[Authorize]
	public class RoomController : ControllerBase
	{
		private readonly IRoomService _roomService;

		public RoomController(IRoomService roomService)
		{
			_roomService = roomService;
		}

		// GET api/rooms?status=Available&floor=2
		[HttpGet]
		public async Task<ActionResult<IEnumerable<RoomDto>>> GetAll(
			[FromQuery] RoomFilterDto filter)
		{
			var rooms = await _roomService.GetAllAsync(filter);
			return Ok(rooms);
		}

		// GET api/rooms/5
		[HttpGet("{id:int}")]
		public async Task<ActionResult<RoomDto>> GetById(int id)
		{
			var room = await _roomService.GetByIdAsync(id);
			return room is null ? NotFound() : Ok(room);
		}

		// POST api/rooms
		[HttpPost]
		public async Task<ActionResult<RoomDto>> Create([FromBody] CreateRoomDto dto)
		{
			try
			{
				var created = await _roomService.CreateAsync(dto);
				return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
			}
			catch (InvalidOperationException ex)
			{
				return Conflict(new { message = ex.Message });
			}
		}

		// PUT api/rooms/5
		[HttpPut("{id:int}")]
		public async Task<ActionResult<RoomDto>> Update(
			int id, [FromBody] UpdateRoomDto dto)
		{
			var updated = await _roomService.UpdateAsync(id, dto);
			return updated is null ? NotFound() : Ok(updated);
		}

		// DELETE api/rooms/5
		[HttpDelete("{id:int}")]
		public async Task<IActionResult> Delete(int id)
		{
			var deleted = await _roomService.DeleteAsync(id);
			return deleted ? NoContent() : NotFound();
		}
	
	}
}
