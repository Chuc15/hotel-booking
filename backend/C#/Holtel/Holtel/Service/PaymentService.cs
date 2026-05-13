using Holtel.Data;
using Holtel.Model;
using Microsoft.EntityFrameworkCore;

namespace Holtel.Service
{
	public class PaymentService: IPaymentService
	{
		private readonly AppDbContext _context;
		private IConfiguration _configuration;

		public PaymentService(AppDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		public async Task<IEnumerable<Payment>> GetAllAsync()
		{
			return await _context.Payments
				.Include(x => x.Booking)
				.ToListAsync();
		}

		public async Task<Payment?> GetByIdAsync(int id)
		{
			return await _context.Payments
				.Include(x => x.Booking)
				.FirstOrDefaultAsync(x => x.Id == id);
		}

		public async Task<Payment> CreateAsync(Payment payment)
		{
			payment.PaidAt = DateTime.UtcNow;

			_context.Payments.Add(payment);

			await _context.SaveChangesAsync();

			return payment;
		}

		public async Task<bool> UpdateAsync(int id, Payment payment)
		{
			var existing = await _context.Payments.FindAsync(id);

			if (existing == null)
				return false;

			existing.BookingId = payment.BookingId;
			existing.Amount = payment.Amount;
			existing.Method = payment.Method;
			existing.TransactionId = payment.TransactionId;
			existing.Status = payment.Status;
			existing.PaidAt = payment.PaidAt;

			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<bool> DeleteAsync(int id)
		{
			var payment = await _context.Payments.FindAsync(id);

			if (payment == null)
				return false;

			_context.Payments.Remove(payment);

			await _context.SaveChangesAsync();

			return true;
		}
		public async Task<string> CreatePaymentUrl(Payment payment, HttpContext httpContext)
		{
			var vnpay = new VnPayLibrary();
			// Lấy cấu hình từ appsettings.json
			var vnp_TmnCode = _configuration["VnPay:TmnCode"];
			var vnp_HashSecret = _configuration["VnPay:HashSecret"];
			var vnp_Url = _configuration["VnPay:BaseUrl"];
			var vnp_ReturnUrl = _configuration["VnPay:ReturnUrl"];
			// Đổ dữ liệu vào Library
			vnpay.AddRequestData("vnp_Version", "2.1.0");
			vnpay.AddRequestData("vnp_Command", "pay");
			vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode!);
			vnpay.AddRequestData("vnp_Amount", ((long)payment.Amount * 100).ToString()); // VNPay tính theo đơn vị Đồng * 100
			vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_CurrCode", "VND");
			vnpay.AddRequestData("vnp_IpAddr", httpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");
			vnpay.AddRequestData("vnp_Locale", "vn");
			vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang {payment.BookingId}");
			vnpay.AddRequestData("vnp_OrderType", "other");
			vnpay.AddRequestData("vnp_ReturnUrl", vnp_ReturnUrl!);
			vnpay.AddRequestData("vnp_TxnRef", payment.Id.ToString()); // Dùng ID Payment làm mã tham chiếu
																	   // Tạo URL cuối cùng có kèm chữ ký Hash
			string paymentUrl = vnpay.CreateRequestUrl(vnp_Url!, vnp_HashSecret!);

			return await Task.FromResult(paymentUrl);
		}

		public async Task<bool> ProcessVnPayReturn(IQueryCollection vnpayData)
		{
			var vnpay = new VnPayLibrary();

			// Lấy dữ liệu trả về từ Query string
			foreach (var (key, value) in vnpayData)
			{
				if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
				{
					vnpay.AddResponseData(key, value!);
				}
			}
			var vnp_SecureHash = vnpayData["vnp_SecureHash"];
			var hashSecret = _configuration["VnPay:HashSecret"];

			// 1. Kiểm tra chữ ký bảo mật
			bool isValidSignature = vnpay.ValidateSignature(vnp_SecureHash!, hashSecret!);
			if (isValidSignature)
			{
				var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
				var paymentId = int.Parse(vnpay.GetResponseData("vnp_TxnRef"));
				// 2. Tìm payment trong DB để cập nhật
				var payment = await _context.Payments.FindAsync(paymentId);
				if (payment != null)
				{
					if (vnp_ResponseCode == "00") // 00 là mã thành công của VNPay
					{
						payment.Status = "Paid";
						payment.TransactionId = vnpay.GetResponseData("vnp_TransactionNo");
						payment.PaidAt = DateTime.UtcNow;
					}
					else
					{
						payment.Status = "Failed";
					}

					await _context.SaveChangesAsync();
					return vnp_ResponseCode == "00";
				}
			}
			return false;
		}
	}
}

