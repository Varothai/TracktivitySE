//@ts-nocheck
import axios from "axios";
import { useRouter } from "next/router";
import { useGetUserData } from "@/hooks/useGetUserData";
import { useEffect, useState } from "react";
import { CmuOAuthBasicInfo } from "@/types/CmuOAuthBasicInfo";
import AdminPage from "@/components/AdminPage";
import StudentPage from "@/components/StudentPage";

export default function MePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<CmuOAuthBasicInfo>(undefined);

  useEffect(() => {
    async function fetchData() {
      const data = await useGetUserData();
      if (data.ok) {
        setUserData(data);
      } else router.push("/");
    }
    fetchData();
  }, []);

  console.log(userData);
  function signOut() {
    //Call sign out api without caring what is the result
    //It will fail only in case of client cannot connect to server
    //This is left as an exercise for you. Good luck.
    axios.post("/api/signOut").finally(() => {
      router.push("/");
    });
  }

  return (
    <div className="p-3">
      {userData?.role === "student" && (
        <div>
          <AdminPage />
        </div>
      )}
      {userData?.itaccounttype_EN === "MIS Employee" && (
        <div>
          <AdminPage />
        </div>
      )}
    </div>
  );
}
