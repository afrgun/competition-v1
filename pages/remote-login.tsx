import dynamic from "next/dynamic";

// const RemoteTest = dynamic(() => import("remoteApp/Test"), { ssr: false });

export default function RemoteTestPage() {
  return (
    <div>
      <h1>Remote Test Page</h1>
      {/* <RemoteTest /> */}
    </div>
  );
}
