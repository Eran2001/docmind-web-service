import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle compact />
      </div>
      {children}
    </>
  );
}
