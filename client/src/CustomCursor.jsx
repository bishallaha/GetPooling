import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const setScale = (s) => {
      cursor.style.transform = `translate(-50%, -50%) scale(${s})`;
    };

    const move = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onOver = (e) => {
      if (e.target.closest('button, a')) setScale(1.6);
    };
    const onOut = (e) => {
      if (e.target.closest('button, a')) setScale(1);
    };
    const onDown = () => setScale(2.2);
    const onUp = (e) => {
      setScale(e.target.closest('button, a') ? 1.6 : 1);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
