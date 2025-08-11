'use client';
import { useState } from 'react';

export default function SortOptions() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  return (
    <div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="sortAsc"
          checked={sortOrder === 'asc'}
          onChange={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
        />
        <label className="form-check-label" htmlFor="sortAsc">
          Sắp xếp theo thứ tự tăng dần
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="sortDesc"
          checked={sortOrder === 'desc'}
          onChange={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
        />
        <label className="form-check-label" htmlFor="sortDesc">
          Sắp xếp theo thứ tự giảm dần
        </label>
      </div>
    </div>
  );
}
