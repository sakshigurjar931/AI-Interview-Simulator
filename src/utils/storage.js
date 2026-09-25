const PREFIX = 'ais_';

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function removeKey(key) {
  localStorage.removeItem(PREFIX + key);
}

export function getAuthUser() {
  return readJSON('auth_user', null);
}

export function setAuthUser(user) {
  writeJSON('auth_user', user);
}

export function clearAuthUser() {
  removeKey('auth_user');
}

export function getInterviewHistory() {
  const list = readJSON('interviews', []);
  return Array.isArray(list) ? list : [];
}

export function addInterviewRecord(record) {
  const list = getInterviewHistory();
  list.unshift(record);
  writeJSON('interviews', list);
}

export function getLastResult() {
  return readJSON('last_result', null);
}

export function setLastResult(result) {
  writeJSON('last_result', result);
}
