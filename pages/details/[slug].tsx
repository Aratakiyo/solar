import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
import { Session } from 'next-auth';
import { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header';
import { client, urlFor } from '../../utils/clients';
import Image from 'next/image';
import styles from './index.module.css';
import Button from '../../components/Button';
import { addToBasket } from '../../redux/basketSlice';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Product from '../../components/Product';

interface Props {
  productDetails: Product;
  products: Product[];
  categories: Category[];
}

const Details = ({ productDetails, products, categories }: Props) => {
  const [imageIndex, setImageIndex] = useState(0);

  const dispatch = useDispatch();

  const addItemToBasket = () => {
    dispatch(addToBasket(productDetails));

    toast.success(`${productDetails.title} added to basket`, {
      position: 'bottom-center',
    });
  };

  const showProducts = (category: string) => {
    return products
      .filter((product) => product.category._ref === category)
      .map((product) => <Product product={product} key={product._id} />); // filter products by category
  };

  return (
    <div className="">
      <title>{productDetails.title}</title>
      <link rel="icon" href="/logo-small.png" />
      <div className={styles.container}>
        <Header />

        <main>
          <section className={styles.imagesContainer}>
            <div className={styles.bigImage}>
              <div className="bg-gradient-to-r from-red-300 to-blue-300">
                <Image
                  src={urlFor(productDetails.image[imageIndex]).url()}
                  alt={`${productDetails.title} ${imageIndex + 1}`}
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </section>
          <section className={styles.infoContainer}>
            <h2 className={styles.infoTitle}>
              {productDetails.title}
            </h2>
            <article>
              <h3 >Details: </h3>
              <p className={styles.desc}>{productDetails.description}</p>
            </article>
            <p className={styles.price}>Price: ${productDetails.price}</p>
            <div className={styles.actionsContainer}>
              <Link href={'/checkout'} onClick={addItemToBasket}>
                <Button title="Buy Now" />
              </Link>
              <Button title="Add to Cart" onClick={addItemToBasket} />
            </div>
          </section>
        </main>
        <div className={styles.productsWrapper}>
          <h2>You may also like</h2>
          <div className={styles.marquee}>
            <div className={styles.track && styles.productsContainer}>
              {showProducts(productDetails.category._ref)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query);

  const paths = products.map((product: any) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params: { slug },
}: any) => {
  const query = `*[_type == "product" && slug.current == "${slug}"][0]`;
  const productsQuery = "*[_type=='product']";

  const productDetails = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return { props: { productDetails, products } };
};

export default Details;
