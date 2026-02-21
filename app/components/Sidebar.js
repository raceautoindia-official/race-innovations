import Image from "next/image";
import Link from "next/link";
import {
  MdDashboard,
  MdArticle,
  MdAssessment,
  MdImage,
  MdAttachMoney,
  MdHome,
  MdSettings,
} from "react-icons/md";

const navLinks = [
  { href: "/dashboard", Icon: MdDashboard, text: "Dashboard" },
  { href: "/admin/blog", Icon: MdArticle, text: "Blog" },
  { href: "/admin/report", Icon: MdAssessment, text: "Reports" },
  { href: "/admin/gallery", Icon: MdImage, text: "Gallery" },
  { href: "/admin/funding", Icon: MdAttachMoney, text: "Funding" },
  { href: "/admin/posts/new", Icon: MdArticle, text: "Posts" },
   { href: "/homepage", Icon: MdHome, text: "HomePage" },
  { href: "/settings", Icon: MdSettings, text: "Settings" },
];

export default function Sidebar() {
  return (
    <div className="col-2 col-sm-4 col-md-3 col-xl-2">
      <div>
        <div className="d-flex align-items-center mt-n3">
          <Link href="/" className="text-decoration-none text-dark">
            <div className="d-flex align-items-center w-100">
              <Image
                src="/images/rrrr.png"
                alt="Logo"
                width={80}
                height={100}
                priority
                loading="eager"
                style={{ objectFit: "contain" }}
              />
              <p className="m-0 fw-bold fs-6">Race Innovations</p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-3">
          <Image
            src="/images/man.png"
            alt="Admin Profile"
            width={90}
            height={90}
            priority
            loading="eager"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <h5 className="fw-bold text-dark">User</h5>
          <h6 className="text-dark">Admin</h6>
        </div>

        <nav className="w-100 mt-4">
          <ul className="list-unstyled p-0 w-100">
            {navLinks.map(({ href, Icon, text }) => (
              <li key={href} className="d-flex align-items-center gap-2 p-2">
                <Icon size={20} className="text-dark" />
                <Link href={href} className="text-decoration-none text-dark fw-medium">
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
