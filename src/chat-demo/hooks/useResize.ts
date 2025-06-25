import { useState, useCallback } from 'react';

interface UseResizeProps {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  direction?: 'left' | 'right';
}

export const useResize = ({
  initialWidth,
  minWidth,
  maxWidth,
  direction = 'left',
}: UseResizeProps) => {
  const [width, setWidth] = useState(initialWidth);

  const handleDrag = useCallback(
    (e: React.MouseEvent) => {
      const startX = e.clientX;
      const startWidth = width;
      let animationFrameId: number | null = null;
      document.body.style.userSelect = 'none';

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (animationFrameId) return;
        animationFrameId = requestAnimationFrame(() => {
          let newWidth: number;
          if (direction === 'left') {
            newWidth = startWidth + (moveEvent.clientX - startX);
          } else {
            newWidth = startWidth + (startX - moveEvent.clientX);
          }
          newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
          setWidth(newWidth);
          animationFrameId = null;
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [width, minWidth, maxWidth, direction],
  );

  return { width, handleDrag };
};
