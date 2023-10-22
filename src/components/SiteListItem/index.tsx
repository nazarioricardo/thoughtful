type SiteListItemProps = {
  url: string;
  isBypassed: boolean;
  alternates: string[];
};

function SiteListItem({ url, isBypassed, alternates }: SiteListItemProps) {
  return (
    <div>
      <span>{url}</span>
    </div>
  );
}

export default SiteListItem;
