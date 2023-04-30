import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from "./Container";
const style = {
  signButton: `max-w-full items-end text-white shadow-md px-4 py-2`,
  bannerStyle: `fixed bottom-0 w-full bg-primary p-4 text-white`,
  containerStyle: `bg-transparent flex justify-between`,
};

export const LoggedOutBanner = () => {
  const { data: userSession } = useSession();

  return (
    <div className={style.bannerStyle}>
      <Container>
        <div>
          {userSession ? (
            <button className={style.signButton} onClick={() => void signOut()}>
              Sign Out
            </button>
          ) : (
            <>
              <p>Do not miss out ! </p>
              <button
                className={style.signButton}
                onClick={() => void signIn()}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};
