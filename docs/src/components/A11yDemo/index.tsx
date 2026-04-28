import React, { useEffect, useRef } from 'react';

const KEYFRAMES = buildKeyframes();

function buildKeyframes() {
  const broken = [
    `<template>`,
    `  <nav role="navigation">`,
    `    <a href="/skip" aria-hidden="true">Skip to content</a>`,
    `    <button role="button" type="button">`,
    `      Menu`,
    `    </button>`,
    `  </nav>`,
    `</template>`,
  ].join('\n');

  const fixed1 = broken.replace(` role="button"`, '');

  const fixed2 = fixed1.replace(` aria-hidden="true"`, '');

  const fixed3 = fixed2.replace(` role="navigation"`, '');

  function t(str: string, search: string) {
    const from = str.indexOf(search);
    return { kind: 'TEXT' as const, data: { class: 'error', tagName: 'mark' }, from, to: from + search.length };
  }

  function g(line: number, text: string) {
    return { kind: 'GUTTER' as const, data: { tagName: 'mark' }, line, text };
  }

  return [
    { code: broken, decorations: [t(broken, 'role="button"'), t(broken, 'aria-hidden="true"'), t(broken, 'role="navigation"')] },
    { code: broken, decorations: [t(broken, 'role="button"'), g(4, '⚠️')] },
    { code: fixed1,  decorations: [g(4, '✅')] },
    { code: fixed1,  decorations: [t(fixed1, 'aria-hidden="true"'), g(3, '⚠️')] },
    { code: fixed2,  decorations: [g(3, '✅'), g(4, '✅')] },
    { code: fixed2,  decorations: [t(fixed2, 'role="navigation"'), g(2, '⚠️')] },
    { code: fixed3,  decorations: [g(2, '✅'), g(3, '✅'), g(4, '✅')] },
  ];
}

export default function A11yDemo(): React.JSX.Element {
  const mountRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (cleanupRef.current) return; // already mounted

    let alive = true;

    (async () => {
      const [{ animateHTML, monokaiLight, monokaiDark }, { default: htmlLang }, { CodeMovieRuntime }] =
        await Promise.all([
          import('@codemovie/code-movie'),
          import('@codemovie/code-movie/languages/html'),
          import('@codemovie/code-movie-runtime'),
        ]);

      if (!alive || !mountRef.current) return;

      const html = animateHTML(KEYFRAMES, {
        tabSize: 2,
        language: htmlLang(),
        theme: [
          { theme: monokaiLight, condition: '@media (prefers-color-scheme: light)' },
          { theme: monokaiDark,  condition: '@media (prefers-color-scheme: dark)' },
          { theme: monokaiLight, condition: "[data-theme='light']" },
          { theme: monokaiDark,  condition: "[data-theme='dark']" },
        ],
        minCols: 48,
      });

      // animateHTML returns "<style>…</style><div class="cm-animation">…</div>"
      // The <style> must live in <head>; the <div> goes into the runtime.
      const tmp = document.createElement('div');
      tmp.innerHTML = html;

      const styleEl = tmp.querySelector('style');
      if (styleEl) {
        styleEl.setAttribute('data-a11y-demo', '');
        document.head.querySelector('style[data-a11y-demo]')?.remove();
        document.head.appendChild(styleEl);
      }

      const animEl = tmp.querySelector('.cm-animation') as HTMLElement | null;
      if (!animEl || !alive) return;

      const runtime = CodeMovieRuntime.with(KEYFRAMES.length);
      runtime.setAttribute('controls', '');
      runtime.setAttribute('autoplay', '');
      runtime.appendChild(animEl);

      mountRef.current.appendChild(runtime);

      const INTERVAL = 2500;
      const PAUSE_ON_LAST = 4000;
      let timer: ReturnType<typeof setTimeout>;

      function advance() {
        if (runtime.current >= runtime.maxFrame) {
          // Pause longer on the final "all fixed" frame, then loop
          timer = setTimeout(() => { runtime.go(0); schedule(); }, PAUSE_ON_LAST);
        } else {
          runtime.next();
          schedule();
        }
      }

      function schedule() {
        timer = setTimeout(advance, INTERVAL);
      }

      schedule();

      cleanupRef.current = () => {
        clearTimeout(timer);
        runtime.remove();
        document.head.querySelector('style[data-a11y-demo]')?.remove();
        cleanupRef.current = null;
      };
    })();

    return () => {
      alive = false;
      cleanupRef.current?.();
    };
  }, []);

  return <div ref={mountRef} />;
}
