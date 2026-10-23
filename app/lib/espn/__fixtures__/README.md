# ESPN fixtures

Real ESPN API responses, trimmed to a few events when too large.

Files ending in `-simulated` are derived from `scoreboard-scheduled-day.json` by replacing the event and competition `status` and the competitor scores with ESPN's in-game shapes (`STATUS_IN_PROGRESS`, `STATUS_HALFTIME`, `STATUS_END_PERIOD`). They stand in until real responses are captured during live games, and should then be replaced.

`leaders-regular-season.json` is the core API leaders response requested with `limit=5`, trimmed to the points, rebounds, and assists categories. `leaders-athletes.json` maps each of its athlete IDs to that athlete's real core API response.

`summary-pre-game.json`, `summary-live.json`, and `summary-final.json` are real game summaries trimmed of the sections the app does not read (news, videos, odds, injuries, and similar). The final summary keeps its first 40 and last 10 plays, with the matching win probability points. The live summary was captured in the 1st quarter, while ESPN listed its line score under two periods.

`scoreboard-international-exhibition.json` is the real 2026-10-12 scoreboard trimmed to the London Lions exhibition, whose competitor has no logo.

`scoreboard-header-week.json` is the real `site.web.api.espn.com` scoreboard header for 2026-10-17 to 2026-10-23, trimmed to the sport, the league, and each event's id, date, name, status, and season.
