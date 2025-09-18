import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Welcome from "./welcome/Welcome";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import Otp from "./auth/otp/Otp";
import ForgetPassword from "./auth/change/ChangePassword";
import Profile from "./profile/Profile";
import { useSocket } from "./global/useSocket";

function App() {
  const socket = useSocket();

  return (
    <Routes>
      <Route path="/" element={<Home socket={socket} />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/changepsw" element={<ForgetPassword />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;

// import * as Dialog from "@radix-ui/react-dialog";

// function OverlayExample() {
//   return (
//     <Dialog.Root>
//       {/* Trigger (button ya event se khulega) */}
//       <Dialog.Trigger className="p-2 bg-blue-600 text-white rounded">
//         Open Overlay
//       </Dialog.Trigger>

//       {/* Overlay */}
//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 bg-black/60" />
//         <Dialog.Content className="fixed inset-0 bg-white p-6">
//           <Dialog.Title className="text-xl font-bold">My Overlay</Dialog.Title>
//           <Dialog.Description>
//             Ye ek full screen overlay hai bina route change kiye 🚀
//           </Dialog.Description>

//           <div className="mt-4">
//             <Dialog.Close className="p-2 bg-red-600 text-white rounded">
//               Close
//             </Dialog.Close>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }
