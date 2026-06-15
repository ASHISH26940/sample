import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FEFAE0]">
      <div className="hidden md:flex w-1/2 items-center justify-center p-12 border-r border-[#283618]">
        <div className="w-full max-w-lg aspect-square border border-[#283618] flex items-center justify-center bg-[#FEFAE0]">
          <svg className="w-3/4 h-3/4" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="50" width="300" height="300" rx="8" stroke="#283618" strokeWidth="2" fill="#606C38" fillOpacity="0.1" />
            <circle cx="200" cy="180" r="60" stroke="#283618" strokeWidth="2" fill="#DDA15E" fillOpacity="0.3" />
            <path d="M120 280 Q200 220 280 280" stroke="#283618" strokeWidth="2" fill="none" />
            <rect x="140" y="130" width="120" height="8" rx="4" fill="#606C38" />
            <rect x="160" y="150" width="80" height="6" rx="3" fill="#BC6C25" />
            <circle cx="200" cy="180" r="20" fill="#DDA15E" fillOpacity="0.5" />
            <path d="M130 320 L160 290 L180 310 L220 270 L250 300 L270 280" stroke="#606C38" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="60" y="320" width="280" height="2" fill="#283618" />
            <circle cx="100" cy="340" r="4" fill="#BC6C25" />
            <circle cx="200" cy="340" r="4" fill="#606C38" />
            <circle cx="300" cy="340" r="4" fill="#DDA15E" />
          </svg>
        </div>
      </div>
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#FEFAE0]">
        <LoginForm />
      </div>
    </div>
  )
}
