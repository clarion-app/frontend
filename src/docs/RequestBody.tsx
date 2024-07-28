import { RequestBodyType } from "./APISpecDisplay";
import SchemaDisplay, { SchemaType } from "./SchemaDisplay";

function RequestBody({ requestBody }: { requestBody: RequestBodyType }) {
  return (
    <div className="box">
      {Object.entries(requestBody.content).map(([contentType, { schema }]) => {
        const s = schema as SchemaType;
        if (!s.properties) return null;
        return <SchemaDisplay key={contentType} type={contentType} schema={s} />;
      })}
    </div>
  );
}

export default RequestBody;
