import React, { useState, ChangeEvent, FormEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firestore/firebase';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SKILLS_OPTIONS = [
  'Teamwork',
  'Adaptability to Technological Changes',
  'Interdisciplinary Collaboration',
  'Effective Communication',
  'Entrepreneurial Mindset',
  'Innovation Mindset'
];

const LEVEL_OPTIONS = [1, 2, 3, 4, 5];

interface Activity {
  name: string;
  description: string;
  dates: string[];
  skills: { name: string; level: number }[];
  imageUrls: string[];
}

const PostActivityPage: React.FC = () => {
  const [activity, setActivity] = useState<Activity>({
    name: '',
    description: '',
    dates: [''],
    skills: [],
    imageUrls: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setActivity({ ...activity, [e.target.name]: e.target.value });
  };

  const handleDateChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newDates = [...activity.dates];
    newDates[index] = e.target.value;
    setActivity({ ...activity, dates: newDates });
  };

  const addDate = () => {
    setActivity({ ...activity, dates: [...activity.dates, ''] });
  };

  const removeDate = (index: number) => {
    const newDates = activity.dates.filter((_, i) => i !== index);
    setActivity({ ...activity, dates: newDates });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);

      const newImageUrls = await uploadFiles(selectedFiles);
      setActivity((prevActivity) => ({
        ...prevActivity,
        imageUrls: [...prevActivity.imageUrls, ...newImageUrls],
      }));
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    for (const file of files) {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    }
    return imageUrls;
  };

  const handleSkillChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedSkills = [...activity.skills];
    updatedSkills[index] = { ...updatedSkills[index], [name]: name === 'level' ? Number(value) : value };
    setActivity({ ...activity, skills: updatedSkills });
  };

  const addSkill = () => {
    setActivity({ ...activity, skills: [...activity.skills, { name: '', level: 1 }] });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = activity.skills.filter((_, i) => i !== index);
    setActivity({ ...activity, skills: updatedSkills });
  };

  const removeImage = async (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImageUrls = activity.imageUrls.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);

    const fileToRemove = files[index];
    const storageRef = ref(storage, `images/${fileToRemove.name}`);
    await deleteObject(storageRef);

    setFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    setActivity({ ...activity, imageUrls: updatedImageUrls });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'AdminActivities'), activity);
      alert('Activity posted successfully!');

      imagePreviews.forEach(url => URL.revokeObjectURL(url));

      setActivity({
        name: '',
        description: '',
        dates: [''],
        skills: [],
        imageUrls: [],
      });
      setFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error('Error posting activity: ', error);
      alert('Failed to post activity. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-opacity-70">
      <div style={{ backgroundImage: 'url(/TracktivityBG.png)', backgroundSize: 'auto' }}>
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


        <h2 className="text-2xl text-red-800 font-bold mb-10 mt-20">Post New Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <div className="p-6 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
              <h3 className="text-lg text-red-800 font-bold mb-2">Activity Name</h3>
                <input
                  type="text"
                  name="name"
                  value={activity.name}
                  onChange={handleChange}
                  placeholder="Activity Name"
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
              </div>
              <div className="p-6 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
              <h4 className="text-lg text-red-800 font-bold mb-2">Activity Description</h4>
                <textarea
                  name="description"
                  value={activity.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="border border-gray-300 px-4 py-2 rounded w-full h-32"
                />
              </div>
              <div className="p-6 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
                <h3 className="text-lg text-red-800 font-bold mb-2">Date</h3>
                {activity.dates.map((date, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(index, e)}
                      className="border border-gray-300 px-4 py-2 rounded w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeDate(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDate}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Date
                </button>
              </div>
            </div>

            <div className="w-1/2 pl-2">
              <div className="p-6 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
                <h3 className="text-lg text-red-800 font-bold mb-2">Skills</h3>
                {activity.skills.map((skill, index) => (
                  <div key={index} className="mb-4">
                    <select
                      name="name"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(index, e)}
                      className="border border-gray-300 px-4 py-2 rounded w-full mb-2"
                    >
                      <option value="">Select Skill</option>
                      {SKILLS_OPTIONS.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <select
                      name="level"
                      value={skill.level}
                      onChange={(e) => handleSkillChange(index, e)}
                      className="border border-gray-300 px-4 py-2 rounded w-full"
                    >
                      <option value="">Select Level</option>
                      {LEVEL_OPTIONS.map((level, i) => (
                        <option key={i} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-red-500 hover:text-red-700 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Skill
                </button>
              </div>

              <div className="p-6 border border-gray-300 rounded-lg mb-6 bg-white shadow-md">
                <h3 className="text-lg text-red-800 font-bold mb-2">Upload Activity Image</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
                />
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative mb-2">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-32 w-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Post Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostActivityPage;
