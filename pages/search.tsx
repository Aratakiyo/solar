import { Tab } from '@headlessui/react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Basket from '../components/Basket';
import Header from '../components/Header';
import Product from '../components/Product';
import { fetchCategories } from '../utils/fetchCategories';
import { fetchProducts } from '../utils/fetchProducts';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface Props {
  categories: Category[];
  products: Product[];
  session: Session | null;
}

function search({ categories, products }: Props) {
  const showProducts = (category: number) => {
    return products
      .filter((product) => product.category._ref === categories[category]._id)
      .map((product) => <Product product={product} key={product._id} />); // filter products by category
  };

  const allProd = () => {
    return products.map((product) => (
      <Product product={product} key={product._id} />
    ));
  };

  return (
    <div className="">
      <Head>
        <title>Search</title>
        <link rel="icon" href="/logo-small.png" />
      </Head>

      <Header products={products} />

      <Basket />

      <main className="relative top-5 h-[200vh] bg-[#02072F]">
        <section className="relative min-h-screen bg-[#02072F]">
          <div className="space-y-10 py-16">
            <Tab.Group>
              <Tab.List className="flex justify-center">
                <Tab
                  className={({ selected }) =>
                    `rounded-t-lg py-3 px-5 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
                      selected
                        ? 'borderGradient bg-[#020E5D] text-white'
                        : 'border-b-2 border-[#35383C] text-[#747474]'
                    }`
                  }
                >
                  All
                </Tab>

                {categories.map((category) => (
                  <Tab
                    key={category._id}
                    id={category._id}
                    className={({ selected }) =>
                      `rounded-t-lg py-3 px-2 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
                        selected
                          ? 'borderGradient bg-[#020E5D] text-white'
                          : 'border-b-2 border-[#35383C] text-[#747474]'
                      }`
                    }
                  >
                    {category.title}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mx-auto max-w-fit pt-10 pb-24 sm:px-4">
                <Tab.Panel className="tabPanel">{allProd()}</Tab.Panel>
                <Tab.Panel className="tabPanel">{showProducts(0)}</Tab.Panel>
                <Tab.Panel className="tabPanel">{showProducts(1)}</Tab.Panel>
                <Tab.Panel className="tabPanel">{showProducts(2)}</Tab.Panel>
                <Tab.Panel className="tabPanel">{showProducts(3)}</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </section>
      </main>
    </div>
  );
}

export default search;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const categories = await fetchCategories();
  const products = await fetchProducts();
  const session = await getSession(context);

  return {
    props: {
      categories,
      products,
      session,
    },
  };
};
