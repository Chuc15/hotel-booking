import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FOOTER_LINKS = {
  "Về khách sạn": [
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
    { label: "Tuyển dụng", href: "/" },
    { label: "Đánh giá khách hàng", href: "/reviews" },
  ],

  "Dịch vụ": [
    { label: "Đặt phòng", href: "/rooms" },
    { label: "Nhà hàng", href: "/" },
    { label: "Spa & Massage", href: "/" },
    { label: "Hồ bơi", href: "/" },
    { label: "Đưa đón sân bay", href: "/" },
  ],

  "Hỗ trợ": [
    { label: "Câu hỏi thường gặp (FAQ)", href: "/" },
    { label: "Chính sách hủy phòng", href: "/" },
    { label: "Chính sách bảo mật", href: "/" },
    { label: "Điều khoản sử dụng", href: "/" },
  ],

  "Khám phá": [
    { label: "Địa điểm du lịch", href: "/" },
    { label: "Blog du lịch", href: "/" },
    { label: "Ưu đãi & khuyến mãi", href: "/promotions" },
  ],
};

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
      </svg>
    ),
  },
];

const PAYMENT_METHODS = [
  { name: "Mastercard", bg: "#EB001B", logo: "MC" },
  { name: "Visa", bg: "#1A1F71", logo: "VISA" },
  { name: "JCB", bg: "#003087", logo: "JCB" },
  { name: "Amex", bg: "#2E77BC", logo: "AMEX" },
  { name: "VietQR", bg: "#E31E25", logo: "VQR" },
  { name: "Napas", bg: "#00447C", logo: "NPS" },
  { name: "ZaloPay", bg: "#0068FF", logo: "ZP" },
  { name: "VP Bank", bg: "#006633", logo: "VP" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

   

function FooterNav() {
  return (
    <div style={styles.navGrid}>
      {Object.entries(FOOTER_LINKS).map(([section, links]) => (
        <div key={section}>
          <h3 style={styles.navHeading}>{section}</h3>
          <ul style={styles.navList}>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} style={styles.navLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FooterBrand() {
  return (
    <div style={styles.brandCol}>
  {/* Logo */}
  <div style={styles.logo}>
    <span style={styles.logoText}>Grand Hotel</span>
    <span style={styles.logoIcon}>🏨</span>
  </div>

  {/* Certification / Trust */}
  <div style={styles.badges}>
    {["3★ Standard", "Đã đăng ký kinh doanh", "An toàn & sạch sẽ"].map((b) => (
      <div key={b} style={styles.badge}>{b}</div>
    ))}
  </div>

  {/* Contact quick */}
  <div style={styles.contactBox}>
    <p>📍 123 Phố Cổ, Hà Nội</p>
    <p>📞 0123 456 789</p>
    <p>✉️ info@grandhotel.com</p>
  </div>

  {/* CTA */}
  <a href="/rooms" style={styles.partnerBtn}>
    Đặt phòng ngay 🛎️
  </a>

  {/* Social */}
  <div style={styles.socialSection}>
    <p style={styles.socialLabel}>Kết nối với chúng tôi</p>
    <div style={styles.socialRow}>
      {SOCIAL_LINKS.map((s) => (
        <a key={s.name} href={s.href} style={styles.socialLink} title={s.name}>
          {s.icon}
        </a>
      ))}
    </div>
  </div>

  {/* Payments */}
  <div>
    <p style={styles.socialLabel}>Thanh toán hỗ trợ</p>
    <div style={styles.paymentGrid}>
      {PAYMENT_METHODS.map((p) => (
        <div key={p.name} style={{ ...styles.paymentCard, background: p.bg }}>
          <span style={styles.paymentLabel}>{p.logo}</span>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}

// ─── Main Footer ─────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer style={styles.footer}>
      

      <div style={styles.mainSection}>
        <div style={styles.mainInner}>
          <FooterBrand />
          <FooterNav />
        </div>
      </div>

      <div style={styles.downloadSection}>
        <div style={styles.downloadInner}>
          <div style={styles.downloadText}>
            <p style={styles.downloadLabel}>Tải app Grand Hotel</p>
            <p style={styles.downloadDescription}>
              Đặt phòng nhanh, nhận ưu đãi độc quyền và quản lý lịch trình ngay trên điện thoại.
            </p>
          </div>
          <div style={styles.storeLinks}>
  {/* App Store */}
  <a
    href="https://apps.apple.com/vn/app/190-booking-%C4%91%E1%BA%B7t-v%C3%A9-m%C3%A1y-bay/id6739488358"
    style={styles.storeBtn}
    target="_blank"
  >
    <img
      src="https://data.190booking.com/assets/img/menu/AppStore.svg"
      alt="App Store"
      style={styles.storeImg}
    />
  </a>

  {/* Google Play */}
  <a
    href="https://play.google.com/store/apps/details?id=com.vietnambooking.booking"
    style={styles.storeBtn}
    target="_blank"
  >
    <img
      src="https://data.190booking.com/assets/img/menu/GooglePlay.svg"
      alt="Google Play"
      style={styles.storeImg}
    />
  </a>
</div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          © {new Date().getFullYear()} Traveloka. Bảo lưu mọi quyền.
        </p>
        <div style={styles.bottomLinks}>
          {["Chính sách bảo mật", "Điều khoản sử dụng", "Cookie"].map((l) => (
            <a key={l} href="#" style={styles.bottomLink}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}



// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  footer: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#1A1510",
  },

  // Newsletter
  newsletterWrapper: {
    background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
    padding: "0",
    overflow: "hidden",
    position: "relative",
  },
  newsletterInner: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: 40,
    padding: "40px 32px",
  },
  appMockup: {
    flexShrink: 0,
    width: 180,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 16,
    backdropFilter: "blur(10px)",
  },
  mockupScreen: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  mockupBar: {
    height: 8,
    background: "rgba(255,255,255,0.5)",
    borderRadius: 4,
    marginBottom: 4,
  },
  mockupRow: {
    display: "flex",
    gap: 6,
  },
  mockupIcon: {
    flex: 1,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: "10px 0",
    textAlign: "center",
    fontSize: 18,
  },
  mockupIconSm: {
    flex: 1,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: "8px 0",
    textAlign: "center",
    fontSize: 14,
  },
  newsletterContent: {
    flex: 1,
    color: "white",
  },
  newsletterTitle: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.35,
    margin: "0 0 20px",
    color: "white",
  },
  emailForm: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  inputWrapper: {
    flex: 1,
    minWidth: 220,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "white",
    borderRadius: 8,
    padding: "0 14px",
    height: 44,
  },
  emailInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    color: "#333",
    background: "transparent",
  },
  subscribeBtn: {
    background: "#1A1510",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "0 24px",
    height: 44,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    flexShrink: 0,
    fontFamily: "inherit",
  },
  successMsg: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 14,
    marginBottom: 20,
    color: "white",
  },
  appTagline: {
    fontSize: 13,
    margin: "0 0 12px",
    opacity: 0.9,
  },
  appBtns: {
    display: "flex",
    gap: 10,
  },
  appBtn: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    textDecoration: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    border: "1px solid rgba(255,255,255,0.3)",
    transition: "background 0.2s",
  },

  // Main section
  mainSection: {
    background: "#2D2620",
  },
  mainInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "44px 32px",
    display: "flex",
    gap: 48,
    flexWrap: "wrap",
  },
  downloadSection: {
    background: "#1f1915",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  downloadInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "28px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
  },
  downloadText: {
    minWidth: 280,
    flex: "1 1 400px",
  },
  downloadLabel: {
    color: "#C9A84C",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin: 0,
  },
  downloadDescription: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 1.7,
    margin: "8px 0 0",
    maxWidth: 580,
  },
  storeImg: {
  height: "40px",
  objectFit: "contain",
},
 storeBtn: {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",

  padding: "10px 16px",
  borderRadius: "12px",

  background: "#000",          // nền đen chuẩn App Store
  color: "#fff",

  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "600",

  border: "1px solid rgba(255,255,255,0.2)",

  transition: "all 0.25s ease",
  cursor: "pointer"
},
  storeBtnHover: {
    background: "rgba(255,255,255,0.16)",
  },
  storeIcon: {
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    background: "rgba(255,255,255,0.18)",
    color: "white",
    fontSize: 14,
  },
  storeText: {
    flex: 1,
    textAlign: "left",
  },

  // Brand column
  brandCol: {
    width: 240,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.5px",
  },
  logoIcon: {
    fontSize: 24,
    marginLeft: 2,
    color: "#C9A84C",
  },
  badges: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  badge: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  partnerBtn: {
    display: "inline-block",
    background: "transparent",
    border: "2px solid #C9A84C",
    color: "#C9A84C",
    borderRadius: 24,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s",
    textAlign: "center",
  },
  socialSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  socialLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: 600,
  },
  socialRow: {
    display: "flex",
    gap: 10,
  },
  socialLink: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textDecoration: "none",
    transition: "background 0.2s",
  },
  paymentGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  paymentCard: {
    width: 50,
    height: 32,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  paymentLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "white",
    letterSpacing: "0.3px",
  },

  // Nav grid
  navGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "32px 24px",
    minWidth: 0,
  },
  navHeading: {
    fontSize: 13,
    fontWeight: 700,
    color: "white",
    margin: "0 0 14px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  navList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  navLink: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textDecoration: "none",
    lineHeight: 1.4,
    transition: "color 0.15s",
  },

  // Bottom bar
  bottomBar: {
    background: "#1A1510",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    maxWidth: "100%",
    borderTop: "1px solid rgba(201,168,76,0.15)",
  },
  copyright: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    margin: 0,
  },
  bottomLinks: {
    display: "flex",
    gap: 20,
  },
  bottomLink: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    textDecoration: "none",
  },
};