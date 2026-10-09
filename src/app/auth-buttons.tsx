import { signIn, signOut } from "@/auth";
import { primaryButton, secondaryButton } from "@/lib/ui";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">
          สวัสดี <span className="font-medium text-slate-900">{userName ?? "ผู้ใช้งาน"}</span>
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className={secondaryButton}>
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button type="submit" className={primaryButton}>
        Login with Google
      </button>
    </form>
  );
}
