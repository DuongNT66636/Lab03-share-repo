// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @param {object} user   the staff member opening the return
 * @returns {object} the new return request
 */
function openReturn(order, lines, user) {
  if (!user || (user.role !== 'customer_service' && user.role !== 'operations')) {
    throw new Error('only customer service or operations staff can open a return');
  }

  if (!lines || lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  return {
    orderId: order.id,
    lines,
    raisedBy: user.id,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId, reason) {
  if (!reason) {
    throw new Error('a refund approval must carry a reason');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };