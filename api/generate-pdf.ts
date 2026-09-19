import { jsPDF } from "jspdf";
import { setupVietnameseFont } from "../src/services/vietnameseFont";

function generateExecutivePdfBuffer(data: any): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  setupVietnameseFont(doc);
  const pageWidth = 210;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  const businessName = (data.businessName || "DOANH NGHIỆP").trim();
  const ceoName = (data.receiverName || "CEO / LÃNH ĐẠO").trim();
  const industry = (data.profile?.industry || "Thương mại & Dịch vụ").trim();
  const score = data.healthScore !== undefined ? data.healthScore : 72;

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, 12, contentWidth, 24, "F");

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(7.5);
  doc.setFont("DejaVuSans", "bold");
  doc.text("AI BUSINESS HEALTH CHECK 2026 - EXECUTIVE STRATEGY REPORT", margin + 5, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("DejaVuSans", "bold");
  doc.text(`BẢN ĐỒ CHIẾN LƯỢC & ĐỊNH VỊ: ${businessName.toUpperCase()}`, margin + 5, 26);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.setFont("DejaVuSans", "normal");
  doc.text(`Người nhận: ${ceoName} | Ngành: ${industry} | Thời điểm: ${new Date().toLocaleDateString("vi-VN")}`, margin + 5, 32);

  // Score Box
  let currentY = 40;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 22, "FD");

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("CHỈ SỐ SỨC KHỎE", margin + 5, currentY + 6);

  const scoreColor = score >= 80 ? [22, 163, 74] : score >= 60 ? [29, 78, 216] : [234, 88, 12];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(20);
  doc.setFont("DejaVuSans", "bold");
  doc.text(`${score}`, margin + 5, currentY + 16);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("/100", margin + 20, currentY + 14);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 36, currentY + 3, margin + 36, currentY + 19);

  doc.setTextColor(30, 64, 175);
  doc.setFontSize(7.5);
  doc.setFont("DejaVuSans", "bold");
  doc.text("NHẬN ĐỊNH CHIẾN LƯỢC TỔNG QUAN:", margin + 40, currentY + 6);

  const summary =
    (data.healthSummary ||
    "Doanh nghiệp đang có nền tảng sản phẩm tốt nhưng cần tập trung tối ưu hóa quy trình giữ chân khách hàng và tự động hóa vận hành.").trim();
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont("DejaVuSans", "normal");
  const splitSummary = doc.splitTextToSize(`"${summary}"`, contentWidth - 45);
  doc.text(splitSummary, margin + 40, currentY + 11);

  // 5 Pillars
  currentY = 66;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("DejaVuSans", "bold");
  doc.text("1. ĐÁNH GIÁ 5 TRỤ CỘT NĂNG LỰC DOANH NGHIỆP (SCORECARD)", margin, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 34, "FD");

  const pillars = [
    { label: "Tài chính & Dòng tiền (Cashflow & Unit Economics)", score: data.radarScores?.finance || 72 },
    { label: "Vận hành & Hệ thống (Operations & Process Automation)", score: data.radarScores?.operations || 65 },
    { label: "Tiếp thị & Khách hàng (Marketing & Retention Engines)", score: data.radarScores?.marketing || 80 },
    { label: "Đội ngũ & Con người (Team Alignment & Culture)", score: data.radarScores?.team || 68 },
    { label: "Lợi thế cạnh tranh & Sản phẩm (Product Moat & IP)", score: data.radarScores?.advantage || 85 },
  ];

  let barY = currentY + 5;
  pillars.forEach((p) => {
    doc.setFont("DejaVuSans", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(p.label, margin + 4, barY);

    doc.setFont("DejaVuSans", "bold");
    doc.setTextColor(29, 78, 216);
    doc.text(`${p.score}/100`, margin + 115, barY);

    doc.setFillColor(226, 232, 240);
    doc.rect(margin + 130, barY - 2.5, 48, 3, "F");

    const barWidth = (Math.min(100, Math.max(0, p.score)) / 100) * 48;
    doc.setFillColor(37, 99, 235);
    doc.rect(margin + 130, barY - 2.5, barWidth, 3, "F");

    barY += 5.8;
  });

  // Action
  currentY = 108;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("DejaVuSans", "bold");
  doc.text("2. HÀNH ĐỘNG ĐÒN BẨY QUYẾT ĐỊNH TRONG 30 NGÀY (IF ONLY ONE THING)", margin, currentY);

  currentY += 4;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.rect(margin, currentY, contentWidth, 18, "FD");

  const ifOneThing =
    (data.ifOnlyOneThing?.action ||
    "Khai thác tối đa giá trị vòng đời khách hàng cũ thông qua chuỗi chăm sóc tự động để tăng biên lợi nhuận gộp ngay lập tức.").trim();
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont("DejaVuSans", "bold");
  doc.text("ĐÒN BẨY CHIẾN LƯỢC:", margin + 4, currentY + 5);

  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(8);
  doc.setTextColor(69, 26, 3);
  const splitOneThing = doc.splitTextToSize(ifOneThing, contentWidth - 10);
  doc.text(splitOneThing, margin + 4, currentY + 10);

  // Insights
  currentY = 134;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("DejaVuSans", "bold");
  doc.text("3. TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC (STRATEGIC TRIANGLE)", margin, currentY);

  currentY += 4;
  const insights = [
    {
      title: "DÒNG TIỀN & HIỆN TRẠNG",
      text:
        (data.threeKeyInsights?.greatestStrength ||
        "Nguồn thu ổn định nhưng chi phí duy trì bộ máy cần được tinh gọn bằng công nghệ.").trim(),
      bg: [239, 246, 255],
      border: [191, 219, 254],
      titleColor: [30, 64, 175],
    },
    {
      title: "ĐIỂM NGHẼN CỐT LÕI",
      text:
        (data.threeKeyInsights?.biggestBottleneck ||
        "Quy trình bán hàng phụ thuộc nhiều vào con người, thiếu hệ thống ghi nhận tự động.").trim(),
      bg: [254, 242, 242],
      border: [254, 202, 202],
      titleColor: [153, 27, 27],
    },
    {
      title: "CƠ HỘI BỨT PHÁ",
      text:
        (data.threeKeyInsights?.mostPromisingOpportunity ||
        "Ứng dụng AI vào tư vấn và chăm sóc khách hàng giúp giảm 40% thời gian xử lý đơn hàng.").trim(),
      bg: [240, 253, 244],
      border: [187, 247, 208],
      titleColor: [22, 101, 52],
    },
  ];

  insights.forEach((ins) => {
    doc.setFillColor(ins.bg[0], ins.bg[1], ins.bg[2]);
    doc.setDrawColor(ins.border[0], ins.border[1], ins.border[2]);
    doc.rect(margin, currentY, contentWidth, 15, "FD");

    doc.setFont("DejaVuSans", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(ins.titleColor[0], ins.titleColor[1], ins.titleColor[2]);
    doc.text(ins.title, margin + 4, currentY + 4.5);

    doc.setFont("DejaVuSans", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const splitIns = doc.splitTextToSize(ins.text, contentWidth - 8);
    doc.text(splitIns, margin + 4, currentY + 9);

    currentY += 17;
  });

  // Footer
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Báo cáo chiến lược độc quyền dành cho CEO được tạo bởi AI Business Health Check Engine 2026. Bảo mật tuyệt đối.",
    pageWidth / 2,
    287,
    { align: "center" }
  );

  return Buffer.from(doc.output("arraybuffer"));
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }
    payload = payload || {};

    const businessName = payload.businessName || "Doanh_Nghiep";
    const asciiBusinessName = businessName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const fileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || "Doanh_Nghiep"}.pdf`;

    const pdfBuffer = generateExecutivePdfBuffer(payload);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (err: any) {
    console.error("Lỗi tạo PDF:", err);
    return res.status(500).json({ status: "error", message: err.message || "Lỗi tạo PDF" });
  }
}
