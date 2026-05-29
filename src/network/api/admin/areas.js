// src/network/api/admin/areas.js
import { get } from "../client";
import { unwrap } from "../../http/responseInterceptor";

export const getAreaStats = () => unwrap(get("areas/stats"));
