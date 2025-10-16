import * as v from "valibot";

export const validate =
  <TSchema extends v.GenericSchema>(schema: TSchema) =>
  (input: unknown) =>
    v.parse(schema, input);

export { v };
