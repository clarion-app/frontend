import { useGetUsersQuery } from "./userApi";
import { UserType } from "../types";

export const Users = () => {
    const { data, error, isLoading } = useGetUsersQuery(null);
    console.log(error);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;
    return (
        <div>
            {data?.map((user: UserType) => (
                <div key={user.id}>{user.name}</div>
            ))}
        </div>
    );
};