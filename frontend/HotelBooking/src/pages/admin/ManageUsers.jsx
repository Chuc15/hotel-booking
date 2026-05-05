import { useState, useEffect, useRef } from "react";
import { getUsers, updateUserRole, deleteUser, updateUserStatus } from "../../api/userApi";

const ALL_ROLES = ["User", "Admin"];

const STATUS_STYLES = {
  true: { background: "#dcfce7", color: "#16a34a", text: "Active" }, // active
  false: { background: "#fee2e2", color: "#dc2626", text: "Blocked" }, // blocked
};

function StatusBadge({ active }) {
  const style = STATUS_STYLES[active];
  return (
    <span style={{ background: style.background, color: style.color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
      {style.text}
    </span>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "Admin";
  return (
    <span style={{ background: isAdmin ? "#fef3c7" : "#f1f5f9", color: isAdmin ? "#d97706" : "#475569", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
      {role || "User"}
    </span>
  );
}

function RoleDropdown({ userId, currentRole, onChangeRole }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
        Đổi Role <span style={{ fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, background: "#fff", border: "1.5px solid #e8e0d0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, minWidth: 120, overflow: "hidden" }}>
          {ALL_ROLES.map(r => (
            <div
              key={r}
              onClick={() => { onChangeRole(userId, r); setOpen(false); }}
              style={{ padding: "10px 16px", fontSize: 13, fontWeight: currentRole === r ? 700 : 500, color: currentRole === r ? "#c9920a" : "#1a1510", background: currentRole === r ? "#fef9ee" : "transparent", cursor: "pointer" }}
              onMouseEnter={e => { if (currentRole !== r) e.currentTarget.style.background = "#f5f0e8"; }}
              onMouseLeave={e => { if (currentRole !== r) e.currentTarget.style.background = "transparent"; }}
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers({ page: 1, pageSize: 100 });
      const usersArray = Array.isArray(data) ? data : data.data || data.items || [];
      setUsers(usersArray.map(u => ({
        id: u.id,
        name: u.fullName || u.name || "N/A",
        email: u.email || "N/A",
        phone: u.phoneNumber || "N/A",
        role: u.role || "User",
        active: u.isActive !== undefined ? u.isActive : true,
      })));
    } catch (err) {
      console.log(err);
      alert("Lấy danh sách người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      setUsers(us => us.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Đổi role thất bại: " + err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateUserStatus(id, newStatus);
      setUsers(us => us.map(u => u.id === id ? { ...u, active: newStatus } : u));
    } catch (err) {
      alert("Đổi trạng thái thất bại: " + err);
    }
  };

  const deleteUserHandler = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      setUsers(us => us.filter(u => u.id !== id));
    } catch (err) {
      alert("Xóa thất bại: " + err);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatus = filterStatus === "" ? true : String(u.active) === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>;

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f5f0e8", minHeight: "100vh", padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1510" }}>Quản lý người dùng</div>
        <div style={{ fontSize: 13, color: "#7a6e62", marginTop: 3 }}>Quản lý tài khoản, vai trò và trạng thái hoạt động</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Tổng người dùng", value: users.length, icon: "👥", color: "#3b82f6" },
          { label: "Admin", value: users.filter(u => u.role === "Admin").length, icon: "🛡️", color: "#d97706" },
          { label: "Đang hoạt động", value: users.filter(u => u.active).length, icon: "✅", color: "#16a34a" },
          { label: "Đã khóa", value: users.filter(u => !u.active).length, icon: "🔒", color: "#dc2626" },
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
            placeholder="Tìm kiếm theo tên hoặc email..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        {[
          { value: filterRole, onChange: setFilterRole, options: ["", "User", "Admin"], labels: ["Tất cả vai trò", "User", "Admin"] },
          { value: filterStatus, onChange: setFilterStatus, options: ["", "true", "false"], labels: ["Tất cả trạng thái", "Active", "Blocked"] },
        ].map((s, i) => (
          <select key={i} value={s.value} onChange={e => s.onChange(e.target.value)}
            style={{ padding: "9px 12px", border: "1.5px solid #e8e0d0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#1a1510", background: "#f5f0e8", outline: "none", minWidth: 160 }}>
            {s.options.map((o, j) => <option key={o} value={o}>{s.labels[j]}</option>)}
          </select>
        ))}
      </div>

      {/* Users List (Table-like grid) */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e8e0d0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "16px 20px", background: "#f5f0e8", borderBottom: "1.5px solid #e8e0d0", fontSize: 12.5, fontWeight: 700, color: "#7a6e62" }}>
          <div>NGƯỜI DÙNG</div>
          <div>SỐ ĐIỆN THOẠI</div>
          <div>VAI TRÒ</div>
          <div>TRẠNG THÁI</div>
          <div style={{ textAlign: "right" }}>THAO TÁC</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#7a6e62", fontSize: 14 }}>Không tìm thấy người dùng nào</div>
        ) : (
          filtered.map((u, i) => (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #e8e0d0" : "none", alignItems: "center", fontSize: 13, color: "#1a1510" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{u.name}</div>
                <div style={{ color: "#7a6e62", fontSize: 12 }}>{u.email}</div>
              </div>
              <div>{u.phone}</div>
              <div><RoleBadge role={u.role} /></div>
              <div><StatusBadge active={u.active} /></div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
                <RoleDropdown userId={u.id} currentRole={u.role} onChangeRole={changeRole} />
                <button onClick={() => toggleStatus(u.id, u.active)} style={{ padding: "6px 12px", border: "1.5px solid #e8e0d0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: u.active ? "#dc2626" : "#16a34a" }}>
                  {u.active ? "Khóa" : "Mở khóa"}
                </button>
                <button onClick={() => deleteUserHandler(u.id)} style={{ padding: "6px", border: "none", borderRadius: 8, background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: 14 }}>
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