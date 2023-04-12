import responsiveImage from './astro-responsive-image';

describe('responsiveImage', () => {
  it('should throw when no configuration is passed', () => {
    expect(responsiveImage({ folder: '', sizes: [1, 2, 3] })).toBe(false);
  });
});
