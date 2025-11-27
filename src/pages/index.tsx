import React from "react";

const Home: React.FC = () => {
    return (
        <main
            style={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            }}
        >
            <h1>Hello, world!</h1>
        </main>
    );
};

export default Home;