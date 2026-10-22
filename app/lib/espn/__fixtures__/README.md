# ESPN fixtures

Real ESPN API responses, trimmed to a few events when too large.

Files ending in `-simulated` are derived from `scoreboard-scheduled-day.json` by replacing the event and competition `status` and the competitor scores with ESPN's in-game shapes (`STATUS_IN_PROGRESS`, `STATUS_HALFTIME`, `STATUS_END_PERIOD`). They stand in until real responses are captured during live games, and should then be replaced.

`leaders-regular-season.json` is the core API leaders response requested with `limit=5`, trimmed to the points, rebounds, and assists categories. `leaders-athletes.json` maps each of its athlete IDs to that athlete's real core API response.
