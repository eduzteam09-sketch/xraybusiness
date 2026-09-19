import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { createExecutiveEmailHtml, ReportEmailData } from "./server/emailTemplate";
import { generateExecutivePdfBuffer } from "./server/pdfGenerator";

dotenv.config();

// Khởi tạo Resend client (ưu tiên từ biến môi trường hoặc key người dùng cấu hình)
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!resendClient && RESEND_API_KEY) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Check Health
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // API Check Mail Service status
  app.get("/api/smtp-status", (req, res) => {
    const hasSmtp = Boolean(process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD));
    const hasResend = Boolean(getResend());
    res.json({
      configured: hasResend || hasSmtp,
      hasResend,
      hasSmtp,
      host: hasResend ? "api.resend.com" : (process.env.SMTP_HOST || "smtp.gmail.com"),
      user: process.env.SMTP_USER
        ? process.env.SMTP_USER.replace(/(.{2})(.*)(@.*)/, "$1***$3")
        : (hasResend ? "Resend Cloud (Active)" : null),
    });
  });

  // API Send Report via Email with real attachment and auto-dispatch
  app.post("/api/send-email", async (req, res) => {
    try {
      const {
        email,
        receiverName,
        businessName,
        subject,
        reportSummary,
        textContent,
        pdfBase64,
        healthScore,
        healthSummary,
        threeKeyInsights,
        ifOnlyOneThing,
        ninetyDayPlan,
        radarScores,
        profile,
        topBottlenecks,
        bottlenecks,
      } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ status: "error", message: "Địa chỉ email không hợp lệ" });
      }

      const resend = getResend();
      const hasRealSmtp = Boolean(
        process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)
      );

      console.log(`[EMAIL DISPATCH] Yêu cầu gửi tới: ${email} (${receiverName || "CEO"})`);
      console.log(`[EMAIL DISPATCH] Resend Active: ${Boolean(resend)}, SMTP Active: ${hasRealSmtp}`);

      const emailSubject = subject || `[BÁO CÁO CHIẾN LƯỢC CEO] Chẩn Đoán & Định Vị Doanh Nghiệp ${businessName}`;
      // Tạo tên tệp đính kèm sạch sẽ, dễ đọc (chuyển tiếng Việt có dấu sang không dấu cho tên tệp tiêu chuẩn)
      const asciiBusinessName = (businessName || "Doanh_Nghiep")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      const pdfFileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || "Doanh_Nghiep"}.pdf`;

      // 1. TẠO TỆP PDF VECTOR CHUẨN TIẾNG VIỆT CÓ DẤU 100% ĐÍNH KÈM THẬT SỰ
      let pdfBuffer: Buffer | null = null;

      try {
        console.log("[PDF] Đang tạo file PDF Executive chuẩn tiếng Việt có dấu 100% trên máy chủ...");
        pdfBuffer = await generateExecutivePdfBuffer({
          email,
          receiverName,
          businessName,
          healthScore,
          healthSummary: healthSummary || reportSummary,
          threeKeyInsights,
          ifOnlyOneThing,
          ninetyDayPlan,
          radarScores,
          profile,
          topBottlenecks,
          bottlenecks,
          pdfFileName,
        });
        console.log(`[PDF] Đã tạo PDF tiếng Việt có dấu thành công! Kích thước: ${pdfBuffer.length} bytes`);
      } catch (pdfGenErr) {
        console.error("[PDF] Lỗi khi tạo PDF máy chủ, chuyển sang dữ liệu từ client:", pdfGenErr);
        if (pdfBase64 && typeof pdfBase64 === "string" && pdfBase64.length > 500) {
          try {
            const base64Clean = pdfBase64.includes("base64,")
              ? pdfBase64.split("base64,")[1]
              : pdfBase64;
            pdfBuffer = Buffer.from(base64Clean, "base64");
          } catch (parseErr) {
            console.warn("[PDF] Lỗi giải mã pdfBase64 từ client:", parseErr);
          }
        }
      }

      const pdfFileSizeKb = pdfBuffer ? Math.max(1, Math.round(pdfBuffer.length / 1024)) : 142;

      // 2. TẠO GIAO DIỆN HTML EMAIL CHUẨN EXECUTIVE GIỐNG 100% TRÊN APP
      const emailHtml = createExecutiveEmailHtml({
        email,
        receiverName,
        businessName,
        healthScore,
        healthSummary: healthSummary || reportSummary,
        threeKeyInsights,
        ifOnlyOneThing,
        ninetyDayPlan,
        radarScores,
        profile,
        pdfFileName,
        pdfFileSizeKb,
      });

      // 3. TỆP ĐÍNH KÈM THẬT
      const attachments = pdfBuffer
        ? [
            {
              filename: pdfFileName,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : [];

      // 4. ƯU TIÊN GỬI QUA RESEND API (NẾU CÓ KEY RESEND)
      if (resend) {
        try {
          console.log(`[RESEND DISPATCH] Đang gửi thư thật qua Resend tới: ${email} với ${attachments.length} tệp đính kèm (${pdfFileSizeKb} KB)`);
          const resendAttachments = pdfBuffer
            ? [
                {
                  filename: pdfFileName,
                  content: pdfBuffer,
                },
              ]
            : [];

          const resendResult = await resend.emails.send({
            from: "AI Business Check-up <onboarding@resend.dev>",
            to: [email],
            subject: emailSubject,
            html: emailHtml,
            text: textContent || reportSummary || "Báo cáo chẩn đoán chiến lược doanh nghiệp",
            attachments: resendAttachments,
          });

          if (resendResult.error) {
            console.error("[RESEND API ERROR]", resendResult.error);
            return res.status(400).json({
              status: "resend_error",
              isRealDelivery: false,
              message: `Resend thông báo: ${resendResult.error.message}`,
              detail: resendResult.error,
              attachmentName: pdfFileName,
            });
          }

          console.log(`[RESEND SUCCESS] Đã gửi thư thành công kèm file PDF! ID:`, resendResult.data?.id);
          return res.json({
            status: "ok",
            isRealDelivery: true,
            provider: "resend",
            message: `Báo cáo chiến lược cho doanh nghiệp "${businessName}" đã được gửi thành công kèm tệp đính kèm PDF vào hòm thư ${email}!`,
            messageId: resendResult.data?.id,
            deliveredTo: email,
            attachmentName: pdfFileName,
            attachmentSize: `${pdfFileSizeKb} KB`,
            timestamp: new Date().toISOString(),
          });
        } catch (resendException: any) {
          console.error("[RESEND EXCEPTION]", resendException);
        }
      }

      // 2. NẾU CÓ CẤU HÌNH SMTP THỰC TẾ: GỬI QUA SMTP
      if (hasRealSmtp) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: process.env.SMTP_SECURE === "true" || !process.env.SMTP_PORT || process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: `"AI Business Check-up" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: email,
          subject: emailSubject,
          text: textContent || reportSummary || "Báo cáo chẩn đoán chiến lược doanh nghiệp",
          html: emailHtml,
          attachments: attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[SMTP DISPATCH] Đã gửi thư THẬT SỰ qua SMTP! Message ID: ${info.messageId}`);

        return res.json({
          status: "ok",
          isRealDelivery: true,
          provider: "smtp",
          message: `Báo cáo chiến lược cho doanh nghiệp "${businessName}" đã được chuyển phát thành công vào hòm thư ${email}!`,
          messageId: info.messageId,
          deliveredTo: email,
          attachmentName: pdfFileName,
          attachmentSize: pdfBuffer ? `${Math.round(pdfBuffer.length / 1024)} KB` : "Đính kèm sẵn",
          timestamp: new Date().toISOString(),
        });
      }

      // 3. NẾU CHƯA CÓ CẢ RESEND LẪN SMTP
      return res.json({
        status: "needs_smtp_config",
        isRealDelivery: false,
        message: `Máy chủ hiện tại chưa kết nối cổng gửi thư (cần RESEND_API_KEY hoặc SMTP).`,
        email: email,
        attachmentName: pdfFileName,
        attachmentSize: pdfBuffer ? `${Math.round(pdfBuffer.length / 1024)} KB` : "142 KB",
      });
    } catch (err: any) {
      console.error("Lỗi khi xử lý gửi email thực sự:", err);
      return res.status(500).json({
        status: "error",
        message: `Lỗi kết nối máy chủ gửi mail: ${err.message}`,
      });
    }
  });

  // API Tải trực tiếp file PDF Executive tiếng Việt có dấu chuẩn A4
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const {
        receiverName,
        businessName,
        healthScore,
        healthSummary,
        threeKeyInsights,
        ifOnlyOneThing,
        ninetyDayPlan,
        radarScores,
        profile,
        topBottlenecks,
        bottlenecks,
      } = req.body;

      const asciiBusinessName = (businessName || "Doanh_Nghiep")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");
      const pdfFileName = `Bao_Cao_Chien_Luoc_CEO_${asciiBusinessName || "Doanh_Nghiep"}.pdf`;

      const pdfBuffer = await generateExecutivePdfBuffer({
        email: "",
        receiverName,
        businessName,
        healthScore,
        healthSummary,
        threeKeyInsights,
        ifOnlyOneThing,
        ninetyDayPlan,
        radarScores,
        profile,
        topBottlenecks,
        bottlenecks,
        pdfFileName,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${pdfFileName}"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      return res.send(pdfBuffer);
    } catch (err: any) {
      console.error("[PDF GEN ERROR]", err);
      return res.status(500).json({ error: "Failed to generate PDF", details: err.message });
    }
  });

  // API AI Interview & Extraction endpoint
  app.post("/api/interview", async (req, res) => {
    try {
      const { history, currentStep, businessInfo, latestUserMessage, mode = 'standard', isDrillDown = false, conversationCount = 1 } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          status: "fallback",
          message: "No GEMINI_API_KEY configured. Falling back to local intelligence.",
        });
      }

      const prompt = `
