// import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
// const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });

export default function AdminLayout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-10 col-sm-8 col-md-9 col-xl-10">
          {children}
        </div>
      </div>
    </div>
  );
}
