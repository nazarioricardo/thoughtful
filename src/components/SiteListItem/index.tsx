import Chrome from "webextension-polyfill";
import { Delete, Http, OpenInNew } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";

type SiteListItemProps = {
  url: string;
  markToDelete: (url: string) => void;
  isBypassed: boolean;
  alternates: string[];
  isEditing: boolean;
  isDeleting: boolean;
};

function SiteListItem({
  url,
  markToDelete,
  isBypassed,
  isEditing,
  isDeleting,
}: SiteListItemProps) {
  const onClick = () => {
    if (isEditing) {
      markToDelete(url);
      return;
    }

    Chrome.tabs.update({
      url,
    });
  };

  const shouldGray = isDeleting || isBypassed;
  return (
    <ListItem variant={shouldGray ? "soft" : "plain"}>
      <ListItemButton onClick={onClick}>
        <ListItemDecorator>
          <Http />
        </ListItemDecorator>
        <ListItemContent>{url}</ListItemContent>
        {isEditing ? <Delete /> : <OpenInNew />}
      </ListItemButton>
    </ListItem>
  );
}

export default SiteListItem;
