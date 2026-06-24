import toast from 'react-hot-toast';

export const uploadImage = async (imageFile) => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append('image', imageFile);

  const apiKey = process.env.NEXT_PUBLIC_IMAGE_API;

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    }

    toast.error('Image upload failed');
  } catch (error) {
    console.error('Image upload error:', error);
    toast.error('Image upload failed due to network error');
  }
};
