import { Form, ActionPanel, Action, showToast, useNavigation } from "@raycast/api";
import { useAtom } from "jotai";
import { tagsAtom } from "../services/atoms";
import { colors } from "../utils/utils";

const DeleteTags = () => {
  const [tags, setTags] = useAtom(tagsAtom);
  const { pop } = useNavigation();

  const handleSubmit = (values: string[]) => {
    setTags(tags.filter((tag) => values.includes(tag.name)));
    showToast({ title: "Tags Updated" });
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Update Tags" onSubmit={(tagValues) => handleSubmit(tagValues.tags)} />
        </ActionPanel>
      }
    >
      <Form.Description text="Unselect any tags to delete" />
      <Form.TagPicker id="tags" defaultValue={tags.map((t) => t.name)}>
        {tags.map((t, i) => (
          <Form.TagPicker.Item
            key={i}
            value={t.name}
            title={t.name}
            icon={{ source: "dot.png", tintColor: colors.find((c) => c.name === t.color)?.tintColor }}
          />
        ))}
      </Form.TagPicker>
    </Form>
  );
};

export default DeleteTags;
