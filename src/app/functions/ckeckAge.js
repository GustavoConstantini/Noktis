function checkAge(birthTimestamp) {
  const ageMilisseg = Date.now() - birthTimestamp;
  const yearsOld = (ageMilisseg / 31556952000);
  if (yearsOld < 18) {
    return false;
  }
  return true;
}

export default checkAge;
