/**
 * Creates a thumbnail from a given image file.
 *
 * @param {File} file - The image file from which the thumbnail will be created.
 * @param {number} width - The width of the thumbnail. The height is calculated proportionally.
 * @returns {Promise<File>} A promise that resolves to a `File` object of the thumbnail.
 *
 * @example
 * const imageFile = // your File object;
 * createThumbnail(imageFile, 200)
 *   .then(thumbnail => console.log('Thumbnail created:', thumbnail))
 *   .catch(error => console.error('Error creating thumbnail:', error));
 */
export const createThumbnail = (file: File, width: number): Promise<File> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);
    img.src = objectURL;

    img.onload = () => {
      try {
        const originalWidth = img.width;
        const originalHeight = img.height;
        const height = (originalHeight / originalWidth) * width;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas context is not available');
        }

        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectURL); // Free up memory

        canvas.toBlob((blob) => {
          if (blob) {
            const fileExtension = file.name.split('.').pop();
            const thumbnail = new File(
              [blob],
              `${file.name}-thumb.${fileExtension}`,
              { type: file.type },
            );
            resolve(thumbnail);
          } else {
            throw new Error('Image conversion failed');
          }
        }, file.type);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectURL);
      reject(new Error('Image loading error'));
    };
  });

/**
 * Gets the dimensions of an image.
 *
 * @param {File} file - The image file.
 * @returns {Promise<{ width: number; height: number }>} A promise that resolves with the dimensions of the image.
 * @throws Will throw an error if the file is not an image (PNG, JPG, or JPEG).
 *
 * @example
 * const file: File = // Your File object;
 * getImageDimensions(file)
 *   .then(dimensions => console.log('Image dimensions:', dimensions))
 *   .catch(error => console.error(error));
 */
export const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    // Check if the file is an image (PNG, JPG, or JPEG)
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Get the dimensions of the image
      const width = img.width;
      const height = img.height;

      // Free up memory
      URL.revokeObjectURL(img.src);

      // Return the dimensions
      resolve({ width, height });
    };

    img.onerror = () => {
      // Handle errors in loading the image
      reject(new Error('Error loading image'));
    };
  });
