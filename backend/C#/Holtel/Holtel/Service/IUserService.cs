using Holtel.Application.DTOs;
using Holtel.Common;

namespace Holtel.Service
{
	public interface IUserService
	{
		Task<UserDto> GetCurrentUserAsync(int userId);
		Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
		Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
		Task<PagedResult<UserDto>> GetAllUsersAsync(string? search, int page, int pageSize);
		Task<UserDto> GetUserByIdAsync(int id);
		Task UpdateUserStatusAsync(int id, UpdateUserStatusDto dto);
		Task<bool> DeleteUser(int id);
		Task UpdateRole(int id, string newRole);
	}
}
