import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { selectBasketItems } from '../redux/basketSlice';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from './Button';
import { Combobox, Menu, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import NextLink from 'next/link';

export interface Props {
  products: Product[];
}

const Header = ({ products }: Props) => {
  const { data: session } = useSession();
  const items = useSelector(selectBasketItems);

  const [selectedpod, setSelectedpod] = useState(products);
  const [query, setQuery] = useState('');

  const filteredpod =
    query === ''
      ? products
      : products.filter((prod) => {
          return prod.title.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <header className="fixed top-0 z-10 inline-flex w-full items-center justify-between  bg-gradient-to-r from-yellow-300 to-blue-300 p-3  ">
      <div className="flex items-center justify-center md:w-1/5">
        <Link href="/">
          <div className="relative h-11 w-11 cursor-pointer opacity-75 transition hover:opacity-100">
            <Image
              src="/logo-small.png"
              layout="fill"
              objectFit="contains"
              alt="logo"
            />
          </div>
        </Link>
      </div>

      <div className="relative mx-5 w-auto">
        <Combobox value={selectedpod} onChange={setSelectedpod}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredpod?.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredpod?.map((prod) => (
                    <NextLink href={`/details/${prod.slug?.current}`}>
                      <Combobox.Option
                        key={prod.title}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-yellow-300 text-black'
                              : 'text-gray-900'
                          }`
                        }
                        value={prod}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {prod.title}
                            </span>

                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-black' : 'text-yellow-300'
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    </NextLink>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>

      <div className="hidden flex-1 items-center justify-center space-x-9 md:inline-flex">
        <Link href="/search" className="link">
          Products
        </Link>
        <a className="link">Explore</a>
        <a className="link">Support</a>
      </div>
      <div className="flex items-center justify-center gap-x-4 md:w-1/5">
        <Link href="/checkout">
          <div className="relative cursor-pointer">
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 z-50 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-blue-500 text-[10px] text-white">
                {items.length}
              </span>
            )}
            <ShoppingBagIcon className="headerIcon" />
          </div>
        </Link>
        {session ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="link">
              {session.user?.name?.split(' ')[0]}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="w-35 absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className=" px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-blue-300 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => signOut()}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div>
            <Button
              padding="py-2 px-3 bg-gradient-to-r from-red-400 to-blue-400"
              title="SignIn"
              onClick={() => signIn()}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
