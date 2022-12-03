import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { ShoppingBagIcon, UserIcon, ClockIcon } from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { selectBasketItems } from '../redux/basketSlice';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from './Button';
import { Menu, Transition } from '@headlessui/react';

function Header() {
  const { data: session } = useSession();
  const items = useSelector(selectBasketItems);

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between  bg-gradient-to-r from-yellow-100 to-blue-200 p-4">
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
      <div className="hidden flex-1 items-center justify-center space-x-8 md:flex">
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

        <Link href="/history" className="headerIcon">
          <ClockIcon className="cursor-pointer rounded-full" />
        </Link>

        {session ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <Image
                src={
                  session.user?.image ||
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
                alt=""
                className="cursor-pointer rounded-full"
                width={34}
                height={34}
              />
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
          <Button
            padding="py-2 px-3 bg-gradient-to-r from-red-400 to-blue-400"
            title="Sign In"
            onClick={() => signIn()}
          />
        )}
      </div>
    </header>
  );
}

export default Header;
