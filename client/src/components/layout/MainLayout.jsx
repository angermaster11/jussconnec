import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>

          {/* Right Panel */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <RightPanel />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
