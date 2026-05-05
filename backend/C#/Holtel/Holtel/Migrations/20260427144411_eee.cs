using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Holtel.Migrations
{
    /// <inheritdoc />
    public partial class eee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 14, 44, 11, 397, DateTimeKind.Utc).AddTicks(3772), "$2a$11$.lgK29S77CBqQ3.Z.zVMGeOGeDY6hnwZUs5rLz8RAtoY6npLAQb.6" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 14, 38, 41, 992, DateTimeKind.Utc).AddTicks(3838), "$2a$11$uirmWvfVxe3LL.X3Y7M7VOQenjUmI4lNWl9ct5pvhZc1w3hRL0uku" });
        }
    }
}
