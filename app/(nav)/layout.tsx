import NavBar from "@/components/nav-bar";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <NavBar />
    </div>
  );
}
