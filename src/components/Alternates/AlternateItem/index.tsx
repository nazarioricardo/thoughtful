import { Link } from "@mui/joy";

type AlternateItemProps = {
  alternate: string;
};

function AlternateItem({ alternate }: AlternateItemProps) {
  return (
    <Link level="title-lg" underline="none">
      {alternate}
    </Link>
  );
}

export default AlternateItem;
