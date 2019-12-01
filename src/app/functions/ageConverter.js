export default (birthTimestamp) => {
  const ageMilisseg = Date.now() - birthTimestamp;
  const yearsOld = (ageMilisseg / 31556952000);
  return Math.trunc(yearsOld);
};
