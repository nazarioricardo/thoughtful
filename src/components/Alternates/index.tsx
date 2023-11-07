import AlternatesForm from "./AlternatesForm";
import AlternatesList from "./AlternatesList";

type AlternatesProps = {
  alternates: string[];
  onAdd: (alternate: string) => void;
  onDelete: (alternates: string[]) => void;
};

function Alternates({ alternates, onAdd, onDelete }: AlternatesProps) {
  console.log("Alternates", alternates);
  return (
    <>
      {alternates.length > 0 && (
        <AlternatesList alternates={alternates} onConfirmDelete={onDelete} />
      )}
      <AlternatesForm alternates={alternates} onAdd={onAdd} />
    </>
  );
}

export default Alternates;
