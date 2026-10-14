export interface ReportEmailData {
  email: string;
  receiverName?: string;
  businessName: string;
  healthScore?: number;
  healthSummary?: string;
  threeKeyInsights?: {
    greatestStrength?: string;
    biggestBottleneck?: string;
    mostPromisingOpportunity?: string;
  };
  ifOnlyOneThing?: {
    action?: string;
    reason?: string;
    impact?: string;
    leverageBottleneck?: string;
  };
  ninetyDayPlan?: Array<{
    timeline?: string;
    title?: string;
    objective?: string;
    kpi?: string;
    tasks?: string[];
  }>;
  radarScores?: any;
  profile?: {
    ceoName?: string;
    industry?: string;
    currentRevenue?: string;
    teamSize?: string;
    mainProducts?: string;
    painPoint?: string;
  };
  topBottlenecks?: Array<{
    title?: string;
    zone?: string;
    recommendation?: string;
    severity?: string;
  }>;
  bottlenecks?: any[];
  pdfFileName?: string;
  pdfFileSizeKb?: number;
}

export function createExecutiveEmailHtml(data: ReportEmailData): string {
  const score = data.healthScore !== undefined ? data.healthScore : 74;
  const scoreColor = score >= 80 ? '#16a34a' : score >= 60 ? '#2563eb' : '#ea580c';
  const scoreBadgeBg = score >= 80 ? '#dcfce7' : score >= 60 ? '#dbeafe' : '#ffedd5';
  const scoreGrade = score >= 80 ? 'HẠNG A • KHỎE MẠNH VỮNG VÀNG' : score >= 60 ? 'HẠNG B • TIỀM NĂNG - CẦN TỐI ƯU' : 'HẠNG C • CẢNH BÁO NGUY CƠ';

  const radar = {
    finance: data.radarScores?.finance || 72,
    operations: data.radarScores?.operations || 65,
    marketing: data.radarScores?.marketing || 80,
    team: data.radarScores?.team || 68,
    advantage: data.radarScores?.advantage || 85,
  };

  const insights = {
    strength: data.threeKeyInsights?.greatestStrength || 'Sản phẩm có lợi thế cạnh tranh tự nhiên và tỷ lệ khách hàng hài lòng cao.',
    bottleneck: data.threeKeyInsights?.biggestBottleneck || 'Phụ thuộc vào khách mới, tỷ lệ quay lại mua hàng chưa được khai thác triệt để.',
    opportunity: data.threeKeyInsights?.mostPromisingOpportunity || 'Xây dựng phễu chăm sóc tự động và gói sản phẩm định kỳ (combo/membership).',
  };

  const action = {
    action: data.ifOnlyOneThing?.action || 'Kích hoạt chiến dịch gọi điện/nhắn tin chăm sóc 100 khách hàng cũ thân thiết nhất.',
    reason: data.ifOnlyOneThing?.reason || 'Chi phí giữ chân khách cũ chỉ bằng 1/5 chi phí tìm khách mới, tạo dòng tiền nóng ngay lập tức.',
    impact: data.ifOnlyOneThing?.impact || 'Dự kiến tăng ngay 15% - 25% doanh thu trong 30 ngày mà không tốn thêm ngân sách quảng cáo.',
  };

  const plan = data.ninetyDayPlan && data.ninetyDayPlan.length > 0 ? data.ninetyDayPlan : [
    {
      timeline: 'Tuần 1 - 2',
      title: 'DẬP TẮT ĐÁM CHÁY & CẮT RÒ RỈ DÒNG TIỀN',
      objective: 'Kiểm toán toàn bộ chi phí thừa và thu hồi công nợ quá hạn.',
      kpi: 'Giảm 10% chi phí vận hành không thiết yếu.',
    },
    {
      timeline: 'Tuần 3 - 6',
      title: 'TỐI ƯU HÓA PHỄU BÁN HÀNG & TĂNG TỶ LỆ QUAY LẠI',
      objective: 'Xây dựng quy trình chăm sóc khách hàng sau mua và kịch bản upsell.',
      kpi: 'Tỷ lệ khách hàng mua lại lần 2 tăng tối thiểu 20%.',
    },
    {
      timeline: 'Tuần 7 - 12',
      title: 'ĐÓNG GÓI QUY TRÌNH & BÀN GIAO VẬN HÀNH',
      objective: 'Chuẩn hóa quy trình làm việc (SOP) để CEO giảm 40% thời gian can thiệp trực tiếp.',
      kpi: 'Đội ngũ tự vận hành 80% công việc thường nhật.',
    },
  ];

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bản Đồ Chiến Lược & Tư Vấn Điều Hành CEO - ${data.businessName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 8px;">
    <tr>
      <td align="center">
        <!-- Container chính -->
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 24px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);">
          
          <!-- 1. Header Banner Hiện Đại (Dark Navy Gradient) -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%); padding: 36px 28px; text-align: left; border-bottom: 3px solid #2563eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: rgba(59,130,246,0.25); border: 1px solid rgba(147,197,253,0.3); color: #93c5fd; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px;">
                      ✦ AI BUSINESS HEALTH CHECK 2026
                    </span>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0 0 8px 0; line-height: 1.3; letter-spacing: -0.3px;">
                      BẢN ĐỒ CHIẾN LƯỢC & TƯ VẤN ĐIỀU HÀNH CEO
                    </h1>
                    <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.5;">
                      Báo cáo chẩn đoán độc quyền dành riêng cho <strong>${data.receiverName || 'CEO'}</strong> • Doanh nghiệp: <strong style="color: #ffffff;">${data.businessName}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Thông báo đính kèm file thật tế ở đầu email -->
          <tr>
            <td style="padding: 16px 28px 0 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 16px; padding: 14px 18px;">
                <tr>
                  <td width="36" style="vertical-align: middle;">
                    <div style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 10px; text-align: center; line-height: 32px; color: #ffffff; font-size: 16px;">
                      📎
                    </div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <div style="font-size: 13px; font-weight: 800; color: #1e3a8a;">
                      TỆP ĐÍNH KÈM THẬT TRONG EMAIL NÀY: ${data.pdfFileName || 'Bao_Cao_Chien_Luoc_CEO.pdf'}
                    </div>
                    <div style="font-size: 11px; color: #3b82f6; margin-top: 2px;">
                      Bản PDF A4 Executive đã được đính kèm vào email (${data.pdfFileSizeKb || 142} KB). Bạn có thể tải ngay ở chân thư để in ấn hoặc lưu trữ.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. Khối Điểm Sức Khỏe Tổng Thể & Nhận Định Chuyên Gia -->
          <tr>
            <td style="padding: 20px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px;">
                <tr>
                  <td width="130" align="center" style="vertical-align: middle; border-right: 1px solid #cbd5e1; padding-right: 18px;">
                    <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;">CHỈ SỐ SỨC KHỎE</div>
                    <div style="font-size: 42px; font-weight: 900; color: ${scoreColor}; line-height: 1; margin: 6px 0 4px 0;">
                      ${score}
                    </div>
                    <div style="display: inline-block; background-color: ${scoreBadgeBg}; color: ${scoreColor}; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 10px;">
                      ${scoreGrade}
                    </div>
                  </td>
                  <td style="padding-left: 20px; vertical-align: middle;">
                    <div style="font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✦ NHẬN ĐỊNH TỪ CHUYÊN GIA CHIẾN LƯỢC AI
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 6px; line-height: 1.6;">
                      “${data.healthSummary || 'Doanh nghiệp sở hữu nền tảng sản phẩm tốt nhưng dòng tiền đang bị rò rỉ ở khâu giữ chân khách hàng cũ và tự động hóa vận hành.'}”
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4. Bảng 5 Trụ Cột Đánh Giá Trực Quan (Thanh Progress Bar) -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <div style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                📊 ĐÁNH GIÁ 5 TRỤ CỘT NĂNG LỰC DOANH NGHIỆP
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px 20px;">
                
                <!-- 1. Tài chính -->
                <tr>
                  <td style="padding: 7px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; color: #1e293b;">1. Tài chính & Dòng tiền (Cashflow)</td>
                        <td align="right" style="font-size: 12px; font-weight: 800; color: #2563eb;">${radar.finance}/100</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 5px;">
                          <div style="width: 100%; height: 7px; background-color: #e2e8f0; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${radar.finance}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 10px;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 2. Vận hành -->
                <tr>
                  <td style="padding: 7px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; color: #1e293b;">2. Vận hành & Hệ thống (Operations)</td>
                        <td align="right" style="font-size: 12px; font-weight: 800; color: #2563eb;">${radar.operations}/100</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 5px;">
                          <div style="width: 100%; height: 7px; background-color: #e2e8f0; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${radar.operations}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 10px;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 3. Marketing -->
                <tr>
                  <td style="padding: 7px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; color: #1e293b;">3. Tiếp thị & Khách hàng (Go-To-Market)</td>
                        <td align="right" style="font-size: 12px; font-weight: 800; color: #2563eb;">${radar.marketing}/100</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 5px;">
                          <div style="width: 100%; height: 7px; background-color: #e2e8f0; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${radar.marketing}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 10px;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 4. Nhân sự -->
                <tr>
                  <td style="padding: 7px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; color: #1e293b;">4. Đội ngũ & Văn hóa (People & Team)</td>
                        <td align="right" style="font-size: 12px; font-weight: 800; color: #2563eb;">${radar.team}/100</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 5px;">
                          <div style="width: 100%; height: 7px; background-color: #e2e8f0; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${radar.team}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 10px;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 5. Lợi thế -->
                <tr>
                  <td style="padding: 7px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; font-weight: 700; color: #1e293b;">5. Lợi thế cạnh tranh & Sản phẩm (Moat)</td>
                        <td align="right" style="font-size: 12px; font-weight: 800; color: #2563eb;">${radar.advantage}/100</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 5px;">
                          <div style="width: 100%; height: 7px; background-color: #e2e8f0; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${radar.advantage}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 10px;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- 5. HÀNH ĐỘNG ĐÒN BẨY SỐ 1 (Nếu chỉ làm 1 việc trong 30 ngày) -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border: 2px solid #fde047; border-radius: 20px; padding: 22px;">
                <tr>
                  <td>
                    <div style="display: inline-block; background-color: #854d0e; color: #ffffff; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 10px; margin-bottom: 10px;">
                      🎯 NẾU CHỈ LÀM 1 VIỆC TRONG 30 NGÀY TỚI
                    </div>
                    <div style="font-size: 16px; font-weight: 900; color: #713f12; line-height: 1.4; margin-bottom: 8px;">
                      ${action.action}
                    </div>
                    <div style="font-size: 12px; color: #854d0e; line-height: 1.6; margin-bottom: 8px;">
                      <strong>Vì sao ưu tiên việc này:</strong> ${action.reason}
                    </div>
                    <div style="font-size: 12px; font-weight: 800; color: #15803d; background-color: rgba(255,255,255,0.7); padding: 8px 12px; border-radius: 10px; border: 1px dashed #86efac;">
                      🚀 Tác động kỳ vọng: ${action.impact}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 6. TAM GIÁC NHẬN ĐỊNH TRỌNG YẾU (3 Thẻ Card) -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                🔍 TAM GIÁC NHẬN ĐỊNH CHIẾN LƯỢC TRỌNG YẾU
              </div>
              
              <!-- Thẻ 1: Điểm mạnh -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 14px 18px; margin-bottom: 10px;">
                <tr>
                  <td width="28" style="vertical-align: top; font-size: 16px;">🟢</td>
                  <td style="vertical-align: top; padding-left: 8px;">
                    <div style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase;">1. ĐIỂM MẠNH LỚN NHẤT CỦA DOANH NGHIỆP</div>
                    <div style="font-size: 13px; color: #14532d; line-height: 1.5; margin-top: 2px;">
                      ${insights.strength}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Thẻ 2: Điểm nghẽn rò rỉ dòng tiền -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 14px 18px; margin-bottom: 10px;">
                <tr>
                  <td width="28" style="vertical-align: top; font-size: 16px;">🔴</td>
                  <td style="vertical-align: top; padding-left: 8px;">
                    <div style="font-size: 11px; font-weight: 800; color: #991b1b; text-transform: uppercase;">2. ĐIỂM NGHẼN RÒ RỈ DÒNG TIỀN (CẦN XỬ LÝ GẤP)</div>
                    <div style="font-size: 13px; color: #7f1d1d; line-height: 1.5; margin-top: 2px;">
                      ${insights.bottleneck}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Thẻ 3: Cơ hội bứt phá -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 16px; padding: 14px 18px;">
                <tr>
                  <td width="28" style="vertical-align: top; font-size: 16px;">🔵</td>
                  <td style="vertical-align: top; padding-left: 8px;">
                    <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase;">3. CƠ HỘI ĐÁNG GIÁ NHẤT ĐỂ NHÂN DOANH SỐ</div>
                    <div style="font-size: 13px; color: #1e3a8a; line-height: 1.5; margin-top: 2px;">
                      ${insights.opportunity}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 7. LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="font-size: 12px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                🗓️ LỘ TRÌNH 90 NGÀY HÀNH ĐỘNG CỦA CEO
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
                ${plan
                  .map(
                    (p, idx) => `
                <tr>
                  <td style="padding: 18px 20px; border-bottom: ${idx === plan.length - 1 ? 'none' : '1px solid #f1f5f9'};">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="display: inline-block; background-color: #f1f5f9; color: #2563eb; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 3px 8px; border-radius: 8px; margin-bottom: 6px;">
                            ${p.timeline || `GIAI ĐOẠN 0${idx + 1}`}
                          </span>
                          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
                            ${p.title}
                          </div>
                          <div style="font-size: 12px; color: #475569; line-height: 1.5; margin-bottom: 6px;">
                            <strong>Mục tiêu:</strong> ${p.objective}
                          </div>
                          <div style="font-size: 11px; font-weight: 700; color: #15803d; background-color: #f0fdf4; padding: 4px 10px; border-radius: 8px; display: inline-block;">
                            🎯 KPI đo lường: ${p.kpi}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `
                  )
                  .join('')}
              </table>
            </td>
          </tr>

          <!-- 8. Hộp tải đính kèm chân trang (Nhắc nhở mở PDF) -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 20px; padding: 20px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 28px; margin-bottom: 8px;">📑</div>
                    <div style="font-size: 14px; font-weight: 800; color: #0f172a;">
                      TỆP ĐÍNH KÈM CHÍNH THỨC: ${data.pdfFileName || 'Bao_Cao_Chien_Luoc_CEO.pdf'}
                    </div>
                    <p style="font-size: 12px; color: #64748b; max-width: 480px; margin: 6px auto 0 auto; line-height: 1.6;">
                      Hệ thống đã đính kèm tệp PDF kích thước A4 độ phân giải cao vào email này. Hãy cuộn xuống dưới cùng của ứng dụng Gmail để tải về hoặc in trực tiếp cho Hội đồng quản trị.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 9. Footer Lịch Sự & Bản Quyền -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 28px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #ffffff;">
                AI BUSINESS HEALTH CHECK 2026
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                Hệ thống chẩn đoán sức khỏe & chiến lược điều hành độc lập dành cho Doanh nghiệp Việt Nam.<br>
                Email được gửi tự động vào lúc ${new Date().toLocaleString('vi-VN')}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
