import { Button, Grid, List, Stack } from "@mui/joy";
import SiteListItem from "../SiteListItem";
import { useState } from "react";
import { Edit } from "@mui/icons-material";

type SiteListProps = {
  sites: string[];
  storage: Storage;
};

function SiteList({ sites, storage }: SiteListProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="stretch">
      <List>
        {sites.map((site) => (
          <SiteListItem
            key={site}
            url={site}
            isBypassed={storage[site].bypass}
            alternates={storage[site].alternates}
            isEditing={isEditing}
          />
        ))}
      </List>

      <Button
        sx={{ alignSelf: "flex-end" }}
        variant="soft"
        onClick={toggleEditing}
        startDecorator={<Edit />}
      >
        Edit
      </Button>
    </Stack>
  );
}

export default SiteList;
