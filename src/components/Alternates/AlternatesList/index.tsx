import { Divider, Grid, IconButton, Stack } from "@mui/joy";
import AlternateItem from "../AlternateItem";
import { Cancel, Check, Edit } from "@mui/icons-material";
import { useState } from "react";

type AlternatesListProps = {
  alternates: string[];
  onConfirmDelete: (alternates: string[]) => void;
};

function AlternatesList({ alternates, onConfirmDelete }: AlternatesListProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [forDeletion, setForDeletion] = useState<string[]>([]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const markForDeletion = (alternate: string) => {
    setForDeletion([alternate, ...forDeletion]);
  };

  const handleConfirmDelete = () => {
    onConfirmDelete(forDeletion);
    setIsEditing(false);
  };

  return (
    <Stack sx={{ minWidth: 330 }} alignItems={"center"}>
      {alternates.map((alternate: string, index: number) => {
        const isLast = index === alternates.length - 1;
        return (
          <>
            <AlternateItem
              key={alternate}
              alternate={alternate}
              isEditing={isEditing}
              onMarkForDelete={markForDeletion}
              isDeleting={forDeletion.includes(alternate)}
            />
            {!isLast && <Divider sx={{ opacity: isEditing ? 1 : 0 }} />}
          </>
        );
      })}
      <Grid
        container
        sx={{ width: "100%", maxHeight: 36 }}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Grid>
          <IconButton
            disabled={!isEditing}
            color="primary"
            sx={{ borderRadius: 0 }}
            onClick={handleConfirmDelete}
          >
            {isEditing && <Check />}
          </IconButton>
        </Grid>
        <Grid>
          <IconButton onClick={toggleEdit} sx={{ borderRadius: 0 }}>
            {isEditing ? <Cancel /> : <Edit />}
          </IconButton>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default AlternatesList;
