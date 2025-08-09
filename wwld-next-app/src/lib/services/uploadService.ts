export const handleImageUpload = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.text(); // => "/uploads/abc.jpg"
    return result;
  } catch (err) {
    console.error("Upload lỗi:", err);
    return null;
  }
};
