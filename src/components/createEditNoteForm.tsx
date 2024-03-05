import { Form, ActionPanel, Action, showToast, useNavigation, Icon, Toast, popToRoot } from "@raycast/api";
import { useAtom } from "jotai";
import { notesAtom, tagsAtom } from "../services/atoms";
import CreateTag from "./createTag";
import { useEffect, useRef } from "react";
import { colors } from "../utils/utils";
import { useForm } from "@raycast/utils";

type NoteForm = {
  title: string;
  note: string;
  tags: string[];
};

const CreateEditNoteForm = ({
  createdAt,
  title,
  note,
  tags,
  isDraft = false,
}: {
  createdAt?: Date;
  title?: string;
  note?: string;
  tags?: string[];
  isDraft?: boolean;
}) => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [tagStore, setTagStore] = useAtom(tagsAtom);
  const dataRef = useRef<NoteForm & { submittedForm: boolean }>({
    title: title ?? "",
    note: note ?? "",
    tags: tags ?? [],
    submittedForm: false,
  });
  const { pop } = useNavigation();

  const { handleSubmit, itemProps, values } = useForm<NoteForm>({
    onSubmit(values) {
      dataRef.current.submittedForm = true;
      const foundNote = notes.find((n) => n.createdAt === createdAt);
      if (foundNote) {
        const updatedNotes = notes.map((n) =>
          n.createdAt === createdAt
            ? {
                title: values.title,
                body: values.note,
                tags: values.tags,
                createdAt: n.createdAt,
                updatedAt: new Date(),
                is_draft: false,
              }
            : n,
        );
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
    },
    initialValues: {
      note,
      title,
      tags,
    },
  });

  // Keeps the dataRef.current in sync with the form values
  useEffect(() => {
    dataRef.current = {
      ...dataRef.current,
      title: values.title,
      note: values.note,
      tags: values.tags,
    };
  }, [values]);

  // This useEffect is a hack to autosave on unmount when the form is not explicitly submitted by the user
  useEffect(() => {
    const autoSave = () => {
      if ((dataRef.current.note || dataRef.current.title) && !dataRef.current.submittedForm) {
        const noteExists = notes.find((n) => n.createdAt === createdAt);
        if (noteExists) {
          const updatedNotes = notes.map((n) => {
            if (n.createdAt === createdAt) {
              return {
                ...n,
                title: dataRef.current.title ?? "",
                body: dataRef.current.note ?? "",
                tags: dataRef.current.tags ?? [],
                updatedAt: new Date(),
              };
            }
            return n;
          });
          setNotes(updatedNotes);
        } else if (!noteExists) {
          setNotes([
            ...notes,
            {
              title: dataRef.current.title ?? "",
              body: dataRef.current.note ?? "",
              tags: dataRef.current.tags ?? [],
              is_draft: isDraft,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
        }
      }
    };

    return autoSave;
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={"Save Note"}
            icon={{
              source: Icon.SaveDocument,
              tintColor: colors.find((c) => c.name === "green")?.tintColor,
            }}
            onSubmit={handleSubmit}
          />
          <Action.Push
            icon={{
              source: Icon.Bookmark,
              tintColor: colors.find((c) => c.name === "amber")?.tintColor,
            }}
            target={<CreateTag />}
            title="Create Tag"
            shortcut={{ modifiers: ["cmd"], key: "t" }}
          />
        </ActionPanel>
      }
    >
      <Form.Description text={createdAt && !isDraft ? "Edit Note" : "Create New Note"} />
      <Form.TextField title="Title" placeholder="Note Title" {...itemProps.title} />
      <Form.TextArea title="Note" placeholder="Enter Markdown" enableMarkdown {...itemProps.note} />
      <Form.TagPicker title="Tags" info="⌘ + T to create new tag" {...itemProps.tags}>
        {tagStore.map((t, i) => (
          <Form.TagPicker.Item
            key={i}
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
