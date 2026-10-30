import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoleCard from '../components/RoleCard';
import { roles as defaultRoles } from '../data/roles';
import { getJobRoles } from '../services/api';
import { getAuthUser } from '../utils/storage';

export default function Roles() {
  const navigate = useNavigate();
  const [dbRoles, setDbRoles] = useState([]);

  useEffect(() => {
    // Fetch backend job roles to synchronize IDs
    getJobRoles()
      .then((data) => setDbRoles(data || []))
      .catch((err) => console.warn('Could not fetch backend job roles:', err));
  }, []);

  const handleStart = (role) => {
    const user = getAuthUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Match backend role by title if available
    const matched = dbRoles.find(
      (r) => r.title.toLowerCase() === role.name.toLowerCase()
    );

    const roleData = {
      id: role.id,
      name: role.name,
      dbId: matched ? matched.id : 1, // Fallback to 1 if backend not synced yet
    };

    localStorage.setItem('ais_selected_role', role.id);
    localStorage.setItem('ais_selected_role_data', JSON.stringify(roleData));
    navigate('/interview');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Choose Your Interview Role
          </h1>
          <p className="mt-4 text-slate-400">
            Pick the role you want to practice for. Each interview is tailored to the skills that matter for that job.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {defaultRoles.map((role) => (
            <RoleCard key={role.id} role={role} onStart={() => handleStart(role)} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
