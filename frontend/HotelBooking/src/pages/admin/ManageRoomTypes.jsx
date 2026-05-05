import { useState, useEffect } from "react";
import { createRoomType, updateRoomType, deleteRoomType, getRoomTypes } from "../../api/roomTypeApi";

const emptyForm = {
  name: "",
  description: "",
  basePrice: "",
  maxOccupancy: "",
  amenities: ""
};

function RoomTypeCard({ roomType, onDelete, onEdit }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e8e0d0", padding: 20, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1510", marginBottom: 8 }}>{roomType.name}</div>
      <div style={{ fontSize: 13, color: "#7a6e62", marginBottom: 16, flex: 1 }}>
        {roomType.description || "Không có mô tả"}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #e8e0d0", paddingTop: 14 }}>
        <button onClick={() => onEdit(roomType)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: "6px 8px", borderRadius: 7 }}>✏️</button>
        <button onClick={() => onDelete(roomType.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, padding: "6px 8px", borderRadius: 7 }}>🗑</button>
      </div>
    </div>
  );
}

function Modal({ open, onClose, onSave, form, setForm, editMode, errors }) {
  if (!open) return null;

  const inputStyle = (hasErr) => ({
    width: "100%", padding: "9px 12px", border: `1.5px solid ${hasErr ? "#ef4444" : "#e8e0d0"}`,
    borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510",
    background: hasErr ? "#fff5f5" : "#f5f0e8", outline: "none", boxSizing: "border-box",
  });

  const field = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: errors[key] ? "#ef4444" : "#7a6e62", marginBottom: 5 }}>{label}</label>
      {type === "textarea" ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          style={{ ...inputStyle(!!errors[key]), minHeight: 80, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          style={inputStyle(!!errors[key])}
        />
      )}
      {errors[key] && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, width: 460, maxWidth: "95vw", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1510", marginBottom: 20 }}>
          {editMode ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}
        </div>

        {field("Tên loại phòng", "name", "text", "VD: Standard Room")}
        {field("Mô tả", "description", "textarea", "VD: Phòng tiêu chuẩn phù hợp cho 2 người...")}
        {field("Giá cơ bản", "basePrice", "number", "VD: 500000")}
        {field("Sức chứa tối đa", "maxOccupancy", "number", "VD: 2")}
        {field("Tiện ích", "amenities", "textarea", "VD: Wifi, TV, Điều hòa...")}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#e8e0d0", color: "#1a1510", fontWeight: 600, cursor: "pointer" }}>Hủy</button>
          <button onClick={onSave} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#c9920a", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Lưu loại phòng</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageRoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await getRoomTypes();

      const rtArray = Array.isArray(data) ? data : data.data || data.items || [];
      setRoomTypes(rtArray.map(rt => ({
        id: rt.id,
        name: rt.name,
        description: rt.description || "",
        basePrice: rt.basePrice,
        maxOccupancy: rt.maxOccupancy,
        amenities: rt.amenities || ""
      })));
    } catch (err) {
      console.log(err);
      alert("Lấy danh sách loại phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const validate = () => {
    const errs = {};
    const trimName = form.name?.trim() || "";

    if (!trimName) {
      errs.name = "Vui lòng nhập tên loại phòng.";
    } else {
      const duplicate = roomTypes.find(
        rt => rt.name.trim().toLowerCase() === trimName.toLowerCase() && rt.id !== editId
      );
      if (duplicate) errs.name = `Loại phòng "${trimName}" đã tồn tại.`;
    }

    if (!form.basePrice || Number(form.basePrice) < 0) {
      errs.basePrice = "Giá phải >= 0";
    }

    if (!form.maxOccupancy || Number(form.maxOccupancy) < 1 || Number(form.maxOccupancy) > 20) {
      errs.maxOccupancy = "Sức chứa từ 1 đến 20";
    }

    return errs;
  };

  const saveRoomType = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const dto = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      basePrice: Number(form.basePrice),
      maxOccupancy: Number(form.maxOccupancy),
      amenities: form.amenities?.trim() || null,
    };

    try {
      if (editId) {
        await updateRoomType(editId, dto);
      } else {
        await createRoomType(dto);
      }
      await fetchRoomTypes();
      closeModal();
    } catch (err) {
      alert("Lỗi: " + err);
    }
  };

  const deleteRoomTypeHandler = async (id) => {
    if (!window.confirm("Xóa loại phòng này?")) return;
    try {
      await deleteRoomType(id);
      setRoomTypes(rts => rts.filter(rt => rt.id !== id));
    } catch (err) {
      alert("Xóa thất bại: " + err);
    }
  };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setErrors({}); setModalOpen(true); };
  const openEdit = (roomType) => {
    setForm({
      name: roomType.name || "",
      description: roomType.description || "",
      basePrice: roomType.basePrice || "",
      maxOccupancy: roomType.maxOccupancy || "",
      amenities: roomType.amenities || ""
    });
    setEditId(roomType.id);
    setErrors({});
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setErrors({}); };

  const filtered = roomTypes.filter(rt => {
    const q = search.toLowerCase();
    return !q || rt.name.toLowerCase().includes(q) || rt.description.toLowerCase().includes(q);
  });

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>;

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f5f0e8", minHeight: "100vh", padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1510" }}>Quản lý loại phòng</div>
          <div style={{ fontSize: 13, color: "#7a6e62", marginTop: 3 }}>Thêm, sửa, xóa danh mục loại phòng</div>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 8, background: "#c9920a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          + Thêm loại phòng
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1.5px solid #e8e0d0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, color: "#7a6e62", fontWeight: 500 }}>Tổng loại phòng</span>
            <span style={{ fontSize: 22, color: "#3b82f6" }}>🏷️</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1510" }}>{roomTypes.length}</div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1.5px solid #e8e0d0", display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7a6e62", fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm loại phòng..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* RoomTypes grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {filtered.map(rt => (
          <RoomTypeCard key={rt.id} roomType={rt} onDelete={deleteRoomTypeHandler} onEdit={openEdit} />
        ))}
      </div>

      <Modal open={modalOpen} onClose={closeModal} onSave={saveRoomType} form={form} setForm={setForm} editMode={!!editId} errors={errors} />
    </div>
  );
}
