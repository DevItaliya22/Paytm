import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreditMoney from './components/CreditMoney';
import DebitMoney from './components/DebitMoney';
import MyTransactions from './components/MyTransactions';
import Requests from './components/Requests';
import Transactions from './components/Transactions';
import Users from './components/Users';
import Friends from './components/Friends';
import ChangePassword from './components/ChangePassword';
import SendRequest from './components/SendRequest';


function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/credit" element={<CreditMoney />} />
        <Route path="/debit" element={<DebitMoney />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/sendRequest" element={<SendRequest />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/mytransactions" element={<MyTransactions />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </Router>
  );
}

export default App;
