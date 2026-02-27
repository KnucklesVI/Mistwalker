/**
 * Library Title Catalog
 * 100 hand-crafted titles: 20 per topic (priest, soldier, engineer, scholar, creatures)
 * Each topic has 10 real abilities + 10 duds
 *
 * Language distribution per topic:
 *   Common (tier 0 language): 5 real + 5 duds = 10
 *   Ancient Script (tier 1): 3 real + 3 duds = 6
 *   Forgotten Tongue (tier 2): 2 real + 2 duds = 4
 *
 * Study durations: dud = 1 day, tier 1 = 3 days, tier 2 = 5 days, tier 3 = 7 days
 *
 * Discoverability (discoverable field):
 *   - Common language books: discoverable 'common'
 *   - Non-common with real ability (tier > 0): discoverable 'common' (mixed language)
 *   - Non-common without ability (tier === 0): discoverable matches language (entirely foreign)
 */

const LIBRARY_CATALOG = [

  // ===========================
  //   PRIEST TITLES (20)
  // ===========================

  // --- Real abilities (10) ---
  {
    id: 'priest_01', name: 'On the Nature of Boundaries and Their Permeability',
    topic: 'priest', hint: 'Discusses the theoretical limits of protective barriers and how they might be expanded.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'mist_push', abilityName: 'Mist Push',
    abilityDescription: 'Priests can temporarily push mist back from walls, expanding the safe zone.',
  },
  {
    id: 'priest_02', name: 'Whispers Heard Only in Desperation',
    topic: 'priest', hint: 'Accounts of prayers spoken in the heat of battle, and what answered.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'battle_prayer', abilityName: 'Battle Prayer',
    abilityDescription: 'Passive ability that triggers when a fight is going badly, providing a small combat boost.',
  },
  {
    id: 'priest_03', name: 'The Geometry of Protective Spheres',
    topic: 'priest', hint: 'Mathematical analysis of curved barriers and their area-to-strength ratio.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'expanded_shield', abilityName: 'Expanded Shield',
    abilityDescription: 'Increases expedition bubble size, allowing more party members.',
  },
  {
    id: 'priest_04', name: 'A Single Flame in Darkness',
    topic: 'priest', hint: 'A meditation on focusing spiritual energy upon a single individual.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'personal_blessing', abilityName: 'Personal Blessing',
    abilityDescription: 'Buff a single character\'s stats temporarily.',
  },
  {
    id: 'priest_05', name: 'Of Corruption and Its Undoing',
    topic: 'priest', hint: 'Detailed methods for cleansing impurities from living things and places.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'purification', abilityName: 'Purification',
    abilityDescription: 'Cleanse corruption or debuffs from a character or area.',
  },
  {
    id: 'priest_06', name: 'Eyes That Pierce the Grey',
    topic: 'priest', hint: 'Records of those who could perceive movement within the mist itself.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'mist_sight', abilityName: 'Mist Sight',
    abilityDescription: 'See threats approaching through the mist earlier, providing early warning.',
  },
  {
    id: 'priest_07', name: 'When Many Voices Become One',
    topic: 'priest', hint: 'The power of coordinated prayer and its amplifying properties.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'congregation_rite', abilityName: 'Congregation Rite',
    abilityDescription: 'Buff an entire group of characters for a duration.',
  },
  {
    id: 'priest_08', name: 'What the Dead Leave Behind',
    topic: 'priest', hint: 'Explores residual spiritual energy and how it might be harvested.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'soul_ward', abilityName: 'Soul Ward',
    abilityDescription: 'Apply essence of the fallen as a defensive buff to walls or towers.',
  },
  {
    id: 'priest_09', name: 'The Ground Remembers What Was Sacred',
    topic: 'priest', hint: 'Ancient rites for consecrating earth so deeply that it resists all corruption.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'consecrated_ground', abilityName: 'Consecrated Ground',
    abilityDescription: 'Mark an area that slowly heals characters standing in it.',
  },
  {
    id: 'priest_10', name: 'Crossing the Threshold and Returning',
    topic: 'priest', hint: 'A forbidden text describing the boundary between life and death, and how to cross it.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'resurrection', abilityName: 'Resurrection',
    abilityDescription: 'Bring back a dead character at high cost and long cooldown.',
  },

  // --- Priest duds (10) ---
  {
    id: 'priest_dud_01', name: 'Reflections on the Nature of Devotion',
    topic: 'priest', hint: 'A philosophical treatise on what it means to serve a higher purpose.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_02', name: 'The Seven Silences of the Old Monastery',
    topic: 'priest', hint: 'Describes seven distinct types of silence observed in ancient religious practice.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_03', name: 'Prayers for the Turning of Seasons',
    topic: 'priest', hint: 'A collection of seasonal prayers with no apparent practical application.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_04', name: 'A Treatise on Spiritual Humility',
    topic: 'priest', hint: 'Argues that spiritual power diminishes with pride. Mostly anecdotal.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_05', name: 'The Weight of Unanswered Questions',
    topic: 'priest', hint: 'A priest\'s journal cataloguing decades of theological uncertainty.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_06', name: 'Meditations Upon the Flickering Light',
    topic: 'priest', hint: 'Extended metaphors about flame and shadow. Beautiful but impractical.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_07', name: 'Songs They Sang Before the Mist',
    topic: 'priest', hint: 'Hymns from the pre-mist era. Historically interesting but spiritually inert.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_08', name: 'On the Proper Arrangement of Sacred Vessels',
    topic: 'priest', hint: 'Detailed instructions for altar setup. Extremely specific and outdated.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_09', name: 'The Paradox of Faith in Absent Gods',
    topic: 'priest', hint: 'Philosophical debate on maintaining belief without evidence. No practical value.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'priest_dud_10', name: 'Why the Bell Rings Thrice at Dusk',
    topic: 'priest', hint: 'A rambling account of monastery tradition with no actionable insight.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },

  // ===========================
  //   ENGINEER TITLES (20)
  // ===========================

  // --- Real abilities (10) ---
  {
    id: 'engineer_01', name: 'Principles of Load-Bearing Under Constraint',
    topic: 'engineer', hint: 'Technical analysis of how to build stronger with fewer materials.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'efficient_construction', abilityName: 'Efficient Construction',
    abilityDescription: 'All building projects take fewer days to complete.',
  },
  {
    id: 'engineer_02', name: 'Subterranean Navigation by Sound',
    topic: 'engineer', hint: 'Methods for mapping underground passages using acoustic reflection.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'fast_excavation', abilityName: 'Fast Excavation',
    abilityDescription: 'Digging speed increased for all excavation projects.',
  },
  {
    id: 'engineer_03', name: 'Defensive Mechanisms of the Burrowing Thornback',
    topic: 'engineer', hint: 'Studies of a creature that builds elaborate mechanical defenses.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'spike_traps', abilityName: 'Spike Traps',
    abilityDescription: 'Build improved traps around the perimeter that deal more damage.',
  },
  {
    id: 'engineer_04', name: 'On the Folding and Tempering of Reclaimed Metal',
    topic: 'engineer', hint: 'Techniques for working salvaged metal into usable implements.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'forge_weapons', abilityName: 'Forge Weapons',
    abilityDescription: 'Craft improved weapons, giving soldiers a combat bonus.',
  },
  {
    id: 'engineer_05', name: 'Coordinating Labour in Confined Spaces',
    topic: 'engineer', hint: 'Management principles for getting the most from digging teams.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'digger_coordination', abilityName: 'Digger Coordination',
    abilityDescription: 'Workers assigned to digging are more effective.',
  },
  {
    id: 'engineer_06', name: 'The Watchtower at Brenne: A Structural Analysis',
    topic: 'engineer', hint: 'Detailed study of a legendary tower that withstood decades of siege.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'reinforced_towers', abilityName: 'Reinforced Towers',
    abilityDescription: 'Upgrade existing towers for more HP and damage.',
  },
  {
    id: 'engineer_07', name: 'Why Walls Fail: Common Fracture Patterns',
    topic: 'engineer', hint: 'Forensic analysis of structural failures and how to prevent them.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'reinforced_walls', abilityName: 'Reinforced Walls',
    abilityDescription: 'Upgrade existing walls for significantly more HP.',
  },
  {
    id: 'engineer_08', name: 'Unusual Findings in Deep Strata',
    topic: 'engineer', hint: 'Geological report noting strange objects embedded in deep rock layers.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'tome_sense', abilityName: 'Tome Sense',
    abilityDescription: 'Increased chance of discovering tomes while digging.',
  },
  {
    id: 'engineer_09', name: 'Layered Composites for Impact Resistance',
    topic: 'engineer', hint: 'Advanced materials science for creating protective equipment.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'forge_armor', abilityName: 'Forge Armor',
    abilityDescription: 'Craft improved armor so soldiers take less damage.',
  },
  {
    id: 'engineer_10', name: 'Harnessing Compression in Sealed Chambers',
    topic: 'engineer', hint: 'Physics of pressure-based mechanisms and their destructive potential.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'siege_cannon', abilityName: 'Siege Cannon',
    abilityDescription: 'New buildable structure dealing heavy damage to large threats.',
  },

  // --- Engineer duds (10) ---
  {
    id: 'engineer_dud_01', name: 'A Survey of Stone Types in the Eastern Ridges',
    topic: 'engineer', hint: 'Comprehensive but purely descriptive catalog of regional geology.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_02', name: 'The Aqueducts of a Forgotten Settlement',
    topic: 'engineer', hint: 'Impressive water engineering for a climate nothing like yours.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_03', name: 'Speculation on Pre-Mist Construction Methods',
    topic: 'engineer', hint: 'Theories about building techniques that required materials no longer available.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_04', name: 'Geometric Patterns Found in Natural Caverns',
    topic: 'engineer', hint: 'Beautiful illustrations of cave formations. Decorative rather than instructive.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_05', name: 'Notes on Soil Composition at Various Depths',
    topic: 'engineer', hint: 'Meticulous soil data from a region hundreds of miles away.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_06', name: 'The Bridges They Built Over Nothing',
    topic: 'engineer', hint: 'Poetic account of bridge-building projects that served no purpose.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_07', name: 'An Incomplete Catalog of Structural Adhesives',
    topic: 'engineer', hint: 'Promising title but the key formulas are missing from this copy.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_08', name: 'Wind Resistance and the Problem of Height',
    topic: 'engineer', hint: 'Theoretical limits of tall structures. Interesting but inapplicable here.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_09', name: 'Observations on the Erosion of Carved Surfaces',
    topic: 'engineer', hint: 'A study of weathering patterns spanning centuries. No practical use.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'engineer_dud_10', name: 'Why the Old Mines Were Abandoned',
    topic: 'engineer', hint: 'Historical account of mine closures. Reasons: economic, not technical.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },

  // ===========================
  //   SOLDIER TITLES (20)
  // ===========================

  // --- Real abilities (10) ---
  {
    id: 'soldier_01', name: 'The Tortoise and the Mountain: Holding Ground',
    topic: 'soldier', hint: 'Tactical doctrine focused on endurance over aggression in combat.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'defensive_stance', abilityName: 'Defensive Stance',
    abilityDescription: 'Fighting style that reduces damage taken at the cost of attack power.',
  },
  {
    id: 'soldier_02', name: 'Lessons from the Cornered Beast',
    topic: 'soldier', hint: 'Studies of desperate combat and the advantages of total commitment.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'aggressive_strike', abilityName: 'Aggressive Strike',
    abilityDescription: 'Fighting style that increases damage dealt at the cost of defense.',
  },
  {
    id: 'soldier_03', name: 'What Keeps a Soldier From Running',
    topic: 'soldier', hint: 'Psychological analysis of morale and the factors that sustain it.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'morale_hold', abilityName: 'Morale Hold',
    abilityDescription: 'Soldiers resist panic and fear effects, fighting longer before breaking.',
  },
  {
    id: 'soldier_04', name: 'Communication Across Distance Without Voice',
    topic: 'soldier', hint: 'Systems for silent coordination using instruments and signals.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'signal_whistles', abilityName: 'Signal Whistles',
    abilityDescription: 'Coordination bonus allowing soldiers to respond faster to threats.',
  },
  {
    id: 'soldier_05', name: 'Covering Ground With Fewer Eyes',
    topic: 'soldier', hint: 'Efficient patrol routes that maximize area coverage with minimal personnel.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'patrol_efficiency', abilityName: 'Patrol Efficiency',
    abilityDescription: 'Soldiers on watch cover more area, providing earlier threat detection.',
  },
  {
    id: 'soldier_06', name: 'On Standing Together in Narrow Places',
    topic: 'soldier', hint: 'Formation tactics for confined spaces where individual skill matters less.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'shield_wall', abilityName: 'Shield Wall',
    abilityDescription: 'Formation technique where grouped soldiers take much less damage.',
  },
  {
    id: 'soldier_07', name: 'How the Fingers Become a Fist',
    topic: 'soldier', hint: 'Coordination drills that transform individual fighters into a unit.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'formation_fighting', abilityName: 'Formation Fighting',
    abilityDescription: 'Adjacent soldiers boost each other\'s combat stats.',
  },
  {
    id: 'soldier_08', name: 'The Advantage of the Unseen Position',
    topic: 'soldier', hint: 'Doctrine of concealment and the devastating effect of surprise.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'ambush_tactics', abilityName: 'Ambush Tactics',
    abilityDescription: 'First-strike bonus when enemies approach the settlement.',
  },
  {
    id: 'soldier_09', name: 'Turning the Tide After the Line Breaks',
    topic: 'soldier', hint: 'Recovery techniques for rallying a broken formation mid-battle.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'rally_cry', abilityName: 'Rally Cry',
    abilityDescription: 'Recover morale mid-battle, preventing a rout.',
  },
  {
    id: 'soldier_10', name: 'A Blade Is Only as Sharp as Its Wielder\'s Focus',
    topic: 'soldier', hint: 'Advanced training regimen for mastering a single weapon type completely.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'weapon_specialization', abilityName: 'Weapon Specialization',
    abilityDescription: 'Individual soldier gets a significant combat bonus with chosen weapon.',
  },

  // --- Soldier duds (10) ---
  {
    id: 'soldier_dud_01', name: 'Marching Songs of the Northern Garrisons',
    topic: 'soldier', hint: 'Rousing songs with detailed lyrics. Good for morale, nothing tactical.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_02', name: 'A History of Rank Insignia and Their Meanings',
    topic: 'soldier', hint: 'Exhaustive catalog of military badges. Culturally rich, tactically void.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_03', name: 'The Diet of a Soldier in Extended Campaign',
    topic: 'soldier', hint: 'Nutritional requirements for soldiers. Interesting but not actionable.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_04', name: 'Customs of Surrender Across Three Cultures',
    topic: 'soldier', hint: 'Diplomatic protocols for yielding. Not relevant to mist creatures.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_05', name: 'On the Proper Care of Leather and Chain',
    topic: 'soldier', hint: 'Maintenance instructions for equipment you don\'t have.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_06', name: 'Famous Last Stands: An Anthology',
    topic: 'soldier', hint: 'Dramatic accounts of doomed defenders. Inspiring but not instructive.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_07', name: 'The Psychology of the Retreating Enemy',
    topic: 'soldier', hint: 'Analysis of enemy behavior during withdrawal. Mist creatures don\'t retreat.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_08', name: 'Drill Formations for Ceremonial Occasions',
    topic: 'soldier', hint: 'Parade ground maneuvers designed for display, not combat.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_09', name: 'A Soldier\'s Journal: Forty Days in the Fog',
    topic: 'soldier', hint: 'Personal diary entries. Moving but offers no tactical insights.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'soldier_dud_10', name: 'The Ethics of Violence in Defence of the Helpless',
    topic: 'soldier', hint: 'Moral philosophy on justified force. Thought-provoking but impractical.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },

  // ===========================
  //   SCHOLAR TITLES (20)
  // ===========================

  // --- Real abilities (10) ---
  {
    id: 'scholar_01', name: 'Techniques for Rapid Comprehension of Dense Material',
    topic: 'scholar', hint: 'Methods for processing written information at accelerated rates.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'speed_reading', abilityName: 'Speed Reading',
    abilityDescription: 'Study time reduced by 1 day for all future books.',
  },
  {
    id: 'scholar_02', name: 'The Art of Scanning: Finding Needles in Vast Collections',
    topic: 'scholar', hint: 'Systematic approaches to locating relevant texts in large libraries.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'deep_browse', abilityName: 'Deep Browse',
    abilityDescription: 'Find 7 titles per browse session instead of 5.',
  },
  {
    id: 'scholar_03', name: 'Judging a Book by More Than Its Cover',
    topic: 'scholar', hint: 'Techniques for assessing the value of a text before investing time.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'book_appraisal', abilityName: 'Book Appraisal',
    abilityDescription: 'Hints become more revealing, making it easier to spot duds.',
  },
  {
    id: 'scholar_04', name: 'Patterns Shared Across Unrelated Tongues',
    topic: 'scholar', hint: 'Linguistic analysis revealing common structures in different languages.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'language_aptitude', abilityName: 'Language Aptitude',
    abilityDescription: 'Learn languages faster, reducing study days required.',
  },
  {
    id: 'scholar_05', name: 'The Interconnected Nature of All Knowledge',
    topic: 'scholar', hint: 'How understanding one subject can unexpectedly illuminate another.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'cross_reference', abilityName: 'Cross-Reference',
    abilityDescription: 'When studying a book, small chance of revealing a related title for free.',
  },
  {
    id: 'scholar_06', name: 'Field Notes on Things That Move in the Mist',
    topic: 'scholar', hint: 'A naturalist\'s observations of mist creatures, written from hiding.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'creature_category', abilityName: 'New Category: Creatures',
    abilityDescription: 'Unlocks the creature research topic in the library.',
  },
  {
    id: 'scholar_07', name: 'Systems of Organisation in the Great Libraries',
    topic: 'scholar', hint: 'Cataloging methods that dramatically improve information retrieval.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'archive_system', abilityName: 'Archive System',
    abilityDescription: 'Revealed books show quality estimates, helping identify valuable texts.',
  },
  {
    id: 'scholar_08', name: 'On the Transfer of Understanding Between Minds',
    topic: 'scholar', hint: 'Pedagogy techniques for efficiently teaching complex subjects.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'lecture', abilityName: 'Lecture',
    abilityDescription: 'Teach a discovered ability to an additional character of the same role.',
  },
  {
    id: 'scholar_09', name: 'Bridging the Gap Between Reader and Text',
    topic: 'scholar', hint: 'Advanced translation methodology for partially understood languages.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'translation_aid', abilityName: 'Translation Aid',
    abilityDescription: 'Help another scholar bypass a language barrier on one book.',
  },
  {
    id: 'scholar_10', name: 'Behavioural Cataloguing of Unknown Species',
    topic: 'scholar', hint: 'Framework for classifying and predicting creature behaviour from limited data.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'creature_insight', abilityName: 'Creature Insight',
    abilityDescription: 'Studying creature books reveals tactical weaknesses of specific threats.',
  },

  // --- Scholar duds (10) ---
  {
    id: 'scholar_dud_01', name: 'A Personal Philosophy of Lifelong Learning',
    topic: 'scholar', hint: 'An elderly scholar\'s reflections on the joy of knowledge for its own sake.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_02', name: 'The Loneliness of the Dedicated Reader',
    topic: 'scholar', hint: 'Memoir about the social costs of intellectual pursuit. Poignant but useless.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_03', name: 'Ink Preservation Methods of the Southern Scribes',
    topic: 'scholar', hint: 'Detailed chemistry of ink-making. The ingredients aren\'t available here.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_04', name: 'How Knowledge Was Lost: A Cautionary Tale',
    topic: 'scholar', hint: 'Historical account of library destruction. Sobering but not helpful.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_05', name: 'The Debate Between Two Scholars of No Consequence',
    topic: 'scholar', hint: 'Transcript of an academic argument about a trivial distinction.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_06', name: 'On the Arrangement of Books by Colour and Size',
    topic: 'scholar', hint: 'An aesthetic approach to library organisation. Looks nice, wastes time.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_07', name: 'A Meditation on the Smell of Old Paper',
    topic: 'scholar', hint: 'Sensory appreciation of aged books. Deeply felt, entirely unhelpful.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_08', name: 'The Scholar Who Read Everything and Understood Nothing',
    topic: 'scholar', hint: 'Cautionary biography of a scholar who accumulated facts without wisdom.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_09', name: 'Marginalia: What Previous Readers Left Behind',
    topic: 'scholar', hint: 'Study of annotations in old books. Occasionally amusing, never useful.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'scholar_dud_10', name: 'An Argument for the Superiority of Oral Tradition',
    topic: 'scholar', hint: 'Ironic: a written text arguing that books are inferior to speech.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },

  // ===========================
  //   CREATURE TITLES (20)
  // ===========================

  // --- Real abilities (10) ---
  {
    id: 'creature_01', name: 'On the Stalking Patterns of Mist-Born Predators',
    topic: 'creatures', hint: 'Detailed observations of how mist stalkers hunt, with notes on their predictable approach routes.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'stalker_predict', abilityName: 'Stalker Prediction',
    abilityDescription: 'Mist Stalker raids give an extra day of early warning.',
  },
  {
    id: 'creature_02', name: 'Crystalline Formations and Their Living Hosts',
    topic: 'creatures', hint: 'Studies of the crystalline growths that animate lurkers, and where they fracture.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'crystal_weakness', abilityName: 'Crystal Weakness',
    abilityDescription: 'Soldiers deal bonus damage to Crystalline Lurkers by targeting growth joints.',
  },
  {
    id: 'creature_03', name: 'The Hollow Shade: Why It Fears the Light',
    topic: 'creatures', hint: 'Experiments with fire and luminescence on shadow-type creatures.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'shadow_repel', abilityName: 'Shadow Repel',
    abilityDescription: 'Torches and fire sources reduce Hollow Shade combat effectiveness.',
  },
  {
    id: 'creature_04', name: 'Spore Clouds and Their Dispersal Mechanics',
    topic: 'creatures', hint: 'Analysis of Spore Drifter toxin patterns and how wind direction affects exposure.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'spore_resist', abilityName: 'Spore Resistance',
    abilityDescription: 'Characters take less damage from Spore Drifter corrosive attacks.',
  },
  {
    id: 'creature_05', name: 'Frequencies That Silence the Wailing',
    topic: 'creatures', hint: 'Acoustic research on the Wailing Wisp and counter-frequencies that disrupt it.',
    language: 'common', discoverable: 'common', tier: 1,
    abilityId: 'wisp_counter', abilityName: 'Wisp Counter',
    abilityDescription: 'Priests can disrupt Wailing Wisp morale attacks with a counter-chant.',
  },
  {
    id: 'creature_06', name: 'Stone Sentinels: The Seams Between the Plates',
    topic: 'creatures', hint: 'Structural analysis of the Stone Sentinel\'s armour, identifying vulnerable joints.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'sentinel_bypass', abilityName: 'Sentinel Bypass',
    abilityDescription: 'Soldiers can target Stone Sentinel joints, bypassing their heavy armour.',
  },
  {
    id: 'creature_07', name: 'The Fog Crawler\'s Burrow: Entry and Collapse',
    topic: 'creatures', hint: 'Underground mapping of Fog Crawler tunnel networks and their structural weaknesses.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'crawler_trap', abilityName: 'Crawler Trap',
    abilityDescription: 'Engineers can build specialised traps that collapse Fog Crawler tunnels.',
  },
  {
    id: 'creature_08', name: 'Echo Wraiths and the Residue They Leave',
    topic: 'creatures', hint: 'Documentation of the strange residue Echo Wraiths deposit, and its alchemical properties.',
    language: 'ancient_script', discoverable: 'common', tier: 2,
    abilityId: 'wraith_harvest', abilityName: 'Wraith Harvest',
    abilityDescription: 'Defeated Echo Wraiths yield shadow essences that can be collected.',
  },
  {
    id: 'creature_09', name: 'The Four Natures: A Unified Theory of Mist Life',
    topic: 'creatures', hint: 'Comprehensive framework linking physical, crystalline, shadow, and corrosive creature types.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'nature_mastery', abilityName: 'Nature Mastery',
    abilityDescription: 'All combat bonuses against specific creature types are doubled.',
  },
  {
    id: 'creature_10', name: 'What Drives Them: The Source-Hunger Hypothesis',
    topic: 'creatures', hint: 'A radical theory that all mist creatures are drawn toward — and repelled by — the same force.',
    language: 'forgotten_tongue', discoverable: 'common', tier: 3,
    abilityId: 'lure_craft', abilityName: 'Lure Craft',
    abilityDescription: 'Engineers can build lures that draw creatures to traps instead of walls.',
  },

  // --- Creature duds (10) ---
  {
    id: 'creature_dud_01', name: 'A Bestiary of Imagined Mist Creatures',
    topic: 'creatures', hint: 'Lavishly illustrated compendium, but most entries appear to be fictional.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_02', name: 'Mist Creature Sounds: A Listener\'s Guide',
    topic: 'creatures', hint: 'Attempts to transcribe creature vocalisations. Evocative but not actionable.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_03', name: 'Do They Dream? Speculations on Mist Creature Consciousness',
    topic: 'creatures', hint: 'Philosophical meditation on whether mist creatures have inner lives. No tactical value.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_04', name: 'Tracks in the Mud: A Footprint Classification System',
    topic: 'creatures', hint: 'Meticulous catalog of creature tracks, but the mud around here is different.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_05', name: 'My Season Among the Drifters: A Personal Account',
    topic: 'creatures', hint: 'Memoir of someone who claims to have lived near Spore Drifters. Dubious credibility.',
    language: 'common', discoverable: 'common', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_06', name: 'Comparative Anatomy of Things That Should Not Be',
    topic: 'creatures', hint: 'Dissection notes that raise more questions than they answer. Incomplete.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_07', name: 'Feeding Habits of the Lesser Mist Fauna',
    topic: 'creatures', hint: 'Observations of small mist creatures\' diets. None of these species threaten the settlement.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_08', name: 'On the Alleged Migration Patterns of Echo Wraiths',
    topic: 'creatures', hint: 'Tracking data that proved inconclusive. The author admits defeat in the final chapter.',
    language: 'ancient_script', discoverable: 'ancient_script', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_09', name: 'The Creature That Was Not There: Phantom Sightings',
    topic: 'creatures', hint: 'Collection of unreliable reports about creatures that may not exist.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
  {
    id: 'creature_dud_10', name: 'A Taxonomy of Fear: How We Name What Hunts Us',
    topic: 'creatures', hint: 'Linguistic analysis of creature naming conventions. Scholarly but useless in practice.',
    language: 'forgotten_tongue', discoverable: 'forgotten_tongue', tier: 0, abilityId: null, abilityName: null, abilityDescription: null,
  },
];

export default LIBRARY_CATALOG;
