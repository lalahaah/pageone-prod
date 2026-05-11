import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@pageone.kr';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface PurchaseConfirmationParams {
  buyerEmail: string;
  buyerName: string;
  productTitle: string;
  downloadUrl: string;
  expireHours: number;
  downloadLimit: number;
  sellerName: string;
}

/**
 * 구매자에게 구매 완료 및 다운로드 링크 발송
 */
export async function sendPurchaseConfirmation({
  buyerEmail,
  buyerName,
  productTitle,
  downloadUrl,
  expireHours,
  downloadLimit,
  sellerName,
}: PurchaseConfirmationParams) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>구매 완료</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #f9f9f9;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                  <h1 style="margin: 0; font-size: 24px; color: #111111;">구매가 완료되었습니다 🎉</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; color: #444444; line-height: 1.6;">
                    안녕하세요, ${buyerName}님!<br />
                    <strong>${sellerName}</strong>님의 <strong>${productTitle}</strong> 상품을 구매해주셔서 감사합니다.
                  </p>
                  
                  <div style="margin: 30px 0; text-align: center;">
                    <a href="${downloadUrl}" style="display: inline-block; padding: 18px 36px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 12px;">상품 다운로드하기</a>
                  </div>

                  <div style="background-color: #f5f5f5; border-radius: 12px; padding: 20px; margin-top: 30px;">
                    <h3 style="margin: 0 0 10px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">다운로드 안내</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; color: #555555; line-height: 1.8;">
                      <li>유효 기간: 결제 시점으로부터 <strong>${expireHours}시간</strong></li>
                      <li>다운로드 횟수 제한: 최대 <strong>${downloadLimit}회</strong></li>
                    </ul>
                  </div>

                  <p style="margin: 30px 0 0; font-size: 14px; color: #888888; text-align: center;">
                    문의사항이 있으시면 판매자(${sellerName})에게 연락 부탁드립니다.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; background-color: #fafafa; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                    본 메일은 PageOne에서 발송되었습니다.<br />
                    &copy; PageOne. All rights reserved.
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

  return resend.emails.send({
    from: FROM_EMAIL,
    to: buyerEmail,
    subject: `[PageOne] ${productTitle} 구매가 완료되었습니다 🎉`,
    html,
  });
}

interface SaleNotificationParams {
  sellerEmail: string;
  productTitle: string;
  amount: number;
  netAmount: number;
  feeRate: number;
  buyerEmail: string;
}

/**
 * 판매자에게 판매 알림 발송
 */
export async function sendSaleNotification({
  sellerEmail,
  productTitle,
  amount,
  netAmount,
  feeRate,
  buyerEmail,
}: SaleNotificationParams) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>판매 알림</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #f9f9f9;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #f0f0f0; background-color: #6366f1;">
                  <h1 style="margin: 0; font-size: 24px; color: #ffffff;">새로운 판매가 발생했습니다 💰</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 25px; font-size: 18px; color: #111111; font-weight: bold;">
                    축하합니다! 상품이 판매되었습니다.
                  </p>
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #666666;">상품명</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #111111; text-align: right; font-weight: bold;">${productTitle}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #666666;">판매 금액</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #111111; text-align: right;">${amount.toLocaleString()}원</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #666666;">수수료 (${feeRate}%)</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-size: 15px; color: #ff4d4d; text-align: right;">-${(amount - netAmount).toLocaleString()}원</td>
                    </tr>
                    <tr style="background-color: #fdfdfd;">
                      <td style="padding: 15px 0; font-size: 16px; color: #111111; font-weight: bold;">정산 예정액</td>
                      <td style="padding: 15px 0; font-size: 20px; color: #6366f1; text-align: right; font-weight: bold;">${netAmount.toLocaleString()}원</td>
                    </tr>
                  </table>

                  <div style="margin: 30px 0; text-align: center;">
                    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 15px 30px; background-color: #111111; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 10px;">대시보드에서 확인하기</a>
                  </div>

                  <p style="margin: 20px 0 0; font-size: 14px; color: #888888;">
                    구매자: ${buyerEmail}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; background-color: #fafafa; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                    본 메일은 PageOne에서 발송되었습니다.<br />
                    &copy; PageOne. All rights reserved.
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

  return resend.emails.send({
    from: FROM_EMAIL,
    to: sellerEmail,
    subject: `[PageOne] ${productTitle}이 판매되었습니다 💰`,
    html,
  });
}
