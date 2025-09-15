import { apiClient } from "../apiClient";

// item-types.ts
export const ITEM_TYPES = [
  "WEAPON",
  "KEY",
  "MATERIAL",
  "UPGRADE_MATERIAL",
  "OTHER",
] as const;

export type ItemType = typeof ITEM_TYPES[number]; // "WEAPON" | "KEY" | ...


export interface ItemData {
  id: number;
  itemName: string;
  itemdescription: string;
  itemImage: string;
  itemIcon: string;
  itemFullInfor: string;
  itemType: ItemType;
  slug: string;
  itemRank: number;
}

export interface ItemPayLoad {
  id?: number;
  itemName: string;
  itemdescription?: string;
  itemImage?: string;
  itemIcon?: string;
  itemFullInfor?: string;
  itemType: ItemType;
  slug?: string;
  itemRank?: number;
}


export interface PageItems {
  items: ItemData[];
  totalItems: number;
  totalPages: number;
  pageIndex: number;
  pageSize: number;
}

export const fetchPageItem = async (
  pageIndex = 0,
  pageSize = 10,
  keyword = ""
): Promise<PageItems> => {
  const req = {
    pageIndex,
    pageSize,
    keyword: keyword.trim(),
    clientTime: new Date().toISOString(),
  };
  const res = await apiClient.post("/api/items/getAllItems", req);
  const data = res.data || {};

  // map linh hoạt theo backend hiện tại
  const items: ItemData[] =
    data.listItems ?? data.items ?? data.listDialogs ?? [];

  const totalItems: number =
    data.totalItems ?? data.total ?? data.count ?? items.length;

  const totalPages: number =
    data.totalPages ?? Math.ceil(totalItems / Math.max(1, pageSize));

  return { items, totalItems, totalPages, pageIndex, pageSize };
};


// Tạo mới 
export const createItemData = async (payload: ItemPayLoad) => {
  try {
    const response = await apiClient.post("/api/items/insert", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding item :", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchItems = async () => {
  try {
    const request = {
      clientTime: new Date().toISOString()
    };
    const response = await apiClient.post("/api/items/getItems", request);
    return response.data.listItemData;
  } catch (error) {
    console.error("Error fetching list items:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchWeapons = async (payload : ItemPayLoad) => {
  try {
    const response = await apiClient.post("/api/items/getWeapons", payload);
    return response.data.listItemData;
  } catch (error) {
    console.error("Error fetching list weapon:", error);
    throw error;
  }
};

// Lấy item theo Id (normalize về ItemData)
export const fetchItemDataById = async (id: number): Promise<ItemData | undefined> => {
  try {
    const request = { id, clientTime: new Date().toISOString() };
    const response = await apiClient.post("/api/items/getItemById", request);
    const raw = response.data?.itemDTO ?? response.data?.ItemDataDTO; // <-- đúng key

    if (!raw) return undefined;

    // Chuẩn hoá tên field theo ItemData
    const item: ItemData = {
      id: Number(raw.id),
      itemName: String(raw.itemName ?? ""),
      itemdescription: String(raw.itemDescription ?? ""),   // itemDescription -> itemdescription
      itemImage: String(raw.itemImage ?? ""),
      itemIcon: String(raw.itemIcon ?? ""),
      itemFullInfor: String(raw.itemFullInfor ?? ""),
      itemType: raw.itemType as ItemType,
      slug: String(raw.slug ?? ""),
      itemRank: Number(raw.itemRank)
    };

    return item;
  } catch (error) {
    console.error("Error fetching item by id:", error);
    throw error;
  }
};



// Sửa 
export const updateItemData = async (payload: ItemPayLoad) => {
  try {
    const response = await apiClient.post("/api/items/update", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Xóa
export const deleteItemData = async (payload: ItemPayLoad) => {
  try {
    const response = await apiClient.post("/api/items/delete", payload);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};


