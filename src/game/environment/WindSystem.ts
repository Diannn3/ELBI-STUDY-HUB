export class WindSystem {
  strength = 0.42;
  direction: -1 | 1 = 1;
  private target = 0.42;
  private nextChange = 0;

  update(now: number, delta: number, multiplier: number) {
    if (now >= this.nextChange) {
      const phase = Math.sin(now * 0.000071) * 0.5 + 0.5;
      this.target = 0.18 + phase * 0.62;
      this.direction = Math.sin(now * 0.000019) >= 0 ? 1 : -1;
      this.nextChange = now + 8_000 + Math.floor(phase * 9_000);
    }
    const step = Math.min(1, delta / 5_000);
    this.strength += (this.target - this.strength) * step * Math.max(0.05, multiplier);
  }
}
