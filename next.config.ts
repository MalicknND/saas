import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/add", destination: "/today", permanent: false },
      { source: "/add-order", destination: "/orders", permanent: false },
      { source: "/add-expense", destination: "/expenses", permanent: false },
      { source: "/customers", destination: "/debts", permanent: false },
      { source: "/orders/new", destination: "/orders", permanent: false },
    ];
  },
};

export default nextConfig;
