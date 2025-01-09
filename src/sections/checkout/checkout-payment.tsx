import type {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
  ICheckoutDeliveryOption,
} from 'src/types/checkout';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { searchCart, cartCheckout } from 'src/api/services';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutPaymentMethods } from './checkout-payment-methods';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: ICheckoutDeliveryOption[] = [
  { value: 0, label: 'Free', description: '5-7 days delivery' },
  { value: 10, label: 'Standard', description: '3-5 days delivery' },
  { value: 20, label: 'Express', description: '2-3 days delivery' },
];

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  { value: 'cash', label: 'Mpesa', description: 'Pay with Mpesa convinient and faster' },
];

const CARDS_OPTIONS: ICheckoutCardOption[] = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

// ----------------------------------------------------------------------

export type PaymentSchemaType = zod.infer<typeof PaymentSchema>;

export const PaymentSchema = zod.object({
  phoneNumber: zod.string().min(1, { message: 'Phone is required!' }),
  // Not required
});

// ----------------------------------------------------------------------

export function CheckoutPayment() {
  const checkout = useCheckoutContext();
  const { user } = useAuthContext();

  const defaultValues = { phoneNumber: '' };

  const methods = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // get user cart
    const userCart = await searchCart({ userId: user?.id!, status: 'ACTIVE' });

    try {
      await cartCheckout({
        paymentMethod: 'MPESA',
        cartId: userCart.id,
        phoneNumber: data.phoneNumber.slice(1),
      });

      toast.success('Order placed succesfully!');
      // sleep 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 10000));

      checkout.onNextStep();
      checkout.onReset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {/* <CheckoutDelivery onApplyShipping={checkout.onApplyShipping} options={DELIVERY_OPTIONS} /> */}

          <CheckoutPaymentMethods
            options={{
              payments: PAYMENT_OPTIONS,
              cards: CARDS_OPTIONS,
            }}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          {/* <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} /> */}

          <CheckoutSummary
            total={checkout.total}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete order
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
