const UPLOAD_ENDPOINT = 'https://your-server.com/api/upload';

export const uploadProductImage = async (uri) => {
  if (!uri) return null;

  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1].toLowerCase();
  const formData = new FormData();

  formData.append('file', {
    uri,
    name: `product_${Date.now()}.${fileType}`,
    type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
  });

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.image_url || data.url || null;
};
