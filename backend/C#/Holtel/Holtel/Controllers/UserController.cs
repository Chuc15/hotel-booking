using Holtel.Application.DTOs;
using Holtel.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Holtel.Controllers
{
	[ApiController]
	[Route("api/users")]
	[Authorize]
	public class UserController : ControllerBase
	{
		private readonly IUserService _userService;

		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		private int GetUserId()
		{
			return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
		}

		// ================= USER =================

		[HttpGet("me")]
		public async Task<IActionResult> GetMe()
		{
			return Ok(await _userService.GetCurrentUserAsync(GetUserId()));
		}

		[HttpPut("me")]
		public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
		{
			return Ok(await _userService.UpdateProfileAsync(GetUserId(), dto));
		}

		[HttpPut("me/password")]
		public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
		{
			await _userService.ChangePasswordAsync(GetUserId(), dto);
			return Ok(new { message = "Đổi mật khẩu thành công" });
		}

		// ================= ADMIN =================

		[HttpGet]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> GetAll(string? search, int page = 1, int pageSize = 10)
		{
			return Ok(await _userService.GetAllUsersAsync(search, page, pageSize));
		}
		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> DeleteUser(int id)
		{
			var result = await _userService.DeleteUser(id);

			if (!result)
			{
				return NotFound(new
				{
					message = "Không tìm thấy người dùng"
				});
			}

			return Ok(new
			{
				message = "Đã xóa người dùng thành công"
			});
		}
		[HttpPut("{id}/role")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> UpdateRole(int id, [FromBody] string newRole)
		{
			// Cần viết thêm hàm UpdateRoleAsync trong UserService
			await _userService.UpdateRole(id, newRole);
			return Ok(new { message = "Đã đổi role thành công" });
		}



		[HttpGet("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> GetById(int id)
		{
			return Ok(await _userService.GetUserByIdAsync(id));
		}

		[HttpPatch("{id}/status")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> UpdateStatus(int id, UpdateUserStatusDto dto)
		{
			if (id == GetUserId())
				return BadRequest(new { message = "Không thể tự khoá chính mình" });

			await _userService.UpdateUserStatusAsync(id, dto);

			return Ok(new
			{
				message = dto.IsActive ? "Đã mở khoá" : "Đã khoá"
			});
		}
	}
}