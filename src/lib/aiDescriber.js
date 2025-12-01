// src/lib/aiDescribe.js
export function generateDescription(asset) {
  const { name, category_id } = asset || {};
  const short = `A ${name || 'asset'}${category_id ? ` in category ${category_id}` : ''}. Well maintained, recorded in the asset registry.`;
  return short;
}
