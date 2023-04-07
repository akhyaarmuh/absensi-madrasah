import { useSelector } from 'react-redux';

import Header from './header';
import Footer from './footer';
import Sidenav from './sidenav';

const Dashboard = ({ active, children }) => {
  const sidenav = useSelector((state) => state.theme.openSidenav);

  return (
    <section
      id="template-dashboard"
      className={`${
        sidenav ? 'laptop:grid-cols-[300px_1fr]' : 'laptop:grid-cols-[80px_1fr]'
      } grid min-h-screen grid-cols-[0_1fr] grid-rows-[60px_1fr_60px] transition-all duration-500`}
    >
      <Sidenav active={active} />
      <Header />

      <main className="overflow-x-hidden p-4">{children}</main>

      <Footer />
    </section>
  );
};

export default Dashboard;
