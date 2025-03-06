import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "@/requests/axios.config";
import { ContestEntry, ContestGroupStage } from "@/types/common-types";

export const getOneContestEntry = async (candidateNumber: string) => {
  const response = await tekdojoAxios.get(
    `${BASE_URL}/contest-entries?filters[candidateNumber][$eq]=${candidateNumber}`
  );
  return response.data.data[0] as ContestEntry;
};


export const getContestGroupStageByCandidateNumber = async (
  candidateNumber: string
) => {
  try {
    const response = await tekdojoAxios.get(
      `${BASE_URL}/contest-entries?filters[candidateNumber][$eq]=${candidateNumber}&populate[contest_group_stage][populate]=contestEntryFile`
    );
    return response.data.data[0].contest_group_stage as ContestGroupStage;
  } catch (error) {
    return;
  }
};

export const updateContestEntry = async (id: string, startTime: string, isContestStarted: boolean) => {
  const update = await tekdojoAxios.put(`${BASE_URL}/contest-entries/${id}`, {
    data: {
      startTime: startTime,
      isContestStarted: isContestStarted
    }
  })
  return update.data.data as ContestEntry;
}

export const updateEndTimeContestEntry = async (id: string, endTime: string) => {
  const update = await tekdojoAxios.put(`${BASE_URL}/contest-entries/${id}`, {
    data: {
      endTime: endTime,
    }
  })
  return update.data.data as ContestEntry;
}