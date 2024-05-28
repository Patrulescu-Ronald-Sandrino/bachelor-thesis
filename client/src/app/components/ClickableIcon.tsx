import { useRef, useState } from 'react';

interface Props {
  icon: string;
  onClick: () => void;
}

export default function ClickableIcon({ icon, onClick }: Props) {
  const iconId = icon.split('/').pop()?.split('.')[0];
  const objectRef = useRef<HTMLObjectElement>(null);
  const [cursor, setCursor] = useState('default');

  function setFill(color: string, cursor = 'default') {
    setCursor(cursor);
    if (!iconId) return;
    objectRef.current
      ?.getSVGDocument()
      ?.getElementById(iconId)
      ?.setAttribute('fill', color);
  }

  return (
    <a
      title={iconId}
      style={{
        display: 'inline-block',
        position: 'relative',
        zIndex: 1,
        cursor: cursor,
      }}
      onMouseEnter={() => setFill('#a89d9d', 'pointer')}
      onMouseLeave={() => setFill('black')}
      onClick={onClick}
    >
      <span style={{ display: 'inline-block' }}>
        <object
          data={icon}
          type="image/svg+xml"
          ref={objectRef}
          style={{
            position: 'relative',
            zIndex: -1,
          }}
        />
      </span>
    </a>
  );
}