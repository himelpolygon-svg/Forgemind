const { db } = require('./db');

function listActive(collection) {
  return db.prepare('SELECT * FROM collection_items WHERE collection = ? AND is_active = 1 ORDER BY sort_order, id').all(collection);
}

function listAll(collection) {
  return db.prepare('SELECT * FROM collection_items WHERE collection = ? ORDER BY sort_order, id').all(collection);
}

function getItem(id) {
  return db.prepare('SELECT * FROM collection_items WHERE id = ?').get(id);
}

function createItem(collection, data) {
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM collection_items WHERE collection = ?').get(collection).m;
  const info = db.prepare(`INSERT INTO collection_items
    (collection, title, subtitle, body, image, link_1, link_2, sort_order, is_active)
    VALUES (@collection, @title, @subtitle, @body, @image, @link_1, @link_2, @sort_order, @is_active)`).run({
    collection,
    title: data.title || '',
    subtitle: data.subtitle || '',
    body: data.body || '',
    image: data.image || '',
    link_1: data.link_1 || '',
    link_2: data.link_2 || '',
    sort_order: maxOrder + 1,
    is_active: data.is_active === undefined ? 1 : (data.is_active ? 1 : 0),
  });
  return info.lastInsertRowid;
}

function updateItem(id, data) {
  const fields = ['title', 'subtitle', 'body', 'link_1', 'link_2'];
  const sets = [];
  const params = { id };
  for (const f of fields) {
    if (data[f] !== undefined) {
      sets.push(`${f} = @${f}`);
      params[f] = data[f];
    }
  }
  if (data.image) {
    sets.push('image = @image');
    params.image = data.image;
  }
  if (data.is_active !== undefined) {
    sets.push('is_active = @is_active');
    params.is_active = data.is_active ? 1 : 0;
  }
  if (!sets.length) return;
  db.prepare(`UPDATE collection_items SET ${sets.join(', ')} WHERE id = @id`).run(params);
}

function deleteItem(id) {
  db.prepare('DELETE FROM collection_items WHERE id = ?').run(id);
}

function reorder(collection, orderedIds) {
  const stmt = db.prepare('UPDATE collection_items SET sort_order = ? WHERE id = ? AND collection = ?');
  const tx = db.transaction((ids) => {
    ids.forEach((id, idx) => stmt.run(idx, id, collection));
  });
  tx(orderedIds);
}

function seedItemIfEmpty(collection, items) {
  const count = db.prepare('SELECT COUNT(*) AS c FROM collection_items WHERE collection = ?').get(collection).c;
  if (count > 0) return;
  items.forEach((item, idx) => {
    db.prepare(`INSERT INTO collection_items
      (collection, title, subtitle, body, image, link_1, link_2, sort_order, is_active)
      VALUES (@collection, @title, @subtitle, @body, @image, @link_1, @link_2, @sort_order, 1)`).run({
      collection,
      title: item.title || '',
      subtitle: item.subtitle || '',
      body: item.body || '',
      image: item.image || '',
      link_1: item.link_1 || '',
      link_2: item.link_2 || '',
      sort_order: idx,
    });
  });
}

module.exports = { listActive, listAll, getItem, createItem, updateItem, deleteItem, reorder, seedItemIfEmpty };
