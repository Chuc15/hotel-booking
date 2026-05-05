using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Holtel.Migrations
{
    /// <inheritdoc />
    public partial class tkadmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[] { 1, new DateTime(2026, 4, 27, 14, 17, 15, 428, DateTimeKind.Utc).AddTicks(1919), "admin@gmail.com", "Admin", true, "$2a$11$ktVVxYSmdsUwJ1FzI8/B3eLr2ld8DGynMUc5Htc7KvxgH3gtx6mG6", "0123456789", "Admin", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
