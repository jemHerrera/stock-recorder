/**
 * Query: query1
 *
 * Description:
 * This query selects records from the `record` table where:
 * - The `gap` is greater than 5, AND
 * - The `from_open_percent` is greater than 5, AND
 * - One of the following is true:
 *   - `consecutive_days` is 1 (i.e., it's the first in a series), OR
 *   - The previous day's record (same `ticker`, `consecutive_days - 1`) has:
 *     - `gap` less than 2 AND
 *     - `from_open_percent` less than 2
 *
 * Approach:
 * - A LEFT JOIN is used to self-join the `record` table (`r`) with its previous day's record (`prev`),
 *   matching on the same `ticker` and `consecutive_days = prev.consecutive_days + 1`.
 * - This allows checking conditions on both the current and previous day's data.
 *
 * Use Case:
 * Useful for filtering records based on strong movement conditions today,
 * but also checking for a "tight" previous day to validate continuation setups.
 */
export const query1 = `
    SELECT r.*
    FROM record r
    LEFT JOIN record prev
      ON r.ticker = prev.ticker
     AND r.consecutive_days = prev.consecutive_days + 1
     AND r.streak_number = prev.streak_number
    WHERE r.gap > 5
      AND r.from_open_percent > 5
      AND (
        r.consecutive_days = 1
        OR (prev.gap < 2 AND prev.from_open_percent < 2)
      )
  `;
