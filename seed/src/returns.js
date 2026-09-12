// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */
function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }
  for (const line of lines) {
  const orderedLine = order.lines.find(
    (orderLine) => orderLine.sku === line.sku
  );

  if (!orderedLine) {
    throw new Error(`SKU ${line.sku} was not found on the order`);
  }
  if (line.quantity > orderedLine.quantity) {
  throw new Error(
    `SKU ${line.sku}: cannot return ${line.quantity} units when only ${orderedLine.quantity} were ordered`
  );
}
}
  const returnableLines = lines.filter((line) => !line.finalClearance);
  if (returnableLines.length == 0){
   throw new Error('cannot open a return: all lines are final clearance');
  }

  for (const line of lines) {
    const orderedLine = order.lines.find(
      (orderLine) => orderLine.sku === line.sku
    );

    if (!orderedLine) {
      throw new Error(`SKU ${line.sku} was not found on the order`);
    }

    if (line.quantity > orderedLine.quantity) {
      throw new Error(
        `SKU ${line.sku}: cannot return ${line.quantity} units when only ${orderedLine.quantity} were ordered`
      );
    }
  }

  return {
    orderId: order.id,
    lines: returnableLines,
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