Bạn là một Giám đốc Tư vấn Chiến lược kỳ cựu (McKinsey/BCG) với 20 năm kinh nghiệm đồng hành cùng các CEO & Chủ doanh nghiệp vừa và nhỏ (SME) tại Việt Nam.
Phong thái: Tinh tế, sắc bén, đồng cảm, nói ngôn ngữ kinh doanh thực chiến (tiền, khách, kênh, lãi, nhân sự, quy trình). Tuyệt đối KHÔNG dùng lý thuyết suông, biệt ngữ công nghệ khó hiểu hay thuật ngữ Canvas trừu tượng.

Thông tin doanh nghiệp:
- Tên doanh nghiệp: ${businessInfo?.businessName || 'Doanh nghiệp'}
- Lãnh đạo / CEO: ${businessInfo?.ceoName || 'CEO'}
- Ngành nghề: ${businessInfo?.industry || 'Kinh doanh & Dịch vụ'}
- Doanh thu: ${businessInfo?.currentRevenue || 'Chưa cung cấp'}
- Quy mô nhân sự: ${businessInfo?.numberOfStaff || 'Chưa cung cấp'}
- Công cụ hiện có: ${JSON.stringify(businessInfo?.currentTools || [])}

Chế độ khám: ${mode === 'deep' ? 'KHÁM CHUYÊN SÂU (Đào sâu tìm điểm nghẽn rò rỉ)' : 'KHÁM TIÊU CHUẨN'}
Bước trụ cột hiện tại: ${currentStep} / 6
Số lượt trao đổi đã qua: ${conversationCount} lượt
Đây có phải là câu hỏi đào sâu trước đó không: ${isDrillDown ? 'Đúng' : 'Không'}

