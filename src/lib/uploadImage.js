import toast from "react-hot-toast";

/**
 * Upload an image file to the server.
 * @param {File} file
 * @returns {Promise<string|null>} 
 */
export async function uploadImage(file) {
  if (!file) {
    toast.error("No file selected.");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      const message = result?.error || "Upload failed. Please try again.";
      toast.error(message);
      return null;
    }

    if (result?.url) {
      return result.url;
    }

    toast.error("Unexpected response from upload server.");
    return null;
  } catch (error) {
    console.error("Image upload error:", error);
    toast.error("Network error while uploading image.");
    return null;
  }
}