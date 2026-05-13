import { useState, useEffect, useRef } from "react";
import { getBookings, updateBooking, deleteBooking, updateBookingStatus } from "../../api/bookingApi";
import { getRoomById, updateRoom } from "../../api/roomApi";

const ALL_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];

const STATUS_STYLES = {
  "Pending": { background: "#fef9c3", color: "#ca8a04", label: "Chờ xác nhận" },
  "Confirmed": { background: "#dbeafe", color: "#2563eb", label: "Đã xác nhận" },
  "Cancelled": { background: "#fee2e2", color: "#dc2626", label: "Đã hủy" },
  "Completed": { background: "#dcfce7", color: "#16a34a", label: "Hoàn thành" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { background: "#f1f5f9", color: "#475569", label: status };
  return (
    <span style={{ background: style.background, color: style.color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
      {style.label}
    </span>
  );
}

function formatPrice(p) {
  return Number(p).toLocaleString("vi-VN") + "đ";
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function StatusDropdown({ bookingId, currentStatus, onChangeStatus, index, total }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Mở lên trên nếu là các mục cuối danh sách để tránh bị che
  const isLastItems = total > 3 && index >= total - 2;
  const dropdownStyle = isLastItems 
    ? { bottom: "calc(100% + 6px)", right: 0 } 
    : { top: "calc(100% + 6px)", right: 0 };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, padding: "6px 10px", border: "1.5px solid #e8e0d0", borderRadius: 8, background: "#f5f0e8", fontFamily: "inherit", fontSize: 12, fontWeight: 600, color: "#1a1510", cursor: "pointer" }}
      >
        Trạng thái <span style={{ fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", ...dropdownStyle, background: "#fff", border: "1.5px solid #e8e0d0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, minWidth: 140, overflow: "hidden" }}>
          {ALL_STATUSES.map(s => (
            <div
              key={s}
              onClick={() => { onChangeStatus(bookingId, s); setOpen(false); }}
              style={{ padding: "10px 16px", fontSize: 13, fontWeight: currentStatus === s ? 700 : 500, color: currentStatus === s ? "#c9920a" : "#1a1510", background: currentStatus === s ? "#fef9ee" : "transparent", cursor: "pointer" }}
              onMouseEnter={e => { if (currentStatus !== s) e.currentTarget.style.background = "#f5f0e8"; }}
              onMouseLeave={e => { if (currentStatus !== s) e.currentTarget.style.background = "transparent"; }}
            >
              {STATUS_STYLES[s]?.label || s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings({ page: 1, pageSize: 100 });
      const bArray = Array.isArray(data) ? data : data.data || data.items || [];

      setBookings(bArray.map(b => {
        const roomObj = b.room || b.Room;
        const userObj = b.user || b.User;
        return {
          id: b.id || b.Id,
          // Tên khách hàng: ưu tiên guestName, sau đó tới fullName từ object User
          guestName: b.guestName || b.GuestName || userObj?.fullName || userObj?.FullName || b.customerName || b.CustomerName || b.userName || b.UserName || "Khách",
          guestPhone: b.guestPhone || b.GuestPhone || userObj?.phoneNumber || userObj?.PhoneNumber || "N/A",
          guestEmail: b.guestEmail || b.GuestEmail || userObj?.email || userObj?.Email || "",
          // Tên phòng: ưu tiên roomName, sau đó tới number từ object Room
          roomName: b.roomName || b.RoomName || roomObj?.number || roomObj?.Number || b.roomNumber || b.RoomNumber || "N/A",
          roomId: b.roomId || b.RoomId || roomObj?.id || roomObj?.Id,
          room: roomObj,
          checkIn: b.checkInDate || b.CheckInDate || b.checkIn || b.CheckIn,
          checkOut: b.checkOutDate || b.CheckOutDate || b.checkOut || b.CheckOut,
          totalPrice: b.totalPrice || b.TotalPrice || b.amount || b.Amount || 0,
          status: b.status || b.Status || "Pending",
        };
      }));
    } catch (err) {
      console.log(err);
      alert("Lấy danh sách đặt phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const syncRoomStatus = async (roomId, bookingStatus) => {
    if (!roomId) return;
    try {
      const room = await getRoomById(roomId);
      if (!room) return;

      let newRoomStatus = room.status;
      if (bookingStatus === "Confirmed") {
        newRoomStatus = "Đang sử dụng";
      } else if (bookingStatus === "Cancelled" || bookingStatus === "Completed") {
        newRoomStatus = "Trống";
      }

      if (newRoomStatus !== room.status) {
        const dto = {
          Number: room.number,
          Floor: room.floor,
          Capacity: room.capacity,
          BedType: room.bedType,
          Area: room.area,
          PricePerNight: room.pricePerNight,
          Status: newRoomStatus,
          Amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : (room.amenities || ""),
          RoomTypeId: room.roomTypeId,
        };
        await updateRoom(roomId, dto);
      }
    } catch (err) {
      console.error("Sync room status failed:", err);
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      // Sử dụng API mới cập nhật trạng thái (PATCH)
      await updateBookingStatus(id, newStatus);
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: newStatus } : b));
      
      const booking = bookings.find(b => b.id === id);
      if (booking?.roomId) {
        await syncRoomStatus(booking.roomId, newStatus);
      }
    } catch (err) {
      alert("Đổi trạng thái thất bại: " + err);
    }
  };

  const deleteBookingHandler = async (id) => {
    if (!window.confirm("Xóa đơn đặt phòng này?")) return;
    try {
      const booking = bookings.find(b => b.id === id);
      await deleteBooking(id);
      
      // Khi xóa đặt phòng, chuyển phòng thành trống
      if (booking?.roomId) {
        await syncRoomStatus(booking.roomId, "Cancelled");
      }
      
      setBookings(bs => bs.filter(b => b.id !== id));
    } catch (err) {
      alert("Xóa thất bại: " + err);
    }
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.guestName.toLowerCase().includes(q) || b.guestPhone.includes(q) || String(b.id).includes(q);
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>;

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f5f0e8", minHeight: "100vh", padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1510" }}>Quản lý Đặt phòng</div>
        <div style={{ fontSize: 13, color: "#7a6e62", marginTop: 3 }}>Theo dõi và quản lý các đơn đặt phòng của khách sạn</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Tổng đơn đặt", value: bookings.length, icon: "📋", color: "#3b82f6" },
          { label: "Chờ xác nhận", value: bookings.filter(b => b.status === "Pending").length, icon: "⏳", color: "#ca8a04" },
          { label: "Đã xác nhận", value: bookings.filter(b => b.status === "Confirmed").length, icon: "✅", color: "#2563eb" },
          { label: "Đã hủy", value: bookings.filter(b => b.status === "Cancelled").length, icon: "❌", color: "#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1.5px solid #e8e0d0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, color: "#7a6e62", fontWeight: 500 }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1510" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1.5px solid #e8e0d0", display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7a6e62", fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn, tên khách hoặc SĐT..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "9px 12px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", minWidth: 160 }}>
          <option value="">Tất cả trạng thái</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_STYLES[s]?.label || s}</option>)}
        </select>
      </div>

      {/* Bookings List (Table-like grid) */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e8e0d0", overflow: "visible", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr 1fr", padding: "16px 20px", background: "#f5f0e8", borderBottom: "1.5px solid #e8e0d0", fontSize: 12.5, fontWeight: 700, color: "#7a6e62" }}>
          <div>KHÁCH HÀNG</div>
          <div>PHÒNG</div>
          <div>THỜI GIAN</div>
          <div>TỔNG TIỀN</div>
          <div>TRẠNG THÁI</div>
          <div style={{ textAlign: "right" }}>THAO TÁC</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7a6e62", fontSize: 14 }}>Không tìm thấy đơn đặt phòng nào</div>
        ) : (
          filtered.map((b, i) => (
            <div key={b.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #e8e0d0" : "none", alignItems: "center", fontSize: 13, color: "#1a1510" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{b.guestName}</div>
                <div style={{ color: "#7a6e62", fontSize: 12 }}>{b.guestPhone}</div>
                {b.guestEmail && <div style={{ color: "#7a6e62", fontSize: 11, fontStyle: "italic" }}>{b.guestEmail}</div>}
              </div>
              <div style={{ fontWeight: 600, color: "#c9920a" }}>{b.roomName}</div>
              <div style={{ color: "#7a6e62", fontSize: 12.5, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: "#1a1510" }}>In:</span> {formatDate(b.checkIn)}<br />
                <span style={{ fontWeight: 600, color: "#1a1510" }}>Out:</span> {formatDate(b.checkOut)}
              </div>
              <div style={{ fontWeight: 700 }}>{formatPrice(b.totalPrice)}</div>
              <div><StatusBadge status={b.status} /></div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
                <StatusDropdown 
                  bookingId={b.id} 
                  currentStatus={b.status} 
                  onChangeStatus={changeStatus} 
                  index={i} 
                  total={filtered.length} 
                />
                <button onClick={() => deleteBookingHandler(b.id)} style={{ padding: "6px", border: "none", borderRadius: 8, background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: 14 }}>
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}