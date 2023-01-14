import Image from 'next/image';
import { urlFor } from '../sanity';
import Currency from 'react-currency-formatter';
import { addToBasket, removeFromBasket } from '../redux/basketSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { PlusIcon, MinusIcon } from '@heroicons/react/outline';

interface Props {
  items: Product[];
  id: string;
}

function CheckoutProduct({ id, items }: Props) {
  const dispatch = useDispatch();

  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));

    toast.error(`${items[0].title} removed from basket`, {
      position: 'bottom-center',
    });
  };

  const addItemToBasket = () => {
    dispatch(addToBasket(items[0]));

    toast.success(`${items[0].title} added to basket`, {
      position: 'bottom-center',
    });
  };

  return (
    <div className="flex flex-col gap-x-4 border-b border-gray-300 pb-5 lg:flex-row lg:items-center">
      <div className="relative h-44 w-44">
        <Image
          src={urlFor(items[0].image[0]).url()}
          layout="fill"
          objectFit="contain"
          alt="items"
        />
      </div>

      <div className="flex flex-1 items-end lg:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl">
            <h4 className="font-semibold lg:w-96">{items[0].title}</h4>
            <p className="flex items-end gap-x-1 font-semibold">
              <MinusIcon
                className="mr-4 h-9 w-6 cursor-pointer text-blue-600 opacity-75 transition hover:opacity-100"
                onClick={removeItemFromBasket}
              />
              {items.length}
              <PlusIcon
                className="ml-4 h-10 w-6 cursor-pointer text-blue-600 opacity-75 transition hover:opacity-100"
                onClick={addItemToBasket}
              />
            </p>
          </div>

          <Link
            href={`/details/${items[0].slug?.current}`}
            className="flex cursor-pointer items-end text-blue-500 hover:underline"
          >
            Show product details
          </Link>
        </div>
        <div className="flex flex-col items-end space-y-4">
          <h4 className="text-xl font-semibold lg:text-2xl">
            <Currency
              quantity={items.reduce((total, item) => total + item.price, 0)}
              currency="USD"
            />
          </h4>
        </div>
      </div>
    </div>
  );
}

export default CheckoutProduct;
