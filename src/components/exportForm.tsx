import { Form, ActionPanel, Action, Icon, Toast, popToRoot } from "@raycast/api";
import { colors, exportNotes } from "../utils/utils";
import fs from "fs";
import { useAtom } from "jotai";
import { notesAtom } from "../services/atoms";

const ExportForm = () => {
  const [notes, setNotes] = useAtom(notesAtom);
  // const { handleSubmit, itemProps, values } = useForm<NoteForm>({
  //   onSubmit(values) {
  //     dataRef.current.submittedForm = true;
  //     const foundNote = notes.find((n) => n.createdAt === createdAt);
  //     if (foundNote) {
  //       const updatedNotes = notes.map((n) =>
  //         n.createdAt === createdAt
  //           ? {
  //               title: values.title,
  //               body: values.note,
  //               tags: values.tags,
  //               createdAt: n.createdAt,
  //               updatedAt: new Date(),
  //               is_draft: false,
  //             }
  //           : n,
  //       );
  //       setNotes(updatedNotes);
  //     } else {
  //       setNotes([
  //         ...notes,
  //         {
  //           title: values.title,
  //           body: values.note,
  //           tags: values.tags,
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //           is_draft: false,
  //         },
  //       ]);
  //     }
  //     showToast({ title: "Note Saved" });
  //     pop();
  //   },
  //   initialValues: {
  //     note,
  //     title,
  //     tags,
  //   },
  //   validation: {
  //     title: (value) => {
  //       if (!value) {
  //         return "Title is required";
  //       } else if (value.length > 100) {
  //         return "Title < 100 chars";
  //       }
  //     },
  //   },
  // });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={"Export Notes"}
            icon={{
              source: Icon.Download,
              tintColor: colors.find((c) => c.name === "green")?.tintColor,
            }}
            onSubmit={async (values: { folders: string[] }) => {
              console.log(values.folders);
              const folder = values.folders[0];
              if (!fs.existsSync(folder) || !fs.lstatSync(folder).isDirectory()) {
                return false;
              }
              await exportNotes(folder, notes);
              popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="folders"
        title="Choose Export Folder"
        allowMultipleSelection={false}
        canChooseDirectories
        canChooseFiles={false}
        info="Choose a file to export all your notes"
      />
    </Form>
  );
};

export default ExportForm;
