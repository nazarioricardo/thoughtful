import { Stack } from "@mui/joy";
import AlternateItem from "../AlternateItem";

type AlternatesListProps = {
  alternates: string[];
};

function AlternatesList({ alternates }: AlternatesListProps) {
  return (
    <Stack>
      {alternates.map((alternate: string) => (
        <AlternateItem key={alternate} alternate={alternate} />
      ))}
    </Stack>
  );
}

export default AlternatesList;
