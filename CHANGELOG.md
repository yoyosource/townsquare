# Release Notes

### Version 2.20.2
- Corrected Fool & Bishop ability texts to match the official app and physical game
- Added missing "About To Die" reminder for the Organ Grinder

### Version 2.20.1
- Reverted change to hide name and author of script if a custom logo is being used
- Renamed remaining options that were still labelled "vote watching"

### Version 2.20.0
- Added opposing alignment functionality for both official and homebrew characters (with explicit permission from TPI)
- Added menu option for changing a players' alignment - this functionality is only client side and will never be shown to players, even for travellers
- Reduced player menu font size slightly to accommodate more options
- Added button in the player role modal to choose from regular, good, or evil aligned characters - this button can be toggled with the control key from the search bar
- Changed token glow to be based on alignment instead of character type
- Disabled ability to select all in-app text (except for the game state JSON)
- Fixed role modal not resetting when exited using escape key
- Moved self-naming, voting twice, and vote watching functionality from settings tab to hosting tab to simplify the menu
- Fixed voting twice to automatically disable all players' abilities to vote twice when the global option is disabled
- Renamed "vote watching" to "secret vote" to make its purpose more clear
- Added ability to cancel nomination before launching it by re-opening the player menu
- Fixed bluffs sometimes assigning to the wrong token
- Converted all app images to WEBP format
- Removed unused edition character type icons
- Changed behaviour of name and author of script to hide if a custom logo is being used
- Added search bar to reminder modal
- Fixed reminder tokens being slightly off-center
- Fixed fabled with duplicate reminders showing multiple copies in the reminder modal
- Removed Laissez un Faire from edition JSON, as it isn't an official script
- Replaced popular custom scripts list with more relevant scripts (includes LuF), and added a mention to botcscripts.com
- Removed dot-points from minion info and demon info descriptions
- Added JSON-driven night order support following the official [JSON Schema](https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json), including curated night order for base-3 scripts (if this is used, fabled and off-script travellers that act at night will always act after dusk)
- Fixed off-script travellers not appearing in night order modal
- Added custom jinx support for homebrew characters, once again following the official [JSON Schema](https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json)
- Updated Organ Grinder and Vizier ability texts
- Corrected Widow and Lil' Monsta ability texts to match the official app and upcoming physical tokens
- Removed Riot from night order, as it was not added in any official tools

### Version 2.19.1
- Added Wizard
- Fixed character setup warning overlapping with character tokens on large scripts in fullscreen mode

### Version 2.19.0
- Added Xaan
- Updated jinx list to include reordered list, new Leviathan/Riot jinxes, and removed Alchemist/Vizier jinx
- Updated Alchemist, Riot, and Al-Hadikhia ability texts
- Updated Cannibal & Lycanthrope reminder tokens
- Change "traveler" to "traveller" internally, and added continuing support for old scripts that use "traveler"
- Hide Name and Author of script if logo is present and imageOptIn is active

### Version 2.18.5
- Always display pronouns when set

### Version 2.18.4
- Add Gnome
- Update Boomdandy, Lycanthrope, Snitch, Nightwatchman, Damsel, King, Vizier, Plague Doctor, Farmer, and Ahsaahir abilities, as well as Kazali/Soldier and Kazali/Goon jinxes
- Add new Cannibal/Poppy Grower jinx
- Remove Organ Grinder/Lil' Monsta and Lycanthrope/Gambler jinxes
- Fix blue gradient for Settings menu tab

---

### Version 2.18.3
- Fix homebrew character reminders (again)
- Fix homebrew character icons in night order and character sheet
- Update the image clone scripts to use rimraf and copyfiles

---

### Version 2.18.2
- Fix homebrew characters with multiple alignment-shifted images failing to display character icons on reminders
- Update Acrobat and Organ Grinder

---

### Version 2.18.1
- Fix players being able to vote while not connected to their seat
- Hosting a new Session now clears all reserved seats
- Added a ToolTip to the seat icon to clarify the reserved/connected state

---

### Version 2.18.0
- Players that lose connection to their active session have their seats reserved in case they reconnect
- Reserved seats cannot be claimed by another player and have their chair icon display as red
- If a player reconnects they can claim their reserved seat using the "Claim seat" button as if it were an unclaimed seat
- The Storyteller can manually empty a reserved seat with the "Empty seat" button as if it were a claimed seat
- Players manually vacating a seat using the "Vacate seat" or "Leave Session" buttons do not reserve the seat they vacated

