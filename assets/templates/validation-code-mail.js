function ValidationCodeMailTemplate({ name, code, expiresInMessage }) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 8px;">
  <div style="background-color: #007bff; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0;">Confirm your account</h1>
  </div>
  <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="font-size: 16px; color: #333;">Hello, ${name}</p>
      <p style="font-size: 16px; color: #333;">Your validation code is:</p>
      <p style="font-size: 24px; color: #007bff; font-weight: bold; margin: 20px 0;">${code}</p>
      <p style="font-size: 16px; color: #333;">Paste this code into the site to complete your verification.</p>
      <p style="font-size: 14px; color: #888;">${expiresInMessage}</p>
  </div>

  <footer style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
      <p>&copy; 2024 Nest Stripe App. All rights reserved.</p>
  </footer>
  </div>
`;
}

module.exports = {
  ValidationCodeMailTemplate
}