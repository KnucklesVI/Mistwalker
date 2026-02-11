# Mistwalker Changelog Rules

These rules govern how the CHANGELOG.md file is written and maintained.

## Structure

- **Newest version at top**, oldest at bottom.
- Each version is an `## Alpha X.XX` header followed by a one-line summary in italics describing the release theme.
- Changes are grouped under **bold category headers** (no sub-bullets unless truly needed).

## Categories (in order)

1. **Systems** — New game mechanics, roles, or major reworks to existing systems.
2. **Content** — New items, creatures, names, lore, discoveries, or procedural generation pools.
3. **UI** — Visual changes, layout fixes, new tabs or modals, animation changes.
4. **Fixes** — Bug fixes, edge cases resolved.
5. **QoL** — Quality-of-life improvements, auto-assignments, convenience features.

Only include categories that have entries for that version. Skip empty categories.

## Writing Style

- Each entry is a single concise line. No multi-sentence paragraphs.
- Lead with the *what*, not the *why*. Keep it factual.
- Use present tense: "Adds herb garden assignment" not "Added herb garden assignment."
- No code references, function names, or implementation details.
- If a feature has multiple sub-parts, use a colon and a brief list: "New role: Alchemist — spirit 2+, mind 2+, 12-day training, can brew recipes and experiment."
- Don't repeat the same info under multiple categories.

## Versioning

- Bump version for any session that produces a new snapshot.
- Note the snapshot filename at the bottom of each version block: `> Snapshot: mistwalker-X.XX.html`

## What NOT to Include

- Internal refactoring that doesn't change player experience.
- Test-only changes.
- Attempts or reverts (only log the final outcome).
- Speculative or planned features not yet implemented.

## When to Update

- Update the changelog at the end of each work session, right before creating the snapshot.
- When creating a new snapshot, move the previous snapshot file to the `MW Versions/` folder.
