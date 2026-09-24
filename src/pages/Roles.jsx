import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoleCard from '../components/RoleCard';
import { roles } from '../data/roles';

export default function Roles() {
  const navigate = useNavigate();

  const handleStart = (role) => {
    localStorage.setItem('ais_selected_role', role.id);
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
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} onStart={() => handleStart(role)} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
