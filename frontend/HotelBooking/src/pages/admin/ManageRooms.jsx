import { useState, useRef, useEffect } from "react";
import { createRoom, updateRoom, deleteRoomApi, getRooms } from "../../api/roomApi";
import { getRoomTypes } from "../../api/roomTypeApi";

// Local images for consistency
import imgRoom1 from '../../assets/images/room1.jpg';
import imgRoom2 from '../../assets/images/room2.jpg';
import imgRoom3 from '../../assets/images/room3.jpg';
import imgRoom4 from '../../assets/images/room4.jpg';
import imgRoom5 from '../../assets/images/room5.jpg';

const defaultImages = [imgRoom1, imgRoom2, imgRoom3, imgRoom4, imgRoom5];
const emptyForm = { name: "", roomTypeId: "", floor: "", capacity: "", bed: "", area: "", price: "", status: "Trống", amenities: "" };

const ALL_STATUSES = ["Trống", "Đang sử dụng", "Bảo trì", "Dọn dẹp"];

const STATUS_STYLES = {
  "Trống": { background: "#dcfce7", color: "#16a34a" },
  "Đang sử dụng": { background: "#dbeafe", color: "#2563eb" },
  "Bảo trì": { background: "#fff7ed", color: "#c2410c" },
  "Dọn dẹp": { background: "#f3e8ff", color: "#7c3aed" },
};

function formatPrice(p) {
  return Number(p).toLocaleString("vi-VN") + "đ";
}

