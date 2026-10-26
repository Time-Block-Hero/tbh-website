// Presentation-only session. Transactions preserve zones until their flight completes.
export function createSession(cards) {
  const entries = cards.map((card, i) => ({ ...card, instance: `sample-${i}` }));
  return { hand: entries.slice(0, 6), deck: entries.slice(6, 15), discard: [], field: [],
    shop: entries.slice(15, 21), stock: entries.slice(21), energy: 18, serial: 0, epoch: 0, pending: null };
}
export function begin(session, kind, id) {
  if (session.pending) return null;
  const source = kind === 'draw' ? session.deck : kind === 'buy' ? session.shop : session.hand;
  const card = kind === 'draw' ? source[0] : source.find(c => c?.instance === id);
  if (!card || (kind === 'draw' && session.hand.length >= 10) || (kind === 'buy' && card.cost > session.energy)) return null;
  const tx = { token: ++session.serial, epoch: session.epoch, kind, id: card.instance, card };
  session.pending = tx;
  return tx;
}
export function cancel(session, tx) {
  if (session.pending === tx) session.pending = null;
}
export function commit(session, tx) {
  if (!tx || session.pending !== tx || tx.epoch !== session.epoch) return false;
  const key = tx.kind === 'draw' ? 'deck' : tx.kind === 'buy' ? 'shop' : 'hand';
  const index = session[key].findIndex(c => c?.instance === tx.id);
  if (index < 0 || (tx.kind === 'buy' && tx.card.cost > session.energy)) { session.pending = null; return false; }
  if (key === 'shop') session.shop[index] = null;
  else session[key].splice(index, 1);
  if (tx.kind === 'buy') session.energy -= tx.card.cost;
  const destination = tx.kind === 'draw' ? 'hand' : tx.kind === 'play' ? 'field' : 'discard';
  session[destination].push(tx.card);
  session.pending = null;
  return true;
}
export function refreshShop(session) {
  if (session.pending || session.energy < 1) return false;
  // This visual study retains bought-out slots; remaining offers exchange with stock.
  const offers = session.shop.filter(Boolean);
  const pool = [...session.stock, ...offers];
  let cursor = 0;
  session.shop = session.shop.map(card => card ? pool[cursor++] : null);
  session.stock = pool.slice(cursor);
  session.energy -= 1;
  return true;
}
export function resetSession(session, cards) {
  const epoch = session.epoch + 1;
  Object.assign(session, createSession(cards), {epoch});
}
