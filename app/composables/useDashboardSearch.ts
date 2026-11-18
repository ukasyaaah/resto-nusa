export const useDashboardSearch = () => {
  const search = useState("dash-search", () => "");
  return { search };
};
