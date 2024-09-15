import Auth from "./pages/Auth";
import CrudWithFirestore from "./pages/CrudWithFirestore";
import Storage from "./pages/Storage";

const Providers = () => {
  return (
    <>
      <Auth />
      <hr />
      <CrudWithFirestore />
      <hr />
      <Storage />
    </>
  );
};

export default Providers;
