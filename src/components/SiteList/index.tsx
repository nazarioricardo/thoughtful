import { Button, Divider, Grid, List, Stack } from "@mui/joy";
import SiteListItem from "../SiteListItem";
import { useState } from "react";
import { Cancel, Check, Edit } from "@mui/icons-material";

type SiteListProps = {
  sites: string[];
  storage: Storage;
  onDelete: (sites: string[]) => void;
};

function SiteList({ sites, storage, onDelete }: SiteListProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<string[]>([]);

  const toggleEditing = () => {
    setToDelete([]);
    setIsEditing(!isEditing);
  };

  const markToDelete = (url: string) => {
    if (toDelete.includes(url)) {
      const filtered = toDelete.filter((s) => s !== url);
      setToDelete(filtered);
      return;
    }

    setToDelete([...toDelete, url]);
  };

  const onConfirmDeletion = () => {
    onDelete(toDelete);
    setIsEditing(false);
  };

  console.log(toDelete);

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="stretch">
      <List>
        {sites.map((site) => (
          <SiteListItem
            key={site}
            url={site}
            markToDelete={markToDelete}
            isBypassed={storage[site].bypass}
            alternates={storage[site].alternates}
            isEditing={isEditing}
            isDeleting={toDelete.includes(site)}
          />
        ))}
      </List>

      <Grid
        container
        flexDirection={"row"}
        justifyContent={"space-between"}
        sx={{ paddingTop: 2 }}
      >
        <Grid>
          {isEditing && (
            <Button
              color="danger"
              variant="soft"
              onClick={onConfirmDeletion}
              startDecorator={<Check />}
            >
              Confirm
            </Button>
          )}
        </Grid>
        <Grid>
          <Button
            variant="soft"
            onClick={toggleEditing}
            startDecorator={isEditing ? <Cancel /> : <Edit />}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default SiteList;
