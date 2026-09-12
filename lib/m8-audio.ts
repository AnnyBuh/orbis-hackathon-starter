// One sound file the experience plays: loaded up front so it starts without delay,
// always restarted from the very beginning, faded out rather than cut.
export class Track {
  private el: HTMLAudioElement | null = null;
  private fade: ReturnType<typeof setInterval> | null = null;

  constructor(
    private src: string,
    private volume: number,
    private loop = false,
  ) {}

  load() {
    if (!this.el && typeof window !== "undefined") {
      this.el = new Audio(this.src);
      this.el.loop = this.loop;
      this.el.preload = "auto";
      this.el.load();
    }
    return this.el;
  }

  playFromStart() {
    const el = this.load();
    if (!el) return Promise.resolve();
    this.clearFade();
    el.pause();
    el.currentTime = 0;
    el.volume = this.volume;
    return el.play();
  }

  // Carry on from where it was (used when music is switched back on).
  resume() {
    const el = this.load();
    if (!el) return Promise.resolve();
    this.clearFade();
    el.volume = this.volume;
    return el.play();
  }

  fadeOut(ms: number) {
    const el = this.el;
    if (!el || el.paused) return;
    this.clearFade();
    const from = el.volume;
    const steps = Math.max(1, Math.round(ms / 30));
    let step = 0;
    this.fade = setInterval(() => {
      step += 1;
      el.volume = Math.max(0, from * (1 - step / steps));
      if (step >= steps) {
        this.clearFade();
        el.pause();
      }
    }, ms / steps);
  }

  stop() {
    this.clearFade();
    this.el?.pause();
  }

  private clearFade() {
    if (this.fade) clearInterval(this.fade);
    this.fade = null;
  }
}
