import { useGetLocalNodesQuery, LocalNodeType } from "./localNodesApi";

interface LocalNodesPropsType {
    chooseNode: Function;
}

export const LocalNodes = (props: LocalNodesPropsType) => {
    const { data: localNodes, isLoading } = useGetLocalNodesQuery(undefined, { pollingInterval: 5000 });
    if (isLoading) return <div>Loading...</div>;
    return (
        <div>
        <h3>Local Nodes</h3>
        {localNodes?.map((node: LocalNodeType) => (
            <div key={node.node_id}>
              <div>{node.name}</div>
              <div>
                <button onClick={() => props.chooseNode(node.node_id)}>Choose</button>
              </div>
            </div>
        ))}
        </div>
    );
};