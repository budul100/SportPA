# SportPA

An offline-first web app for public address (PA) announcers at amateur sports events. It replaces handwritten lineup sheets with one screen per phase of the game: your announcement schedule, roster check-in, lineup introductions and live game tracking.

It runs entirely in the browser (plain HTML, CSS and JavaScript, no build step, no backend, no account). All data stays on your device.

## Features

- **Schedule**: your announcement script per game (sponsors, standings, notices), split into pre-game, breaks and post-game. Every item can carry a detail text. Pre-game items are checked off in the Intro tab, breaks and post-game in the Game tab. The Breaks checklist can be reset for every period or carried over (set per sport, see *Settings*). Save a schedule as a template per sport.
- **Check-in**: confirm who is present, change numbers on the spot, set tags (goalkeeper, captain, ...), add pronunciation hints, enter coaches and officials. Duplicate numbers are highlighted.
- **Intro**: large, readable introduction lists: Pre-game items (the match as "Home vs Away" plus your own items from the Schedule, e.g. last meeting, standings, top scorers), officials, away team and home team. Tap to strike off a name, or use the *Announce next* button to strike off the next one and scroll on. Coaches can be listed before or after the players.
- **Game**: both rosters side by side. Tap a player to log a goal (or foul or penalty, depending on the mode). Running score, scorers in the top bar (sorted by goals, then number), undo. The event log shows time with seconds, period (e.g. `2/2`), player and action.
- **Penalty timers**: assign a penalty and a player, the countdown starts only when you tell the app that play has resumed. Visual warning before the end, full-screen flashing at expiry until you confirm, so a return to play is never forgotten. The clock stops automatically when no penalty is left. The time of a penalty event is set to the moment its countdown actually starts.
- **Fouls** (optional per sport): counted per player with a limit, e.g. water polo. Per sport you can choose whether the app stays in foul or penalty mode after an entry ("Keep mode") or switches back to scoring.
- **Generic by design**: sports, number and names of periods (halves, quarters, sets, innings, ...), scoring name, penalty durations and player tags are all configurable.
- **Roster import**: paste a table copied from Word, a PDF or a web page.
- **Current time** with seconds is always visible.
- Works offline once installed, keeps the screen awake during the game where the browser supports it.

## Quick start

1. Open the app (see *Deployment* below) and add it to your home screen.
2. **Teams**: import or create two teams. *Data > Add sample teams* gives you two fictional ones to try things out.
3. **Games**: choose sport, home and away team, create the game.
4. Work through the tabs: **Schedule**, **Check-in**, **Intro**, **Game**.

## Roster import

Copy a roster table and paste it under *Teams > Import roster*. The parser reads cells and lines in order and understands:

| Token | Meaning |
| --- | --- |
| `7` | A number (1 to 3 digits). Applies to the next name. |
| `T`, `K`, ... | Any tag code you defined in *Settings*. Applies to the next name. |
| `Trainer:`, `Coach:`, `Staff:` | Everything after it is read as coaches or staff. |
| anything else | A player name. |

Players without a number are imported without one. The import warns about duplicate numbers, duplicate names and players without number, and removes entries that appear twice (common when copying from a layout with repeated blocks). The first line before the first number is used as team name.

## Settings

- **Tags**: short codes with a label and colour, e.g. `T` goalkeeper, `K` captain. Tags marked *Priority* are listed first in lineups.
- **Sports**: name, number of periods, period name, scoring name, penalty durations in seconds and optional foul tracking with a limit, *Keep mode* (stay in foul or penalty mode after an entry) and whether the Breaks checklist is reset for every period. Defaults are provided for indoor and field hockey, water polo, volleyball, basketball, ice hockey, handball and baseball. A game keeps the settings it was created with.

## Deployment

SportPA is a static site. Any static host works, as long as it serves the files over HTTPS (required for the offline cache). GitHub Pages is the simplest option.

### GitHub Pages

Create a repository, push the files in the repository root and enable Pages:

```powershell
git init -b main
git add .
git commit -m "Initial commit"
gh repo create SportPA --public --source . --push
gh api -X POST repos/<your-user>/SportPA/pages -f "source[branch]=main" -f "source[path]=/"
```

Without the GitHub CLI: create the repository on github.com, push with `git remote add origin ...` and `git push -u origin main`, then enable *Settings > Pages > Deploy from a branch > main / (root)*.

The site is then available at `https://<your-user>.github.io/SportPA/`. All paths are relative, so a sub-path works without changes.

### Installing on a tablet or phone

Open the URL once while online, then:

- **iPad / iPhone (Safari)**: Share > *Add to Home Screen*
- **Android (Chrome)**: menu > *Install app* or *Add to Home screen*

After the first load the app works without any network connection. Open it once online before the event so the cache is complete.

### Updating

When you change `index.html`, increase `VERSION` in `sw.js` (for example `sportpa-v6`), otherwise installed copies keep serving the old cached version. Devices pick up the new version the next time they open the app online (a second restart may be needed).

## Data and backup

Everything is stored in the browser's local storage on the device. Nothing is ever sent to a server.

- Use *Data > Save as file* before and after events to keep a backup. *Data > Copy to clipboard* works as well.
- *Data > Load backup file* restores a backup and replaces all current data.
- Browsers can delete site data under storage pressure, and Safari may clear data of websites that were not used for a while. Installing the app to the home screen and keeping regular backups avoids surprises.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (markup, styles, code) |
| `sw.js` | Service worker, cache-first, makes the app work offline |
| `manifest.json` | Web app manifest for installing the app |
| `icon-192.png`, `icon-512.png` | App icons (the 192 px icon is also shown in the top left corner of the app) |

## Limitations

- No live data connection to leagues or scoreboards, rosters are imported by copy and paste.
- The game clock is not tracked, only wall-clock time of events and penalty countdowns that you start and stop by hand.
- Substitutions are not tracked.
- Data is per device and browser, there is no sync between devices (use the backup file).

## Development

There is no build step. Edit `index.html` and open it in a browser, or serve the folder locally to test the service worker:

```powershell
python -m http.server 8000
```

then open `http://localhost:8000`.

## License

MIT, see [LICENSE](LICENSE).
