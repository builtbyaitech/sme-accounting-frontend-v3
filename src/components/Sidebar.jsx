import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/coa">Chart of Accounts</Link></li>
        <li><Link to="/journal">Journal</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </nav>
  );
}
