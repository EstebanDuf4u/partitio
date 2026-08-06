const FETCH_BASE_URL = (import.meta.env.VITE_BASE_URL ?? "").replace(/\/$/, "");

export default FETCH_BASE_URL;
