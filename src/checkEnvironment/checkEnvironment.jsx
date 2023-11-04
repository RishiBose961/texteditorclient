export const checkEnvironment = () => {
    let base_url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://vidmit.cyclic.app"; // https://v2ds.netlify.app
  
    return base_url;
  };