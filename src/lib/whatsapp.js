/**
 * Build and URL-encode the COD WhatsApp message.
 * @param {Object} order - The order object from Supabase insert
 * @param {Array}  items - Array of { name, quantity, price }
 */
export function buildWhatsAppMessage(order, items) {
  const lineItems = items
    .map(i => `• ${i.name} x${i.quantity} – $${(i.price * i.quantity).toFixed(2)}`)
    .join('\n');

  const message = `
MAISON DU TORTE – CASH ON DELIVERY ORDER

Order ID: ${order.order_number}
Name: ${order.customer_name}
Phone: ${order.phone}
Email: ${order.email}
Delivery: ${order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup'}
Address: ${order.address || 'N/A (Pickup)'}
Preferred Date: ${order.preferred_date || 'Not specified'}

Items:
${lineItems}

Subtotal: $${Number(order.subtotal).toFixed(2)}
Delivery: $${Number(order.delivery_fee).toFixed(2)}
Total: $${Number(order.total).toFixed(2)}

Notes: ${order.notes || 'None'}
  `.trim();

  return message;
}

/**
 * Open WhatsApp with the pre-filled message.
 * @param {string} message - Plain text message
 * @param {string} [number] - WhatsApp number with country code (no +/spaces)
 */
export function openWhatsApp(message, number) {
  const phone = number || import.meta.env.VITE_WHATSAPP_ORDER_NUMBER;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
  return url;
}
