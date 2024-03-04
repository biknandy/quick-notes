import { Form, ActionPanel, Action, showToast, useNavigation, Icon, Toast, popToRoot } from "@raycast/api";
import { useAtom } from "jotai";
import { notesAtom, tagsAtom } from "../services/atoms";
import CreateTag from "./createTag";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors } from "../utils/utils";
import { debounce } from "lodash";

type NoteForm = {
  title: string;
  note: string;
  tags: string[];
};

const TIMEOUT = 1000;

const CreateEditNoteForm = ({
  title,
  note,
  tags,
  createdAt,
  draftMode = false,
}: {
  title?: string;
  note?: string;
  tags?: string[];
  createdAt?: Date;
  draftMode?: boolean;
}) => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [tagStore, setTagStore] = useAtom(tagsAtom);
  const dataRef = useRef<NoteForm>({
    title: title ?? "",
    note: note ?? "",
    tags: tags ?? [],
  });
  const [submittedForm, setSubmittedForm] = useState(false);
  const { pop } = useNavigation();

  useEffect(() => {
    return () => {
      if ((/^\s*$/.test(dataRef.current.note) && !createdAt) || submittedForm) {
        return;
      }
      // if editing or drafting, save note using existing createdAt to query
      // we know the note exists if we are editing or drafting
      if (createdAt) {
        const updatedNotes = notes.map((n) => {
          if (n.createdAt === createdAt) {
            return {
              ...n,
              title: dataRef.current.title,
              body: dataRef.current.note,
              tags: dataRef.current.tags,
              updatedAt: new Date(),
            };
          }
          return n;
        });
        setNotes(updatedNotes);
      } else {
        setNotes([
          ...notes,
          {
            title: dataRef.current.title,
            body: dataRef.current.note,
            tags: dataRef.current.tags,
            is_draft: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    };
  }, [createdAt, draftMode, submittedForm]);

  const handleSubmit = (values: NoteForm) => {
    if (createdAt || draftMode) {
      const updatedNotes = notes.map((n) => {
        if (n.createdAt === createdAt) {
          return {
            ...n,
            title: values.title,
            body: values.note,
            tags: values.tags,
            updatedAt: new Date(),
            is_draft: false,
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
          tags: values.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
          is_draft: false,
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
          <Action.SubmitForm title={createdAt && !draftMode ? "Edit Note" : "Create Note"} onSubmit={handleSubmit} />
          <Action.Push
            icon={Icon.Plus}
            target={<CreateTag />}
            title="Create Tag"
            shortcut={{ modifiers: ["cmd"], key: "t" }}
          />
        </ActionPanel>
      }
    >
      <Form.Description text={createdAt && !draftMode ? "Edit Note" : "Create New Note"} />
      <Form.TextField
        id="title"
        title="Title"
        placeholder="Note Title"
        defaultValue={title}
        onChange={(newTitle) => {
          dataRef.current = {
            ...dataRef.current,
            title: newTitle,
          };
        }}
      />
      <Form.TextArea
        id="note"
        title="Note"
        placeholder="Enter Markdown"
        enableMarkdown
        defaultValue={note}
        onChange={(newNote) => {
          dataRef.current = {
            ...dataRef.current,
            note: newNote,
          };
        }}
      />
      <Form.TagPicker
        id="tags"
        title="Tags"
        defaultValue={tags}
        onChange={(newTags) => {
          dataRef.current = {
            ...dataRef.current,
            tags: newTags,
          };
        }}
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
