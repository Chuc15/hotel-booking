using Holtel.Model;
using Holtel.Service;
using Microsoft.AspNetCore.Mvc;

namespace Holtel.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PaymentController : ControllerBase
	{
		private readonly IPaymentService _paymentService;
		private readonly IConfiguration _configuration;
		public PaymentController(IPaymentService paymentService, IConfiguration configuration)
		{
			_paymentService = paymentService;
			_configuration = configuration;
		}

		// GET: api/payments
		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var payments = await _paymentService.GetAllAsync();

			return Ok(payments);
		}

		// GET: api/payments/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var payment = await _paymentService.GetByIdAsync(id);

			if (payment == null)
				return NotFound();

			return Ok(payment);
		}

		// POST: api/payments
		[HttpPost]
		public async Task<IActionResult> Create(Payment payment)
		{
			var created = await _paymentService.CreateAsync(payment);

			return CreatedAtAction(
				nameof(GetById),
				new { id = created.Id },
				created);
		}

		// PUT: api/payments/5
		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, Payment payment)
		{
			var result = await _paymentService.UpdateAsync(id, payment);

			if (!result)
				return NotFound();

			return Ok(new
			{
				message = "Update successful"
			});
		}

		// DELETE: api/payments/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var result = await _paymentService.DeleteAsync(id);

			if (!result)
				return NotFound();

			return Ok(new
			{
				message = "Delete successful"
			});
		}
		// MỚI: API tạo link thanh toán VNPay
		[HttpPost("pay-vnpay")]
		public async Task<IActionResult> PayVnPay([FromBody] Payment payment)
		{
			// 1. Lưu payment vào DB
			var created = await _paymentService.CreateAsync(payment);
			// 2. Sử dụng VnPayLibrary theo đúng các hàm AddRequestData
			var vnpay = new VnPayLibrary();

			vnpay.AddRequestData("vnp_Version", "2.1.0");
			vnpay.AddRequestData("vnp_Command", "pay");
			vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]!);
			vnpay.AddRequestData("vnp_Amount", ((long)created.Amount * 100).ToString()); // Số tiền * 100
			vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
			vnpay.AddRequestData("vnp_CurrCode", "VND");
			vnpay.AddRequestData("vnp_IpAddr", Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");
			vnpay.AddRequestData("vnp_Locale", "vn");
			vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang {created.BookingId}");
			vnpay.AddRequestData("vnp_OrderType", "other");
			vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VnPay:ReturnUrl"]!);
			vnpay.AddRequestData("vnp_TxnRef", created.Id.ToString());
			// 3. Tạo URL
			var url = vnpay.CreateRequestUrl(_configuration["VnPay:BaseUrl"]!, _configuration["VnPay:HashSecret"]!);
			return Ok(new { paymentUrl = url });
		}

		// MỚI: API nhận kết quả trả về từ VNPay
		[HttpGet("vnpay-callback")]
		public async Task<IActionResult> VnPayCallback()
		{
			var vnpay = new VnPayLibrary();

			// Đọc dữ liệu từ Query string vào Library
			foreach (var (key, value) in Request.Query)
			{
				if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
				{
					vnpay.AddResponseData(key, value!);
				}
			}
			var vnp_SecureHash = Request.Query["vnp_SecureHash"];
			var hashSecret = _configuration["VnPay:HashSecret"]!;

			// Kiểm tra chữ ký
			bool isValid = vnpay.ValidateSignature(vnp_SecureHash!, hashSecret);
			if (isValid)
			{
				var status = Request.Query["vnp_ResponseCode"];
				var paymentId = int.Parse(vnpay.GetResponseData("vnp_TxnRef"));
				var payment = await _paymentService.GetByIdAsync(paymentId);
				if (status == "00" && payment != null)
				{
					payment.Status = "Paid";
					payment.TransactionId = Request.Query["vnp_TransactionNo"]!;
					payment.PaidAt = DateTime.Now;
					await _paymentService.UpdateAsync(paymentId, payment);

					return Ok(new { message = "Thanh toán thành công" });
				}
			}
			return BadRequest(new { message = "Thanh toán thất bại" });
		}
	} 

}

