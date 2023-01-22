import Head from 'next/head';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Currency from 'react-currency-formatter';
import { useSelector } from 'react-redux';
import Stripe from 'stripe';
import Button from '../components/Button';
import { selectBasketItems, selectBasketTotal } from '../redux/basketSlice';
import CheckoutProduct from '../components/CheckoutProduct';
import { fetchPostJSON } from '../utils/api-helpers';
import getStripe from '../utils/get-stripejs';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  products: Product[];
}

function Checkout({ products}: Props) {
  const items = useSelector(selectBasketItems);
  const { data: session } = useSession();
  const basketTotal = useSelector(selectBasketTotal);
  const router = useRouter();
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
    {} as { [key: string]: Product[] }
  );
  const [loading, setLoading] = useState(false);

  const discount = () => {
    if (items.length >= 10) {
      const per = basketTotal / 10;
      return per;
    } else return 0;
  };

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {} as { [key: string]: Product[] });

    setGroupedItemsInBasket(groupedItems);
  }, [items]);

  const createCheckoutSession = async () => {
    setLoading(true);

    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      '/api/checkout_sessions',
      {
        items: items,
      }
    );

    // Internal Server Error
    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }

    // Redirect to checkout
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });

    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);

    setLoading(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#E7ECEE]">
      <Head>
        <title>Bag</title>
        <link rel="icon" href="/small-logo.png" />
      </Head>
      <Header products={products}  />
      <main className="mx-auto max-w-5xl pb-24 pt-20">
        <div className="px-5">
          <h1 className="my-4 text-3xl font-semibold lg:text-4xl">
            {items.length > 0 ? 'Review your bag.' : 'Your bag is empty.'}
          </h1>
          <p className="my-4">Free delivery and free returns.</p>

          {items.length === 0 && (
            <Button
              title="Continue Shopping"
              onClick={() => router.push('/search')}
            />
          )}
        </div>

        {items.length > 0 && (
          <div className="mx-5 md:mx-8">
            {Object.entries(groupedItemsInBasket).map(([key, items]) => (
              <CheckoutProduct key={key} items={items} id={key} />
            ))}

            <div className="my-12 mt-6 ml-auto max-w-3xl">
              <div className="divide-y divide-gray-300">
                <div className="pb-4">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>
                      <Currency quantity={basketTotal} currency="USD" />
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>FREE</p>
                  </div>
                  <div className="flex justify-between">
                    {items.length >= 10 && (
                      <div className="flex flex-col gap-x-1 lg:flex-row">
                        Discount for:{' +10 items'}
                      </div>
                    )}
                    {items.length >= 10 && (
                      <Currency quantity={discount()} currency="USD" />
                    )}

                    {items.length < 10 && (
                      <div className="flex flex-col gap-x-1 lg:flex-row">
                        Discount for:{' >10 items'}
                      </div>
                    )}
                    {items.length < 10 && <p>-$0</p>}
                  </div>
                </div>

                <div className="flex justify-between pt-4 text-xl font-semibold">
                  <h4>Total</h4>
                  <h4>
                    <Currency
                      quantity={basketTotal - discount()}
                      currency="USD"
                    />
                  </h4>
                </div>
              </div>

              <div className="my-14 space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2">
                    <h4 className="mb-4 flex flex-col text-xl font-semibold">
                      Pay in full
                      <span>
                        <Currency
                          quantity={basketTotal - discount()}
                          currency="USD"
                        />
                      </span>
                    </h4>
                    <div className='mx-15 space-x-5'>
                      <Link href="/search">
                        <Button
                          title="Continue Shopping"
                        />
                      </Link>
                      {session ? (
                        <Button
                          noIcon
                          loading={loading}
                          title="Check Out"
                          onClick={createCheckoutSession}
                        />
                      ) : (
                        <Button
                          noIcon
                          loading={loading}
                          title="Check Out"
                          onClick={() => {
                            window.location.replace('/search');
                            window.location.replace('/api/auth/signin');
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
