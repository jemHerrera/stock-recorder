import { record } from "./helpers/record";

(async () => {
  const BASE_SCREENER = "v=171&f=geo_usa,ta_perf2_ytdup&ft=3";

  await record(BASE_SCREENER, 0);
})();
