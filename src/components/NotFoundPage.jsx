import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-3xl">😅Looks like you’re lost.😅</h1>
      <h3 className="text-2xl !my-3">Visit one of our pages!😎</h3>
      <Link to={"/"} className="!my-1 text-xl !underline !underline-offset-4">Overview Page</Link>
      <Link to={"/expense"} className="!my-1 text-xl !underline !underline-offset-4">Expneses Page</Link>
      <Link to={"/income"} className="!my-1 text-xl !underline !underline-offset-4">Incomes Page</Link>
    </div>
  );
};

export default NotFoundPage;
