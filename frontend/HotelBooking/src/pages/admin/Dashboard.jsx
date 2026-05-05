export default function Dashboard() {
  const stats = [
    { title: "Tổng Booking", value: 120 },
    { title: "Doanh thu", value: "50,000,000đ" },
    { title: "Phòng", value: 35 },
    { title: "Người dùng", value: 80 },
  ];

  return (
    <div className="grid">
      {stats.map((item, index) => (
        <div className="card" key={index}>
          <h3>{item.title}</h3>
          <p className="big">{item.value}</p>
        </div>
      ))}
    </div>
  );
}