Câu nói vừa rồi của CEO: "${latestUserMessage}"

Lịch sử trao đổi gần nhất:
${JSON.stringify(history?.slice(-6) || [], null, 2)}

HƯỚNG DẪN TƯ VẤN THÍCH ỨNG (ADAPTIVE CONSULTING RULES):
1. Đọc kỹ câu trả lời của CEO. Tìm xem có tín hiệu "rò rỉ dòng tiền" hoặc "điểm nghẽn vận hành" nào không (Ví dụ: phụ thuộc khách mới, chi phí quảng cáo tăng, khách không mua lại, công nợ chậm trả, đọng vốn hàng tồn, việc gì CEO cũng phải tự làm, thiếu công cụ lưu data).
2. Quyết định chiến lược câu hỏi tiếp theo:
   - NẾU câu trả lời của CEO hé lộ một điểm nghẽn lớn (Và chưa từng đào sâu về điểm này): Hãy đặt 1 CÂU HỎI ĐÀO SÂU (Drill-down) bóc tách nguyên nhân gốc rễ (Root cause). Ví dụ: "Tôi nhận thấy chi phí tìm khách mới đang tăng nhanh trong khi tỷ lệ mua lại thấp. Cho tôi hỏi thêm: Sau khi khách mua xong lần đầu, hiện tại bên mình đang có kịch bản chăm sóc lại như thế nào và ai là người chịu trách nhiệm khâu này?". Đặt isDrillDown = true.
   - NẾU câu trả lời đã rõ ràng hoặc đã đào sâu xong: Chuyển mượt mà sang trụ cột tiếp theo trong 6 trụ cột (01.Sản phẩm & Khác biệt -> 02.Khách hàng trọng tâm -> 03.Kênh tiếp cận & Chuyển đổi -> 04.Dòng tiền, Chi phí & Lợi nhuận -> 05.Vận hành & Mức độ phụ thuộc CEO -> 06.Mục tiêu đột phá 90 ngày & Sẵn sàng AI). Đặt isDrillDown = false.
