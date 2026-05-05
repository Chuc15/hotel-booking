namespace Holtel.Common
{
	public class PagedResult<T>
	{
		public IEnumerable<T> Data { get; set; } = [];
		public int TotalCount { get; set; }   // tổng số record
		public int Page { get; set; }          // trang hiện tại
		public int PageSize { get; set; }      // số record mỗi trang
		public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
		public bool HasNext => Page < TotalPages;
		public bool HasPrev => Page > 1;
	}
}
