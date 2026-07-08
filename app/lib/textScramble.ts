const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·◆';

/**
 * Brief character scramble before settling on final text.
 * Returns a cancel function.
 */
export function scrambleText(
  element: HTMLElement,
  finalText: string,
  duration = 420
): () => void {
  let frame = 0;
  let cancelled = false;

  const start = performance.now();

  const tick = (now: number) => {
    if (cancelled) return;

    const progress = Math.min((now - start) / duration, 1);
    const revealed = Math.floor(progress * finalText.length);
    let output = '';

    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ') {
        output += ' ';
        continue;
      }
      if (i < revealed) output += finalText[i];
      else output += CHARSET[Math.floor(Math.random() * CHARSET.length)];
    }

    element.textContent = output;

    if (progress < 1) frame = requestAnimationFrame(tick);
    else element.textContent = finalText;
  };

  frame = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    element.textContent = finalText;
  };
}
