import { fetchEndpoint } from "@/utils/fetch";
import { useUser } from "@clerk/clerk-react"

export function useCurrentUser() {
    const { user } = useUser();
    if (!user) throw new Error("Current user not found. Are you logged in?");
    // const { id } = user;
    const id = 6723647823;
    //TODO: once we populate the db with actual user data, change this to the user's id
    //currently it's just a placeholder
    return fetchEndpoint(`user-by-clerk?id=${id}`, "GET")
        .then((data) => {
            return data;
        })

}