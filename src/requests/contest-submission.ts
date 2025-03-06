import tekdojoAxios from "./axios.config";

export const getResultSearchContestSubmisson = async (query: string) => {
    try {
        const res = await tekdojoAxios.get(`/contest-submissions?${query}`);
        return res.data.data;
    } catch (error) {
        Promise.reject(error);
    }
}