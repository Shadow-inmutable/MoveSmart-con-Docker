import UsuariosForm from "../components/UsuariosForm";

export default function User() {
    return (
        <main
            style={{
                minHeight: "calc(100vh - 80px)",
                padding: "40px",
                background: "#F4F7FE",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                <header style={{ marginBottom: "25px" }}>
                    <h1
                        style={{
                            margin: 0,
                            color: "#2B3674",
                            fontSize: "28px",
                            fontWeight: "700",
                        }}
                    >
                        Gestión de Usuarios
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#707EAE",
                            fontSize: "15px",
                        }}
                    >
                        Administra los usuarios, accesos y roles de Move Smart.
                    </p>
                </header>

                <UsuariosForm />
            </div>
        </main>
    );
}