function calculateFee(entryTime, exitTime = new Date()) {
  const hours = Math.max(1, Math.ceil((new Date(exitTime) - new Date(entryTime)) / 3600000));
  return Number((hours * 40).toFixed(2));
}
module.exports = { calculateFee };
