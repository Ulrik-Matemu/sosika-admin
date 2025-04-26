// src/pages/Users.tsx

import React, { useEffect, useState } from 'react';

type User = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  college_id: number;
  college_registration_number: string;
  created_at: string;
  geolocation: { x: number; y: number };
  custom_address: { x: number; y: number };
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch from your API endpoint
    fetch('https://sosika-backend.onrender.com/api/auth/users') // Replace this with your real endpoint
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">College Reg. Number</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.full_name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone_number}</td>
                  <td className="px-4 py-2">{user.college_registration_number}</td>
                  <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-4 text-center text-gray-500">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
