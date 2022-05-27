interface ISesssionData {
  user: any;
  id: string;
  github: {
    token: string;
    user: {
      id: string;
    };
  };
  firebase: {
    token: string;
  };
}
