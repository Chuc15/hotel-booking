import { useState, useEffect } from "react";
import { getBookings } from "../../api/bookingApi";
import { getRooms } from "../../api/roomApi";
import { getUsers } from "../../api/userApi";
import * as XLSX from "xlsx";
import "./css/Dashboard.css";

export default function Dashboard() {
    const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, totalRooms: 0, totalUsers: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [bRes, rRes, uRes] = await Promise.all([
                    getBookings({ page: 1, pageSize: 100 }),
                    getRooms({ page: 1, pageSize: 100 }),
                    getUsers({ page: 1, pageSize: 100 }),
                ]);

                const bookings = toArr(bRes);
                const rooms = toArr(rRes);
                const users = toArr(uRes);

                // Calculate Revenue
                const totalRevenue = bookings
                    .filter(b => !b.status?.toLowerCase().includes("cancel") && !b.status?.toLowerCase().includes("hủy"))
                    .reduce((s, b) => s + (b.totalPrice || b.totalAmount || 0), 0);

                // Group by customer for "Top Revenue Guests"
                const customerMap = {};
                bookings.forEach(b => {
                    if (b.status?.toLowerCase().includes("cancel") || b.status?.toLowerCase().includes("hủy")) return;
                    const name = b.guestName || b.userName || b.customerName || "Khách ẩn danh";
                    if (!customerMap[name]) {
                        customerMap[name] = { name, total: 0, count: 0 };
                    }
                    customerMap[name].total += (b.totalPrice || b.totalAmount || 0);
                    customerMap[name].count += 1;
                });

                const topSorted = Object.values(customerMap)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5);

                setRecentBookings(bookings.slice(0, 6));
                setTopCustomers(topSorted);
                setStats({
                    totalBookings: bookings.length,
                    revenue: totalRevenue,
                    totalRooms: rooms.length,
                    totalUsers: users.length
                });
            } catch (e) {
                console.error("Dashboard Error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const toArr = d => Array.isArray(d) ? d : d?.data || d?.items || [];
    const vnd = (n, compact = false) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        ...(compact ? { notation: "compact" } : {})
    }).format(n);

    // ── EXCEL EXPORT LOGIC ──
    const handleExport = () => {
        try {
            // 1. Prepare Data for Summary Sheet
            const summaryData = [
                { "Tiêu chí": "Tổng doanh thu", "Giá trị": stats.revenue },
                { "Tiêu chí": "Tổng lượt đặt phòng", "Giá trị": stats.totalBookings },
                { "Tiêu chí": "Tổng số phòng", "Giá trị": stats.totalRooms },
                { "Tiêu chí": "Tổng số khách hàng", "Giá trị": stats.totalUsers },
                { "Tiêu chí": "Ngày xuất báo cáo", "Giá trị": new Date().toLocaleString("vi-VN") }
            ];

            // 2. Prepare Data for Recent Bookings Sheet
            const bookingsData = recentBookings.map(b => ({
                "ID": b.id,
                "Khách hàng": b.guestName || b.userName || "N/A",
                "Phòng": b.roomNumber || b.roomName || "N/A",
                "Ngày đặt": new Date(b.createdAt || b.checkIn).toLocaleDateString("vi-VN"),
                "Tổng tiền": b.totalPrice || b.totalAmount || 0,
                "Trạng thái": b.status || "N/A"
            }));

            // 3. Prepare Data for Top Customers Sheet
            const customersData = topCustomers.map(c => ({
                "Tên khách hàng": c.name,
                "Số lần đặt": c.count,
                "Tổng chi tiêu": c.total
            }));

            // Create Workbook
            const wb = XLSX.utils.book_new();

            // Add Summary Sheet
            const wsSummary = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, wsSummary, "Tổng quan");

            // Add Bookings Sheet
            const wsBookings = XLSX.utils.json_to_sheet(bookingsData);
            XLSX.utils.book_append_sheet(wb, wsBookings, "Đơn đặt phòng");

            // Add Customers Sheet
            const wsCustomers = XLSX.utils.json_to_sheet(customersData);
            XLSX.utils.book_append_sheet(wb, wsCustomers, "Khách hàng VIP");

            // Save File
            const fileName = `Bao_Cao_Hotel_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

        } catch (error) {
            console.error("Export Error:", error);
            alert("Có lỗi khi xuất báo cáo!");
        }
    };

    if (loading) return <div className="dash-loading-wrap">Khởi tạo dữ liệu sang trọng...</div>;

    return (
        <div className="dashboard-container">
            
            {/* Header Section */}
            <div className="dash-header">
                <div className="dash-title">
                    <h1>Phân tích tổng quan</h1>
                    <p>Chào mừng trở lại, Admin. Đây là hiệu suất kinh doanh của bạn hôm nay.</p>
                </div>
                <div className="dash-actions">
                    <button 
                        onClick={handleExport}
                        style={{
                            padding: '12px 24px',
                            background: '#1A1510',
                            color: '#C9A84C',
                            border: 'none',
                            borderRadius: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <span>📥</span> Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="label"><span>💰</span> Tổng doanh thu</div>
                    <div className="value">{vnd(stats.revenue, true)}</div>
                    <div className="trend up">↑ 12.5% <span style={{fontWeight: 400, color: '#9a8e7d'}}>vs tháng trước</span></div>
                </div>

                <div className="stat-card">
                    <div className="label"><span>📋</span> Lượt đặt phòng</div>
                    <div className="value">{stats.totalBookings}</div>
                    <div className="trend up">↑ 8.2% <span style={{fontWeight: 400, color: '#9a8e7d'}}>hàng tuần</span></div>
                </div>

                <div className="stat-card">
                    <div className="label"><span>🏨</span> Công suất phòng</div>
                    <div className="value">{Math.round((stats.totalBookings / (stats.totalRooms || 1)) * 100)}%</div>
                    <div className="trend down">↓ 2.1% <span style={{fontWeight: 400, color: '#9a8e7d'}}>hôm nay</span></div>
                </div>

                <div className="stat-card">
                    <div className="label"><span>👥</span> Khách hàng</div>
                    <div className="value">{stats.totalUsers}</div>
                    <div className="trend up">↑ 15% <span style={{fontWeight: 400, color: '#9a8e7d'}}>tháng này</span></div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-content-grid">
                
                {/* Recent Bookings Table */}
                <div className="panel-card">
                    <div className="panel-header">
                        <h2>Giao dịch đặt phòng gần đây</h2>
                        <span style={{color: '#C9A84C', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'}}>Xem tất cả →</span>
                    </div>
                    
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((b, i) => (
                                <tr key={b.id || i}>
                                    <td style={{fontWeight: 700}}>{b.guestName || b.userName || "Khách hàng"}</td>
                                    <td>{new Date(b.createdAt || b.checkIn).toLocaleDateString('vi-VN')}</td>
                                    <td style={{fontWeight: 700, color: '#1A1510'}}>{vnd(b.totalPrice || b.totalAmount || 0)}</td>
                                    <td>
                                        <span className={`status-tag ${b.status?.toLowerCase().includes('confirm') ? 'confirmed' : 'pending'}`}>
                                            {b.status || "Đang xử lý"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Revenue Customers */}
                <div className="panel-card">
                    <div className="panel-header">
                        <h2>Đối tác doanh thu cao</h2>
                    </div>
                    <div className="customer-list">
                        {topCustomers.length === 0 ? (
                            <p style={{textAlign: 'center', color: '#9a8e7d', padding: '40px 0'}}>Chưa có dữ liệu giao dịch</p>
                        ) : topCustomers.map((c, i) => (
                            <div className="customer-item" key={c.name}>
                                <div className="customer-avatar" style={{
                                    background: i === 0 ? '#1A1510' : '#f8f5ef',
                                    color: i === 0 ? '#C9A84C' : '#1A1510'
                                }}>
                                    {c.name[0].toUpperCase()}
                                </div>
                                <div className="customer-info">
                                    <h4>{c.name}</h4>
                                    <p>{c.count} lượt đặt phòng</p>
                                </div>
                                <div className="customer-rev">
                                    <span className="amount">{vnd(c.total, true)}</span>
                                    <span className="count">Tích lũy</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}