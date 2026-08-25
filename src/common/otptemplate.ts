export const getOtpEmailTemplate = (otpCode: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .header { text-align: center; color: #1a202c; }
          .otp-card { background: #edf2f7; border-radius: 6px; padding: 12px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #3182ce; letter-spacing: 6px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>OTP Verification</h2>
          </div>
          <p>Aapka login OTP verification code yeh hai:</p>
          <div class="otp-card">
            <h1 class="otp-code">${otpCode}</h1>
          </div>
          <p style="font-size: 12px; color: #718096;">Yeh code 5 minutes ke liye valid hai.</p>
        </div>
      </body>
    </html>
  `;
};