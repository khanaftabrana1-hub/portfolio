export interface EmailTemplateData {
  senderEmail: string;
  message: string;
  senderName: string;
}

export const getProfessionalEmailTemplate = (data: EmailTemplateData): string => {
  const receivedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portfolio Inquiry</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f1f5f9;
          margin: 0;
          padding: 40px 20px;
          color: #1e293b;
        }
        .container {
          max-width: 580px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .header {
          background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .header p {
          margin: 6px 0 0 0;
          color: #e0f2fe;
          font-size: 13px;
        }
        .content {
          padding: 32px 24px;
        }
        .info-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .info-row {
          font-size: 13px;
          margin-bottom: 8px;
        }
        .info-row:last-child {
          margin-bottom: 0;
        }
        .label {
          color: #64748b;
          font-weight: 600;
          display: inline-block;
          width: 90px;
        }
        .value {
          color: #0f172a;
          font-weight: 500;
        }
        .value a {
          color: #0284c7;
          text-decoration: none;
        }
        .section-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .message-box {
          background-color: #ffffff;
          border-left: 4px solid #4f46e5;
          border-top: 1px solid #f1f5f9;
          border-right: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          border-radius: 4px;
          padding: 18px;
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .btn-wrapper {
          text-align: center;
          margin-top: 28px;
        }
        .reply-btn {
          display: inline-block;
          background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
          color: #ffffff !important;
          padding: 12px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }
        .footer {
          background-color: #f8fafc;
          padding: 16px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Portfolio Message 📩</h1>
          <p>You have received a new inquiry from your website.</p>
        </div>
        
        <div class="content">
          <div class="info-card">
            <div class="info-row">
              <span class="label">From:</span>
              <span class="value"><a href="mailto:${data.senderEmail}">${data.senderEmail}</a></span>
            </div>

            <div class="content">
          <div class="info-card">
            <div class="info-row">
              <span class="label">From:</span>
              <span class="value"><a href="mailto:${data.senderName}">${data.senderName}</a></span>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">${receivedAt}</span>
            </div>
          </div>

          <div class="section-title">Message Details</div>
          <div class="message-box">${data.message}</div>

          <div class="btn-wrapper">
            <a href="mailto:${data.senderEmail}" class="reply-btn">Reply Direct</a>
          </div>
        </div>

        <div class="footer">
          Automated notification sent from your Portfolio Backend Application.
        </div>
      </div>
    </body>
    </html>
  `;
};