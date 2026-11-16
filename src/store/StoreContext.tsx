import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { getProduct, Product } from '@/data/catalog';

export type CartLine = { key: string; productId: string; size: string; qty: number };

export type Address = {
  fullName: string;
  line1: string;
  city: string;
  postcode: string;
  phone: string;
};

export type DeliveryMethod = 'courier' | 'pickup';
export type PaymentMethod = 'cod' | 'card' | 'wallet';
export type OrderStatus = 'placed' | 'packed' | 'out' | 'delivered';

export type Order = {
  id: string;
  createdAt: number;
  lines: CartLine[];
  total: number;
  address: Address;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  status: OrderStatus;
  etaMinutes: number;
};

export type User = { name: string; email: string; guest: boolean } | null;

type State = {
  bag: CartLine[];
  saved: string[];
  orders: Order[];
  user: User;
  address: Address;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
};

const defaultAddress: Address = {
  fullName: 'Alex Morgan',
  line1: '22 Hartley Street, Flat 4B',
  city: 'London',
  postcode: 'E8 3RP',
  phone: '+44 7700 900123',
};

const initial: State = {
  bag: [],
  saved: ['p3', 'p7'],
  orders: [],
  user: null,
  address: defaultAddress,
  delivery: 'courier',
  payment: 'cod', // Cash on delivery is preselected — 7 of 10 testers preferred it.
};

type Action =
  | { type: 'ADD'; productId: string; size: string }
  | { type: 'QTY'; key: string; qty: number }
  | { type: 'REMOVE'; key: string }
  | { type: 'CLEAR_BAG' }
  | { type: 'TOGGLE_SAVE'; productId: string }
  | { type: 'SET_ADDRESS'; address: Address }
  | { type: 'SET_DELIVERY'; delivery: DeliveryMethod }
  | { type: 'SET_PAYMENT'; payment: PaymentMethod }
  | { type: 'PLACE_ORDER'; order: Order }
  | { type: 'SIGN_IN'; user: NonNullable<User> }
  | { type: 'SIGN_OUT' }
  | { type: 'ADVANCE_ORDER'; id: string; status: OrderStatus };

const lineKey = (productId: string, size: string) => `${productId}__${size}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const key = lineKey(action.productId, action.size);
      const existing = state.bag.find((l) => l.key === key);
      if (existing) {
        return {
          ...state,
          bag: state.bag.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 9) } : l)),
        };
      }
      return {
        ...state,
        bag: [...state.bag, { key, productId: action.productId, size: action.size, qty: 1 }],
      };
    }
    case 'QTY':
      return {
        ...state,
        bag: action.qty <= 0
          ? state.bag.filter((l) => l.key !== action.key)
          : state.bag.map((l) => (l.key === action.key ? { ...l, qty: Math.min(action.qty, 9) } : l)),
      };
    case 'REMOVE':
      return { ...state, bag: state.bag.filter((l) => l.key !== action.key) };
    case 'CLEAR_BAG':
      return { ...state, bag: [] };
    case 'TOGGLE_SAVE':
      return {
        ...state,
        saved: state.saved.includes(action.productId)
          ? state.saved.filter((id) => id !== action.productId)
          : [...state.saved, action.productId],
      };
    case 'SET_ADDRESS':
      return { ...state, address: action.address };
    case 'SET_DELIVERY':
      return { ...state, delivery: action.delivery };
    case 'SET_PAYMENT':
      return { ...state, payment: action.payment };
    case 'PLACE_ORDER':
      return { ...state, bag: [], orders: [action.order, ...state.orders] };
    case 'SIGN_IN':
      return { ...state, user: action.user };
    case 'SIGN_OUT':
      return { ...state, user: null };
    case 'ADVANCE_ORDER':
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: action.status } : o)),
      };
    default:
      return state;
  }
}

export const DELIVERY_FEE = 0; // All-in pricing: no delivery or service fees.

export type BagLineView = CartLine & { product: Product; lineTotal: number };

type StoreValue = {
  state: State;
  bagLines: BagLineView[];
  bagCount: number;
  subtotal: number;
  total: number;
  addToBag: (productId: string, size: string) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearBag: () => void;
  toggleSave: (productId: string) => void;
  isSaved: (productId: string) => boolean;
  setAddress: (address: Address) => void;
  setDelivery: (delivery: DeliveryMethod) => void;
  setPayment: (payment: PaymentMethod) => void;
  placeOrder: () => Order | null;
  signIn: (name: string, email: string, guest: boolean) => void;
  signOut: () => void;
  advanceOrder: (id: string, status: OrderStatus) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

let orderCounter = 48213;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const bagLines = useMemo<BagLineView[]>(
    () =>
      state.bag
        .map((line) => {
          const product = getProduct(line.productId);
          if (!product) return null;
          return { ...line, product, lineTotal: product.price * line.qty };
        })
        .filter((l): l is BagLineView => l !== null),
    [state.bag],
  );

  const subtotal = bagLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const total = subtotal + (state.delivery === 'courier' ? DELIVERY_FEE : 0);
  const bagCount = bagLines.reduce((sum, l) => sum + l.qty, 0);

  const addToBag = useCallback((productId: string, size: string) => dispatch({ type: 'ADD', productId, size }), []);
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: 'QTY', key, qty }), []);
  const removeLine = useCallback((key: string) => dispatch({ type: 'REMOVE', key }), []);
  const clearBag = useCallback(() => dispatch({ type: 'CLEAR_BAG' }), []);
  const toggleSave = useCallback((productId: string) => dispatch({ type: 'TOGGLE_SAVE', productId }), []);
  const setAddress = useCallback((address: Address) => dispatch({ type: 'SET_ADDRESS', address }), []);
  const setDelivery = useCallback((delivery: DeliveryMethod) => dispatch({ type: 'SET_DELIVERY', delivery }), []);
  const setPayment = useCallback((payment: PaymentMethod) => dispatch({ type: 'SET_PAYMENT', payment }), []);
  const signIn = useCallback(
    (name: string, email: string, guest: boolean) => dispatch({ type: 'SIGN_IN', user: { name, email, guest } }),
    [],
  );
  const signOut = useCallback(() => dispatch({ type: 'SIGN_OUT' }), []);
  const advanceOrder = useCallback(
    (id: string, status: OrderStatus) => dispatch({ type: 'ADVANCE_ORDER', id, status }),
    [],
  );

  // Builds an order from the current bag + checkout choices and empties the bag.
  const placeOrder = useCallback((): Order | null => {
    if (bagLines.length === 0) return null;
    orderCounter += 1;
    const order: Order = {
      id: `ON-${orderCounter}`,
      createdAt: Date.now(),
      lines: state.bag,
      total,
      address: state.address,
      delivery: state.delivery,
      payment: state.payment,
      status: 'placed',
      etaMinutes: 45,
    };
    dispatch({ type: 'PLACE_ORDER', order });
    return order;
  }, [bagLines.length, state.bag, state.address, state.delivery, state.payment, total]);

  const value: StoreValue = {
    state,
    bagLines,
    bagCount,
    subtotal,
    total,
    addToBag,
    setQty,
    removeLine,
    clearBag,
    toggleSave,
    isSaved: (productId) => state.saved.includes(productId),
    setAddress,
    setDelivery,
    setPayment,
    placeOrder,
    signIn,
    signOut,
    advanceOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
