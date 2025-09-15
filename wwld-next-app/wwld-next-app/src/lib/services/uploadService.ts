// src/lib/cloudinaryUpload.ts
/**
 * Upload ảnh trực tiếp lên Cloudinary bằng chữ ký từ Spring.
 * Trả về secure_url hoặc null nếu lỗi.
 */
export const handleImageUpload = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    // 1) Lấy chữ ký từ backend Spring
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://localhost:8080";

    const signRes = await fetch(`${backend}/cloudinary/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // folder bạn đang dùng theo yêu cầu trước đó
      body: JSON.stringify({ folder: "wwld" }),
    });

    if (!signRes.ok) throw new Error(`Sign failed ${signRes.status}`);
    const { timestamp, signature, apiKey, cloudName, folder } = await signRes.json();

    // 2) Upload trực tiếp lên Cloudinary
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder ?? "folder123");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const resp = await fetch(uploadUrl, { method: "POST", body: form });
    const payload = await resp.json();

    if (!resp.ok) throw new Error(payload?.error?.message || "Upload failed");

    // 3) Trả về URL ảnh đã upload
    return payload.secure_url as string;
  } catch (err) {
    console.error("Upload lỗi:", err);
    return null;
  }
};
