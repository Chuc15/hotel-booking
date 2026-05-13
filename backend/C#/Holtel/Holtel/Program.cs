
using Holtel.Application.Mappings;
using Holtel.Data;
using Holtel.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

namespace Holtel
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.
			builder.Services.AddDbContext<AppDbContext>(options =>
			options.UseSqlServer(builder.Configuration.GetConnectionString("Default")
	        )
            );
			// JWT Authentication
			var jwt = builder.Configuration.GetSection("JwtSettings");
			builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(opt =>
				{
					opt.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateLifetime = true,
						ValidateIssuerSigningKey = true,
						ValidIssuer = jwt["Issuer"],
						ValidAudience = jwt["Audience"],
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(jwt["SecretKey"]!)),
						RoleClaimType = ClaimTypes.Role
					};

				});

			//// DI
			
			builder.Services.AddScoped<IBookingService, BookingService>();
			builder.Services.AddScoped<IRoomService, RoomService>();
			builder.Services.AddScoped<IRoomTypeService, RoomTypeService>();
			builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
			builder.Services.AddScoped<IPaymentService, PaymentService>();	
			builder.Services.AddScoped<IUserService, UserService>();

			builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen(c => {
				// Cho phép nhập JWT token trực tiếp trong Swagger UI
				c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Name = "Authorization",
					Type = SecuritySchemeType.Http,
					Scheme = "bearer",
					BearerFormat = "JWT"
				});
				c.AddSecurityRequirement(new OpenApiSecurityRequirement {{
			new OpenApiSecurityScheme {
			Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
				}, Array.Empty<string>()
				}});
			});
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowFrontend",
					policy =>
					{
						policy.WithOrigins("http://localhost:5173") // URL frontend React
							  .AllowAnyHeader()
							  .AllowAnyMethod()
							  .AllowCredentials();
					});
			});
			var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
			
			app.UseCors("AllowFrontend");
			app.UseHttpsRedirection();
			app.UseAuthentication();
			app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
