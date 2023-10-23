import { Add, ArrowRight, InfoOutlined } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Input } from "@mui/joy";
import { useState } from "react";

function AlternatesForm() {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<Error | undefined>();
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {};
  return (
    <form onSubmit={onSubmitForm}>
      <FormControl>
        <Input
          sx={{ "--Input-decoratorChildHeight": "45px" }}
          value={text}
          onChange={(event) => {
            setError(undefined);
            setText(event.target.value);
          }}
          name="url"
          placeholder="Add a website here..."
          required
          variant="soft"
          endDecorator={
            <Button
              variant="solid"
              color="primary"
              type="submit"
              startDecorator={<ArrowRight />}
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Add and Go
            </Button>
          }
        />
        <Button
          variant="soft"
          color="primary"
          type="submit"
          startDecorator={<Add />}
        >
          Just Add
        </Button>
        <FormHelperText sx={{ minHeight: 32, margin: 0 }}>
          {error && (
            <>
              <InfoOutlined />
              {error.message}
            </>
          )}
        </FormHelperText>
      </FormControl>
    </form>
  );
}

export default AlternatesForm;
