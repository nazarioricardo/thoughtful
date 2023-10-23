import { Link } from "@mui/joy";
import { getHostName } from "../../../constants";

type AlternateItemProps = {
  alternate: string;
};

function AlternateItem({ alternate }: AlternateItemProps) {
  return (
    <Link href={alternate} level="title-lg">
      {getHostName(alternate)}
    </Link>
  );
}

export default AlternateItem;
