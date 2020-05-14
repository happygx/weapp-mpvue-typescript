import Api from "@/utils/request";

export const tree = (params = {}) => {
  return Api.tree(params);
};
