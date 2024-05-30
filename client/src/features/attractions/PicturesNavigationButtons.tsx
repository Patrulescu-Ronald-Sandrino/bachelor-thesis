import SwiperButton from './SwiperButton.tsx';
import { useAttractionPicturesContext } from '../../app/context/AttractionPicturesContext.tsx';

export default function PicturesNavigationButtons() {
  const { hasPrevious, hasNext, previous, next } =
    useAttractionPicturesContext();

  return (
    <div className="centered">
      <SwiperButton
        text="Previous image"
        onClick={previous}
        disabled={!hasPrevious}
        icon="/icons/keys/up.svg"
        eventKey="ArrowUp"
      />

      <SwiperButton
        text="Next image image"
        onClick={next}
        disabled={!hasNext}
        icon="/icons/keys/down.svg"
        eventKey="ArrowDown"
      />
    </div>
  );
}
