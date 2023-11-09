// --------------- API Methods --------------- //

const POST = {
  type: 'post',
  headers: {
    'content-type': 'multipart/form-data',
  },
  dataFormat: 'formData',
};
const POST_JSON = {
  type: 'post',
  dataFormat: 'raw',
};
const GET = {
  type: 'get',
  dataFormat: 'raw',
};
const GET_JSON = {
  type: 'get',
  headers: {
    'content-type': 'application/json',
  },
  dataFormat: 'json',
};
const PUT = {
  type: 'put',
  dataFormat: 'raw',
};
// const DEL = {
//   type: 'delete',
//   dataFormat: 'raw',
// };

export const HOTEL_LIST = (latitude, longitude) => {
  return {
    method: GET,
    path: `/public/hotel/list?latitude=${latitude}&longitude=${longitude}`,
  };
};

export const VIEW_HOTEL = (id) => {
  return {
    method: GET,
    path: `/public/hotel/view?hotelId=${id}`,
  };
};

export const TOURS_LIST = (id) => {
  return {
    method: GET,
    path: `/public/tour/list?hotelId=${id}`,
  };
};

export const CITY_LIST = {
  method: GET,
  path: '/public/city/list',
};

export const STOP_LIST = (id) => {
  return {
    method: GET,
    path: `/public/stop/list?cityId=${id}`,
  };
};

export const BOOK_TOUR = (tourId, cityId, stopId, uid) => {
  return {
    method: POST_JSON,
    path: `/public/tour/booking?tourId=${tourId}&cityId=${cityId}&stopId=${stopId}&uId=${uid}`,
  };
};

export const BOOKING_TYPE = {
  method: GET,
  path: '/public/tour/booking/type/list',
};

export const AIRPORT_LIST = {
  method: GET,
  path: '/public/airport/list',
};

export const VEHICLE_PRICE = (hotelId, airportId) => {
  return {
    method: GET,
    path: `/public/airportTransfer/vehiclePrice/list?hotelId=${hotelId}&airportId=${airportId}`,
  };
};

export const BOOK_AIRPORT_TRANSFER = (
  airportId,
  vehiclePriceId,
  hotelId,
  uid,
) => {
  return {
    method: POST_JSON,
    path: `/public/airportTransfer/booking?airportId=${airportId}&vehiclePriceId=${vehiclePriceId}&hotelId=${hotelId}&uId=${uid}`,
  };
};

export const LIST_BOOKED_TOURS = (uId) => {
  return {
    method: GET,
    path: `/public/tour/booking/list/uid?uId=${uId}`,
  };
};

export const VIEW_BOOKED_TOUR = (bId) => {
  return {
    method: GET,
    path: `/public/tour/booking/list/bid?bookingId=${bId}`,
  };
};

export const LIST_BOOKED_TRANSFERS = (uId) => {
  return {
    method: GET,
    path: `/public/airportTransfer/booking/list/uid?uId=${uId}`,
  };
};

export const VIEW_BOOKED_TRANSFER = (bId) => {
  return {
    method: GET,
    path: `/public/airportTransfer/booking/list/bid?bookingId=${bId}`,
  };
};

export const PAYMENT_INTENT = (id) => {
  return {
    method: POST_JSON,
    path: `/public/tour/payment?bookingId=${id}`,
  };
};

export const PAYMENT_CONFIRM = (bId) => {
  return {
    method: POST_JSON,
    path: `/public/tour/add/payment?id=${bId}`,
  };
};

export const GET_PAYMENT = (bId) => {
  return {
    method: GET,
    path: `/public/tour/get/payment?id=${bId}`,
  };
};

export const TRANSFER_PAYMENT_INTENT = (id) => {
  return {
    method: POST_JSON,
    path: `/public/airportTransfer/payment?bookingId=${id}`,
  };
};

export const TRANSFER_PAYMENT_CONFIRM = (bId) => {
  return {
    method: POST_JSON,
    path: `/public/airportTransfer/add/payment?id=${bId}`,
  };
};

export const GET_TRANSFER_PAYMENT = (bId) => {
  return {
    method: GET,
    path: `/public/airportTransfer/get/payment?id=${bId}`,
  };
};

export const BOOK_TICKET = (tourId, cityId, stopId, uid) => {
  return {
    method: POST_JSON,
    path: `/public/tour/ticket/booking?tourId=${tourId}&cityId=${cityId}&stopId=${stopId}&uId=${uid}`,
  };
};

export const TICKET_TOURS_LIST = (id) => {
  return {
    method: GET,
    path: `/public/tour/ticket/hotel/list?hotelId=${id}`,
  };
};

export const TICKET_GUIDE_TOUR_LIST = (id) => {
  return {
    method: GET,
    path: `/public/tour/guide/hotel/list?hotelId=${id}`,
  };
};

export const BOOK_GUIDE_TICKET = (tourId, cityId, stopId, uid) => {
  return {
    method: POST_JSON,
    path: `/public/tour/guide/booking?tourId=${tourId}&cityId=${cityId}&stopId=${stopId}&uId=${uid}`,
  };
};
