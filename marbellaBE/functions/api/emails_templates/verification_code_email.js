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

const verificationCodeEmail = ({ preheader, email_deliverable_code }) => {
  const year = new Date().getFullYear();

  return `
    
    <div style="margin:0;padding:0;background:#f5ead9;">
    
      <!-- Preheader -->
    
      <div style="
        display:none!important;
        visibility:hidden;
        opacity:0;
        height:0;
        width:0;
        overflow:hidden;
        color:transparent;">
        ${esc(preheader)}
      </div>
    
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          width:100%;
          max-width:640px;
          background:#ffffff;
          border-radius:18px;
          overflow:hidden;
          border:1px solid #eadfca;
        ">
    
    <tr>
      <td align="center" style="padding:0 12px 24px;">
    
        <table
          role="presentation"
          width="560"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width:560px;
            max-width:560px;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            border:1px solid #eadfca;
          ">
    
    
          <tr>
            <td style="padding:16px 20px 8px;background:#ffffff;" align="left">
    
              <img
                src="cid:marbella-register-user"
                alt="Verification code"
                width="420"
                style="
                  display:block;
                  width:100%;
                  max-width:420px;
                  height:auto;
                  border:0;
                "
              />
    
            </td>
          </tr>
    
    
          <tr>
            <td style="padding:0;background:#f5ead9;">
    
              <img
                src="cid:marbella-hero"
                width="560"
                alt="Café Marbella"
                style="
                  display:block;
                  width:100%;
                  height:auto;
                  border:0;
                "
              />
    
            </td>
          </tr>
    
    
          <tr>
    
            <td style="padding:28px 24px;">
    
              <div style="
                font-family:'Raleway','Segoe UI',Arial,sans-serif;
                font-size:32px;
                font-weight:800;
                color:#1f1f1f;
                margin-bottom:12px;
              ">
                Verify your email
              </div>
    
              <div style="
                font-family:Arial,Helvetica,sans-serif;
                font-size:18px;
                line-height:1.6;
                color:#4a4a4a;
                margin-bottom:26px;
              ">
                Enter the following code in Café Marbella to confirm this email address belongs to you.
              </div>
    
    
              <div style="
                background:#f5ead9;
                border:2px dashed #3A2F01;
                border-radius:14px;
                padding:24px;
                text-align:center;
                margin-bottom:24px;
              ">
    
                <div style="
                  font-family:'Raleway','Segoe UI',Arial,sans-serif;
                  font-size:52px;
                  font-weight:800;
                  letter-spacing:12px;
                  color:#3A2F01;
                ">
                  ${esc(email_deliverable_code)}
                </div>
    
              </div>
    
              <div style="
                font-family:Arial,Helvetica,sans-serif;
                font-size:16px;
                line-height:1.5;
                color:#6b6b6b;
                margin-bottom:12px;
              ">
                This code expires in 10 minutes.
              </div>
    
              <div style="
                font-family:Arial,Helvetica,sans-serif;
                font-size:16px;
                line-height:1.5;
                color:#6b6b6b;
              ">
                If you didn't request this code, you can safely ignore this email.
              </div>
    
            </td>
    
          </tr>
    
    
          <tr>
    
            <td style="
              padding:20px;
              background:#ffffff;
              border-top:1px solid #eadfca;
            ">
    
              <div style="
                font-family:Arial,Helvetica,sans-serif;
                font-size:11px;
                color:#8a8a8a;
              ">
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
  verificationCodeEmail,
};
