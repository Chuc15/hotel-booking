using Holtel.Model;

namespace Holtel.Service
{
	public interface IPaymentService
	{
		Task<IEnumerable<Payment>> GetAllAsync();

		Task<Payment?> GetByIdAsync(int id);

		Task<Payment> CreateAsync(Payment payment);

		Task<bool> UpdateAsync(int id, Payment payment);

		Task<bool> DeleteAsync(int id);
		Task<string> CreatePaymentUrl(Payment payment, HttpContext httpContext);
		Task<bool> ProcessVnPayReturn(IQueryCollection vnpayData);
	}
}

