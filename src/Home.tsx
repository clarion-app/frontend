import { Conversation } from "@clarion-app/llm-client-frontend";

const Home = () => {
  return (
    <>
      <h1 className="text-[32px] font-extrabold box-border break-words text-[#1a365d] leading-9 p-0 m-0 mb-6">Clarion</h1>
      <Conversation />
    </>
  );
};

export default Home;