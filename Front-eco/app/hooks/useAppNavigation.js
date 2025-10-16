import { useRouter } from 'expo-router';
import { ROUTES } from '../config/routes';

export function useAppNavigation() {
  const router = useRouter();

  const navigate = {

    toIndex: () => router.replace(ROUTES.INDEX),


    toLogin: () => router.push(ROUTES.SESSION.LOGIN),
    toRegister: () => router.push(ROUTES.SESSION.REGISTER),
    toSelectProfile: () => router.push(ROUTES.SESSION.SELECT_PROFILE),
    toRegisterConsumer: () => router.push(ROUTES.SESSION.REGISTER_CONSUMER),
    toRegisterComerce: () => router.push(ROUTES.SESSION.REGISTER_COMERCE),
    toRegisterRider: () => router.push(ROUTES.SESSION.REGISTER_RIDER),


    toConsumerHome: () => router.replace(ROUTES.CONSUMER.HOME),
    toConsumerCart: () => router.push(ROUTES.CONSUMER.CART),
    toProductDetails: (id) => router.push(ROUTES.CONSUMER.PRODUCT(id)),
    toPayment: (total) => router.push({
      pathname: ROUTES.CONSUMER.PAYMENT,
      params: { total }
    }),
    toOrder: (order) => router.push({
      pathname: ROUTES.CONSUMER.ORDER,
      params: { order }
    }),


    toComerceHome: () => router.replace(ROUTES.COMERCE.HOME),
    toAddProduct: () => router.push(ROUTES.COMERCE.ADD_PRODUCT),
    toComerceOrders: () => router.push(ROUTES.COMERCE.ORDERS),
  toComerceProductDetails: (id) => router.push(ROUTES.COMERCE.PRODUCT(id)),
    


    back: () => router.back(),
    replace: (route) => router.replace(route),
  };

  return navigate;
} 

export default useAppNavigation;