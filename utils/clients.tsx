import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const client = sanityClient({
  projectId: '9p0z0ae8',
  dataset: 'production',
  apiVersion: '2022-05-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

const urlFor = (source: any) => builder.image(source);

export { client, urlFor };
      