import Navbar from "../components/Navbar";

export default function AuthLayout({ children }: any) {

  return (

    <>

      <Navbar />

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#3a7bd5,#00d2ff)"
        }}
      >

        <div style={{ width: "420px" }}>
          {children}
        </div>

      </div>

    </>

  );

}