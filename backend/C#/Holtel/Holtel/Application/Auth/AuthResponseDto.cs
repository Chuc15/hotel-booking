namespace Holtel.Application.Auth
{
	public class AuthResponseDto
	{
		public string AccessToken { get; set; } = null!;
		public object User { get; set; } = null!;	
	}
}
