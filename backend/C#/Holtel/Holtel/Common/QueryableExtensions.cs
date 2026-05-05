using Microsoft.EntityFrameworkCore;

namespace Holtel.Common
{
	public static class QueryableExtensions
	{
		public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
		this IQueryable<T> query, int page, int pageSize)
		{
			var totalCount = await query.CountAsync();

			var data = await query
				.Skip((page - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();

			return new PagedResult<T>
			{
				Data = data,
				TotalCount = totalCount,
				Page = page,
				PageSize = pageSize
			};
		}
	}
}
