import { useParams } from "next/navigation";

export const PASSCODE = "1";
export const backendUrl = "http://localhost:8080";
// export const backendUrl = "https://wwld-production.up.railway.app";

export const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/uploads/")) return backendUrl + image;
    return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
};



