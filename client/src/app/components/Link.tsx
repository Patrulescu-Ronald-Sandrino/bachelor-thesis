interface Props {
  href: string;
  text: string;
}

export default function Link({ href, text }: Props) {
  return (
    <a href={href}>
      <button className={'app-button'}>{text}</button>
    </a>
  );
}
