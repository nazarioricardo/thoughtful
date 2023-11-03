import Browser from "webextension-polyfill";
import { ArrowRight } from "@mui/icons-material";
import { Button, FormControl, FormLabel, Textarea } from "@mui/joy";
import { FormEvent, useState } from "react";

type OverrideProps = {
  url: string;
  hostname: string;
};

function Override({ url, hostname }: OverrideProps) {
  const [text, setText] = useState<string>();

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await Browser.storage.sync.get([url]);
    const hostFilter = response[url];
    console.log("hostFilter", url, JSON.stringify(hostFilter), hostFilter.id);

    await Browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [hostFilter.id],
      addRules: [
        {
          id: hostFilter.id,
          priority: 1,
          action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
          condition: {
            urlFilter: url,
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
            ],
          },
        },
      ],
    });

    await Browser.storage.sync.set({
      [url]: {
        ...hostFilter,
        isBypassed: true,
      },
    });
  };

  return (
    <form onSubmit={onSubmitForm} style={{ width: 600 }}>
      <FormControl>
        <FormLabel>Why?</FormLabel>
        <Textarea
          minRows={1}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          name="reason"
          placeholder="Set your intention here..."
          variant="soft"
          required
        />
        <Button variant="solid" type="submit" endDecorator={<ArrowRight />}>
          Submit and Go To {hostname}
        </Button>
      </FormControl>
    </form>
  );
}

export default Override;
