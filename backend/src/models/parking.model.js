const { pool } = require('../config/database');

const listSlots = async ({ type, status, search } = {}) => {
  let sql = 'SELECT * FROM parking_slots WHERE 1=1'; const args = [];
  if (type) { sql += ' AND slot_type = ?'; args.push(type); }
  if (status) { sql += ' AND status = ?'; args.push(status); }
  if (search) { sql += ' AND (slot_number LIKE ? OR zone LIKE ?)'; args.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY level_number, zone, slot_number';
  const [rows] = await pool.execute(sql, args); return rows;
};
const slotById = async (id, conn = pool) => { const [r] = await conn.execute('SELECT * FROM parking_slots WHERE id = ?', [id]); return r[0] || null; };
const createSlot = async (data) => { const [r] = await pool.execute('INSERT INTO parking_slots (slot_number, slot_type, status, zone, level_number) VALUES (?, ?, ?, ?, ?)', [data.slot_number, data.slot_type, data.status || 'AVAILABLE', data.zone || 'A', data.level_number || 1]); return slotById(r.insertId); };
const updateSlot = async (id, data) => { await pool.execute('UPDATE parking_slots SET slot_number=?, slot_type=?, status=?, zone=?, level_number=? WHERE id=?', [data.slot_number, data.slot_type, data.status, data.zone, data.level_number, id]); return slotById(id); };
const deleteSlot = (id) => pool.execute('DELETE FROM parking_slots WHERE id = ?', [id]);

const vehicleById = async (id, conn = pool) => { const [r] = await conn.execute('SELECT * FROM vehicles WHERE id = ?', [id]); return r[0] || null; };
const listVehicles = async (userId) => { const [r] = await pool.execute('SELECT v.*, u.name AS user_name FROM vehicles v LEFT JOIN users u ON u.id=v.user_id WHERE (? IS NULL OR v.user_id=?) ORDER BY v.created_at DESC', [userId || null, userId || null]); return r; };
const createVehicle = async (data) => { const [r] = await pool.execute('INSERT INTO vehicles (user_id, vehicle_number, vehicle_type, owner_name) VALUES (?, ?, ?, ?)', [data.user_id, data.vehicle_number.toUpperCase(), data.vehicle_type, data.owner_name]); return vehicleById(r.insertId); };
const updateVehicle = async (id, data) => { await pool.execute('UPDATE vehicles SET vehicle_number=?, vehicle_type=?, owner_name=? WHERE id=?', [data.vehicle_number.toUpperCase(), data.vehicle_type, data.owner_name, id]); return vehicleById(id); };
const deleteVehicle = (id) => pool.execute('DELETE FROM vehicles WHERE id = ?', [id]);

const bookingById = async (id) => { const [r] = await pool.execute(`SELECT b.*, v.vehicle_number, v.vehicle_type, s.slot_number, s.slot_type, s.zone, p.payment_status, p.amount, p.payment_method, p.receipt_number FROM bookings b JOIN vehicles v ON v.id=b.vehicle_id JOIN parking_slots s ON s.id=b.slot_id LEFT JOIN payments p ON p.booking_id=b.id WHERE b.id=?`, [id]); return r[0] || null; };
const listBookings = async ({ userId, status } = {}) => { let sql = `SELECT b.*, u.name AS user_name, v.vehicle_number, s.slot_number, s.slot_type, p.payment_status, p.amount FROM bookings b JOIN users u ON u.id=b.user_id JOIN vehicles v ON v.id=b.vehicle_id JOIN parking_slots s ON s.id=b.slot_id LEFT JOIN payments p ON p.booking_id=b.id WHERE 1=1`; const a=[]; if(userId){sql+=' AND b.user_id=?';a.push(userId)} if(status){sql+=' AND b.booking_status=?';a.push(status)} sql+=' ORDER BY b.booked_at DESC'; const [r]=await pool.execute(sql,a); return r; };
const listHistory = async ({ userId } = {}) => { let sql=`SELECT h.*, v.vehicle_number, s.slot_number, b.booking_code FROM parking_history h JOIN vehicles v ON v.id=h.vehicle_id JOIN parking_slots s ON s.id=h.slot_id LEFT JOIN bookings b ON b.id=h.booking_id WHERE 1=1`;const a=[]; if(userId){sql+=' AND v.user_id=?';a.push(userId)}sql+=' ORDER BY h.entry_time DESC';const[r]=await pool.execute(sql,a);return r; };
const listPayments = async () => { const [r]=await pool.execute(`SELECT p.*, b.booking_code, b.user_id, u.name AS user_name, v.vehicle_number FROM payments p JOIN bookings b ON b.id=p.booking_id JOIN users u ON u.id=b.user_id JOIN vehicles v ON v.id=b.vehicle_id ORDER BY p.created_at DESC`);return r; };

module.exports={ pool,listSlots,slotById,createSlot,updateSlot,deleteSlot,vehicleById,listVehicles,createVehicle,updateVehicle,deleteVehicle,bookingById,listBookings,listHistory,listPayments };
