/* eslint-disable */
const nodemailer = require("nodemailer");
const path = require("path");
const {
  orderCreatedEmail,
} = require("../emails_templates/order_created_email");

const asset = (file) => path.join(__dirname, "../../assets", file);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // user: process.env.GMAIL_EMAIL, // e.g., "alvarez.arnoldo@gmail.com"
    user: "alvarez.arnoldo@gmail.com", // e.g., "alvarez.arnoldo@gmail.com"
    // pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
    pass: "ubfiljheujsrwhsy", // 16-char app password
  },
  logger: true, // optional: helpful during debugging
  debug: true, // optional
});

function randomBase36(len) {
  // base36: 0-9a-z
  let out = "";
  while (out.length < len) out += Math.random().toString(36).slice(2);
  return out.slice(0, len).toUpperCase(); // uppercase looks cleaner
}

const makeOrderCode10 = () => {
  // 10 chars total: 6 from timestamp + 4 random
  // timestamp part increases over time => reduces collision chance even more
  const ts = Date.now().toString(36).toUpperCase(); // e.g. "L5GZ2K..."
  const tsPart = ts.slice(-6).padStart(6, "0"); // last 6 chars
  const rndPart = randomBase36(4); // 4 chars random
  return `${tsPart}${rndPart}`; // 10 chars
};

const reserveUniqueOrderNumber = async (
  db,
  { prefix = "MCM", maxRetries = 10 } = {}
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const code10 = makeOrderCode10();
    const orderNumber = `${prefix}-${code10}`;

    try {
      // Use a dedicated collection as a "uniqueness lock"
      // Doc id = orderNumber, so uniqueness is guaranteed by Firestore
      await db.collection("order_numbers").doc(orderNumber).create({
        createdAt: new Date().toISOString(),
      });

      return orderNumber;
    } catch (err) {
      // Collision (doc already exists) => retry
      // Firestore Admin SDK usually throws code 6 for ALREADY_EXISTS
      if (err?.code === 6 || err?.message?.includes("ALREADY_EXISTS")) continue;
      throw err; // real error
    }
  }

  throw new Error(
    "Failed to generate a unique order number after max retries."
  );
};

const buildSkuQtyFromOrderProducts = (order_products = []) => {
  const skuQty = {};

  for (const product of order_products) {
    const productId = product?.id;
    if (!productId) continue;

    const variants = Array.isArray(product.size_variants)
      ? product.size_variants
      : [];

    for (const variant of variants) {
      const variantId = String(variant?.id ?? "");
      if (!variantId) continue;

      const qtyOrdered = Number(variant?.quantity ?? 0); // ✅ order uses quantity
      if (qtyOrdered <= 0) continue;

      const sku = `${productId}:${variantId}`;

      // ✅ if same sku appears twice, accumulate
      skuQty[sku] = Number(skuQty[sku] ?? 0) + qtyOrdered;
    }
  }

  return skuQty;
};
const isValidEmail = (s) =>
  typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

