using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Holtel.Migrations
{
    /// <inheritdoc />
    public partial class RemovePhoneRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 14, 38, 41, 992, DateTimeKind.Utc).AddTicks(3838), "$2a$11$uirmWvfVxe3LL.X3Y7M7VOQenjUmI4lNWl9ct5pvhZc1w3hRL0uku" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 14, 17, 15, 428, DateTimeKind.Utc).AddTicks(1919), "$2a$11$ktVVxYSmdsUwJ1FzI8/B3eLr2ld8DGynMUc5Htc7KvxgH3gtx6mG6" });
        }
    }
}
