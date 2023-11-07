import { Add, ArrowRight, InfoOutlined } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Input } from "@mui/joy";
import {
  URL_OR_HOST_REGEX,
  HTTPS_REGEX,
  HTTP_REGEX,
  PROTOCOL,
} from "./../../../constants";
import { FormEvent, useRef, useState } from "react";
import { createUrl } from "../../../utils";

type AlternatesFormProps = {
  alternates: string[];
  onAdd: (alternate: string) => void;
};

function AlternatesForm({ alternates, onAdd }: AlternatesFormProps) {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<Error | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  const getUrlFromText = (): string => {
    const isValidInput = URL_OR_HOST_REGEX.test(text);
    if (!isValidInput) {
      setError(new Error("Please input a valid web address."));
      throw error;
    }

    const url = createUrl(text);
    return url;
  };

  const addUrl = (): string => {
    if (alternates.length > 3) {
      throw new Error("Max of 3 alternates allowed.");
    }

    let url;
    try {
      url = getUrlFromText();
    } catch (error) {
      throw error;
    }

    onAdd(url);
    return url;
  };

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const url = addUrl();
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }

      console.error(err);
    }
  };

  const onJustAdd = () => {
    try {
      const url = addUrl();
      onAdd(url);
      setText("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }

      console.error(err);
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmitForm}>
      <FormControl>
        <Input
          sx={{ "--Input-decoratorChildHeight": "45px", marginBottom: 24 }}
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
              endDecorator={<ArrowRight />}
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Add and Go
            </Button>
          }
        />
        <Button
          variant="solid"
          color="neutral"
          startDecorator={<Add />}
          onClick={onJustAdd}
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
