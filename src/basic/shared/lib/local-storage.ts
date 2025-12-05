function get<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key);

    if (item === null) return null;

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`localStorage 읽기 실패 (key: "${key}"):`, error);
    return null;
  }
}

function set<T>(key: string, value: T): boolean {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    // 용량 초과 에러 처리
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error(
        `localStorage 용량 초과 (key: "${key}"). 이전 데이터를 삭제해주세요.`
      );
    } else {
      console.error(`localStorage 저장 실패 (key: "${key}"):`, error);
    }
    return false;
  }
}

function remove(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`localStorage 삭제 실패 (key: "${key}"):`, error);
    return false;
  }
}

export const LocalStorage = {
  get,
  set,
  remove,
};
