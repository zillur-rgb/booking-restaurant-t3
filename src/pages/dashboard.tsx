import { api } from "~/utils/api";

const dashboard = () => {
  const { mutate } = api.admin.sensitiveInfo.useMutation();
  return (
    <>
      <h1>Hello from the dashboard</h1>
      <button type="button" onClick={() => mutate()}>
        See sensitive information
      </button>
    </>
  );
};
export default dashboard;
