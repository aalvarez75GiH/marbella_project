// /* eslint-disable */
/* eslint-disable */

// escape HTML (important for user-provided strings)
const esc = (v = "") =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// cents -> "$0.00"

const registeredUserCreatedEmail = ({
  preheader,
  display_name,
  decrypted_pin,
}) => {
  const year = new Date().getFullYear();

  //   const { name } = userToSendEmailTo || {};

  return `
        <div style="margin:0;padding:0;background:#f5ead9;">
          <!-- Preheader -->
          <div style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;color:transparent;">
            ${esc(preheader)}
          </div>
      
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #eadfca;">  
            <tr>
              <td align="center" style="padding:0 12px 24px;">
                <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0"
                  style="width:560px;max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #eadfca;">
                <tr>
                <td style="padding:16px 20px 8px;background:#ffffff;" align="left">
                    <img src="cid:marbella-register-user" alt="Your PIN number has been reset" width="420"
                    style="
                    display:block;
                    width:100%;
                    max-width:420px;
                    height:auto;
                    border:0;
                    line-height:0;
                    "
                    />
                </td>
            </tr>
         
                    <td style="height:8px;line-height:8px;font-size:0;background:#ffffff;">&nbsp;</td>
                </tr>
                  <!-- HERO IMAGE FIRST -->
                  <tr>
                    <td style="padding:0;background:#f5ead9;">
                      <img src="cid:marbella-hero" width="560" alt="Café Marbella"
                        style="display:block;width:100%;height:auto;border:0;line-height:0;">
                    </td>
                  </tr>
      
                  <!-- Header -->
            <tr>
                <td style="padding:24px 20px 20px;">
    
            <!-- Name -->
            <div style="
                font-family:'Raleway','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                font-size:32px;
                line-height:1.25;
                font-weight:800;
                color:#1f1f1f;
                margin:0 0 8px 0;">
                ${esc(display_name)}
            </div>

            <!-- Welcome -->
            <div style="
                font-family:'Raleway','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                font-size:26px;
                line-height:1.25;
                font-weight:800;
                color:#1f1f1f;
                margin:0 0 20px 0;">
                Welcome to Café Marbella!
            </div>

            <!-- Spacer (bulletproof) -->
            <div style="height:12px; line-height:12px; font-size:0;">&nbsp;</div>

            <!-- PIN message -->
            <div style="
                font-family:Arial,Helvetica,sans-serif;
                font-size:20px;
                line-height:1.5;
                color:#4a4a4a;
                margin:0 0 18px 0;">
                We have generated this PIN number for you:
                <strong style="color:#1f1f1f;">${esc(decrypted_pin)}</strong>
            </div>

            <!-- Change PIN note -->
            <div style="
                font-family:Arial,Helvetica,sans-serif;
                font-size:20px;
                line-height:1.5;
                color:#4a4a4a;">
                    You can change it anytime later in the app if you’d like.
            </div>

            </td>
            /tr>
      
                  <!-- Footer -->
                  <tr>
                    <td style="padding:16px 20px;background:#ffffff;border-top:1px solid #eadfca;">
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b6b6b;">
                        If you didn’t place this order, you can ignore this email.
                      </div>
                      <div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8a8a8a;">
                        © ${year} Café Marbella. All rights reserved.
                      </div>
                    </td>
                  </tr>
      
                </table>
              </td>
            </tr>
          </table>
        </div>
        `;
};

module.exports = {
  registeredUserCreatedEmail,
};
