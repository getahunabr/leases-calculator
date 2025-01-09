import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

const fetchLeases = async () => {
  const { data } = await axiosInstance.get("/getLeases");
  return data;
};

export const useLeases = () => {
  return useQuery({ queryKey: ["leases"], queryFn: fetchLeases });
};
