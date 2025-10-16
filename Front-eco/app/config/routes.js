export const ROUTES = {
  INDEX: '/',
  
  SESSION: {
    LOGIN: '/sesion/Login',
    REGISTER: '/sesion/Register',
    SELECT_PROFILE: '/sesion/SelectProfile',
    REGISTER_CONSUMER: '/sesion/RegisterConsumer',
    REGISTER_COMERCE: '/sesion/RegisterComerce',
    REGISTER_RIDER: '/sesion/RegisterRider',
  },
  
  CONSUMER: {
    HOME: '/consumer/Home',
    CART: '/consumer/Cart',
    PAYMENT: '/consumer/Payment',
    ORDER: '/consumer/Order',
    PRODUCT: (id) => `/consumer/Product/${id}`,
  },
  
  COMERCE: {
    HOME: '/comerce/Home',
    ADD_PRODUCT: '/comerce/AddProduct',
    // Vista de detalle/edición de producto para comerciante
    PRODUCT: (id) => `/comerce/Product/${id}`,

  },
};


export const ROUTE_PARAMS = {
  [ROUTES.CONSUMER.PRODUCT]: {
    id: 'string',
  },
  [ROUTES.CONSUMER.PAYMENT]: {
    total: 'number',
  },
  [ROUTES.CONSUMER.ORDER]: {
    order: 'object',
  },
};