function StatusBadge({ status }) {
  return (
    <span style={{ ...STATUS_STYLES[status], fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
      {status}
    </span>
  );
}

// Dropdown status picker giống ảnh
function StatusDropdown({ roomId, currentStatus, onChangeStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", border: "1.5px solid #e8e0d0", borderRadius: 8, background: "#f5f0e8", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: "#1a1510", cursor: "pointer" }}
      >
        Đổi trạng thái <span style={{ fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0, background: "#fff", border: "1.5px solid #e8e0d0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, minWidth: 160, overflow: "hidden" }}>
          {ALL_STATUSES.map(s => (
            <div
              key={s}
              onClick={() => { onChangeStatus(roomId, s); setOpen(false); }}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: currentStatus === s ? 700 : 500,
                color: currentStatus === s ? "#c9920a" : "#1a1510",
                background: currentStatus === s ? "#fef9ee" : "transparent",
                cursor: "pointer", transition: "background 0.1s",
              }}
              onMouseEnter={e => { if (currentStatus !== s) e.currentTarget.style.background = "#f5f0e8"; }}
              onMouseLeave={e => { if (currentStatus !== s) e.currentTarget.style.background = "transparent"; }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomCard({ room, onDelete, onEdit, onChangeStatus }) {
  const showAmenities = room.amenities.slice(0, 3);
  const extra = room.amenities.length - 3;
  const roomImg = defaultImages[room.id % defaultImages.length] || imgRoom1;

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e8e0d0", padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
        <img 
          src={roomImg} 
          alt={room.name} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1510" }}>{room.name}</span>
          <StatusBadge status={room.status} />
        </div>
      <div style={{ fontSize: 12, color: "#7a6e62", marginBottom: 14 }}>{room.type}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {[["Tầng:", room.floor], ["Sức chứa:", room.capacity], ["Loại giường:", room.bed], ["Diện tích:", room.area]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#7a6e62" }}>{label}</span>
            <span style={{ fontWeight: 600, color: "#1a1510" }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#c9920a" }}>
        {formatPrice(room.price)} <span style={{ fontSize: 13, fontWeight: 500, color: "#7a6e62" }}>/đêm</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0 16px" }}>
        {showAmenities.map(a => (
          <span key={a} style={{ background: "#1a1510", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{a}</span>
        ))}
        {extra > 0 && <span style={{ background: "#e8e0d0", color: "#7a6e62", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>+{extra}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #e8e0d0", paddingTop: 14 }}>
        <StatusDropdown roomId={room.id} currentStatus={room.status} onChangeStatus={onChangeStatus} />
        <button onClick={() => onEdit(room)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: "6px 8px", borderRadius: 7 }}>✏️</button>
        <button onClick={() => onDelete(room.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: "6px 8px", borderRadius: 7 }}>🗑</button>
      </div>
    </div>
  </div>
  );
}

function Modal({ open, onClose, onSave, form, setForm, editMode, errors, roomTypes }) {

  if (!open) return null;

  const inputStyle = (hasErr) => ({
    width: "100%", padding: "9px 12px", border: `1.5px solid ${hasErr ? "#ef4444" : "#e8e0d0"}`,
    borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510",
    background: hasErr ? "#fff5f5" : "#f5f0e8", outline: "none", boxSizing: "border-box",
  });

  const field = (label, key, type = "text", placeholder = "", min = "") => (
    <div>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: errors[key] ? "#ef4444" : "#7a6e62", marginBottom: 5 }}>{label}</label>
      <input
        type={type}
        min={min}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={inputStyle(!!errors[key])}
      />
      {errors[key] && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  const selectField = (label, key, options) => (
    <div>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#7a6e62", marginBottom: 5 }}>{label}</label>
      <select
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none" }}
      >
        {options.map(o => {
          const isObj = typeof o === 'object';
          const val = isObj ? o.value : o;
          const lbl = isObj ? o.label : o;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, width: 460, maxWidth: "95vw", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1510", marginBottom: 20 }}>
          {editMode ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {field("Số phòng", "name", "text", "VD: Phòng 101")}
          {selectField("Loại phòng", "roomTypeId", roomTypes.map(rt => ({
            label: rt.name,
            value: rt.id
          })))}
          {field("Tầng", "floor", "number", "VD: 1", "1")}
          {field("Sức chứa", "capacity", "number", "VD: 2", "1")}
          {field("Loại giường", "bed", "text", "VD: 1 giường đôi")}
          {field("Diện tích (m²)", "area", "number", "VD: 25", "1")}
          {field("Giá / đêm (đ)", "price", "number", "VD: 2800000", "0")}
          {selectField("Trạng thái", "status", ALL_STATUSES)}
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: errors.amenities ? "#ef4444" : "#7a6e62", marginBottom: 5 }}>Tiện nghi (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={form.amenities || ""}
              onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))}
              placeholder="VD: Wifi tốc độ cao, Smart TV, Bồn tắm"
              style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${errors.amenities ? "#ef4444" : "#e8e0d0"}`, borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: errors.amenities ? "#fff5f5" : "#f5f0e8", outline: "none", boxSizing: "border-box" }}
            />
            {errors.amenities && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.amenities}</div>}
          </div>
        </div>

        {/* Nút Hủy / Lưu */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#e8e0d0", color: "#1a1510", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
          <button onClick={onSave} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#c9920a", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Lưu phòng</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const data = await getRooms({ page: 1, pageSize: 50 });

      // 👇 đảm bảo luôn là array
      const roomsArray = Array.isArray(data)
        ? data
        : data.data || data.items || [];

      setRooms(roomsArray.map(r => ({
        id: r.id,
        name: r.number,
        type: r.roomTypeName,
        floor: `Tầng ${r.floor}`,
        capacity: `${r.capacity} người`,
        bed: r.bedType,
        area: `${r.area}m²`,
        price: r.pricePerNight,
        status: r.status,
        amenities: r.amenities ?? [],
        roomTypeId: r.roomTypeId,
        rawFloor: r.floor,
        rawCapacity: r.capacity,
        rawArea: r.area,
      })));

    } catch (err) {
      console.log(err);
      alert("Lấy danh sách phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchRooms();
      try {
        const types = await getRoomTypes();
        setRoomTypes(types);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  const validate = () => {
    const errs = {};
    const trimName = form.name?.trim() || "";
    if (!trimName) {
      errs.name = "Vui lòng nhập số phòng.";
    } else {
      const duplicate = rooms.find(r => r.name.trim().toLowerCase() === trimName.toLowerCase() && r.id !== editId);
      if (duplicate) errs.name = `"${trimName}" đã tồn tại.`;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = "Giá phòng phải lớn hơn 0.";
    if (!form.bed || form.bed.trim() === "")
      errs.bed = "Vui lòng nhập loại giường.";
    if (!form.area || isNaN(form.area) || Number(form.area) <= 0)
      errs.area = "Diện tích phải lớn hơn 0.";
    if (!form.floor || isNaN(form.floor) || Number(form.floor) <= 0)
      errs.floor = "Tầng phải hợp lệ.";
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0)
      errs.capacity = "Sức chứa phải lớn hơn 0.";
    return errs;
  };
  const saveRoom = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Map field FE → DTO backend
    const dto = {
      Number: form.name.trim(),
      Floor: parseInt(form.floor) || 1,
      Capacity: parseInt(form.capacity) || 1,
      BedType: form.bed.trim(),
      Area: parseFloat(form.area) || 1,
      PricePerNight: parseInt(form.price) || 0,
      Status: form.status,
      Amenities: form.amenities || "",
      RoomTypeId: parseInt(form.roomTypeId) || 1,
    };

    try {
      if (editId) {
        await updateRoom(editId, dto);
      } else {
        await createRoom(dto);
      }
      await fetchRooms(); // reload từ API
      closeModal();
    } catch (err) {
      alert("Lỗi: " + err);
    }
  };

  // ── Xóa phòng ────────────────────────────────────────────────────
  const deleteRoom = async (id) => {
    if (!window.confirm("Xóa phòng này?")) return;
    try {
      await deleteRoomApi(id);
      setRooms(rs => rs.filter(r => r.id !== id));
    } catch (err) {
      alert("Xóa thất bại: " + err);
    }
  };

  // ── Đổi trạng thái ───────────────────────────────────────────────
  const changeStatus = async (id, newStatus) => {
    try {
      const room = rooms.find(r => r.id === id);
      if (!room) return;
      
      // Gửi đầy đủ dữ liệu phòng khi đổi trạng thái
      const dto = {
        Number: room.name,
        Floor: parseInt(room.rawFloor) || 1,
        Capacity: parseInt(room.rawCapacity) || 1,
        BedType: room.bed,
        Area: parseFloat(room.rawArea) || 1,
        PricePerNight: parseInt(room.price) || 0,
        Status: newStatus,
        Amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : room.amenities || "",
        RoomTypeId: parseInt(room.roomTypeId) || 1,
      };
      console.log("DEBUG changeStatus:", { room, dto });
      
      await updateRoom(id, dto);
      setRooms(rs =>
        rs.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    } catch (err) {
      alert("Đổi trạng thái thất bại: " + err);
    }
  };

  const openAdd = () => { setForm({ ...emptyForm, roomTypeId: roomTypes[0]?.id || "" }); setEditId(null); setErrors({}); setModalOpen(true); };
  const openEdit = (room) => { setForm({ ...room, name: room.name, floor: room.rawFloor, capacity: room.rawCapacity, area: room.rawArea, amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : room.amenities || "" }); setEditId(room.id); setErrors({}); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setErrors({}); };

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q))
      && (!filterType || r.type === filterType)
      && (!filterStatus || r.status === filterStatus);
  });

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>;



  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f5f0e8", minHeight: "100vh", padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1510" }}>Quản lý phòng</div>
          <div style={{ fontSize: 13, color: "#7a6e62", marginTop: 3 }}>Quản lý thông tin và trạng thái phòng khách sạn</div>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, background: "#c9920a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          + Thêm phòng
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Tổng số phòng", value: rooms.length, icon: "🛏", iconColor: "#3b82f6" },
          { label: "Phòng trống", value: rooms.filter(r => r.status === "Trống").length, dot: "#22c55e" },
          { label: "Đang sử dụng", value: rooms.filter(r => r.status === "Đang sử dụng").length, dot: "#3b82f6" },
          { label: "Bảo trì", value: rooms.filter(r => r.status === "Bảo trì").length, icon: "🔧", iconColor: "#f97316" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1.5px solid #e8e0d0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, color: "#7a6e62", fontWeight: 500 }}>{s.label}</span>
              {s.icon
                ? <span style={{ fontSize: 22, color: s.iconColor }}>{s.icon}</span>
                : <span style={{ width: 12, height: 12, background: s.dot, borderRadius: "50%", display: "inline-block" }} />}
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
            placeholder="Tìm kiếm theo số phòng hoặc loại..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        {[
          { value: filterType, onChange: setFilterType, options: ["", ...roomTypes.map(rt => rt.name)], labels: ["Tất cả loại phòng", ...roomTypes.map(rt => rt.name)] },
          { value: filterStatus, onChange: setFilterStatus, options: ["", ...ALL_STATUSES], labels: ["Tất cả trạng thái", ...ALL_STATUSES] },
        ].map((s, i) => (
          <select key={i} value={s.value} onChange={e => s.onChange(e.target.value)}
            style={{ padding: "9px 12px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", minWidth: 160 }}>
            {s.options.map((o, j) => <option key={o} value={o}>{s.labels[j]}</option>)}
          </select>
        ))}
      </div>

      {/* Rooms grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {filtered.map(room => (
          <RoomCard key={room.id} room={room} onDelete={deleteRoom} onEdit={openEdit} onChangeStatus={changeStatus} />
        ))}
      </div>

      <Modal open={modalOpen} onClose={closeModal} onSave={saveRoom} form={form} setForm={setForm} editMode={!!editId} errors={errors} roomTypes={roomTypes} />
    </div>
  );
}