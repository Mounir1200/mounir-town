// Screen-reader announcements through a polite live region.
export class Announcer {
  constructor(element) {
    this.element = element;
  }

  say(message) {
    this.element.textContent = '';
    // Clearing first makes repeated messages announced again.
    requestAnimationFrame(() => {
      this.element.textContent = message;
    });
  }
}
