export function isProductOpen(product) {
  return Boolean(product.is_available_today) && !product.is_sold_out && Number(product.quantity) > 0;
}

export function serializeProduct(row, { includeHidden = false, showUnavailable = true } = {}) {
  const open = isProductOpen(row);
  if (!includeHidden && !open && !showUnavailable) {
    return null;
  }
  if (!includeHidden && !row.is_available_today && !showUnavailable) {
    return null;
  }

  return {
    id: row.id,
    name_ar: row.name_ar,
    description: row.description,
    price: row.price,
    image_url: row.image_url,
    category_id: row.category_id,
    category_name: row.category_name,
    category_slug: row.category_slug,
    is_featured: row.is_featured,
    is_available_today: row.is_available_today,
    quantity: row.quantity,
    is_sold_out: row.is_sold_out || row.quantity === 0,
    layout_variant: row.layout_variant,
    is_open: open,
    status_label: open ? "متوفر اليوم" : "خلص اليوم"
  };
}

export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    || `cat-${Date.now()}`;
}
