/**
 * Calculate delivery fee based on zones from Supabase settings.
 *
 * @param {Array}  zones        - Array of { name, fee, free_threshold } from DB
 * @param {string} zoneId       - Selected zone id
 * @param {number} cartSubtotal - Cart subtotal
 * @returns {{ fee: number, isFree: boolean }}
 */
export function calculateDeliveryFee(zones, zoneId, cartSubtotal) {
  const zone = zones.find(z => z.id === zoneId);
  if (!zone) return { fee: 0, isFree: false };

  const isFree =
    zone.free_threshold != null && cartSubtotal >= zone.free_threshold;

  return {
    fee: isFree ? 0 : Number(zone.fee),
    isFree,
    zone,
  };
}

/**
 * Check whether all cart items have their lead time satisfied.
 * @param {Array}  cartItems   - Cart items with product { lead_time } attached
 * @param {string} desiredDate - ISO date string from form (optional)
 * @returns {{ valid: boolean, blockers: string[] }}
 */
export function validateLeadTime(cartItems, desiredDate) {
  const blockers = [];

  cartItems.forEach(item => {
    if (!item.product?.lead_time) return;
    // lead_time is a string like "48 hours" or "24-HOUR NOTICE REQUIRED"
    // Extract the number of hours
    const match = item.product.lead_time.match(/(\d+)/);
    if (!match) return;

    const requiredHours = parseInt(match[1], 10);
    const requiredMs = requiredHours * 60 * 60 * 1000;

    if (!desiredDate) {
      blockers.push(
        `"${item.product.name}" requires ${requiredHours}h notice. Please select a preferred date.`
      );
      return;
    }

    const now = Date.now();
    const desired = new Date(desiredDate).getTime();
    if (desired - now < requiredMs) {
      blockers.push(
        `"${item.product.name}" requires ${requiredHours}h notice. Please choose a later date.`
      );
    }
  });

  return { valid: blockers.length === 0, blockers };
}
