
/**
 * Re-exports all order service functions
 */

// Import and export all order service functions
import { fetchOrders, fetchOrderDetails } from './orders/order-fetch-service';
import { saveOrderChanges, createOrder } from './orders/order-modify-service';
import { deleteOrder, deleteAllOrders } from './orders/order-delete-service';

export {
  fetchOrders,
  fetchOrderDetails,
  saveOrderChanges,
  createOrder,
  deleteOrder,
  deleteAllOrders
};
