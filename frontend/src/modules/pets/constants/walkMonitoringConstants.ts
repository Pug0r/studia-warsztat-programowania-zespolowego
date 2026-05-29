export const WALK_PRIORITY_QUERY_KEY = ["pet_walk_priority"] as const;
export const WALK_SUMMARY_QUERY_KEY = ["pet_walk_summary"] as const;
export const MY_WALKS_QUERY_KEY = ["my_walks"] as const;
export const PET_WALKS_QUERY_KEY = ["pet_walk_events"] as const;
// Alias for the unified API endpoint (both getMyWalksRequest and getPetWalksRequest use the same endpoint)
export const WALKS_QUERY_KEY = MY_WALKS_QUERY_KEY;
