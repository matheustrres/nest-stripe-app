function SubscriptionRefundedTemplate({ name, refundAmount, refundDate }) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 8px;">
  <div style="background-color: #28a745; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0;">Subscription Refunded</h1>
  </div>
  <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="font-size: 16px; color: #333;">Hello, ${name}</p>
      <p style="font-size: 16px; color: #333;">We have successfully processed your subscription refund.</p>
      <p style="font-size: 16px; color: #333;">Refund Amount:</p>
      <p style="font-size: 24px; color: #28a745; font-weight: bold; margin: 20px 0;">$${refundAmount.toFixed(2)}</p>
      <p style="font-size: 16px; color: #333;">Refund Date:</p>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px;">${refundDate}</p>
      <p style="font-size: 16px; color: #333;">If you have any questions, feel free to contact our support team.</p>
  </div>

  <footer style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
      <p>&copy; 2024 Nest Stripe App. All rights reserved.</p>
  </footer>
  </div>
`;
}

module.exports = {
  SubscriptionRefundedTemplate
}
