import { Form, ActionPanel, Action, showToast, useNavigation } from "@raycast/api";
import { useAtom } from "jotai";
import { tagsAtom } from "../services/atoms";
import { colors, getRandomColor } from "../utils/utils";
import { useState } from "react";

type TagForm = {
  name: string;
  color: string;
};

const CreateTag = () => {
  const [tags, setTag] = useAtom(tagsAtom);
  const { pop } = useNavigation();
  const [color, setColor] = useState(getRandomColor().name);

  // Creates a new tag
  const handleSubmit = (values: TagForm) => {
    // if tag already exists, don't do anything
    if (tags.find((tag) => tag.name === values.name)) {
      showToast({ title: "Tag Exists" });
      pop();
      return;
    }
    setTag([...tags, { name: values.name, color }]);
    showToast({ title: "Tag Saved" });
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Tag" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="New Tag" />
      <Form.TextField id="name" title="Name" />
      <Form.Dropdown id="color" title="Color" value={color} onChange={setColor}>
        {Object.values(colors).map((color, i) => (
          <Form.Dropdown.Item
            key={i}
            value={color.name}
            title={color.name}
            icon={{ source: "dot.png", tintColor: color.tintColor }}
          />
        ))}
      </Form.Dropdown>
      <Form.Separator />
      <Form.Description text="Existing Tags" />
      <Form.Dropdown id="tags" info="For referencing existing tags only" defaultValue="Select Tag">
        {tags.map((t, i) => (
          <Form.Dropdown.Item
            key={i}
            value={t.name}
            title={t.name}
            icon={{ source: "dot.png", tintColor: colors.find((c) => c.name === t.color)?.tintColor }}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
};

export default CreateTag;
