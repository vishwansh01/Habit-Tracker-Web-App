import React from "react";

const UserDet = ({ user }) => {
  return (
    <div key={user._id} className="border p-2">
      <div>Email : {user.email}</div>
      {/* <div>Id : {user._id}</div> */}
      {user.email !== user.currUser && (
        <div> Following : {user.isFollowing ? "Yes" : "No"}</div>
      )}
      {user.email !== user.currUser ? (
        !user.isFollowing ? (
          <button
            className="bg-blue-500 my-2 hover:bg-blue-600 cursor-pointer rounded-lg text-xs lg:text-lg lg:font-bold  lg:px-4 py-1 px-2"
            onClick={async () => {
              const payload = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/social/users/${
                  user.email
                }/follow`,
                {
                  method: "POST",
                  headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                }
              );
              const hab = await payload.json();
              console.log(hab);
              if (hab.message) {
                window.location.reload();
                // setUsers(hab.users);
                // setCross(true);
              }
            }}
          >
            Follow
          </button>
        ) : (
          <button
            className="bg-red-600 my-2 hover:bg-red-700 cursor-pointer rounded-lg text-lg font-bold py-1 px-2"
            onClick={async () => {
              const payload = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/social/users/${
                  user.email
                }/follow`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                }
              );
              const hab = await payload.json();
              console.log(hab);
              if (hab.message) {
                window.location.reload();
                // setUsers(hab.users);
                // setCross(true);
              }
            }}
          >
            Unfollow
          </button>
        )
      ) : (
        <div>You can't follow yourself</div>
      )}
    </div>
  );
};

export default UserDet;
