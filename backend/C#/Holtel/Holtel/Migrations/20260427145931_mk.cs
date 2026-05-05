using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Holtel.Migrations
{
    /// <inheritdoc />
    public partial class mk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpireAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 14, 59, 31, 510, DateTimeKind.Utc).AddTicks(7292), "$2a$11$eokw63oFPmbIs3Pr69OTned2Xvl4WxuoEEfWsosNuVj8dMuAtYR8a" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetTokens");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 14, 44, 11, 397, DateTimeKind.Utc).AddTicks(3772), "$2a$11$.lgK29S77CBqQ3.Z.zVMGeOGeDY6hnwZUs5rLz8RAtoY6npLAQb.6" });
        }
    }
}
