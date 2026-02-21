"use client";
import Image from "next/image";
import React from "react";
import {
  FaClipboardList,
  FaBook,
  FaFlask,
  FaPen,
  FaDollarSign,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cardData = [
  {
    title: "284",
    content: "General Reports",
    icon: <FaClipboardList size={30} />,
  },
  { title: "284", content: "LBI Reports", icon: <FaBook size={30} /> },
  { title: "285", content: "Research Reports", icon: <FaFlask size={30} /> },
  { title: "285", content: "Blogs", icon: <FaPen size={30} /> },
  { title: "17", content: "Fundings", icon: <FaDollarSign size={30} /> },
];

// Sample data for Bar Chart
const data = [
  { day: "Monday", value: 10 },
  { day: "Tuesday", value: 15 },
  { day: "Wednesday", value: 12 },
  { day: "Thursday", value: 18 },
  { day: "Friday", value: 20 },
  { day: "Saturday", value: 25 },
  { day: "Sunday", value: 22 },
];

function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={contentStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <button style={viewSiteButtonStyle}>View Site</button>
        </div>
        <p>Welcome Back! Reena Evanjaline</p>
        <div className="container mx-auto p-4 mt-4" style={cardContainerStyle}>
          <div className="row g-4">
            <div className="col-md-2 d-flex">
              <div className="w-100 text-center">
                <h3 className="text-lg font-bold" style={{ color: "#6E59A4" }}>
                  Total Values
                </h3>
                <p className="text-gray-800" style={{ color: "#6E59A4" }}>
                  Magazine Inspirational Designs, Illustration, Graphic Elements
                </p>
              </div>
            </div>
            {cardData.map((card, index) => (
              <div key={index} className="col-md-2 d-flex">
                <div
                  className="p-4 rounded-lg shadow-lg w-100 text-center"
                  style={cardStyle}
                >
                  <div className="mb-2">{card.icon}</div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "#6E59A4" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-gray-800" style={{ color: "#6E59A4" }}>
                    {card.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4" style={chartContainerStyle}>
          <h2 className="text-xl font-semibold">Weekly Blogs & Reports</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#6E59A4" }} />
              <YAxis tick={{ fill: "#6E59A4" }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#6E59A4"
                barSize={50}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="">
          <h3 className="mt-5">Latest Blogs</h3>
          <div className="row">
            <div className="col-md-4 mt-4">
              <Image
                src="/images/12.png"
                alt="Globe showing world map"
                width={200}
                height={200}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
            <div className="col-md-4 mt-4">
              <Image
                src="/images/34.png"
                alt="Globe showing world map"
                width={200}
                height={200}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
            <div className="col-md-4 mt-4">
              <Image
                src="/images/56.png"
                alt="Globe showing world map"
                width={200}
                height={200}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardContainerStyle = {
  backgroundColor: "#ECEBF0",
  padding: "20px",
  borderRadius: "10px",
};
const cardStyle = {
  backgroundColor: "white",
  color: "#6E59A4",
  borderRadius: "10px",
  padding: "20px",
  border: "2px solid #6E59A4",
};
const contentStyle = {
  flex: "1",
  marginLeft: "270px",
  padding: "20px",
};
const viewSiteButtonStyle = {
  backgroundColor: "#f0b249",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  color: "black",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};
const chartContainerStyle = {
  backgroundColor: "#FFF",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
};

export default Dashboard;
