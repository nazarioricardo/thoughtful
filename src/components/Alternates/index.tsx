import { Typography } from "@mui/joy";
import AlternatesForm from "./AlternatesForm";
import AlternatesList from "./AlternatesList";

type AlternatesProps = {
  alternates: string[];
  onAdd: (alternate: string) => void;
};

function Alternates({ alternates, onAdd }: AlternatesProps) {
  return (
    <>
      <Typography level={"body-lg"}>Try going somewhere else...</Typography>
      <AlternatesForm />
      <AlternatesList alternates={alternates} />
    </>
  );
}

export default Alternates;
