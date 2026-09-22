export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-paper px-4 py-16">
      {children}
    </div>
  );
}