const sendingEmailToUserWhenOrderIsCreated = async (order) => {
  // console.log("encrypted_pin at sendingEmailToUser:", encrypted_pin);
  const {
    customer,
    warehouse_to_pickup,
    delivery_type,
    createdAt,
    order_products,
    order_number,
    order_status,
    payment_information,
    pricing,
  } = order;
  const { email } = customer || {};
  const to = (email || "").trim().toLowerCase();
  if (!isValidEmail(to)) {
    console.error("Invalid recipient email:", email);
    return null;
  }

  // Optional: quick sanity check; throws on bad auth/connection
  await transporter.verify();

  const preheader =
    "Thank you for choosing us!. Your order has been received and is being processed.";

  const html = orderCreatedEmail({
    preheader,
    order,
  });

  const mailOptions = {
    // from: process.env.GMAIL_EMAIL, // must match the authenticated account
    from: "alvarez.arnoldo@gmail.com", // must match the authenticated account
    to,
    // subject: "Your Marbella Cafe order has been received",
    subject: `Order received — ${order_number}`,
    text: `This is your order number:\n\n${order_number}\n\nIf you didn't buy coffee with us, ignore this email.`,

    attachments: [
      {
        filename: "Thanks.png",
        path: asset("Thanks.png"),
        cid: "marbella-thank-you",
      },
      {
        filename: "marbella_cup_of_coffee.jpeg",
        path: asset("marbella_cup_of_coffee.jpeg"),
        cid: "marbella-hero",
      },
    ],
    html,

    // (Optional) Make the SMTP envelope explicit; usually not needed, but can help:
    envelope: {
      from: process.env.GMAIL_EMAIL,
      to: to,
    },
    headers: { "X-Entity-Ref-ID": `marbella-${Date.now()}` },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("SMTP accepted:", info.accepted);
    // console.log("SMTP rejected:", info.rejected);
    // console.log("MessageID:", info.messageId);
    // console.log("Server response:", info.response);
    return {
      ok: true,
      message: "Email sent successfully...",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
// const sendingEmailToUserWhenOrderIsCreated = async (order) => {
//   // console.log("encrypted_pin at sendingEmailToUser:", encrypted_pin);
//   const {
//     customer,
//     warehouse_to_pickup,
//     delivery_type,
//     createdAt,
//     order_products,
//     order_number,
//     order_status,
//     payment_information,
//     pricing,
//   } = order;
//   const { email } = customer || {};
//   const to = (email || "").trim().toLowerCase();
//   if (!isValidEmail(to)) {
//     console.error("Invalid recipient email:", email);
//     return null;
//   }

//   // Optional: quick sanity check; throws on bad auth/connection
//   await transporter.verify();

//   const preheader =
//     "Thank you for choosing us!. Your order has been received and is being processed.";

//   const mailOptions = {
//     // from: process.env.GMAIL_EMAIL, // must match the authenticated account
//     from: "alvarez.arnoldo@gmail.com", // must match the authenticated account
//     to,
//     subject: "Your Marbella Cafe order has been received",
//     text: `This is your order number:\n\n${order_number}\n\nIf you didn't buy coffee with us, ignore this email.`,

//     attachments: [
//       {
//         filename: "at_restaurant-shopping.png",
//         path: asset("at_restaurant-shopping.png"),
//         cid: "marbella-hero",
//       },
//     ],
//     html: `
//   <div style="margin:0;padding:0;background:#0b0c0f;">
//     <!-- Preheader (hidden in body but visible in inbox preview) -->
//     <div style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;color:transparent;">
//       ${preheader}
//     </div>

//     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0c0f;">
//       <tr>
//         <td align="center" style="padding:24px 16px;">
//           <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:560px;max-width:560px;background:#101318;border-radius:16px;overflow:hidden;border:1px solid #1c2230;">
//             <!-- Header -->
//             <tr>
//               <td style="padding:20px 24px;background:#0f131a;">
//                 <table role="presentation" width="100%">
//                   <tr>
//                     <td align="left">
//                     <h1 style="
//                       margin:0 0 8px;
//                       font-family:'Raleway','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
//                       font-size:40px;
//                       line-height:1.3;
//                       font-weight:700;
//                       letter-spacing:0.5px;
//                       color:#ffffff;
//                       ">
//                           Café Marbella
//                     </h1>
//                     </td>

//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- Hero -->
//             <tr>
//               <td style="background:#141a24;">
//                 <img src="cid:marbella-hero" width="560" height="auto" alt="Cliply hero" style="display:block;width:100%;height:auto;border:0;">
//               </td>
//             </tr>

//             <!-- Content -->
//             <tr>
//               <td style="padding:28px 24px;background:#101318;">
//                 <h1 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#ffffff;">
//                   This is your order number:
//                 </h1>
//                 <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#c7cfdd;">
//                   Use this code to sign in or change your PIN:
//                 </p>

//                 <!-- Code box -->
//                 <div style="margin:0 0 20px;">
//                    <div style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;letter-spacing:6px;color:#101318;background:#ffffff;border-radius:12px;padding:14px 18px;border:1px solid #e6e8ef;">
//                      ${order_number}
//                    </div>
//                 </div>

//                 <h1 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.3;color:#ffffff;">
//                   Español: Usa este PIN para acceder o cambiar tu PIN
//                 </h1>

//                 <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8c96a6;">
//                   If you didn’t request this, you can ignore this email. | Si no solicitaste este código, ignora este correo.
//                 </p>
//               </td>
//             </tr>

//             <!-- Footer -->
//             <tr>
//               <td style="padding:18px 24px;background:#0f131a;">
//                 <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#778199;">
//                   © ${new Date().getFullYear()} Cliply. All rights reserved.
//                 </p>
//               </td>
//             </tr>
//           </table>

//           <!-- Dark-mode safety text contrast -->
//           <div style="height:24px;"></div>
//         </td>
//       </tr>
//     </table>
//   </div>
//   `,

//     // (Optional) Make the SMTP envelope explicit; usually not needed, but can help:
//     envelope: {
//       from: process.env.GMAIL_EMAIL,
//       to: to,
//     },
//     headers: {
//       "X-Entity-Ref-ID": `cliply-${Date.now()}`,
//     },
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     // console.log("SMTP accepted:", info.accepted);
//     // console.log("SMTP rejected:", info.rejected);
//     // console.log("MessageID:", info.messageId);
//     // console.log("Server response:", info.response);
//     return {
//       ok: true,
//       message: "Email sent successfully...",
//     };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

module.exports = {
  reserveUniqueOrderNumber,
  buildSkuQtyFromOrderProducts,
  sendingEmailToUserWhenOrderIsCreated,
};
