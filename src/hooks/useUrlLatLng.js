import { useSearchParams } from "react-router-dom";

export const useUrlLatLng = () => {
  const [searchParams] = useSearchParams();
  const lng = searchParams.get("lng");
  const lat = searchParams.get("lat");

  return [lat, lng];
};