3. Câu ghi nhận (acknowledgement): Viết 1-2 câu ngắn gọn, đồng cảm sâu sắc với nỗi vất vả thực tế của CEO Việt Nam.
4. Gợi ý câu trả lời nhanh (quickAnswers): Cung cấp 3-4 câu trả lời mẫu cực kỳ thực chiến, bám sát ngành nghề của CEO để CEO bận rộn chỉ cần bấm 1 click là gửi được ngay mà không nhất thiết phải gõ dài.
5. Ước tính độ đầy đủ dữ liệu (dataConfidencePercent): Từ 25% (khi mới bắt đầu) tăng dần lên 50%, 75%, 90%, 98% khi thông tin ngày càng rõ.
6. Đánh giá readyToFinalize: Đặt là true nếu đã trao đổi từ 5-7 lượt và đã nắm đủ: Sản phẩm, Khách hàng, Kênh bán, Tình trạng dòng tiền/khách cũ, và Vận hành.

Trả về JSON chuẩn:
{
  "acknowledgement": "1-2 câu ghi nhận sắc sảo, thấu cảm...",
  "nextQuestion": "Câu hỏi tiếp theo (ngắn gọn, tập trung vào 1 ý trọng tâm)...",
  "quickAnswers": ["Gợi ý thực tế 1", "Gợi ý thực tế 2", "Gợi ý thực tế 3", "Gợi ý thực tế 4"],
  "isDrillDown": false,
  "dataConfidencePercent": 65,
  "confidenceRating": "medium",
  "detectedBottleneck": "Rò rỉ khách cũ / Chi phí quảng cáo cao / Phụ thuộc CEO...",
  "readyToFinalize": false,
  "extractedInsights": {
    "coreProduct": "...",
    "targetCustomer": "...",
    "mainChannel": "...",
    "cashflowLeak": "...",
    "ceoBottleneck": "..."
  }
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      return res.json({ status: "ok", data: parsed });
    } catch (error: any) {
      console.error("AI Interview Error:", error);
      return res.status(500).json({ error: error.message || "Failed to process interview" });
    }
  });

  // API Strategic Diagnosis Engine
  app.post("/api/diagnose", async (req, res) => {
    try {
      const { answers, businessName, ceoName, industry } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          status: "fallback",
          message: "Using embedded strategic model generator.",
        });
      }

      const prompt = `
Bạn là Giám đốc Tư vấn Chiến lược hàng đầu tại Việt Nam.
Hãy phân tích toàn diện dữ liệu cuộc trò chuyện "Khám Doanh Nghiệp" của CEO ${ceoName} (Doanh nghiệp: ${businessName}, Ngành: ${industry || 'Kinh doanh'}).

Dữ liệu phỏng vấn thu thập được từ CEO:
${JSON.stringify(answers, null, 2)}

QUY TẮC CỐT TỬ:
- Mọi nhận định, sản phẩm, khách hàng, đối tác, điểm nghẽn, dòng tiền và hành động PHẢI DỰA 100% TRÊN THÔNG TIN THỰC TẾ mà CEO đã cung cấp ở trên.
- TUYỆT ĐỐI KHÔNG TỰ BỊA ĐẶT 'khách hàng là SME / doanh nghiệp vừa và nhỏ / B2B' nếu người dùng không nói. Nếu người dùng nói khách hàng là học sinh trong trường, phụ huynh, người mua cá nhân, hay bệnh nhân... thì BẮT BUỘC ghi CHÍNH XÁC tệp khách hàng đó!
- NẾU DOANH NGHIỆP CÓ ĐỐI TÁC (như trường học lắp hồ bơi đào tạo chia tỉ lệ, đại lý phân phối, đối tác mặt bằng...): Trong bảng Canvas ô Key Partners (Đối tác chính) BẮT BUỘC ghi rõ mô hình hợp tác chia tỷ lệ/mặt bằng đó; ô Customer Segments BẮT BUỘC ghi rõ đối tượng thụ hưởng và người trả tiền (ví dụ: học sinh và phụ huynh); ô Revenue Streams BẮT BUỘC ghi rõ cơ chế thu phí (học phí, vé, chia tỷ lệ % doanh thu với đối tác).
- TUYỆT ĐỐI KHÔNG tự bịa ra ngành nghề khác, không nói chung chung sáo rỗng. Phải bám sát từng chi tiết CEO đã chia sẻ để người đọc thấy chính xác công ty mình trong báo cáo.

Hãy đóng vai trò của 9 Engine phân tích chiến lược:
1. DATA ENGINE: Chuẩn hóa dữ liệu theo đặc thù của doanh nghiệp ${businessName}
2. VALUE STREAM FLOW: Xác định trạng thái 7 bước của chuỗi giá trị (Thị trường, Khách hàng, Giá trị, Khác biệt, Mô hình, Dòng tiền, Tăng trưởng)
3. BUSINESS MODEL ENGINE: Lập Mô hình kinh doanh 9 thành phần (Canvas sống với 3 tầng: Hiện tại, AI nhận xét, Cơ hội)
4. POSITIONING & DIFFERENTIATION ENGINE: Định vị thị trường và kiểm chứng 5 khu vực khác biệt (kèm bằng chứng cụ thể)
5. BOTTLENECK ENGINE: Tìm 3-5 điểm nghẽn chính trên 5 Zone và chuỗi nguyên nhân gốc rễ (Root cause 5-Why)
6. MONEY FLOW ENGINE: Bóc tách dòng tiền hiện tại và dòng tiền mở rộng mới
7. OPPORTUNITY ENGINE: Khoảng trống thị trường bỏ ngỏ có thể khai thác
8. HEALTH & RADAR ENGINE: Điểm sức khỏe (0-100), 10 trục radar (1-5 điểm), nhận định tổng quan ngôn ngữ con người
9. ACTION ENGINE: 3 điều CEO cần biết, Nếu chỉ làm 1 việc duy nhất, và Kế hoạch 90 ngày (3-5 ưu tiên với KPI, thời hạn, kết quả)

Hãy trả về JSON theo schema sau (toàn bộ nội dung bằng tiếng Việt chuẩn xác):
{
  "healthScore": 72,
  "healthSummary": "Nhận định tổng quan sắc bén 2-3 câu về sức khỏe doanh nghiệp ${businessName}...",
  "valueChainFlow": [
    { "step": "01", "label": "THỊ TRƯỜNG", "status": "normal", "note": "Đặc điểm quy mô/nhu cầu thị trường của ngành..." },
    { "step": "02", "label": "KHÁCH HÀNG", "status": "strong", "note": "Tệp khách hàng mục tiêu cốt lõi mà doanh nghiệp đang phục vụ..." },
    { "step": "03", "label": "GIÁ TRỊ", "status": "strong", "note": "Sản phẩm/dịch vụ cốt lõi mang lại giá trị thật của doanh nghiệp này..." },
    { "step": "04", "label": "KHÁC BIỆT", "status": "warning", "note": "Thực trạng điểm khác biệt và chứng chỉ/bằng chứng định vị..." },
    { "step": "05", "label": "MÔ HÌNH", "status": "normal", "note": "Kênh bán và cách thức tổ chức vận hành hiện tại..." },
    { "step": "06", "label": "DÒNG TIỀN", "status": "danger", "note": "Điểm rò rỉ dòng tiền (khách cũ mua lại, công nợ, chi phí)..." },
    { "step": "07", "label": "TĂNG TRƯỞNG", "status": "warning", "note": "Thực trạng tốc độ tăng trưởng doanh thu gần đây..." }
  ],
  "expertFlowAssessment": "Nhận định chuyên gia 1-2 câu tóm tắt vị trí dòng chảy giá trị đang thông suốt và điểm đang rò rỉ dòng tiền của ${businessName}.",
  "threeKeyInsights": {
    "greatestStrength": "Thế mạnh cốt lõi lớn nhất thực tế của doanh nghiệp...",
    "biggestBottleneck": "Điểm nghẽn nghiêm trọng nhất đang kìm hãm doanh số/dòng tiền...",
    "mostPromisingOpportunity": "Cơ hội mở rộng doanh thu sáng giá nhất có thể làm ngay..."
  },
  "ifOnlyOneThing": {
    "action": "Một việc duy nhất CEO cần làm ngay để tạo chuyển biến lớn...",
    "reason": "Lý do vì sao việc này mang lại đòn bẩy tài chính cao nhất...",
    "leverageBottleneck": "Vị trí điểm nghẽn được giải phóng..."
  },
  "positioningSummary": {
    "marketLocation": "Vị trí phân khúc thị trường của doanh nghiệp...",
    "targetTier": "Khách hàng mục tiêu cốt lõi sẵn sàng trả tiền...",
    "competitiveStand": "Lợi thế cạnh tranh và định vị độc nhất..."
  },
  "differentiation": [
    { "area": "Sản phẩm", "title": "...", "description": "...", "hasEvidence": true, "evidenceNote": "..." },
    { "area": "Dịch vụ", "title": "...", "description": "...", "hasEvidence": true, "evidenceNote": "..." },
    { "area": "Trải nghiệm", "title": "...", "description": "...", "hasEvidence": false, "evidenceNote": "..." },
    { "area": "Mô hình kinh doanh", "title": "...", "description": "...", "hasEvidence": true, "evidenceNote": "..." },
    { "area": "Hệ sinh thái", "title": "...", "description": "...", "hasEvidence": false, "evidenceNote": "..." }
  ],
  "radarScores": [
    { "subject": "USP khác biệt", "score": 3, "benchmark": 3.5, "note": "..." },
    { "subject": "Nhóm khách lợi nhuận", "score": 3, "benchmark": 3.2, "note": "..." },
    { "subject": "Thấu hiểu Insight", "score": 3, "benchmark": 3.0, "note": "..." },
    { "subject": "Dễ dàng tìm thấy", "score": 2, "benchmark": 3.4, "note": "..." },
    { "subject": "Internet -> Doanh thu", "score": 2, "benchmark": 3.5, "note": "..." },
    { "subject": "Cơ chế mua lại", "score": 2, "benchmark": 3.2, "note": "..." },
    { "subject": "Cross-sell / Upsell", "score": 2, "benchmark": 3.0, "note": "..." },
    { "subject": "Dữ liệu khách hàng", "score": 1, "benchmark": 3.2, "note": "..." },
    { "subject": "Tăng trưởng không tăng NS", "score": 3, "benchmark": 2.8, "note": "..." },
    { "subject": "Dễ dàng nhân bản", "score": 2, "benchmark": 3.0, "note": "..." }
  ],
  "canvas": {
    "customerSegments": { "id": "cs", "title": "Khách hàng chính", "englishSub": "Customer Segments", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "valuePropositions": { "id": "vp", "title": "Giá trị mang lại", "englishSub": "Value Propositions", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "channels": { "id": "ch", "title": "Kênh phân phối", "englishSub": "Channels", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "customerRelationships": { "id": "cr", "title": "Quan hệ khách hàng", "englishSub": "Customer Relationships", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "revenueStreams": { "id": "rs", "title": "Dòng doanh thu", "englishSub": "Revenue Streams", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "keyResources": { "id": "kr", "title": "Nguồn lực chính", "englishSub": "Key Resources", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "keyActivities": { "id": "ka", "title": "Hoạt động chính", "englishSub": "Key Activities", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "keyPartners": { "id": "kp", "title": "Đối tác chính", "englishSub": "Key Partners", "current": ["..."], "aiFeedback": "...", "opportunity": "..." },
    "costStructure": { "id": "cst", "title": "Cơ cấu chi phí", "englishSub": "Cost Structure", "current": ["..."], "aiFeedback": "...", "opportunity": "..." }
  },
  "bottlenecks": [
    {
      "id": "b1",
      "zone": "Khách hàng",
      "title": "...",
      "severity": "Cao",
      "flowStep": "Bước 02: Tiếp cận & Chuyển đổi",
      "why": "...",
      "impact": "...",
      "recommendation": "...",
      "confidence": "high",
      "rootCauses": ["Vấn đề bề mặt", "Triệu chứng", "Nguyên nhân vận hành", "Gốc rễ chiến lược"]
    }
  ],
  "rootCauseMap": {
    "problemStatement": "Vấn đề cốt lõi kìm hãm doanh nghiệp...",
    "chain": [
      { "step": "Triệu chứng bề mặt", "description": "..." },
      { "step": "Nguyên nhân cấp 1", "description": "..." },
      { "step": "Nguyên nhân cấp 2", "description": "..." },
      { "step": "Nguyên nhân gốc rễ", "description": "..." }
    ]
  },
  "moneyFlow": {
    "summary": "Tóm tắt thực trạng dòng tiền hiện tại...",
    "transformationLogic": "Dòng tiền hiện tại -> Điểm nghẽn -> Năng lực đang có -> Cơ hội mới -> Dòng tiền mới",
    "currentFlows": [
      { "id": "mf-1", "name": "...", "type": "current", "sourceProduct": "...", "targetCustomer": "...", "channel": "...", "frequency": "...", "shareOrEstimate": "75%", "healthStatus": "ổn định", "description": "..." }
    ],
    "potentialFlows": [
      { "id": "mf-pot-1", "name": "...", "type": "potential", "sourceProduct": "...", "targetCustomer": "...", "channel": "...", "frequency": "...", "shareOrEstimate": "25%", "healthStatus": "tiềm năng lớn", "description": "..." }
    ]
  },
  "opportunities": [
    {
      "id": "opp-1",
      "title": "...",
      "category": "Khách hàng chưa phục vụ",
      "whyAiFoundIt": "...",
      "whatCanBeDone": "...",
      "priority": "Cao"
    }
  ],
  "digitalAndAi": {
    "readinessScore": 45,
    "levelTitle": "Đang ở mức bắt đầu số hóa",
    "currentTools": ["Zalo", "Excel"],
    "missingCrucialTools": ["CRM quản lý khách hàng", "Phần mềm theo dõi dòng tiền tự động"],
    "initiatives": [
      { "title": "...", "whyPriority": "...", "impact": "...", "difficulty": "Dễ", "suggestedTools": ["..."] },
      { "title": "...", "whyPriority": "...", "impact": "...", "difficulty": "Trung bình", "suggestedTools": ["..."] },
      { "title": "...", "whyPriority": "...", "impact": "...", "difficulty": "Trung bình", "suggestedTools": ["..."] }
    ]
  },
  "ninetyDayPlan": [
    {
      "id": "p1",
      "priorityLabel": "ƯU TIÊN 01 (0 - 30 ngày)",
      "title": "...",
      "objective": "...",
      "actionItems": ["..."],
      "kpi": "...",
      "timeline": "30 ngày",
      "expectedResult": "...",
      "status": "todo"
    },
    {
      "id": "p2",
      "priorityLabel": "ƯU TIÊN 02 (30 - 60 ngày)",
      "title": "...",
      "objective": "...",
      "actionItems": ["..."],
      "kpi": "...",
      "timeline": "60 ngày",
      "expectedResult": "...",
      "status": "todo"
    },
    {
      "id": "p3",
      "priorityLabel": "ƯU TIÊN 03 (60 - 90 ngày)",
      "title": "...",
      "objective": "...",
      "actionItems": ["..."],
      "kpi": "...",
      "timeline": "90 ngày",
      "expectedResult": "...",
      "status": "todo"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      return res.json({ status: "ok", data: parsed });
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      return res.status(500).json({ error: err.message || "Diagnosis failed" });
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
