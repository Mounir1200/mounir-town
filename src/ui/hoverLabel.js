const OFFSET_PX = 14;

// Small label following the mouse over something the player can go to.
export class HoverLabel {
  constructor(element) {
    this.element = element;
  }

  show(text, clientX, clientY) {
    this.element.textContent = text;
    this.element.style.transform = `translate(${Math.round(clientX + OFFSET_PX)}px, ${Math.round(clientY + OFFSET_PX)}px)`;
    this.element.hidden = false;
  }

  hide() {
    this.element.hidden = true;
  }
}
