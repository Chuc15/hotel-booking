using AutoMapper;
using Holtel.Application.DTOs;
using Holtel.Common;
using Holtel.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Holtel.Service
{
	public class UserService : IUserService
	{
		private readonly AppDbContext _db;
		private readonly IMapper _mapper;
		private readonly ILogger<UserService> _logger;

		public UserService(AppDbContext db, IMapper mapper, ILogger<UserService> logger)
		{
			_db = db;
			_mapper = mapper;
			_logger = logger;
		}

		// ================= GET CURRENT USER =================
		public async Task<UserDto> GetCurrentUserAsync(int userId)
		{
			var user = await _db.Users.FindAsync(userId)
				?? throw new Exception("User không tồn tại");

			return _mapper.Map<UserDto>(user);
		}

		// ================= UPDATE PROFILE =================
		public async Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
		{
			var user = await _db.Users.FindAsync(userId)
				?? throw new Exception("User không tồn tại");

			user.FullName = dto.FullName.Trim();
			user.PhoneNumber = dto.PhoneNumber?.Trim();
			user.UpdatedAt = DateTime.UtcNow;

			await _db.SaveChangesAsync();

			_logger.LogInformation("User {UserId} cập nhật profile", userId);

			return _mapper.Map<UserDto>(user);
		}

		// ================= CHANGE PASSWORD =================
		public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
		{
			var user = await _db.Users.FindAsync(userId)
				?? throw new Exception("User không tồn tại");

			if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
				throw new Exception("Mật khẩu hiện tại sai");

			if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.PasswordHash))
				throw new Exception("Mật khẩu mới không được trùng");

			user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
			user.UpdatedAt = DateTime.UtcNow;

			await _db.SaveChangesAsync();

			_logger.LogInformation("User {UserId} đổi mật khẩu", userId);
		}

		// ================= GET ALL (ADMIN) =================
		public async Task<PagedResult<UserDto>> GetAllUsersAsync(string? search, int page, int pageSize)
		{
			var query = _db.Users.AsNoTracking();

			if (!string.IsNullOrWhiteSpace(search))
			{
				var keyword = search.ToLower().Trim();
				query = query.Where(u =>
					u.FullName.ToLower().Contains(keyword) ||
					u.Email.ToLower().Contains(keyword));
			}

			var total = await query.CountAsync();

			var data = await query
				.OrderByDescending(x => x.CreatedAt)
				.Skip((page - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();

			return new PagedResult<UserDto>
			{
				Data = _mapper.Map<IEnumerable<UserDto>>(data),
				TotalCount = total,
				Page = page,
				PageSize = pageSize
			};
		}

		// ================= GET BY ID =================
		public async Task<UserDto> GetUserByIdAsync(int id)
		{
			var user = await _db.Users.FindAsync(id)
				?? throw new Exception("User không tồn tại");

			return _mapper.Map<UserDto>(user);
		}

		// ================= UPDATE STATUS =================
		public async Task UpdateUserStatusAsync(int id, UpdateUserStatusDto dto)
		{
			var user = await _db.Users.FindAsync(id)
				?? throw new Exception("User không tồn tại");

			user.IsActive = dto.IsActive;
			user.UpdatedAt = DateTime.UtcNow;

			await _db.SaveChangesAsync();

			_logger.LogWarning("Admin thay đổi trạng thái user {UserId}", id);
		}
		[HttpPut("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task UpdateRole(int id, string newRole)
		{
			var user = await _db.Users.FindAsync(id);
			if (user == null)
				throw new Exception("Không tìm thấy người dùng");

			user.Role = newRole;
			await _db.SaveChangesAsync();
		}
		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<bool> DeleteUser(int id)
		{
			var user = await _db.Users.FindAsync(id);

			if (user == null)
			{
				return false;
			}

			user.IsDeleted = true;
			user.UpdatedAt = DateTime.UtcNow;

			await _db.SaveChangesAsync();

			return true;
		}

	}
}