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
const money = (cents = 0) => {
  const n = Number(cents || 0);
  const dollars = n / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// "298 mi" -> "298 mi away" (or "3.2 mi away")
const formatMilesAway = (distance_in_miles) => {
  if (!distance_in_miles) return "";
  // your field is like "298 mi" (string)
  const s = String(distance_in_miles).trim();
  return s ? `${s} away` : "";
};

const getSelectedVariant = (product) => {
  const variants = Array.isArray(product?.size_variants)
    ? product.size_variants
    : [];
  return (
    variants.find((v) => Number(v?.quantity) > 0) ||
    variants.find((v) => v?.isDefault) ||
    variants[0] ||
    {}
  );
};

const orderCreatedEmail = ({ preheader, order }) => {
  const year = new Date().getFullYear();

  const {
    delivery_type,
    order_number,
    pricing = {},
    warehouse_to_pickup = {},
    customer = {},
    payment_information = {},
    order_products = [],
    quantity,
  } = order || {};

  // totals (your schema is cents)
  const itemsCents = pricing?.sub_total ?? 0;
  const shippingCents = pricing?.shipping ?? 0;
  const taxesCents = pricing?.taxes ?? 0;
  const discountCents = pricing?.discount ?? 0;
  const totalCents = pricing?.total ?? 0;

  // items count (prefer order.quantity, fallback sum of variant quantities)
  const itemsCount =
    Number(quantity) ||
    (order_products || []).reduce((sum, p) => {
      const v = getSelectedVariant(p);
      return sum + Number(v?.quantity || 0);
    }, 0);

  // shipment
  const isPickup = delivery_type === "pickup";
  const shipTitle = isPickup ? "Pickup at" : "Delivery to";
  const shipSubtitle = isPickup ? "Warehouse" : "Address";

  const shipmentAddress = isPickup
    ? warehouse_to_pickup?.warehouse_address || ""
    : order?.order_delivery_address || customer?.customer_address || "";

  const opening = warehouse_to_pickup?.opening_time || "";
  const closing = warehouse_to_pickup?.closing_time || "";
  const hoursLine = opening && closing ? `Between ${opening} – ${closing}` : "";

  const distanceLine = isPickup
    ? formatMilesAway(warehouse_to_pickup?.distance_in_miles)
    : "";

  // payment (your schema: last_four)
  const last4 = payment_information?.last_four || "";
  const paymentLine = last4 ? `Card ending in ${esc(last4)}` : "Card";

  // products list (your schema)
  const productsHtml = (order_products || [])
    .map((p) => {
      const v = getSelectedVariant(p);

      const brandTitle = p?.title || "Café Marbella"; // "Cafe Marbella"
      const origin = p?.originCountry || ""; // "Hondúras"
      const grind = p?.product_subtitle || ""; // "Ground Bean Honduras"
      const sizeText = [v?.sizeLabel, v?.sizeLabel_ounces]
        .filter(Boolean)
        .join(" - "); // "250 gr - 9 oz"

      const qty = Number(v?.quantity || 1);
      const unitPriceCents = Number(v?.price || 0);
      const lineTotalCents = unitPriceCents * qty;

      return `
          <tr>
            <td style="padding:14px 0;border-top:1px solid #e9e0c9;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align:top;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f1f1f;font-weight:700;">
                      ${esc(brandTitle)}
                    </div>
  
                    <div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.1;color:#1f1f1f;font-weight:900;">
                      ${esc(origin)}
                    </div>
  
                    <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1f1f1f;font-weight:700;">
                      ${esc(grind)}
                    </div>
  
                    <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4a4a4a;">
                      ${sizeText ? esc(sizeText) : ""}
                    </div>
                  </td>
  
                  <td align="right" style="vertical-align:top;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1;color:#1f1f1f;font-weight:900;">
                      ${money(lineTotalCents)}
                    </div>
                    <div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#4a4a4a;">
                      Qty: ${esc(qty)}${
        qty > 1 ? ` • Each: ${money(unitPriceCents)}` : ""
      }
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;
    })
    .join("");

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
            <td style="padding:16px 20px 8px;background:#ffffff;" align="center">
                <img src="cid:marbella-thank-you" alt="Thank you for choosing Café Marbella" 
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
                <td style="padding:18px 20px 8px;">
                  <div style="
                    font-family:'Raleway','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-size:22px;
                    line-height:1.25;
                    font-weight:800;
                    color:#1f1f1f;
                    margin:0 0 6px 0;">
                    Order received
                  </div>
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4a4a4a;">
                    Order number: <strong style="color:#1f1f1f;">${esc(
                      order_number
                    )}</strong>
                  </div>
                </td>
              </tr>
  
              <!-- Totals -->
              <tr>
                <td style="padding:14px 20px 10px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1f1f1f;">
                    <tr>
                      <td style="padding:6px 0;">Items (${esc(
                        itemsCount
                      )}):</td>
                      <td align="right" style="padding:6px 0;">${money(
                        itemsCents
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">Shipping &amp; handling:</td>
                      <td align="right" style="padding:6px 0;">${money(
                        shippingCents
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">Estimated tax:</td>
                      <td align="right" style="padding:6px 0;">${money(
                        taxesCents
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">Discounts:</td>
                      <td align="right" style="padding:6px 0;">-${money(
                        discountCents
                      )}</td>
                    </tr>
  
                    <tr><td colspan="2" style="padding:10px 0;"><div style="height:1px;background:#eadfca;"></div></td></tr>
  
                    <tr>
                      <td style="padding:6px 0;font-weight:800;font-size:16px;">Order total:</td>
                      <td align="right" style="padding:6px 0;font-weight:800;font-size:16px;">${money(
                        totalCents
                      )}</td>
                    </tr>
                  </table>
                </td>
              </tr>
  
              <!-- Shipment details title -->
              <tr>
                <td style="padding:12px 20px 8px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;color:#1f1f1f;">
                    Shipment details
                  </div>
                </td>
              </tr>
  
              <!-- Shipment card -->
              <tr>
                <td style="padding:0 20px 14px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="background:#f6f1c9;border-radius:18px;overflow:hidden;">
                    <tr>
                      <td style="padding:18px 16px;">
                        <div style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:900;color:#1f1f1f;">
                          ${esc(shipTitle)}
                        </div>
                        <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;color:#1f1f1f;margin-top:2px;">
                          ${esc(shipSubtitle)}
                        </div>
  
                        <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1f1f1f;margin-top:10px;">
                          ${esc(shipmentAddress)}
                        </div>
  
                        ${
                          hoursLine
                            ? `
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1f1f1f;margin-top:10px;">
                            ${esc(hoursLine)}
                          </div>
                        `
                            : ``
                        }
  
                        ${
                          distanceLine
                            ? `
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1f1f1f;margin-top:6px;">
                            ${esc(distanceLine)}
                          </div>
                        `
                            : ``
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
  
              <!-- Payment card -->
              <tr>
                <td style="padding:0 20px 18px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="background:#f6f1c9;border-radius:18px;overflow:hidden;">
                    <tr>
                      <td style="padding:18px 16px;">
                        <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;color:#1f1f1f;">
                          Payment method used
                        </div>
                        <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1f1f1f;margin-top:6px;">
                          ${paymentLine}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
  
              <!-- Products title -->
              <tr>
                <td style="padding:8px 20px 8px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:900;color:#1f1f1f;">
                    Products in the order
                  </div>
                </td>
              </tr>
  
              <!-- Products list -->
              <tr>
                <td style="padding:0 20px 18px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    ${
                      productsHtml ||
                      `
                      <tr>
                        <td style="padding:14px 0;border-top:1px solid #e9e0c9;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4a4a4a;">
                          (No products found in this order)
                        </td>
                      </tr>
                    `
                    }
                  </table>
                </td>
              </tr>
  
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
  orderCreatedEmail,
};

// const orderCreatedEmail = ({ preheader, order_number }) => {
//   const year = new Date().getFullYear();

//   return `
//       <div style="margin:0;padding:0;background:#0b0c0f;">
//         <!-- Preheader -->
//         <div style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;color:transparent;">
//           ${preheader}
//         </div>

//         <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0c0f;">
//           <tr>
//             <td align="center" style="padding:24px 16px;">
//               <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0"
//                 style="width:560px;max-width:560px;background:#101318;border-radius:16px;overflow:hidden;border:1px solid #1c2230;">

//                 <!-- Header -->
//                 <tr>
//                   <td style="padding:20px 24px;background:#0f131a;">
//                     <h1 style="
//                       margin:0 0 8px;
//                       font-family:'Raleway','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
//                       font-size:40px;
//                       line-height:1.3;
//                       font-weight:700;
//                       letter-spacing:0.5px;
//                       color:#ffffff;
//                     ">
//                       Café Marbella
//                     </h1>
//                   </td>
//                 </tr>

//                 <!-- Hero -->
//                 <tr>
//                   <td style="background:#141a24;">
//                     <img src="cid:marbella-hero" width="560" alt="Café Marbella"
//                       style="display:block;width:100%;height:auto;border:0;">
//                   </td>
//                 </tr>

//                 <!-- Content -->
//                 <tr>
//                   <td style="padding:28px 24px;background:#101318;">
//                     <h1 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:22px;color:#ffffff;">
//                       This is your order number:
//                     </h1>

//                     <div style="margin:16px 0 20px;">
//                       <div style="
//                         display:inline-block;
//                         font-family:Arial,Helvetica,sans-serif;
//                         font-size:28px;
//                         font-weight:700;
//                         letter-spacing:6px;
//                         color:#101318;
//                         background:#ffffff;
//                         border-radius:12px;
//                         padding:14px 18px;
//                         border:1px solid #e6e8ef;
//                       ">
//                         ${order_number}
//                       </div>
//                     </div>

//                     <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8c96a6;">
//                       If you didn’t request this, you can ignore this email.
//                     </p>
//                   </td>
//                 </tr>

//                 <!-- Footer -->
//                 <tr>
//                   <td style="padding:18px 24px;background:#0f131a;">
//                     <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#778199;">
//                       © ${year} Café Marbella. All rights reserved.
//                     </p>
//                   </td>
//                 </tr>

//               </table>
//             </td>
//           </tr>
//         </table>
//       </div>
//       `;
// };

// module.exports = {
//   orderCreatedEmail,
// };
