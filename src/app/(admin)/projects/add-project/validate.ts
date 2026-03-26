export const validation = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!values.identifier?.trim()) {
    errors.identifier = "Identifier is required";
  }

  if (!values.image && !values.id) {
    errors.image = "Image is required";
  }

  return errors;
};
