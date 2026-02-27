/**
 * Compendium Tab - Creature knowledge and research
 *
 * Displays discovered creatures with progressively revealed information:
 * - Basic stats (damage, size)
 * - Trait hints from scouting
 * - Confirmed traits (where we know the counter)
 * - Doctrine test results
 * - Intel sources (sightings, encounters, scout reports)
 */

export class CompendiumTab {
  constructor() {
    // Read-only display tab, no callbacks
  }

  /**
   * Build a collapsible section for a single creature
   */
  buildCreatureSection(creatureTypeId, entry, state) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    // Header with creature name or placeholder
    const header = document.createElement('div');
    header.className = 'collapsible-header';

    const creatureName = entry.discovered && entry.name ? entry.name : 'Unknown Creature';
    const creatureDisplay = entry.discovered ? creatureName : `??? (ID: ${creatureTypeId})`;

    header.innerHTML = `
      <span class="collapsible-caret">▼</span>
      <span class="collapsible-title">${creatureDisplay}</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    // If not discovered, just show placeholder
    if (!entry.discovered) {
      const placeholder = document.createElement('div');
      placeholder.style.cssText = 'color: var(--text-secondary); padding: 8px; font-style: italic;';
      placeholder.textContent = 'Not yet discovered. Venture deeper to learn more.';
      body.appendChild(placeholder);
    } else {
      // Build stats section
      const statsSection = this.buildStatsSection(entry);
      if (statsSection) body.appendChild(statsSection);

      // Build trait hints section
      const hintsSection = this.buildTraitHintsSection(entry);
      if (hintsSection) body.appendChild(hintsSection);

      // Build confirmed traits section
      const confirmedSection = this.buildConfirmedTraitsSection(entry);
      if (confirmedSection) body.appendChild(confirmedSection);

      // Build doctrine tests section
      const doctrineSection = this.buildDoctrineTestsSection(entry);
      if (doctrineSection) body.appendChild(doctrineSection);

      // Build intel sources section
      const intelSection = this.buildIntelSourcesSection(entry, state);
      if (intelSection) body.appendChild(intelSection);
    }

    // Collapsible toggle
    header.addEventListener('click', () => {
      const isCollapsed = header.classList.toggle('collapsed');
      if (isCollapsed) {
        body.classList.add('hidden');
      } else {
        body.classList.remove('hidden');
      }
    });

    section.appendChild(header);
    section.appendChild(body);
    return section;
  }

  /**
   * Build stats subsection (damage, size info, trait gap)
   */
  buildStatsSection(entry) {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 12px; padding: 8px; background: var(--panel-bg-secondary, rgba(255,255,255,0.02)); border-radius: 4px; border-left: 3px solid var(--accent-gold);';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; color: var(--accent-gold); margin-bottom: 6px; font-size: 0.9em;';
    title.textContent = 'Stats';
    section.appendChild(title);

    // Base damage
    if (entry.baseDamageKnown && entry.baseDamage !== null) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <span class="item-name">Base Damage</span>
        <span class="item-detail">${entry.baseDamage}</span>
      `;
      section.appendChild(row);
    } else if (entry.baseDamageKnown === false) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <span class="item-name">Base Damage</span>
        <span class="item-detail" style="color: var(--text-secondary);">Unknown</span>
      `;
      section.appendChild(row);
    }

    // Total damage by size
    if (entry.totalDamageKnown && entry.totalDamage) {
      const sizeLabels = { sm: 'Small', m: 'Medium', l: 'Large' };
      for (const [size, damage] of Object.entries(entry.totalDamage)) {
        if (damage !== null) {
          const row = document.createElement('div');
          row.className = 'item-row';
          row.innerHTML = `
            <span class="item-name">${sizeLabels[size] || size} Damage</span>
            <span class="item-detail">${damage}</span>
          `;
          section.appendChild(row);
        }
      }
    }

    // Size known indicator
    if (entry.sizeKnown) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <span class="item-name">Size</span>
        <span class="item-detail" style="color: var(--text-good);">✓ Confirmed</span>
      `;
      section.appendChild(row);
    }

    return section;
  }

  /**
   * Build trait hints section (descriptions from scouting/encounters)
   */
  buildTraitHintsSection(entry) {
    if (!entry.traitHints || entry.traitHints.length === 0) {
      return null;
    }

    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 12px; padding: 8px; background: var(--panel-bg-secondary, rgba(255,255,255,0.02)); border-radius: 4px; border-left: 3px solid var(--text-secondary);';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; color: var(--text-secondary); margin-bottom: 6px; font-size: 0.9em;';
    title.textContent = `Trait Hints (${entry.traitHints.length})`;
    section.appendChild(title);

    for (const hint of entry.traitHints) {
      const hintBox = document.createElement('div');
      hintBox.style.cssText = 'margin-bottom: 6px; padding: 6px; background: rgba(255,255,255,0.01); border-left: 2px solid var(--text-secondary); border-radius: 2px;';

      const desc = document.createElement('div');
      desc.style.cssText = 'font-style: italic; color: var(--text-primary); margin-bottom: 2px;';
      desc.textContent = `"${hint.description}"`;
      hintBox.appendChild(desc);

      const meta = document.createElement('div');
      meta.style.cssText = 'font-size: 0.8em; color: var(--text-muted); display: flex; gap: 12px;';

      const sourceSpan = document.createElement('span');
      sourceSpan.textContent = `Source: ${hint.source}`;
      meta.appendChild(sourceSpan);

      if (hint.day !== undefined && hint.day !== null) {
        const daySpan = document.createElement('span');
        daySpan.textContent = `Dawn ${hint.day}`;
        meta.appendChild(daySpan);
      }

      hintBox.appendChild(meta);
      section.appendChild(hintBox);
    }

    return section;
  }

  /**
   * Build confirmed traits section (traits where we know the counter)
   */
  buildConfirmedTraitsSection(entry) {
    if (!entry.confirmedTraits || entry.confirmedTraits.length === 0) {
      return null;
    }

    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 12px; padding: 8px; background: var(--panel-bg-secondary, rgba(255,255,255,0.02)); border-radius: 4px; border-left: 3px solid var(--text-good);';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; color: var(--text-good); margin-bottom: 6px; font-size: 0.9em;';
    title.textContent = `Confirmed Traits (${entry.confirmedTraits.length})`;
    section.appendChild(title);

    for (const trait of entry.confirmedTraits) {
      const row = document.createElement('div');
      row.className = 'item-row';

      const traitId = trait.traitId || 'Unknown';
      const counter = trait.counteredBy ? `✓ ${trait.counteredBy}` : 'Countered (details unknown)';
      const day = trait.confirmedDay !== undefined && trait.confirmedDay !== null ? ` · Dawn ${trait.confirmedDay}` : '';

      row.innerHTML = `
        <span class="item-name">${traitId}</span>
        <span class="item-detail" style="color: var(--text-good);">${counter}${day}</span>
      `;
      section.appendChild(row);
    }

    return section;
  }

  /**
   * Build doctrine tests section (what we've tried and results)
   */
  buildDoctrineTestsSection(entry) {
    if (!entry.testedDoctrines || entry.testedDoctrines.length === 0) {
      return null;
    }

    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 12px; padding: 8px; background: var(--panel-bg-secondary, rgba(255,255,255,0.02)); border-radius: 4px; border-left: 3px solid var(--accent-gold);';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; color: var(--accent-gold); margin-bottom: 6px; font-size: 0.9em;';
    title.textContent = `Doctrine Tests (${entry.testedDoctrines.length})`;
    section.appendChild(title);

    for (const test of entry.testedDoctrines) {
      const row = document.createElement('div');
      row.className = 'item-row';

      const doctrineId = test.doctrineId || 'Unknown';
      const traitInfo = test.traitTargeted ? ` (targets ${test.traitTargeted})` : '';
      const resultClass = test.effective ? 'item-detail' : 'item-detail';
      const resultText = test.effective ? '✓ Effective' : '✗ Ineffective';
      const resultColor = test.effective ? 'var(--text-good)' : 'var(--text-muted)';
      const day = test.day !== undefined && test.day !== null ? ` · Dawn ${test.day}` : '';

      row.innerHTML = `
        <span class="item-name">${doctrineId}${traitInfo}</span>
        <span class="${resultClass}" style="color: ${resultColor};">${resultText}${day}</span>
      `;
      section.appendChild(row);
    }

    return section;
  }

  /**
   * Build intel sources section (sightings, encounters, scout reports)
   */
  buildIntelSourcesSection(entry, state) {
    const hasSightings = entry.sightings && entry.sightings.length > 0;
    const hasEncounters = entry.encounters && entry.encounters.length > 0;
    const hasScoutReports = entry.scoutReports && entry.scoutReports.length > 0;

    if (!hasSightings && !hasEncounters && !hasScoutReports) {
      return null;
    }

    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 12px; padding: 8px; background: var(--panel-bg-secondary, rgba(255,255,255,0.02)); border-radius: 4px; border-left: 3px solid var(--text-secondary);';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: bold; color: var(--text-secondary); margin-bottom: 6px; font-size: 0.9em;';
    title.textContent = 'Intel Sources';
    section.appendChild(title);

    // Sightings
    if (hasSightings) {
      const sightingTitle = document.createElement('div');
      sightingTitle.style.cssText = 'font-weight: 600; color: var(--text-primary); margin: 6px 0 4px 0; font-size: 0.85em;';
      sightingTitle.textContent = 'Sightings';
      section.appendChild(sightingTitle);

      for (const sighting of entry.sightings) {
        const row = document.createElement('div');
        row.className = 'item-row';
        const source = sighting.source || 'Unknown source';
        const day = sighting.day !== undefined && sighting.day !== null ? `Dawn ${sighting.day}` : 'Unknown dawn';
        row.innerHTML = `
          <span class="item-detail" style="color: var(--text-secondary);">${source}</span>
          <span class="item-detail" style="color: var(--text-muted); font-size: 0.85em;">${day}</span>
        `;
        section.appendChild(row);
      }
    }

    // Encounters
    if (hasEncounters) {
      const encounterTitle = document.createElement('div');
      encounterTitle.style.cssText = 'font-weight: 600; color: var(--text-primary); margin: 6px 0 4px 0; font-size: 0.85em;';
      encounterTitle.textContent = 'Encounters';
      section.appendChild(encounterTitle);

      for (const encounter of entry.encounters) {
        const row = document.createElement('div');
        row.className = 'item-row';
        const outcome = encounter.outcome || 'Unknown outcome';
        const day = encounter.day !== undefined && encounter.day !== null ? `Dawn ${encounter.day}` : 'Unknown dawn';
        row.innerHTML = `
          <span class="item-detail" style="color: var(--text-secondary);">${outcome}</span>
          <span class="item-detail" style="color: var(--text-muted); font-size: 0.85em;">${day}</span>
        `;
        section.appendChild(row);
      }
    }

    // Scout Reports
    if (hasScoutReports) {
      const reportTitle = document.createElement('div');
      reportTitle.style.cssText = 'font-weight: 600; color: var(--text-primary); margin: 6px 0 4px 0; font-size: 0.85em;';
      reportTitle.textContent = 'Scout Reports';
      section.appendChild(reportTitle);

      for (const report of entry.scoutReports) {
        const reportBox = document.createElement('div');
        reportBox.style.cssText = 'margin-bottom: 6px; padding: 6px; background: rgba(255,255,255,0.01); border-radius: 2px;';

        const info = document.createElement('div');
        info.style.cssText = 'font-size: 0.85em; margin-bottom: 2px;';

        const sizeLabel = { sm: 'Small', m: 'Medium', l: 'Large' }[report.size] || report.size;
        const exactLabel = report.exactDays ? `(exact: ${report.exactDays}d)` : '';
        const countText = report.count !== undefined && report.count !== null ? `${report.count}x ${sizeLabel} ${exactLabel}` : `${sizeLabel} ${exactLabel}`;
        const dayText = report.day !== undefined && report.day !== null ? `Dawn ${report.day}` : 'Unknown dawn';

        info.textContent = `${countText} · ${dayText}`;
        reportBox.appendChild(info);

        // Trait descriptions from report
        if (report.traitDescriptions && report.traitDescriptions.length > 0) {
          const traitsDiv = document.createElement('div');
          traitsDiv.style.cssText = 'font-size: 0.8em; color: var(--text-secondary); font-style: italic; padding-top: 2px; border-top: 1px solid rgba(255,255,255,0.05);';
          traitsDiv.textContent = `Traits: ${report.traitDescriptions.join(', ')}`;
          reportBox.appendChild(traitsDiv);
        }

        section.appendChild(reportBox);
      }
    }

    return section;
  }

  /**
   * Main render function
   */
  render(state) {
    const container = document.createElement('div');

    // Header section with discovery progress
    const headerSection = document.createElement('div');
    headerSection.style.cssText = 'margin-bottom: 16px; padding: 12px; background: var(--panel-bg-secondary, rgba(255,255,255,0.02)); border-radius: 4px; border-left: 3px solid var(--accent-gold);';

    const headerTitle = document.createElement('div');
    headerTitle.style.cssText = 'font-weight: bold; font-size: 1.1em; color: var(--accent-gold); margin-bottom: 6px;';

    const compendiumData = state.creatures?.compendium || {};
    const known = Object.values(compendiumData).filter(e => e.discovered).length;
    const total = (state.creatures?.types || []).length;
    headerTitle.textContent = `Bestiary: ${known} of ${total} discovered`;
    headerSection.appendChild(headerTitle);

    if (total > 0) {
      const progressText = document.createElement('div');
      progressText.style.cssText = 'font-size: 0.85em; color: var(--text-secondary);';
      const pct = total > 0 ? Math.round((known / total) * 100) : 0;
      progressText.textContent = `Discovery: ${pct}%`;
      headerSection.appendChild(progressText);
    }

    container.appendChild(headerSection);

    // Creature sections
    const creatureTypeIds = Object.keys(compendiumData).sort();

    if (creatureTypeIds.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = 'padding: 16px; color: var(--text-secondary); text-align: center; font-style: italic;';
      emptyMsg.textContent = 'The mist has not yet revealed its horrors...';
      container.appendChild(emptyMsg);
    } else {
      for (const creatureTypeId of creatureTypeIds) {
        const entry = compendiumData[creatureTypeId];
        const creatureSection = this.buildCreatureSection(creatureTypeId, entry, state);
        container.appendChild(creatureSection);
      }
    }

    return container;
  }
}

export default CompendiumTab;
