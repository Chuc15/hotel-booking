using Holtel.Entities;
using Holtel.Model;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Holtel.Data
{
	public class AppDbContext:DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<User> Users { get; set; }
		public DbSet<Room> Rooms { get; set; }
		public DbSet<RoomType> RoomTypes { get; set; }
		public DbSet<Booking> Bookings { get; set; }
		public DbSet<Payment> Payments { get; set; }
		public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
		protected override void OnModelCreating(ModelBuilder mb)
		{
			mb.Entity<User>().HasData(
		new User
		{
			Id = 1,
			FullName = "Admin",
			Email = "admin@gmail.com",
			PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin@123"),
			PhoneNumber = "0123456789",
			Role = "Admin",
			IsActive = true,
			CreatedAt = DateTime.UtcNow
			}
		);// aba11 @gmail.com Ab@00000

			mb.Entity<Booking>()
				.HasIndex(b => new { b.RoomId, b.CheckIn, b.CheckOut });

			mb.Entity<Room>()
				.Property(r => r.Status)
				.HasDefaultValue("Available");

			mb.Entity<RoomType>(entity =>
			{
				entity.Property(x => x.Name)
					.IsRequired()
					.HasMaxLength(100);

				entity.Property(x => x.Description)
					.HasMaxLength(500);

				entity.Property(x => x.BasePrice)
					.HasPrecision(18, 2);

				entity.Property(x => x.Amenities)
					.HasMaxLength(500);
			});

			mb.Entity<Payment>(entity =>
			{
				entity.Property(x => x.Amount)
					.HasPrecision(18, 2);

				entity.Property(x => x.Method)
					.HasMaxLength(50);

				entity.Property(x => x.TransactionId)
					.HasMaxLength(100);

				entity.Property(x => x.Status)
					.HasMaxLength(50);

				entity.HasIndex(x => x.TransactionId)
					.IsUnique();

				entity.HasOne(x => x.Booking)
					.WithMany(b => b.Payments)
					.HasForeignKey(x => x.BookingId);
			});
			mb.Entity<Review>(entity =>
			{
				entity.Property(x => x.Comment)
					.HasMaxLength(500);

				entity.Property(x => x.CreatedAt)
					.HasDefaultValueSql("GETUTCDATE()");

				entity.HasCheckConstraint("CK_Review_Rating", "[Rating] BETWEEN 1 AND 5");

				entity.HasIndex(x => x.BookingId)
					.IsUnique();

				// Booking → Review (giữ cascade)
				entity.HasOne(x => x.Booking)
					.WithOne(b => b.Review)
					.HasForeignKey<Review>(x => x.BookingId)
					.OnDelete(DeleteBehavior.Cascade);

				// 🔥 QUAN TRỌNG: User → Review phải NO ACTION
				entity.HasOne(x => x.User)
					.WithMany(u => u.Reviews)
					.HasForeignKey(x => x.UserId)
					.OnDelete(DeleteBehavior.NoAction); // 🔥 FIX CHÍNH
			});


		}
	}
}

