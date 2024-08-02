import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

function AdminPage() {
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

  return (
    <div className="flex flex-col h-screen">
    {/* Navbar */}
    <div className="navbar bg-customColor1 text-primary-content p-4 fixed top-0 left-0 w-full z-50">
      <div className="flex-1">
            <a className="text-xl text-white">ADMIN DASHBOARD</a>
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
      </div>
  );
}

export default AdminPage;
