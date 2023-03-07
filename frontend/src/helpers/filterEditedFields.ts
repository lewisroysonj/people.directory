type AllFormFields = Record<string, unknown>;

const filterEditedFields = (
  allFields: AllFormFields,
  editedFields: Record<string, boolean>,
  isNumeric?: boolean,
): AllFormFields => {
  let updatedFields: AllFormFields = {};
  Object.entries(editedFields).forEach(([key]) => {
    const matchedFieldValue = Object.entries(allFields).find(
      ([fieldKey]) => fieldKey === key,
    )?.[1];
    const formattedValue = isNumeric
      ? Number(matchedFieldValue)
      : matchedFieldValue;
    updatedFields = {
      ...updatedFields,
      [`${key}`]: formattedValue,
    };
  });
  return updatedFields;
};

export default filterEditedFields;
