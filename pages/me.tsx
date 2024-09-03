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
  const [userData, setUserData] = useState<CmuOAuthBasicInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await useGetUserData(); // Call useGetUserData directly in useEffect
      if (data.ok) {
        setUserData(data);
      } else {
        router.push("/");
      }
    }
    fetchData();
  }, [router]);

  console.log(userData);

  function signOut() {
    // Call sign out API without caring about the result
    axios.post("/api/signOut").finally(() => {
      router.push("/");
    });
  }

  return (
    <div className="p-3">
      {userData?.role === "student" && (
        <div>
          <StudentPage />
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
