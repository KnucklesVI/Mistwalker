/**
 * Notification Handler
 * Routes engine notifications to UI components
 *
 * The core engine's EventModule writes classified feed entries to state.events.feed.
 * This handler reads those entries and routes them to the UI feed and overlay.
 */

export class NotificationHandler {
  constructor(feed, overlay, renderer) {
    this.feed = feed;
    this.overlay = overlay;
    this.renderer = renderer;
    this.lastFeedIndex = 1; // Skip the initial "Settlement established" entry
  }

  /**
   * Process new state after day advancement
   * Reads feed entries from state and routes to UI components
   */
  handle(state, notifications) {
    // Route new feed entries from state.events.feed
    const feed = state.events?.feed || [];

    for (let i = this.lastFeedIndex; i < feed.length; i++) {
      const entry = feed[i];
      this.feed.addEntry(entry.day, entry.text, entry.classification || 'routine', entry.category || 'general');
    }
    this.lastFeedIndex = feed.length;

    // Check notifications for overlay-worthy events
    if (!notifications) return;

    const overlayLines = [];

    for (const notif of notifications) {
      if (notif.type === 'COMBAT_RESULT') {
        overlayLines.push({ text: `Combat: ${notif.message}`, style: notif.outcome === 'defeat' || notif.outcome === 'catastrophic' ? 'danger' : 'success' });
      }
      if (notif.type === 'RAID_GENERATED' && !notif.unannounced) {
        overlayLines.push({ text: notif.message, style: 'warning' });
      }
      if (notif.type === 'CHARACTER_LOST') {
        overlayLines.push({ text: `${notif.characterName} has been lost to the mist`, style: 'mythic' });
      }
      if (notif.type === 'STARVATION') {
        overlayLines.push({ text: 'Food supplies depleted!', style: 'danger' });
      }
      if (notif.type === 'TRAINING_COMPLETE') {
        overlayLines.push({ text: `${notif.characterName} completed training as ${notif.newRole}`, style: 'success' });
      }
    }

    // Overlays disabled — too distracting. Events show in feed only.
    // if (overlayLines.length > 0) {
    //   this.overlay.showEvent(overlayLines);
    // }
  }

  /**
   * Reset feed tracking (for new game)
   */
  reset() {
    this.lastFeedIndex = 0;
  }
}

export default NotificationHandler;
