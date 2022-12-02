import {Grid} from '@mui/material';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Basket from '../components/Basket';
import Header from '../components/Header';
import Product from '../components/Product';
import { fetchCategories } from '../utils/fetchCategories';
import { fetchProducts } from '../utils/fetchProducts';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';


function history () {
    
    return (
    <div className="">
      <Head>
        <title>History</title>
        <link rel="icon" href="/logo-small.png" />
      </Head>

      <Header />

      <main className="relative h-[200vh] bg-white">
      
      </main>
    </div>
    );
};

export default history;