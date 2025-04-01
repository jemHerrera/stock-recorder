import { record } from "./helpers/record";

(async () => {
  const BASE_SCREENER =
    "v=171&f=geo_usa,ta_perf_4wup,ta_perf2_ytdup,ta_sma50_pa,ta_volatility_mo2&ft=3";
  await record(BASE_SCREENER);
})();
