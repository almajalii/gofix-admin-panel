// src/network/api/admin/earnings.js
import { get } from "../client";
import { unwrap } from "../../http/responseInterceptor";

/** GET /api/admin/earnings — all professionals with totals + recent items */
export const getAllEarnings = () => unwrap(get("earnings"));

/** GET /api/admin/earnings/summary — platform-level period breakdown */
export const getEarningsSummary = () => unwrap(get("earnings/summary"));

/** GET /api/admin/earnings/:proId — full history for one professional */
export const getProfessionalEarnings = (proId) =>
  unwrap(get(`earnings/${proId}`));
