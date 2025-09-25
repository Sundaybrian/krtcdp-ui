'use client';

import type { DialogProps } from '@mui/material/Dialog';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import {
  createCart,
  searchCart,
  cartCheckout,
  generateAdvanceOTP,
  verifyAdvanceOTP,
} from 'src/api/services';

import { CheckoutSteps } from '../checkout/checkout-steps';
import { CheckoutSummary } from '../checkout/checkout-summary';
import { CheckoutCartProductList } from '../checkout/checkout-cart-product-list';
import { CheckoutPaymentMethods } from '../checkout/checkout-payment-methods';
import { CheckoutOrderComplete } from '../checkout/checkout-order-complete';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  selectedFarmer: any;
  farmerAdvance: any;
  onClose: () => void;
};

export function CheckoutDialog({ open, selectedFarmer, farmerAdvance, onClose, ...other }: Props) {
  const checkout = useCheckoutContext();
  const [localStep, setLocalStep] = useState(0);

  const handleNextStep = () => {
    setLocalStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setLocalStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setLocalStep(0);
    onClose();
  };

  const handleOrderComplete = () => {
    checkout.onReset();
    setLocalStep(0);
    onClose();
  };

  const renderContent = () => {
    if (localStep === 0) {
      return (
        <CheckoutCartDialog
          onNextStep={handleNextStep}
          onClose={handleClose}
          selectedFarmer={selectedFarmer}
          farmerAdvance={farmerAdvance}
        />
      );
    }

    if (localStep === 1) {
      return (
        <CheckoutPaymentDialog
          onNextStep={handleNextStep}
          onBackStep={handleBackStep}
          selectedFarmer={selectedFarmer}
          farmerAdvance={farmerAdvance}
        />
      );
    }

    if (localStep === 2) {
      return <CheckoutOrderComplete open onReset={handleOrderComplete} onDownloadPDF={() => {}} />;
    }

    return null;
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose} {...other}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Checkout for {selectedFarmer?.firstName} {selectedFarmer?.lastName}
          </Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {localStep < 2 && (
          <CheckoutSteps
            activeStep={localStep}
            steps={PRODUCT_CHECKOUT_STEPS.slice(0, 2)} // Only show Cart and Payment steps
            sx={{ mb: 3 }}
          />
        )}

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type CheckoutCartDialogProps = {
  onNextStep: () => void;
  onClose: () => void;
  selectedFarmer: any;
  farmerAdvance: any;
};

function CheckoutCartDialog({
  onNextStep,
  onClose,
  selectedFarmer,
  farmerAdvance,
}: CheckoutCartDialogProps) {
  const checkout = useCheckoutContext();

  const empty = !checkout.items.length;

  const handleCreateCart = async () => {
    try {
      const cartItems = checkout.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await createCart({ items: cartItems, farmerId: selectedFarmer?.id });
      toast.success('Cart created successfully!');
      onNextStep();
    } catch (error) {
      console.error(error);
      toast.error('Error creating cart');
    }
  };

  return (
    <Box>
      {/* Farmer Info */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Order for Farmer:
        </Typography>
        <Typography variant="body2">
          {selectedFarmer?.firstName} {selectedFarmer?.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Member NO: {selectedFarmer?.Farmer?.memberNumber} | Phone:{' '}
          {selectedFarmer?.mobilePhone || 'N/A'}
        </Typography>
        {farmerAdvance && (
          <Typography
            variant="caption"
            color="primary.main"
            sx={{ display: 'block', mt: 1, fontWeight: 'medium' }}
          >
            Available Advance: KES {farmerAdvance.availableAdvance?.toLocaleString() || 0}
          </Typography>
        )}
      </Box>

      {/* Cart Content */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {empty ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Cart is empty!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some products to continue.
              </Typography>
            </Box>
          ) : (
            <CheckoutCartProductList
              products={checkout.items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Box>

        <Box sx={{ width: 320 }}>
          <CheckoutSummary
            total={checkout.total}
            discount={checkout.discount}
            subtotal={checkout.subtotal}
            onApplyDiscount={checkout.onApplyDiscount}
          />
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color="inherit"
          onClick={onClose}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue shopping
        </Button>

        <Button size="large" variant="contained" disabled={empty} onClick={handleCreateCart}>
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CheckoutPaymentDialogProps = {
  onNextStep: () => void;
  onBackStep: () => void;
  selectedFarmer: any;
  farmerAdvance: any;
};

function CheckoutPaymentDialog({
  onNextStep,
  onBackStep,
  selectedFarmer,
  farmerAdvance,
}: CheckoutPaymentDialogProps) {
  const checkout = useCheckoutContext();

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ADVANCE'>('CASH');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const PaymentSchema = zod
    .object({
      phoneNumber: zod.string().optional(),
      otp: zod.string().optional(),
    })
    .refine(
      (data) => {
        // OTP is required for advance payments when showing OTP verification
        if (paymentMethod === 'ADVANCE' && showOtpVerification && !data.otp) {
          return false;
        }
        return true;
      },
      {
        message: 'OTP is required for advance payments',
        path: ['otp'],
      }
    );

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      phoneNumber: selectedFarmer?.mobilePhone || '',
      otp: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (paymentMethod === 'ADVANCE' && !showOtpVerification) {
      // First step for advance payment - generate OTP
      try {
        setIsProcessingPayment(true);
        await generateAdvanceOTP(selectedFarmer?.Farmer?.memberNumber, {
          cooperativeId: farmerAdvance?.cooperativeId,
          amount: checkout.total,
        });
        setShowOtpVerification(true);
        toast.success('OTP sent successfully! Please enter the OTP to verify advance payment');
      } catch (error) {
        console.error('Error generating OTP:', error);
        toast.error('Failed to generate OTP. Please try again.');
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }

    if (paymentMethod === 'ADVANCE' && showOtpVerification && !data.otp) {
      toast.error('Please enter OTP to proceed');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Get user cart
      if (paymentMethod === 'ADVANCE') {
        // Check if cart total exceeds available advance
        if (checkout.total > (farmerAdvance?.availableAdvance || 0)) {
          toast.error(
            `Order total (KES ${checkout.total.toLocaleString()}) exceeds available advance (KES ${farmerAdvance?.availableAdvance?.toLocaleString() || 0})`
          );
          setIsProcessingPayment(false);
          return;
        }

        // First verify OTP
        try {
          await verifyAdvanceOTP(selectedFarmer?.Farmer?.memberNumber, {
            cooperativeId: farmerAdvance?.cooperativeId,
            amount: checkout.total,
            otp: data.otp,
          });
          toast.success('OTP verified successfully!');
        } catch (error) {
          console.error('Error verifying OTP:', error);
          toast.error('Invalid OTP. Please try again.');
          setIsProcessingPayment(false);
          return;
        }

        // Then process advance payment checkout
        await cartCheckout({
          paymentMethod: 'ADVANCE',
          cartId: 0,
          farmerId: selectedFarmer?.id,
          advanceAmount: checkout.total,
          advanceId: farmerAdvance.id,
          cashAmount: 0,
          phoneNumber: data.phoneNumber.slice(1),
        });
      } else {
        // Process cash payment without OTP
        await cartCheckout({
          paymentMethod: 'CASH',
          cartId: 0,
          farmerId: selectedFarmer?.id,
          advanceId: farmerAdvance.id,
          cashAmount: checkout.total,
          advanceAmount: 0,
          phoneNumber: data.phoneNumber.slice(1),
        });
      }

      toast.success('Order placed successfully!');

      // Wait a bit for processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onNextStep();
    } catch (error) {
      console.error(error);
      toast.error('Error processing payment');
    } finally {
      setIsProcessingPayment(false);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box>
        {/* Farmer Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Order for Farmer:
          </Typography>
          <Typography variant="body2">
            {selectedFarmer?.firstName} {selectedFarmer?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {selectedFarmer?.id} | Phone: {selectedFarmer?.mobilePhone || 'N/A'}
          </Typography>
          {farmerAdvance && (
            <Typography
              variant="caption"
              color="primary.main"
              sx={{ display: 'block', mt: 1, fontWeight: 'medium' }}
            >
              Available Advance: KES {farmerAdvance.availableAdvance?.toLocaleString() || 0}
            </Typography>
          )}
        </Box>

        {/* Payment Content */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {/* Payment Method Selection */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value as 'CASH' | 'ADVANCE');
                  setShowOtpVerification(false);
                }}
              >
                <FormControlLabel value="CASH" control={<Radio />} label="Cash Payment" />
                <FormControlLabel
                  value="ADVANCE"
                  control={<Radio />}
                  label={`Use Advance (Available: KES ${farmerAdvance?.availableAdvance?.toLocaleString() || 0})`}
                  disabled={!farmerAdvance?.availableAdvance || farmerAdvance.availableAdvance <= 0}
                />
              </RadioGroup>
            </FormControl>

            {/* Advance Payment Warning */}
            {paymentMethod === 'ADVANCE' &&
              checkout.total > (farmerAdvance?.availableAdvance || 0) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  Order total (KES {checkout.total.toLocaleString()}) exceeds available advance (KES{' '}
                  {farmerAdvance?.availableAdvance?.toLocaleString() || 0})
                </Alert>
              )}

            {/* Cash Payment Phone Number Field */}
            {paymentMethod === 'CASH' && (
              <Field.Text
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number for payment"
                helperText="Phone number for cash payment"
              />
            )}

            {/* OTP Verification for Advance Payment Only */}
            {paymentMethod === 'ADVANCE' && showOtpVerification && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  An OTP has been sent to verify the advance payment. Please enter the OTP below.
                </Alert>
                <Field.Text
                  name="otp"
                  label="OTP"
                  placeholder="Enter OTP"
                  helperText="Enter the OTP sent for advance payment verification"
                />
              </Box>
            )}
          </Box>

          <Box sx={{ width: 320 }}>
            <CheckoutSummary
              total={checkout.total}
              subtotal={checkout.subtotal}
              discount={checkout.discount}
              shipping={checkout.shipping}
              onEdit={() => onBackStep()}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting || isProcessingPayment}
              disabled={
                paymentMethod === 'ADVANCE' &&
                checkout.total > (farmerAdvance?.availableAdvance || 0)
              }
              sx={{ mt: 2 }}
            >
              {paymentMethod === 'ADVANCE' && !showOtpVerification
                ? 'Send OTP for Verification'
                : paymentMethod === 'ADVANCE' && showOtpVerification
                  ? 'Verify OTP & Complete Order'
                  : 'Complete Order'}
            </LoadingButton>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back to Cart
          </Button>
        </Box>
      </Box>
    </Form>
  );
}
