import { record } from "./helpers/record";

(async () => {
  const DOWN_10 = "v=171&f=geo_usa,ta_change_d10&ft=3";
  const UP_10 = "v=171&f=geo_usa,ta_change_u10";
  await record(DOWN_10);
  await record(UP_10);
})();
