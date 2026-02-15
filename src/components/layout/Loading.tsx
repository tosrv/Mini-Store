import { Spinner } from "../ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50 space-x-5">
        <Spinner className="w-12 h-12 text-primary" />
        <p className="text-2xl font-semibold text-center">Please wait</p>
      </div>
    </div>
  );
}
