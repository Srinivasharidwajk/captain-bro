import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';
import { isMockFirebase } from './auth';

export const uploadProductImage = async (file) => {
  if (isMockFirebase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate uploading by creating an object URL
    // For a persistent URL in local development, we can use a standard Unsplash food image or base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  } else {
    const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }
};
