import { record } from "./helpers/record";

(async () => {
  const BASE_SCREENER = "v=171&f=geo_usa";

  await record(BASE_SCREENER, 0);
})();
