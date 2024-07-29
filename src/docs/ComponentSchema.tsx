interface ComponentType {
    properties: {
        [propertyName: string]: {
            type: string | string[];
            description: string;
        };
    };
    required: string[];
}

interface ComponentSchemaPropsType {
    component: ComponentType;
}

const ComponentSchema = ({ component }: ComponentSchemaPropsType) => {
  return (
    <div className="box has-background-black has-text-info has-text-centered mb-5">
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th className="has-text-primary">Property</th>
            <th className="has-text-primary">Type</th>
            <th className="has-text-primary">Required</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(component.properties).map(
            ([propertyName, propertyDetails]) => {
              return (
                <tr key={propertyName}>
                  <td>{propertyName}</td>
                  <td>
                    {typeof propertyDetails.type === "string" ? propertyDetails.type : 
                      <>
                        {propertyDetails.type.map((type, index) => (
                          <span key={index}>{type}{index < propertyDetails.type.length - 1 ? " | " : ""}</span>
                        ))}
                      </> }
                  </td>
                  <td>{component.required.includes(propertyName) ? "Yes": "No"}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentSchema;
