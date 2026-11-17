export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  COURIER: 'COURIER'
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
});

export const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH'
});

export const DELIVERY_STATUS = Object.freeze({
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED'
});

export const DOCUMENT_TYPES = Object.freeze({
  ID: 'ID',
  ADDRESS_PROOF: 'ADDRESS_PROOF',
  OTHER: 'OTHER'
});
