import { Grid, IconButton, Link, Sheet } from "@mui/joy";
import { getHostName } from "../../../constants";
import { Delete } from "@mui/icons-material";

type AlternateItemProps = {
  alternate: string;
  isEditing: boolean;
  onMarkForDelete: (alternate: string) => void;
  isDeleting: boolean;
};

function AlternateItem({
  alternate,
  isEditing,
  onMarkForDelete,
  isDeleting,
}: AlternateItemProps) {
  const handleMarkForDelete = () => {
    onMarkForDelete(alternate);
  };

  return (
    <Sheet
      sx={{
        width: "100%",
        height: 36,
      }}
      variant={isDeleting ? "soft" : "plain"}
    >
      <Grid
        container
        sx={{
          width: "100%",
          height: 36,
        }}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        position={"relative"}
      >
        <Grid>
          <Link href={alternate} level="title-lg" disabled={isEditing}>
            {getHostName(alternate)}
          </Link>
        </Grid>
        {isEditing && (
          <Grid position={"absolute"} right={0}>
            <IconButton sx={{ borderRadius: 0 }} onClick={handleMarkForDelete}>
              <Delete />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Sheet>
  );
}

export default AlternateItem;
