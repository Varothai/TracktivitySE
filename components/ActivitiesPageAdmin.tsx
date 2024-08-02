import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firestore/firebase';
import { formatDate } from '../utils/formatDate';
import { skillColors } from '../utils/skillColors';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface User {
  firstname_EN: string;
  lastname_EN: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  dates: Date[];
  skills: { name: string; level: number }[];
  imageUrls: string[];
}

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      const response = await axios.post('/api/signOut');
      console.log('Sign out response:', response.data);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    axios.get<User>('/api/whoAmI')
      .then((response) => {
        if (response.data) {
          setUserData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    const unsubscribe = onSnapshot(collection(db, 'AdminActivities'), (snapshot) => {
      const activitiesData: Activity[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data() as Omit<Activity, 'id'>
      }));
      setActivities(activitiesData);
    });

    return () => unsubscribe();
  }, []);

  const filteredActivities = filter === ''
    ? activities
    : activities.filter(activity => 
        activity.skills.some(skill => skill.name === filter)
      );

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="navbar bg-customColor1 text-primary-content p-4 fixed top-0 left-0 w-full z-50">
        <div className="flex-1">
          <Link
            href="/admin-page"
            className="btn btn-ghost text-xl text-white"
          >
            ADMIN DASHBOARD
          </Link>
        </div>
        <div className="flex-1">
          <li>
            <Link
              href="/activities-admin"
              className="btn btn-ghost text-xl text-white"
            >
              Activities Page
            </Link>
          </li>
        </div>
        <div className="flex-1">
          <li>
            <Link
              href="/post-activity"
              className="btn btn-ghost text-xl text-white"
            >
              Post Activities
            </Link>
          </li>
        </div>
        <div className="flex-0">
          <li>
            <Link
              href="/pending-activities"
              className="btn btn-ghost text-xl text-white"
            >
              Students&apos; Pending Activities
            </Link>
          </li>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Admin Avatar"
                  src="https://png.pngtree.com/element_pic/16/11/02/bd886d7ccc6f8dd8db17e841233c9656.jpg"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
              <li><button onClick={signOut} className="cursor-pointer">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex mt-20">
        {/* Sidebar on the left */}
        <div className="w-1/4 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Filter Activities</h2>
          <div className="space-y-4">
            {Object.keys(skillColors).map(skill => (
              <button 
                key={skill}
                onClick={() => setFilter(skill)} 
                className={`${skillColors[skill]} hover:bg-opacity-75 text-white font-semibold py-2 px-4 rounded-full w-full transition`}
              >
                {skill}
              </button>
            ))}
            <button 
              onClick={() => setFilter('')} 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full w-full transition"
            >
              Show All
            </button>
          </div>
        </div>

        {/* Activities list on the right */}
        <div className="w-3/4 pl-6">
          <h2 className="text-3xl font-bold text-white mb-6">Activities</h2>
          {filteredActivities.length === 0 ? (
            <p className="text-gray-300">No activities available.</p>
          ) : (
            <div className="space-y-6">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="bg-white bg-opacity-80 border border-gray-200 shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-start">
                  <div className="flex-1 md:mr-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{activity.name}</h3>
                    <p className="text-gray-700 mb-3">{activity.description}</p>
                    <div className="text-gray-600 mb-4">
                      <strong className="text-gray-800">Dates:</strong>
                      <ul className="list-disc list-inside">
                        {activity.dates && activity.dates.map((date, index) => (
                          <li key={index}>{formatDate(date.toString())}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <strong className="text-gray-800">Skills:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {activity.skills.map((skill, index) => (
                          <li key={index} className="mb-1 flex items-center">
                            <span className={`w-4 h-4 rounded-full ${skillColors[skill.name]} mr-2`}></span>
                            <span className="font-medium">{skill.name}</span> - Level: {skill.level}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center space-x-4 space-y-4">
                    {activity.imageUrls.map((url, index) => (
                      <div key={index} className="relative group w-64 h-64">
                        <img
                          src={url}
                          alt={`Activity Image ${index + 1}`}
                          className="w-full h-full object-cover border border-gray-300 rounded-lg shadow-sm transition-transform transform group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
