/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import {
  addCartItem,
  ensureArenaXSession,
  getCart,
  getBookingAddOns,
  removeCartItem,
  updateCartItem,
} from '../lib/arenaxApi';

const AddOnsContext = createContext(null);

export const AddOnsProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Home',
      name: 'Aarav Kumar',
      phone: '+91 98765 43210',
      street: '12 Wallajah Road',
      city: 'Chennai',
      pincode: '600002',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      name: 'Aarav Kumar',
      phone: '+91 98989 11122',
      street: '91 MG Road',
      city: 'Bengaluru',
      pincode: '560001',
      isDefault: false,
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholder: '',
    billingAddress: 'same',
  });

  const couponCatalog = {
    PLAY50: { code: 'PLAY50', amount: 50 },
    FUEL10: { code: 'FUEL10', amount: 10 },
  };

  const normalizeBooking = (booking) => {
    if (!booking) {
      return null;
    }

    if (booking.venueName) {
      return booking;
    }

    return {
      id: booking._id || booking.id,
      venueId: booking.venue?._id || booking.venue?.id,
      venueName: booking.venue?.name,
      city: booking.venue?.city,
      sportType: booking.venue?.sportTypes?.[0] || 'Cricket',
      level: 'Local',
      slotDate: booking.slot?.slotDate,
      timeLabel: booking.slot?.timeLabel,
      durationMinutes: booking.slot?.slotDurationMinutes || 60,
      amountPaid: booking.amountPaid || 0,
      pricePerHour: booking.slot?.slotPrice || booking.amountPaid || 0,
      bookingType: booking.bookingType,
    };
  };

  const withSession = async () => {
    const session = await ensureArenaXSession();
    return session.token;
  };

  const loadCart = async () => {
    setIsCartLoading(true);
    try {
      const token = await withSession();
      const response = await getCart(token);
      setCart(response.data.cart);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapCart = async () => {
      setIsCartLoading(true);
      try {
        const token = await withSession();
        const response = await getCart(token);
        setCart(response.data.cart);
      } finally {
        setIsCartLoading(false);
      }
    };

    bootstrapCart().catch(() => undefined);
  }, []);

  const openRecommendationsForBooking = async (bookingId, tokenOverride) => {
    setIsRecommendationsLoading(true);
    setIsModalOpen(true);

    try {
      const token = tokenOverride || (await withSession());
      const response = await getBookingAddOns(bookingId, token);
      setRecommendations(response.data.recommendations);
      setCart(response.data.cart);
      setLatestBooking(normalizeBooking(response.data.booking || null));
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  const closeRecommendations = () => {
    setIsModalOpen(false);
  };

  const addToCart = async (productId, tokenOverride) => {
    const token = tokenOverride || (await withSession());
    const response = await addCartItem(productId, token);
    setCart(response.data.cart);
    setRecommendations((current) =>
      current.map((item) => (item.id === productId ? { ...item, is_added: true } : item))
    );
  };

  const removeFromCart = async (productId, tokenOverride) => {
    const token = tokenOverride || (await withSession());
    const response = await removeCartItem(productId, token);
    setCart(response.data.cart);
    setRecommendations((current) =>
      current.map((item) => (item.id === productId ? { ...item, is_added: false } : item))
    );
  };

  const changeCartQuantity = async (productId, quantity, tokenOverride) => {
    const token = tokenOverride || (await withSession());
    const response = await updateCartItem(productId, quantity, token);
    setCart(response.data.cart);
  };

  const registerLatestBooking = (booking) => {
    setLatestBooking(normalizeBooking(booking));
    setCheckoutStep(booking ? 2 : 1);
  };

  const applyCoupon = (input) => {
    const normalized = input.trim().toUpperCase();
    const coupon = couponCatalog[normalized];

    if (!coupon) {
      setAppliedCoupon(null);
      setCouponError('Invalid promo code.');
      return false;
    }

    setAppliedCoupon(coupon);
    setCouponError('');
    return true;
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const addAddress = (address) => {
    const nextAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((current) => [...current, nextAddress]);
    setSelectedAddressId(nextAddress.id);
  };

  const bookingPrice = latestBooking?.amountPaid || 0;
  const addOnSubtotal = cart.total_price || 0;
  const subtotal = bookingPrice + addOnSubtotal;
  const gst = Number((subtotal * 0.18).toFixed(2));
  const deliveryCharge = cart.total_items > 0 ? 50 : 0;
  const discount = appliedCoupon ? appliedCoupon.amount : 0;
  const totalAmount = Number((subtotal + gst + deliveryCharge - discount).toFixed(2));

  const placeOrder = async () => {
    setPlacingOrder(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setCheckoutStep(4);
    setPlacingOrder(false);
  };

  return (
    <AddOnsContext.Provider
      value={{
        cart,
        recommendations,
        isModalOpen,
        isRecommendationsLoading,
        isCartLoading,
        openRecommendationsForBooking,
        closeRecommendations,
        addToCart,
        removeFromCart,
        changeCartQuantity,
        loadCart,
        latestBooking,
        registerLatestBooking,
        checkoutStep,
        setCheckoutStep,
        appliedCoupon,
        couponError,
        applyCoupon,
        clearCoupon,
        paymentMethod,
        setPaymentMethod,
        paymentDetails,
        setPaymentDetails,
        savedAddresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        termsAccepted,
        setTermsAccepted,
        placingOrder,
        placeOrder,
        totals: {
          bookingPrice,
          addOnSubtotal,
          subtotal,
          gst,
          deliveryCharge,
          discount,
          totalAmount,
        },
      }}
    >
      {children}
    </AddOnsContext.Provider>
  );
};

export const useAddOns = () => {
  const context = useContext(AddOnsContext);
  if (!context) {
    throw new Error('useAddOns must be used within AddOnsProvider');
  }
  return context;
};
