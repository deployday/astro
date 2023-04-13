// @ts-nocheck
// import type { GetImageTransform } from '@astrojs/image/dist/lib/get-image';

export function absoluteUrl(url: string): string {
  // Remove starting slash from url
  if (url.startsWith('/')) {
    url = url.substring(1);
  }

  return `${import.meta.env.SITE}${url}`;
}

// interface GetImageTransform extends Omit<TransformOptions, 'src'> {
//   src: string | ImageMetadata | Promise<{ default: ImageMetadata }>;
//   alt: string;
// }

let _images: Record<string, () => Promise<{ default: ImageMetadata }>>;

const loadImages = async () => {
  // const images = await import.meta.glob('../assets/**');
  // const images = await import.meta.glob('~/assets/images/**');
  const images = await import.meta.glob('/src/assets/images/**');
  return images;
};

export const getImages = async () => {
  _images = _images || (await loadImages());
  return _images;
};

// export const loadImage = async (imagePath?: string) => {
//   if (typeof imagePath !== 'string') {
//     return null;
//   }
//
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
//
//   if (!imagePath.startsWith('~/assets')) {
//     return null;
//   } // For now only consume images using ~/assets alias (or absolute)
//
//   const images = await getImages();
//   const key = imagePath.replace('~/', '/src/');
//
//   return typeof images[key] === 'function'
//     ? (await images[key]())['default']
//     : null;
// };
export const loadImage = async (
  path: string
): Promise<ImageMetadata | string> => {
  if (typeof path !== 'string') {
    return path;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const images = await getImages();
  console.log('+++++++++', images, '-----');

  const normalizedPath = path
    .replace('/src/assets/images/', '')
    .replace('/_astro/', '')
    .split('?')[0];

  if ((normalizedPath.match(/\./g) || []).length === 2) {
    const matches = normalizedPath.match(/^(.*)\.([a-z0-9]+)\.(\w{3,5})$/);

    if (matches?.length) {
      const key = `/src/assets/images/${matches[1]}.${matches[3]}`;
      console.log('KEY!!', key);

      if (typeof images[key] === 'function') {
        console.log('YAAAAAAY!!');
        const image = await images[key]();
        console.log('IMAGEEEEE', image);
        const hey = image.default;
        hey.id = `${matches[1]}.${matches[2]}.${matches[3]}`.replace(
          /jpg|png|jpeg/g,
          'webp'
        );
        console.log('IMMhey', hey);
        return hey;
      }
    }
  } else {
    const matches = normalizedPath.match(/^(.*)\.([a-z0-9]+)?\.?(\w{3,5})$/);
    console.log('!!!!!!!!!!!!', normalizedPath);

    if (matches?.length) {
      const key = `/src/assets/images/${normalizedPath}`;
      console.log('KEY!!', key);

      if (typeof images[key] === 'function') {
        console.log('YAAAAAAY!!');
        const image = await images[key]();
        console.log('IMAGEEEEE', image);
        const hey = image.default;
        hey.id = normalizedPath.replace(/jpg|png|jpeg/g, 'webp');
        console.log('IMMhey', hey);
        return hey;
      }
    }
  }

  return normalizedPath;
};

export const getScreenshotPath = (slug: string) => {
  return absoluteUrl(`/screenshots/${slug}.jpg`);
};

export const getItemImagePath = (
  slug: string,
  imagePath: string,
  collection = 'posts'
) => {
  if (imagePath?.startsWith('~')) {
    return `assets/${collection}/${slug}/${imagePath.replace('~', '')}`;
  }

  return imagePath;
};

export const getRenderedImage = async (
  path: string,
  getImage: any,
  options = {}
) => {
  const image = await loadImage(path);

  if (image) {
    let imageOpts = {
      alt: '',
      src: '',
      width: 0,
      height: 0,
    };
    // } as GetImageTransform;

    if (typeof image === 'string') {
      imageOpts.src = image;
    } else if (image.src) {
      imageOpts = {
        ...imageOpts,
        src: image.src,
        width: image.width,
        height: image.height,
      };
    }

    const { src } = await getImage({
      ...imageOpts,
      ...options,
    });

    return src;
  }

  return null;
};
