function InviteGuestEmailTemplate({ guestEmail, guestName, linkWithToken, ownerName }) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 8px;">
    <div style="background-color: #007bff; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0;">CollabHub invitation!</h1>
    </div>
    <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="font-size: 16px; color: #333;">Howdy there, ${guestName}!</p>
      <p style="font-size: 16px; color: #333;">${ownerName} has invited you to join CollabHub.</p>
      <p style="font-size: 16px; color: #333;">To accept the invitation and get started, click the button below:</p>
      <a href="${linkWithToken}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p style="font-size: 14px; color: #888; margin-top: 20px;">If the button above doesn’t work, copy and paste the following link into your browser:</p>
      <p style="font-size: 14px; color: #555;">${linkWithToken}</p>
    </div>

    <footer style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
      <p>&copy; 2024 CollabHub. All rights reserved.</p>
    </footer>
  </div>
`;
}

module.exports = {
  InviteGuestEmailTemplate
};
