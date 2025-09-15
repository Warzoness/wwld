'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './ItemDetail.module.css';
import {
  type ItemData,
  fetchItemDataById,
  fetchPageItem,
} from '@/lib/services/itemService';

export default function ItemDetailPage() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const router = useRouter();

  const [data, setData] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const isNumericId = useMemo(() => /^\d+$/.test(String(idOrSlug)), [idOrSlug]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setErr('');
      setLoading(true);
      try {
        let item: ItemData | null = null;

        if (isNumericId) {
          // Ưu tiên API by Id
          const byId = await fetchItemDataById(Number(idOrSlug)); // API sẵn có
          item = byId ?? null;
          console.log("data : ", byId);

        } else {
          // Tìm theo slug qua phân trang + keyword
          const res = await fetchPageItem(0, 10, String(idOrSlug));
          item = (res.items || []).find((x) => x.slug === idOrSlug) ?? null;

          // Nếu chưa ra, thử mở rộng tìm kiếm
          if (!item && res.totalPages > 1) {
            // Chạy thêm vài page đầu để tìm nhanh (tránh tải quá nhiều)
            for (let p = 1; p < Math.min(res.totalPages, 3) && !item; p++) {
              const more = await fetchPageItem(p, 10, String(idOrSlug));
              item = (more.items || []).find((x) => x.slug === idOrSlug) ?? null;
            }
          }
        }

        if (!alive) return;

        if (!item) {
          setErr('Không tìm thấy vật phẩm.');
          setData(null);
        } else {
          setData(item);
        }
      } catch (e: unknown) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : 'Tải dữ liệu thất bại');
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [idOrSlug, isNumericId]);

  const cover = data?.itemImage?.trim() || '/default-image.png';
  const icon = data?.itemIcon?.trim();

  return (
    <div className={styles.wapper}>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/admin/items/items-list" className={styles.link}>&larr; Danh sách vật phẩm</Link>
          </div>
          <h1 className={styles.title}>Chi tiết vật phẩm</h1>
        </div>

        {loading && (
          <div className={styles.skeleton}>
            <div className={styles.skelCover} />
            <div className={styles.skelText} />
            <div className={styles.skelText} />
            <div className={styles.skelTextWide} />
          </div>
        )}

        {!loading && err && (
          <div className={styles.error}>{err}</div>
        )}

        {!loading && !err && data && (
          <article className={styles.card}>
            <div className={styles.mediaCol}>
              {/* Ảnh lớn */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={data.itemName} className={styles.cover} />
              {/* Icon nếu có */}
              {icon && (
                <div className={styles.iconWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={icon} alt="Icon" className={styles.icon} />
                </div>
              )}
            </div>

            <div className={styles.infoCol}>
              <div className={styles.topRow}>
                <h2 className={styles.name}>{data.itemName}</h2>
                <span className={styles.badge}>{data.type || '—'}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.muted}>Slug</span>
                <span className={styles.value}>{data.slug || '—'}</span>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Mô tả</div>
                <p className={styles.desc}>
                  {data.itemdescription?.trim() || '—'}
                </p>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Thông tin đầy đủ</div>
                <div className={styles.fullInfo}>
                  {data.itemFullInfor?.trim() ? (
                    <pre className={styles.pre}>
                      {data.itemFullInfor}
                    </pre>
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
