import useKeyEvent from '../../app/hooks/useKeyEvent.tsx';

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
  eventKey?: string;
}

export default function SwiperButton({
  text,
  onClick,
  disabled,
  icon,
  eventKey,
}: Props) {
  useKeyEvent({ eventKey: eventKey, callback: onClick });

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="app-button"
      style={{ display: 'flex', alignItems: 'center', marginRight: '0.5em' }}
    >
      {icon && (
        <object
          data={icon}
          type="image/svg+xml"
          style={{ marginRight: '0.25em' }}
        />
      )}
      {text}
    </button>
  );
}