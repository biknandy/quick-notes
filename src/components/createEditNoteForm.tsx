import { Form, ActionPanel, Action, showToast, useNavigation, Icon } from "@raycast/api";
import { useAtom } from "jotai";
import { notesAtom, tagsAtom } from "../services/atoms";
import CreateTag from "./createTag";
import { useState } from "react";
import { colors } from "../utils/utils";

type NoteForm = {
  title: string;
  note: string;
  tags: string[];
};

const CreateEditNoteForm = ({
  title,
  note,
  tags,
  createdAt,
  editMode = false,
}: {
  editMode?: boolean;
  title?: string;
  note?: string;
  tags?: string[];
  createdAt?: Date;
}) => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [tagStore, setTagStore] = useAtom(tagsAtom);
  const [selectedTags, setSelectedTags] = useState<string[]>(tags ?? []);
  const { pop } = useNavigation();

  const handleSubmit = (values: NoteForm) => {
    if (editMode) {
      const updatedNotes = notes.map((n) => {
        if (n.createdAt === createdAt) {
          return {
            title: values.title,
            body: values.note,
            createdAt: n.createdAt,
            updatedAt: new Date(),
            tags: values.tags,
          };
        }
        return n;
      });
      setNotes(updatedNotes);
    } else {
      setNotes([
        ...notes,
        {
          title: values.title,
          body: values.note,
          createdAt: editMode && createdAt ? createdAt : new Date(),
          updatedAt: new Date(),
          tags: values.tags,
        },
      ]);
    }
    showToast({ title: "Note Saved" });
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={editMode ? "Edit Note" : "Create Note"} onSubmit={handleSubmit} />
          <Action.Push
            icon={Icon.Plus}
            target={<CreateTag />}
            title="Create Tag"
            shortcut={{ modifiers: ["cmd"], key: "t" }}
          />
        </ActionPanel>
      }
      enableDrafts
    >
      <Form.Description text={editMode ? "Edit Note" : "Create New Note"} />
      <Form.TextField id="title" title="Title" placeholder="Note Title" defaultValue={title} />
      <Form.TextArea id="note" title="Note" placeholder="Enter Markdown" enableMarkdown defaultValue={note} />
      <Form.TagPicker
        id="tags"
        title="Tags"
        value={selectedTags}
        onChange={setSelectedTags}
        info="⌘ + T to create new tag"
      >
        {tagStore.map((t) => (
          <Form.TagPicker.Item
            value={t.name}
            title={t.name}
            icon={{ source: Icon.CircleFilled, tintColor: colors.find((c) => c.name === t.color)?.tintColor }}
          />
        ))}
      </Form.TagPicker>
    </Form>
  );
};

export default CreateEditNoteForm;
