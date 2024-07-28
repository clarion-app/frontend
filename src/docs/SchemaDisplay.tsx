interface SchemaProperty {
  type: string;
  format?: string;
  description?: string;
  // Include additional fields as necessary based on your schema structure
}

export interface SchemaType {
  type: string;
  properties: {
    [propertyName: string]: SchemaProperty;
  };
  required?: string[];
  // Additional schema attributes can be added here if needed
}

interface SchemaDisplayProps {
  schema: SchemaType;
  type: string;
}

function SchemaDisplay({ schema, type }: SchemaDisplayProps) {
  const properties = schema.properties || {};
  const requiredProperties = new Set(schema.required || []);

  return (
    <div className="box">
      <h4 className="is-size-6 has-text-weight-semibold">
        Content-Type: {type}
      </h4>
      <h4 className="is-size-5 has-text-weight-semibold">Schema Details</h4>
      <table className="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(properties).map(([propertyName, propertyDetails]) => (
            <tr key={propertyName}>
              <td>{propertyName}</td>
              <td>{propertyDetails.type}</td>
              <td>{requiredProperties.has(propertyName) ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchemaDisplay;
