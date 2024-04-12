export type News = {
  id: number;
  attributes: {
    title: string;
    backgroundImgUrl: string;
    content: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    location: string;
    locationName: string;
    type: string;
    metadata: any;
    user: any;
  };
};
