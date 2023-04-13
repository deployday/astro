import { defineConfig } from 'astro/config';
// import responsiveImage from 'astro-responsive-image';

export default defineConfig({
  outDir: '../../build/packages/example',
  // image: {
  //   service: 'astro/assets/services/sharp',
  // },
  // experimental: {
  //   assets: true,
  // },
  integrations: [
    // responsiveImage({
    //   folder: '_img',
    // }),
  ],
});