---

### Version 2.17.1
- updated fabled json to include Bootlegger, Ferryman, and Gardener
- fixed inconsistency with official app and physical game where characters with multiple of the same reminder would only show one leaf
- fixed icon spacing in the night order modal
- added dusk and dawn to night order sheet for Vizier and Leviathan night order positions to make sense
- fixed minion & demon info positions in night order to reference the nightsheet.json
- fixed scrolling in character menus for large scripts (this only works when the modals are maximised)

---

### Version 2.17.0
- cleaned up character JSON to create consistent reminder tokens and ability texts
- updated nightsheet.json as per latest updates
- update the build to pull images from https://github.com/tomozbot/botc-icons
- added Boffin role
- removed full stop after night order reminders

---

### Version 2.16.4
- fixed minor spelling mistakes in code documentation
- fixed Banshee votes being shown as the singular form "2 vote" during a nomination if no other players voted

---

### Version 2.16.3
- adjusted the Add Fabled and Choose & Assign windows to be more mobile friendly

---

### Version 2.16.2
- fixed issue regarding the grimoire being clipped on mobile devices ([#11](https://github.com/nicholas-eden/townsquare/issues/11))
- fixed issue with demon head image in center being clipped on mobile devices
- increased text sizes on mobile devices
- adjusted windows on mobile to be more mobile friendly

---

### Version 2.16.1
Updated character night order to be consistent with script tool

---

### Version 2.16.0
- Add ability to use json from clipboard to upload script (by @alexanderfletcher)

---

### Version 2.15.4
- fixed flickering of add reminder token
- added redirect to Chinese version

---

### Version 2.15.3
- add Huntsman/Damsel, Noble, Al-Hadikhia, Golem, Fearmonger, Puzzlemaster, Alchemist, Engineer, Riot, Psychopath, Atheist, Nightwatchman to list of available characters
- fixed game state JSON not handling custom Fabled correctly

---

### Version 2.15.2
- added mobile web application support
- show correct number of leaves on roles with global reminders
- fixed a bug with traveler list showing up when assigning demon bluffs
- fixed a bug with homebrew scripts that contained negative night order positions

---

### Version 2.15.1
- fix Mephit not showing up on scripts, futureproof Mephit name change
- add Boomdandy to list of available characters

---

### Version 2.15.0
- clean up transparent portions of icons
- add Magician & LLeech to list of available characters

---

### Version 2.14.0
- added Farmer to list of available characters

---

### Version 2.13.0
- fix players being moved or removed during nomination
- add vue linter
- use "Exile" rather than "Banishment" for exiles
- added global animation toggle for better performance
- added record vote history toggle to session menu, and clear vote history button
- add support for custom Fabled characters
- show Jinxed interactions on character reference list
- add 'marked for execution' indicator

---

### Version 2.12.0
- tweak reference sheet to better fit screen in single column layout
- add warning icon overlay for setup roles on character assignment modal
- added Heretic and Marionette plus King/Choirboy and the Gangster to list of available characters

---

### Version 2.11.0
- new design for character reference sheet
- automatically switch to grimoire view when joining a session through a link
- fixed demon bluffs showing on public town square
- fixed a bug that prevented connecting to a session when previously being connected and joining through a link

---

### Version 2.10.0
- added [nomination log indicator](https://fontawesome.com/icons/book-dead).  When a nomination log [v] is available, the number of currently visible entries is displayed. Clicking the indicator can reveal/hide the nomination log.
- fix issue where a player and storyteller updating the same players pronouns at around the same time causes an infinite loop disconnecting the session.
- fix bug with shifting roles when the storyteller deletes a player
- added Poppygrower to list of available characters

---

### Version 2.9.1
- fix gamestate JSON not showing (custom) roles and failing to load states with custom scripts properly
- fix gamestate not stripping out special characters from role.id on load
- made character assignment modal a bit prettier
- got rid of the extra pixels on the  Soldier icon
- fixed lengthy live session channel names not being correctly cut off
- hide player names in night order / character reference popup when town square is public
- fix (pre-)vote calculation being off by one if the nominee votes

---

### Version 2.9.0
- added support for assigning pronouns to players and display of the pronouns in a tooltip on the player name.
- added button to modals that allows the user to maximize them
- added Mephit and Snitch to roles.json

---

### Version 2.8.0
- added hands-off live session support for homebrew / custom characters again!
- added custom image opt-in that will prevent any (potentially malicious / harmful) images from loading until a player manually allows them to

---

## Version 2.7.0
- added support for assigning duplicate characters to more than one player (like Legion)
- further live session bandwidth optimizations
- sessions can now be joined by pasting the whole link into the popup (thanks @davotronic5000)
- fabled night order bug fixed
- added Legion to list of available characters (thanks @eddgabriel)
- added support for mp4/webm video backgrounds
- added tooltips to night order popup

---

## Version 2.6.0
- night mode can be toggeled with [S] now (thanks @davotronic5000)
- night order shows which players are dead

---

## Version 2.5.0
- all travelers from the base editions are now optionally available (thanks @davotronic5000)
- night order shows player names near roles now

---

## Version 2.4.0
- added spoiler role (Pixie!)
- fixed bug with ST sending out roles that are not part of the current edition / script (ie. travelers or base set roles)
- better Lycanthrope icon (thanks @AWConant)

---

## Version 2.3.1
- better vote history design and added timestamps
- adjusted player menu styling on smaller screens
- improved CONTRIBUTING.md description of hosting your own copy

---

## Version 2.3.0
- added spoiler role (Lycanthrope!)
- fixed copy to clipboard in Firefox
- fixed non-countdown votes still playing countdown sound for a split second

---

## Version 2.2.1
- clearing players / roles now also clears Fabled
- fix list of locked votes showing unlocked votes sometimes

---

## Version 2.2.0
- added [V] hotkey to open nomination history (thanks @lilserf)
- updated roles according to official Wiki changes
- adjusted roles night order

---

## Version 2.1.1
- show vote results at the end of a vote
- fixed global reminders not showing up anymore when the associated role is assigned to a player
- adjusted backend metrics


---

## Version 2.1.0
- reduced countdown volume by 10db
- added a mute toggle to the Grimoire menu (currently only silences the countdown)
- pressing [J] while in a session will now leave the session
- always show reminder add button when on a mobile device that doesn't support hovering
- removed screenshot feature as it is no longer useful

---

## Version 2.0.4
- fix bug with live sessions that contain travelers from a different set
- fix server channel cleanup

---

## Version 2.0.3
- load roles that belong to different editions (like travelers) from gamestate
- close session when missing custom roles and open edition modal
- added a few more metrics

---

## Version 2.0.2
- fix nomination history type not detecting travelers
- fix live session domain whitelist
- fix build path
- fix changelog version numbering

---

## Version 2.0.1
- clearing the nomination history as the Storyteller clears it for the players too
- vote buttons should work in all situations correctly now
- fixed some minor styling and live session issues

---

## Version 2.0.0
- The project is now available under its own domain: [clocktower.live](https://clocktower.live)
- Added a feature that allows a live session Storyteller to automatically (and safely) distribute assigned
  characters to all players that have claimed a seat, eliminating the need to manually tell every player their role
- Visible "night phase" that can be toggled by the Storyteller
- Voting history added with nomination and vote results
- Optional, audible voting countdown added (featuring an actual clock tower bell!)
- Fabled show up on the Night Order sheet and affect Grimoire night order counters
- Current game state can now be easily exported and imported in the form of a JSON text code
- Voting can be paused and sped up / slowed down in 0.5 second increments by the Storyteller
- Voting terminology changed to "Hand UP" / "Hand DOWN" and iconography updated
- Added meta-data support for custom scripts, that currently supports `name`, `author` and a custom `logo` through a
  `_meta` role (note that a customized logo will not be synced to players in a live session)
- Players can no longer claim seats that are already occupied and only the Storyteller can vacate seats of other players
  (players can still vacate their own seat)
- Characters selected in the bluff window now also show up in the list of reminder tokens
- Homebrew scripts / custom characters no longer automatically load in live sessions, for 2 reasons:
  - the players in a live session have no control over the script that the storyteller loads,
    so a malicious storyteller could load a custom script that contains harmful / inappropriate images
  - some homebrew scripts are quite big JSON files and synching these through the live session
    server can cause traffic / performance issue easily
  - this change may be reverted in the future when I figure out a way to sync custom characters safely and without
    such a big impact on performance constraints
- Buggy (spamming) live session connections will now be terminated on the server side and display an error message
- Balloonist reminder tokens adjusted
- Live session URLs shortened
- Deus Ex Fiasco and Stormcatcher Fabled added / updated
- Custom Reminder text looks better when there is a lot of text
- added a README for the backend server
